import test from "ava"

import {Serializable, Serialize, Writes} from "../../src"
import Writer from "../../src/writer/Writer";
import SerializeError from "../../src/core/SerializeError";
import {TypeListDefinition} from "../../src/core/TypesDefinition";

const customWriter: Writer<String> = function(value: String, prototype: Object, genericTypes: TypeListDefinition, classPath: string[]) {
    return new Promise((resolve, reject) => {
        if(value !== "error") {
            resolve(value + '_custom')
        } else {
            reject(SerializeError.writerError([String], `Custom error`, classPath))
        }
    })
};

(async function() {

    try {

        @Serializable({
            id: String,
        })
        class Foo {

            @Writes(customWriter)
            public id: string;

            constructor(id: string) {
                this.id = id;
            }
        }

        const fooJson = await Serialize.writes({id: 'abc'}, Foo) as any;

        test(`@Writes should override the default writer.`, t => {
            t.is(fooJson.id, 'abc_custom');

            return Serialize.writes({id: 'error'}, Foo)
                .then(() => t.fail('An error should be raised when an custom writer is not found'))
                .catch((err : Error) => {
                    const expected = "Foo.id cannot be serialized into JSON value.\nCause: Custom error";
                    t.deepEqual(err.message, expected);
                });
        });

    } catch(e) {
        console.error(e);
    }

}());
