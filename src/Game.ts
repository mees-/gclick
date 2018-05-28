import Investment from './Investment'
import DividingNumber from './DividingNumber'

export default class Game {
  investments: Array<Investment>
  constructor(investments: Array<{ new (game: Game): Investment }> = []) {
    const self = this
    this.investments = investments.map(
      InvestmentClass => new InvestmentClass(self)
    )
  }

  private _money = new DividingNumber()

  get money(): number {
    return this._money.value
  }
  set money(val: number) {
    this._money.value = val
  }

  get divisionLevel(): number {
    return this._money.dividerLevel
  }

  set divisionLevel(val: number) {
    throw new Error('divisionLevel is read-only')
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
