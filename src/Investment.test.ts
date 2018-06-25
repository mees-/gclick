import test from 'ava'
import Investment, { InvestmentOptions } from './Investment'
import Game from './Game'
import Bignum from 'bignumber.js'
import delay from 'delay'

class DummyGame extends Game {
  transactCallback: (amount: Bignum) => any
  constructor(
    investments: Array<{ new (game: Game): Investment }>,
    transactCallback: (amount: Bignum) => any = () => {}
  ) {
    super(investments)
    this.transactCallback = transactCallback
  }

  transact(amount: Bignum) {
    super.transact(amount)
    this.transactCallback(amount)
  }
}

const defaultOptions = {
  name: 'simple',
  singleProfit: 1,
  startDuration: 100
}

class TestInvestment extends Investment {
  constructor(
    game: Game = new Game(),
    options: InvestmentOptions = defaultOptions
  ) {
    super(game, options)
  }
  price(amount: Bignum = this.amount) {
    return amount
  }
  doubles(): number {
    return 0
  }
}

test('create investment', t => {
  const game = new Game()
  t.notThrows(() => new TestInvestment(game))
})

test('Investment#buy', t => {
  const game = new Game([TestInvestment])
  const [investment] = game.investments
  // investment should be free because price = amount and amount = 0
  t.notThrows(() => investment.buy())

  // investment should cost one while game.money = 0, so buy should throw
  game.money = new Bignum(0)
  t.throws(() => investment.buy())
})

test('Investment#cycle', t => {
  let lastAdded: Bignum = new Bignum(0)
  const transactCallback = (amount: Bignum) => {
    lastAdded = amount
  }
  const game = new DummyGame([TestInvestment], transactCallback)
  const [investment] = game.investments

  investment.amount = new Bignum(0)
  investment.cycle()
  t.true(lastAdded.isEqualTo(0))
  investment.amount = new Bignum(1)
  investment.cycle()
  t.true(lastAdded.isEqualTo(investment.singleProfit))

  investment.cycle(10)
  t.true(lastAdded.isEqualTo(10 * investment.singleProfit))

  investment.amount = new Bignum(5)
  investment.cycle(2)
  t.true(lastAdded.isEqualTo(investment.singleProfit * 5 * 2))
})

test('Investment#tick', async t => {
  let lastAdded: Bignum = new Bignum(0)
  const transactCallback = (amount: Bignum) => (lastAdded = amount)
  const game = new DummyGame([TestInvestment], transactCallback)
  const [investment] = game.investments

  investment.amount = new Bignum(1)

  investment.lastCycle = Date.now()
  investment.tick()
  t.true(lastAdded.isEqualTo(0))
  await delay(investment.currentDuration)
  investment.tick()
  t.true(lastAdded.isEqualTo(investment.singleProfit))
  await delay(2 * investment.currentDuration)
  investment.tick()
  t.true(lastAdded.isEqualTo(2 * investment.singleProfit))
})

test('Investment#calculatePrice', t => {
  const game = new Game([TestInvestment])
  const [investment] = game.investments

  investment.amount = new Bignum(1)
  t.true(
    investment
      .calculatePrice(10)
      .isEqualTo(1 + 2 + 3 + 4 + 5 + 6 + 7 + 8 + 9 + 10)
  )
})

test('Investment#maxBuy', t => {
  const game = new Game([TestInvestment])
  const [investment] = game.investments

  let amount = 0
  let price = 0
  while (price <= 100) {
    amount++
    price += amount
  }
  t.true(investment.maxBuy(new Bignum(100)).isEqualTo(amount))
})
