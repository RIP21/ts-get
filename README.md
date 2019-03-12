# ts-get
[![codecov](https://codecov.io/gh/RIP21/ts-get/branch/master/graph/badge.svg)](https://codecov.io/gh/RIP21/ts-get)
[![Build Status](https://travis-ci.org/RIP21/ts-get.svg?branch=master)](https://travis-ci.org/RIP21/ts-get)

Alternative to `lodash.get` that makes it typed and cool as if optional chaining proposal is there.

## Usage and features

```typescript
import get from 'ts-get'

 type SomeType = {
  optionalField?: string
  nested?: {
    dangerousAccess?: string
  }
 } | undefined | null
 
 const input = {}
 const input2 = {
    optionalField: "value",
 }
 
 get(input, it => it.optionalField, "default") // -> "default"
 get(input2, it => it.optionalField, "default") // -> "value"
 get(input2, it => it.nested.dangerousAccess, "default") // -> "default"
 get(input2, it => it.unknownField, "default") // -> Type error, `unknownField` doesn't exist on type
 get(input2, it => it.optionalField, 5) // -> Type error, third argument is not assignable to type `string`
```

## Difference with `lodash.get` behavior

- If your path gets `null` at the end, it will bail out to `defaultValue` or `undefined`. 
If you would like to get `null` returned anyway, just pass it as a `defaultValue`
- If your type field is of type `null` and only `null` or `undefined` your field will be of type `{}[]`. 
I have no idea how to fix it 🤷‍♂️ PR Welcome 😇🙏
```typescript
type A = {
  field: null | undefined// -> {}[] inside of the callback and as return type too
}
```