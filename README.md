[![Build Status](https://travis-ci.org/thomaswinckell/ts-serialize.svg?branch=master)](https://travis-ci.org/thomaswinckell/ts-serialize) [![npm version](https://img.shields.io/npm/v/ts-serialize.svg?style=flat)](https://www.npmjs.com/package/ts-serialize)[![Test Coverage](https://codeclimate.com/github/thomaswinckell/ts-serialize/badges/coverage.svg)](https://codeclimate.com/github/thomaswinckell/ts-serialize/coverage)

## ts-serialize

Serialization tool using Typescript decorators and reflect-metadata.

### Usage

Example with two classes :

```
import {Serializable, Serialize, SerializeOpt, SerializeArray} from "ts-serialize"
 
class Role extends Serializable {
 
    // Serialize knows the primitive types
    // So it can automatically validate and convert it
    @Serialize()
    public id : string;
    
    @Serialize()
    public order : number;
}
```

```
class User extends Serializable {
 
    // You can change the property name 
    // (`id` for the class, `identifier` for the json)
    @Serialize('identifier')
    public id : string;
 
    @Serialize()
    private age : number;
    
    @Serialize()
    public language : string;
 
    // For optionals, you need to use a special decorator
    @SerializeOpt( String )
    public name : Optional< string >;
 
    // For arrays, you need to use a special decorator
    @SerializeArray( User )
    public children : User[];
 
    // Composition works naturally
    @Serialize()
    public role : Role;
    
    // You can apply your own transformers
    @Serialize(() => Math.random() * 1000)
    public random : number;
}
```

Now, validate you json using one of those and get either errors or your serialized object/array


```
static fromString< T >(str: string): Either< Error[], T >;
 
static fromStringAsArray< T >(str: string): Either< Error[], Array< T > >;
 
static fromJsObject< T >(jsObject: JsObject, jsonPath: string[] = [], classPath: string[] = []): Either< Error[], T >;
 
static fromJsArray< T >(jsArray: JsArray, jsonPath: string[] = [], classPath: string[] = []): Either< Error[], T[] >;
```

And convert your instances to json using :

```
const user = new User();
console.log(user.toJson());
```
