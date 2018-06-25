type Options = {
  significance?: number
  dividerLevel?: number
}

const defaultOptions = {
  significance: 6,
  dividerLevel: 0
}

export default class DividingNumber {
  public readonly significance: number
  private _value: number
  public dividerLevel: number
  constructor(value: number, options: Options = {}) {
    const { significance, dividerLevel } = { ...defaultOptions, ...options }

    if (typeof value !== 'number' || Number.isNaN(value)) {
      throw new TypeError('cannot set dividingNumber to a non-number')
    }
    this._value = value
    this.significance = significance
    this.dividerLevel = dividerLevel
    this.updateValue()
  }

  get value(): number {
    return this._value
  }

  set value(val: number) {
    if (typeof val !== 'number' || Number.isNaN(val)) {
      throw new TypeError('cannot set dividingNumber to a non-number')
    }
    this._value = val
    this.updateValue()
  }

  private updateValue() {
    while (Math.abs(this.value) >= Math.pow(10, this.significance) - 1) {
      this._value /= 10
      this.dividerLevel++
    }
    this._value = Math.floor(this._value)
    while (
      Math.abs(this.value) <= Math.pow(10, this.significance - 2) &&
      this.dividerLevel > 0
    ) {
      this._value *= 10
      this.dividerLevel--
    }
  }

  realValue() {
    return this.value * Math.pow(10, this.dividerLevel)
  }

  toString() {
    if (this.dividerLevel === 0) {
      return this.value.toString()
    } else {
      return `${this.value.toString()}e${this.dividerLevel.toString()}`
    }
  }

  multiply(num: DividingNumber | number) {
    if (num instanceof DividingNumber) {
      this.value *= num.value
      this.dividerLevel += num.dividerLevel
    } else {
      this.value *= num
    }
  }

  divide(num: DividingNumber | number) {
    if (num instanceof DividingNumber) {
      this.value /= num.value
      this.dividerLevel -= num.dividerLevel
    } else {
      this.value /= num
    }
  }

  add(num: DividingNumber | number) {
    if (!(num instanceof DividingNumber)) {
      num = new DividingNumber(num, { significance: this.significance })
    }
    const levelDifference = num.dividerLevel - this.dividerLevel
    this.value += num.value * Math.pow(10, levelDifference)
  }

  substract(num: DividingNumber | number) {
    if (!(num instanceof DividingNumber)) {
      num = new DividingNumber(num, { significance: this.significance })
    }
    const levelDifference = num.dividerLevel - this.dividerLevel
    this.value -= num.value * Math.pow(10, levelDifference)
  }

  // some arithmetic methods for two dividingNumbers
  static multiply(a: DividingNumber, b: DividingNumber): DividingNumber {
    const significance = Math.min(a.significance, b.significance) // take the lowest significance
    return new DividingNumber(a.value * b.value, {
      dividerLevel: a.dividerLevel + b.dividerLevel,
      significance
    })
  }

  static divide(a: DividingNumber, b: DividingNumber): DividingNumber {
    const significance = Math.min(a.significance, b.significance) // take the lowest significance
    return new DividingNumber(a.value / b.value, {
      dividerLevel: a.dividerLevel - b.dividerLevel,
      significance
    })
  }

  static add(a: DividingNumber, b: DividingNumber): DividingNumber {
    const significance = Math.min(a.significance, b.significance) // take the lowest significance

    const levelDifference = a.dividerLevel - b.dividerLevel
    return new DividingNumber(
      a.value * Math.pow(10, levelDifference) + b.value,
      {
        dividerLevel: b.dividerLevel,
        significance
      }
    )
  }

  static substract(a: DividingNumber, b: DividingNumber): DividingNumber {
    const significance = Math.min(a.significance, b.significance)
    const levelDifference = a.dividerLevel - b.dividerLevel
    return new DividingNumber(
      a.value * Math.pow(10, levelDifference) - b.value,
      {
        dividerLevel: b.dividerLevel,
        significance
      }
    )
  }
}
