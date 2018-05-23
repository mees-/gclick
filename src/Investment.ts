import Game from './Game'

export type InvestmentOptions = {
  name: string
  singleProfit: number
  startDuration: number
}

export default abstract class Investment {
  name: string
  parentGame: Game

  singleProfit: number
  startDuration: number

  amount: number
  lastCycle: number

  interval: {
    id?: number
    lastDuration: number
  }

  constructor(
    parentGame: Game,
    options: InvestmentOptions = {
      name: 'default',
      singleProfit: 0,
      startDuration: 1
    }
  ) {
    this.parentGame = parentGame

    this.name = options.name
    this.startDuration = options.startDuration
    this.singleProfit = options.singleProfit

    this.amount = 0
    this.lastCycle = Date.now()

    this.interval = {
      lastDuration: this.currentDuration
    }
  }
  // default stubs
  abstract price(amount: number): number

  abstract doubles(): number

  // some computed properties
  get currentDuration(): number {
    return this.startDuration * Math.pow(0.5, this.doubles())
  }

  get profitPerCycle(): number {
    return this.amount * this.singleProfit
  }

  get profitPerSecond(): number {
    return this.profitPerCycle / (this.currentDuration / 1000)
  }

  get timeSinceLastCycle(): number {
    return Date.now() - this.lastCycle
  }

  get cyclesSinceLast(): number {
    return Math.floor(this.timeSinceLastCycle / this.currentDuration)
  }

  get timeInCurrentCycle(): number {
    return this.timeSinceLastCycle % this.currentDuration
  }

  // methods
  cycle(times: number = 1) {
    this.parentGame.transact(this.profitPerCycle * times)
    this.lastCycle += times * this.currentDuration
  }

  tick() {
    this.cycle(this.cyclesSinceLast)
  }

  start(listener: () => any = () => {}) {
    this.interval.id = setInterval(() => {
      this.tick()
      listener()
      if (
        this.currentDuration !== this.interval.lastDuration &&
        this.interval.id != null
      ) {
        clearInterval(this.interval.id)
        this.start(listener)
      }
    }, this.currentDuration)
  }

  stop() {
    if (this.interval.id != null) {
      clearInterval(this.interval.id)
    }
  }

  calculatePrice(amount: number): number {
    let price = 0
    for (let i = 0; i < amount; i++) {
      price += this.price(this.amount + i)
    }
    return price
  }

  buy(amount: number = 1) {
    this.parentGame.transact(-1 * this.calculatePrice(amount))
    this.amount += amount
  }

  // a bunch of setters for read-only properties
  set currentDuration(val: number) {
    throw new Error('currentDuration is read-only')
  }
  set totalProfit(val: number) {
    throw new Error('totalProfit is read-only')
  }
  set profitPerSecond(val: number) {
    throw new Error('profitPerSecond is read-only')
  }
  set timeSinceLastCycle(val: number) {
    throw new Error('timeSinceLastCycle is read-only')
  }
  set cyclesSinceLast(val: number) {
    throw new Error('cyclesSinceLast is read-only')
  }
  set timeInCurrentCycle(val: number) {
    throw new Error('timeInCurrentCycle is read-only')
  }
}
