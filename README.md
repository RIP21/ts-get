# ts-get
[![npm version](https://badge.fury.io/js/ts-get.svg)](https://badge.fury.io/js/ts-get)
[![Build Status](https://travis-ci.org/RIP21/ts-get.svg?branch=master)](https://travis-ci.org/RIP21/ts-get)
[![codecov](https://codecov.io/gh/RIP21/ts-get/branch/master/graph/badge.svg)](https://codecov.io/gh/RIP21/ts-get)

## Archived. Use optional chaining instead :)


Alternative to `lodash.get` that makes it typed and cool as if optional chaining proposal is there. 

Means you're not only safely navigate object, but you're also getting 100% autocomplete and type-safeness 🎉

## Important comment from the author :)
Please, be aware of how this is working, and take a look limitations below, this is good to get only primitive values not an objects! (at least without generics/castings etc, which makes no sense and you can use lodash then). You better use [ts-optchain](https://github.com/rimeto/ts-optchain) if browsers your are supporting, have Proxy support. If not, use `ts-optchain` anyway but with typescript transformer or babel-plugin that you can find in their docs.
More than that, [optional chaining proposal](https://github.com/tc39/proposal-optional-chaining) has moved to Stage 3 recently, meaning it will be in TS very soon (version 3.7.0 to be precise)

This was nice experiment, but performance limitations of `try catch` and problems with type inference if object is accessed is making this thing dangerous and not as cool as I thought when I wrote it initially and started using it 😇


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

## Known issues/limitations:
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
You can solve this issue passing down generics implicitly
```typescript
import get from 'ts-get'
type A = {
  field?: {
    optional?: string | null
  }
}
const input: A = {}
const res = get<A, A['field']>(input, it => it.field)
res // <== Will be inferred properly
```
