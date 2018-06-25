import Game from './Game'
import Bignum from 'bignumber.js'

export type InvestmentOptions = {
  name: string
  singleProfit: number
  startDuration: number
}

type Interval = {
  id?: number
  lastDuration: number
}

export type InvestmentSettings = {
  name: string
  singleProfit: number
  startDuration: number
  doubles: (amount: number) => number
  price: (amount: number) => number
}

export type rawInvestmentSettings = {
  name: string
  singleProfit: number
  startDuration: number
  doubles: string
  price: string
}

export default abstract class Investment {
  name: string
  parentGame: Game

  singleProfit: number
  startDuration: number

  constructor(
    parentGame: Game,
    { name, singleProfit, startDuration }: InvestmentOptions
  ) {
    this.parentGame = parentGame

    this.name = name
    this.startDuration = startDuration
    this.singleProfit = singleProfit
  }
  amount = 0
  lastCycle = Date.now()
  interval: Interval = {
    lastDuration: this.currentDuration
  }

  // default stubs
  abstract price(amount?: number): number

  abstract doubles(): number

  // some computed properties
  get currentDuration(): number {
    return this.startDuration * Math.pow(0.5, this.doubles())
  }

  get profitPerCycle(): number {
    return this.amount * this.singleProfit
  }

  get profitPerSecond(): number {
    return this.profitPerCycle / this.currentDuration / 1000
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
    for (let i = 0; amount > i; i++) {
      price = price + this.price(this.amount + i)
    }
    return price
  }

  maxBuy(money: number): number {
    let amount = 0
    while (this.calculatePrice(amount + 1) <= money) amount = amount + 1
    return amount
  }

  buy(amount: number = 1) {
    this.parentGame.transact(this.calculatePrice(amount) * -1)
    this.amount = this.amount + amount
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
  set divisionLevel(val: number) {
    throw new Error('divisionLevel is read-only')
  }

  static fromSettings(rawSettings: rawInvestmentSettings | InvestmentSettings) {
    const settings: InvestmentSettings = {
      ...rawSettings,
      price:
        typeof rawSettings.price === 'string'
          ? (eval(rawSettings.price) as (amount: number) => number)
          : rawSettings.price,
      doubles:
        typeof rawSettings.doubles === 'string'
          ? (eval(rawSettings.doubles) as (amount: number) => number)
          : rawSettings.doubles
    }
    return class CustomInvestment extends Investment {
      constructor(parentGame: Game) {
        super(parentGame, {
          name: settings.name,
          singleProfit: settings.singleProfit,
          startDuration: settings.startDuration
        })
      }

      price(amount: number = this.amount) {
        return settings.price(amount)
      }

      doubles() {
        return settings.doubles(this.amount)
      }
    }
  }
}
