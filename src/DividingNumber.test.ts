import test from 'ava'
import DividingNumber from './DividingNumber'

test('retains number', t => {
  const num1 = new DividingNumber(0)
  t.is(num1.value, 0)

  const num2 = new DividingNumber(10)
  t.is(num2.value, 10)
})

test('default settings', t => {
  const num = new DividingNumber(0)
  t.is(num.value, 0)
  t.is(num.dividerLevel, 0)
  t.is(num.significance, 6)
})

test('properly updates number without division step', t => {
  const num = new DividingNumber(10)
  t.is(num.value, 10)
  num.value = 5
  t.is(num.value, 5)
  t.is(num.dividerLevel, 0)

  num.value *= 3
  t.is(num.value, 15)
  t.is(num.dividerLevel, 0)
})

test('properly updates number with division step', t => {
  const num = new DividingNumber(10, { significance: 3 })
  t.is(num.dividerLevel, 0)

  num.value *= 10
  t.is(num.value, 100)
  t.is(num.dividerLevel, 0)

  num.value *= 10
  t.is(num.value, 100)
  t.is(num.dividerLevel, 1)
})

test('can jump multiple levels at once', t => {
  const num = new DividingNumber(0, { significance: 3 })

  num.value = 100
  t.is(num.value, 100)
  t.is(num.dividerLevel, 0)

  num.value *= 100
  t.is(num.value, 100)
  t.is(num.dividerLevel, 2)
})

test('jumps down when value gets smaller', t => {
  const num = new DividingNumber(10, { significance: 3 })
  num.value *= 100
  t.is(num.value, 100)
  t.is(num.dividerLevel, 1)
  num.value /= 100
  t.is(num.value, 10)
  t.is(num.dividerLevel, 0)

  const num2 = new DividingNumber(10, { significance: 3, dividerLevel: 2 })
  t.is(num2.value, 100)
  t.is(num2.dividerLevel, 1)
})

// arithmetic tests
test('multiply normal number', t => {
  const num = new DividingNumber(15, { significance: 2 })

  num.multiply(7)
  t.is(num.value, 10)
  t.is(num.dividerLevel, 1)
})

test('multiply dividingNumber', t => {
  const num1 = new DividingNumber(15, { significance: 6 })
  const num2 = new DividingNumber(8, { significance: 6, dividerLevel: 4 })

  num1.multiply(num2)
  t.is(num1.value, 120000)
  t.is(num1.dividerLevel, 1)
})

test('static multipy', t => {
  const num1 = new DividingNumber(7, { significance: 6, dividerLevel: 6 })
  const num2 = new DividingNumber(4, { significance: 6, dividerLevel: 3 })

  const result = DividingNumber.multiply(num1, num2)
  t.is(result.value, 280000)
  t.is(result.dividerLevel, 5)
})

test('divide normal number', t => {
  const num = new DividingNumber(15, { significance: 2 })

  num.divide(7)
  t.is(num.value, 10)
  t.is(num.dividerLevel, 1)
})

test('divide dividingNumber', t => {
  const num1 = new DividingNumber(15, { significance: 6, dividerLevel: 6 })
  const num2 = new DividingNumber(8, { significance: 6, dividerLevel: 4 })

  num1.divide(num2)
  t.is(num1.value, 120000)
  t.is(num1.dividerLevel, 1)
})

test('static divide', t => {
  const num1 = new DividingNumber(7, { significance: 6, dividerLevel: 6 })
  const num2 = new DividingNumber(4, { significance: 6, dividerLevel: 3 })

  const result = DividingNumber.divide(num1, num2)
  t.is(result.value, 1750)
  t.is(result.dividerLevel, 0)
})

test('add normal number', t => {
  const num1 = new DividingNumber(10, { significance: 3 })

  num1.add(1000)
  t.is(num1.dividerLevel, 1)
  t.is(num1.value, 101)
})

test('add dividingNumber', t => {
  const num1 = new DividingNumber(100000, { significance: 6, dividerLevel: 8 })
  const num2 = new DividingNumber(100000, { significance: 6, dividerLevel: 3 })

  num1.add(num2)

  t.is(num1.value, 100001)
  t.is(num1.dividerLevel, 8)
})

test('static add', t => {
  const num1 = new DividingNumber(7, { significance: 6, dividerLevel: 6 })
  const num2 = new DividingNumber(4, { significance: 6, dividerLevel: 3 })

  const result = DividingNumber.add(num1, num2)
  t.is(result.value, 700400)
  t.is(result.dividerLevel, 1)
})
