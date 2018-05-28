import test from 'ava'
import DividingNumber from './DividingNumber'

test('retains number', t => {
  const num1 = new DividingNumber(0)
  t.is(num1.value, 0)
  t.is(num1.dividerLevel, 0)

  const num2 = new DividingNumber(10)
  t.is(num2.value, 10)
  t.is(num2.dividerLevel, 0)
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
  const num = new DividingNumber(10, 1000)
  t.is(num.dividerLevel, 0)

  num.value *= 100
  t.is(num.value, 10 * 100 / 1000)
  t.is(num.dividerLevel, 1)
})
