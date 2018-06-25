import Investment, {
  rawInvestmentSettings,
  InvestmentSettings
} from './Investment'
import Bignum from 'bignumber.js'

export default class Game {
  investments: Array<Investment>
  constructor(investments: Array<{ new (game: Game): Investment }> = []) {
    const self = this
    this.investments = investments.map(
      InvestmentClass => new InvestmentClass(self)
    )
  }

  money = new Bignum(0)

  set divisionLevel(val: number) {
    throw new Error('divisionLevel is read-only')
  }

  transact(money: Bignum | number) {
    // ow(money, ow.number.greaterThanOrEqual(0))
    if (this.money.plus(money).isLessThan(0)) {
      throw new Error('Cannot deduct more money than owned')
    }
    this.money = this.money.plus(money)
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

  static fromSettings(
    settings: Array<rawInvestmentSettings | InvestmentSettings>
  ) {
    const investments = settings.map(el => Investment.fromSettings(el))
    return new Game(investments)
  }
}
