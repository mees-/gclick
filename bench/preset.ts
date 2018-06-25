import Game, { Investment, InvestmentSettings } from '..'

const investments: InvestmentSettings[] = [
  {
    name: '1',
    singleProfit: 5,
    startDuration: 4,
    doubles: amount => {
      return amount / 25
    },
    price: amount => {
      return Math.pow(amount, 2) / Math.sqrt(amount)
    }
  },
  {
    name: '2',
    singleProfit: 1,
    startDuration: 3,
    doubles: amount => {
      return amount / 50
    },
    price: amount => {
      return amount * 2
    }
  },
  {
    name: '3',
    singleProfit: 20,
    startDuration: 15,
    doubles: amount => {
      return amount / 13
    },
    price: amount => {
      return Math.pow(amount / 4, 3) / (Math.sqrt(amount) / 2)
    }
  },
  {
    name: '4',
    singleProfit: 20,
    startDuration: 100,
    doubles: amount => {
      return amount / 100
    },
    price: amount => {
      return Math.pow(amount, 2) / Math.sqrt(amount) + amount
    }
  }
]

export default investments
