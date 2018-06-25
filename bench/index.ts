import benchmark from './bench'
import Game, { InvestmentSettings } from '..'
import Bignum from 'bignumber.js'
import preset from './preset'

const config = {
  loops: 2000,
  runs: 100
}

const result = benchmark<{ game: Game }>({
  loops: config.loops,
  runs: config.runs,
  benchMarkFunction: ctx => {
    ctx.game.tick()
  },
  createContext: () => ({
    game: Game.fromSettings(preset)
  }),
  beforeRun: ctx => {
    for (const investment of ctx.game.investments) {
      investment.amount = new Bignum(
        Math.random() * 10 * Math.pow(10, Math.random() * 100)
      )
    }
    ctx.game.money = new Bignum(0)
  }
})

const avg =
  result.performanceEntries.reduce((acc, current) => acc + current, 0) /
  result.performanceEntries.length

console.log(`config.loops:\t\t${config.loops}`)
console.log(`config.runs:\t\t${config.runs}`)
console.log()
console.log(`total duration:\t\t${(result.totalDuration / 1000).toFixed(3)}s`)
console.log(`avg run:\t\t${avg.toFixed(5)}ms`)
console.log(`avg call:\t\t${(avg / config.loops).toFixed(5)}ms`)
console.log(`calls per second:\t${((config.loops / avg) * 1000).toFixed(5)}`)
