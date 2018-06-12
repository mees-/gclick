import Game from './game'
import Investment from './Investment'

type InvestmentSettings = {
  name: string
  singleProfit: number
  startDuration: number
  doubles: (amount: number) => number
  price: (amount: number) => number
}

type rawInvestmentSettings = {
  name: string
  singleProfit: number
  startDuration: number
  doubles: string
  price: string
}

export default function createInvestmentFromSettings(
  rawSettings: rawInvestmentSettings
) {
  const settings: InvestmentSettings = {
    ...rawSettings,
    price: eval(rawSettings.price) as (amount: number) => number,
    doubles: eval(rawSettings.doubles) as (amount: number) => number
  }

  return class CustomInvestment extends Investment {
    settings: InvestmentSettings
    constructor(parentGame: Game) {
      super(parentGame, {
        name: settings.name,
        singleProfit: settings.singleProfit,
        startDuration: settings.startDuration
      })

      this.settings = settings
    }

    price(amount: number = this.amount) {
      return this.settings.price(amount)
    }

    doubles() {
      return this.settings.doubles(this.amount)
    }
  }
}
