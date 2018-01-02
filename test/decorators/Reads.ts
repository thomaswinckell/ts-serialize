import test from "ava"

import {Serializable, Serialize, Reads} from "../../src"
import Reader from "../../src/reader/Reader";
import {JsValue} from "ts-json-definition";
import SerializeError from "../../src/core/SerializeError";
import {TypeListDefinition} from "../../src/core/TypesDefinition";

const customReader: Reader<String> = function(value: JsValue, prototype: Object, genericTypes: TypeListDefinition, classPath: string[]) {
    return new Promise((resolve, reject) => {
        if(typeof value === 'string') {
            resolve(value + '_custom')
        } else {
            reject(SerializeError.readerError([String], `Custom error`, classPath))
        }
    })
};

(async function() {

    try {

        @Serializable({
            id: String,
        })
        class Foo {

            @Reads(customReader)
            public id: string;

            constructor(id: string) {
                this.id = id;
            }
        }

        const fooClass = await Serialize.reads({id: 'abc'}, Foo);

        test(`@Reads should override the default reader.`, t => {
            t.is(fooClass.id, 'abc_custom');

            return Serialize.reads({id: 123}, Foo)
                .then(() => t.fail('An error should be raised when an custom reader is not found'))
                .catch((err : Error) => {
                    const expected = "Foo.id cannot be serialized into String.\nCause: Custom error";
                    t.deepEqual(err.message, expected);
                });
        });

    } catch(e) {
        console.error(e);
    }

}());
