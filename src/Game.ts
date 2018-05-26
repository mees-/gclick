import Investment from './Investment'

export default class Game {
  investments: Array<Investment>
  money: number
  constructor(investments: Array<{ new (game: Game): Investment }> = []) {
    this.money = 0

    const self = this
    this.investments = investments.map(
      InvestmentClass => new InvestmentClass(self)
    )
  }

  transact(money: number) {
    if (this.money + money < 0) {
      throw new Error('Cannot deduct more money than owned')
    }
    this.money += money
  }

  tick() {
    for (const investment of this.investments) {
      investment.tick()
    }
  }

  start(listener: () => any) {
    for (const investment of this.investments) {
      investment.start(listener)
    }
  }

  stop() {
    for (const investment of this.investments) {
      investment.stop()
    }
  }
}
