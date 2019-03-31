import { get } from './'
import { get as _get } from 'lodash'

describe('get', function() {
  type InputType = {
    a: string
    b?: {
      nested?: string | null
    }
  }
  const inputAllPresent: InputType = {
    a: 'Value',
    b: {
      nested: 'Value',
    },
  }
  const inputOptionalsMissing: InputType = {
    a: 'Value',
  }
  const inputOptionalsSafeAccessMissing: InputType = {
    a: 'Value',
    b: {}, // accessing b.nested will return undefined and will not throw error
  }
  it('should return value', () => {
    const result = get(inputAllPresent, it => it.a)
    expect(result).toBe('Value')
  })
  it('should return value on existing optional field', () => {
    const result = get(inputAllPresent, it => it!.b!.nested, 'Default')
    expect(result).toBe('Value')
  })
  it('should return undefined on non existing optional field', () => {
    const result = get(inputOptionalsMissing, it => it!.b!.nested)
    expect(result).toBeUndefined()
  })
  it('should return defaultValue on non existing optional field', () => {
    const result = get(inputOptionalsMissing, it => it!.b!.nested, 'Default')
    expect(result).toBe('Default')
  })
  it('should return defaultValue on non existing optional field', () => {
    const result = get(inputOptionalsMissing, it => it!.b!.nested, 'Default')
    expect(result).toBe('Default')
  })

  it('should replica lodash interface in cases below', () => {
    const result1 = get(inputAllPresent, it => it.a)
    const result1_ = _get(inputAllPresent, 'a')

    const result2 = get(inputAllPresent, it => it!.b!.nested, 'Default')
    const result2_ = _get(inputAllPresent, 'b.nested', 'Default')

    const result3 = get(inputOptionalsMissing, it => it!.b!.nested)
    const result3_ = _get(inputOptionalsMissing, 'b.nested')

    const result4 = get(inputOptionalsSafeAccessMissing, it => it!.b!.nested, 'Default')
    const result4_ = _get(inputOptionalsSafeAccessMissing, 'b.nested', 'Default')

    expect(result1).toBe(result1_)
    expect(result2).toBe(result2_)
    expect(result3).toBe(result3_)
    expect(result4).toBe(result4_)
  })
  it('should return undefined and default value in case of null (different from _.get)', function() {
    const inputWithNull: InputType = {
      a: 'Value',
      b: {
        nested: null,
      },
    }
    const defaultedNull = get<InputType, string | null | undefined>(
      inputOptionalsMissing,
      it => it!.b!.nested,
      null,
    )
    expect(defaultedNull).toBe(null)

    const undefinedFromNullValue = get(inputWithNull, it => it!.b!.nested)
    expect(undefinedFromNullValue).toBeUndefined()

    const defaultedStringFromNullValue = get(
      inputWithNull,
      it => it!.b!.nested,
      'Default',
    )
    expect(defaultedStringFromNullValue).toBe('Default')
  })
})
