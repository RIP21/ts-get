# ts-get
[![npm version](https://badge.fury.io/js/ts-get.svg)](https://badge.fury.io/js/ts-get)
[![Build Status](https://travis-ci.org/RIP21/ts-get.svg?branch=master)](https://travis-ci.org/RIP21/ts-get)
[![codecov](https://codecov.io/gh/RIP21/ts-get/branch/master/graph/badge.svg)](https://codecov.io/gh/RIP21/ts-get)

Alternative to `lodash.get` that makes it typed and cool as if optional chaining proposal is there. 

Means you're not only safely navigate object, but you're also getting 100% autocomplete and type-safeness 🎉

## Important

There is also `ts-get-simple` that is exactly the same, but will require you to use `!` to be able to chain, it improves some corner cases 
(e.g. when you chain to some object, and non primitive, it will persist original nested type)
Take a look at the examples below.

## Usage and examples

```typescript
import get from 'ts-get'

 type SomeType = {
  optionalField?: string
  nested?: {
    dangerousAccess?: string
  }
 } | undefined | null
 
 const emptyObject: SomeType = {}
 const withOneOptionalField: SomeType = {
    optionalField: "value",
 }
 
 get(emptyObject, it => it.optionalField, "default") // -> "default"
 get(withOneOptionalField, it => it.optionalField, "default") // -> "value"
 get(withOneOptionalField, it => it.nested.dangerousAccess, "default") // -> "default"
 get(withOneOptionalField, it => it.unknownField, "default") // -> Type error, `unknownField` doesn't exist on type
 get(withOneOptionalField, it => it.optionalField, 5) // -> Type error, third argument is not assignable to type `string`
```

## Difference with `lodash.get` behavior

- If your path gets `null` at the end, it will bail out to `defaultValue` or `undefined`. 
If you would like to get `null` returned anyway, just pass it as a `defaultValue`

## Known issues:
- If your type field is of type `null` and only `null` or `undefined` your field will be of type `{}[]`. 
I have no idea how to fix it 🤷‍♂️ PR Welcome 😇🙏
```typescript
type A = {
  field: null | undefined// -> {}[] inside of the callback and as return type too
}

```
- If you return not a primitive but an object, all its nested fields will be `Required` e.g. all `undefined` and `null` will be removed.
```typescript
import get from 'ts-get'
type A = {
  field?: {
    optional?: string | null
  }
}
const input: A = {}
const res = get(input, it => it.field)
res // <== Will be inferred as { optional: string }, without null and ? (undefined) which is wrong, but seems to be impossible to infer.

```


# ts-get-simple
[![npm version](https://badge.fury.io/js/ts-get.svg)](https://badge.fury.io/js/ts-get-simple)



## Usage and examples `ts-get-simple`

```typescript
import get from 'ts-get-simple'

 type SomeType = {
  optionalField?: string
  nested?: {
    dangerousAccess?: string
  }
 } | undefined | null
 
 const emptyObject: SomeType = {}
 const withOneOptionalField: SomeType = {
    optionalField: "value",
 }
 
get(emptyObject, it => it!.optionalField, "default") // -> "default"
get(withOneOptionalField, it => it!.optionalField, "default") // -> "value"
get(withOneOptionalField, it => it!.nested!.dangerousAccess, "default") // -> "default"
get(withOneOptionalField, it => it!.unknownField, "default") // -> Type error, `unknownField` doesn't exist on type
get(withOneOptionalField, it => it!.optionalField, 5) // -> Type error, third argument is not assignable to type `string | undefined`
```

## Known typing issues of `ts-get-simple`

```typescript
 import get from 'ts-get-simple'
 
 type SomeType = {
   nested?: string | null 
 }
 const input: SomeType = {}
 const cannotBeNull = get(input, it => it!.nested) // <== will be inferred as string | null | undefined, while it really cannot be `null` by logic
 const canBeNull = get(input, it => it!.nested, null) // <== will be inferred as string, while it really should be string | null
 const canBeUndefined = get(input, it => it!.nested, undefined) // <== will be inferred as string, while it really should be string | undefined
```
Last one is stupid, but just for your information.