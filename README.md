[![Build Status](https://travis-ci.org/thomaswinckell/ts-serialize.svg?branch=master)](https://travis-ci.org/thomaswinckell/ts-serialize) [![npm version](https://img.shields.io/npm/v/ts-serialize.svg?style=flat)](https://www.npmjs.com/package/ts-serialize)[![Test Coverage](https://codeclimate.com/github/thomaswinckell/ts-serialize/badges/coverage.svg)](https://codeclimate.com/github/thomaswinckell/ts-serialize/coverage)

## ts-serialize

Serialization tool using Typescript decorators.


NEW API :

```
import {Serializable, Serialize, DefaultValue, AfterReads, Writes, Named} from "ts-serialize"
 
@Serializable({
    id: [String],
    order: [Array, [Number]],
    maybe: ["?", String],
    strOrNumber: [String, "|", number],
})
class Foo {
    @DefaultValue("anonymous")
    public id : string;
    public maybe ?: string;
    @AfterReads(arr => arr.map(o => o + 1))
    public order : number[];
    @Writes(s => s === "yes" ? "no" : s)
    public maybe ?: string;
    @JsonName("trololo")
    public strOrNumber : string|number;
}

Serialize.registerWriter({
    id: [String],
    order: [Array, [Number]],
    maybe: ["?", String],
    strOrNumber: [String, "|", number],
})

Serialize.fromJson(Foo, {}); 
```

TODO :

- New type definition syntax support (optional, and, or)
- DefaultValue decorator
- BeforeReads / AfterReads / BeforeWrites / AfterWrites hooks decorators
- Optional type and @DefaultValue support
- Formatter registry, see TODO (put formatters in class metadata)
- Any formatter
- Runtime generics supports for serializable class with generics
- Review error system and messages
- Serializable class should have a default constructor (if there's no way to enforce it, say it in the docs)
