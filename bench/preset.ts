import Game, { Investment, InvestmentSettings } from '..'

const investments: InvestmentSettings[] = [
  {
    name: '1',
    singleProfit: 5,
    startDuration: 4,
    doubles: amount => {
      return amount.dividedBy(25).toNumber()
    },
    price: amount => {
      return amount.pow(2).dividedBy(amount.squareRoot())
    }
  },
  {
    name: '2',
    singleProfit: 1,
    startDuration: 3,
    doubles: amount => {
      return amount.dividedBy(50).toNumber()
    },
    price: amount => {
      return amount.multipliedBy(2)
    }
  },
  {
    name: '3',
    singleProfit: 20,
    startDuration: 15,
    doubles: amount => {
      return amount.dividedBy(13).toNumber()
    },
    price: amount => {
      return amount
        .dividedBy(4)
        .pow(3)
        .dividedBy(amount.squareRoot().dividedBy(2))
    }
  },
  {
    name: '4',
    singleProfit: 20,
    startDuration: 100,
    doubles: amount => {
      return amount.dividedBy(100).toNumber()
    },
    price: amount => {
      return amount
        .pow(2)
        .dividedBy(amount.squareRoot())
        .plus(amount)
    }
  }
]

export default investments
