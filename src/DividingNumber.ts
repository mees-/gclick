export default class DividingNumber {
  private step: number
  private _value: number
  constructor(value: number = 0, step: number = 1000) {
    this._value = value
    this.step = step
  }

  dividerLevel = 0

  get value(): number {
    return this._value
  }

  set value(val: number) {
    if (val >= this.step) {
      this.dividerLevel++
      this._value = val / this.step
    } else {
      this._value = val
    }
  }
}
