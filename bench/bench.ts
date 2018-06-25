import { PerformanceObserver, performance } from 'perf_hooks'

export type benchmarkOptions<Context> = {
  createContext?: () => Context
  beforeBench?: (context: Context) => any
  beforeRun?: (context: Context) => void
  runs: number
  loops: number
  benchMarkFunction: (context: Context) => void
  afterRun?: (context: Context) => void
  afterBench?: (context: Context) => void
}

export default function benchmark<Context>(options: benchmarkOptions<Context>) {
  const benchStartTime = performance.now()
  const context: Context =
    (options.createContext && options.createContext()) || ({} as Context)

  const performanceEntries: number[] = []
  const observer = new PerformanceObserver(list => {
    performanceEntries.push(...list.getEntries().map(entry => entry.duration))
  })
  observer.observe({ entryTypes: ['measure'] })
  options.beforeBench && options.beforeBench(context)

  for (let i = 0; i < options.runs; i++) {
    options.beforeRun && options.beforeRun(context)
    performance.mark(`run-${i}-start`)

    for (let j = 0; j < options.loops; j++) {
      options.benchMarkFunction(context)
    }

    performance.mark(`run-${i}-end`)
    performance.measure(`run-${i}`, `run-${i}-start`, `run-${i}-end`)
    performance.clearMarks()
    performance.clearMeasures()
    options.afterRun && options.afterRun(context)
  }

  options.afterBench && options.afterBench(context)
  observer.disconnect()

  const totalDuration = performance.now() - benchStartTime
  return { performanceEntries, totalDuration }
}
