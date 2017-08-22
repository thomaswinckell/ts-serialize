import test from "ava"

import {Serializable, Serialize} from "../../src"


(async function() {

    class Foo extends Serializable {

        @Serialize()
        public id: string;

        @Serialize()
        public bar: number;

        @Serialize()
        public bool: boolean;

        constructor(id : string, bar : number, bool : boolean) {
            super();
            this.id = id;
            this.bar = bar;
            this.bool = bool;
        }
    }

    const foo = new Foo('abc', 1, true);
    const fooJson = await foo.toJson();
    const fooClass = await Foo.fromJsObject<Foo>(fooJson);

    test(`Reads/writes string property`, t => {
        t.is(fooJson.id, 'abc');
        t.is(fooClass.id, 'abc');
    });

    test(`Reads/writes number property`, t => {
        t.is(fooJson.bar, 1);
        t.is(fooClass.bar, 1);
    });

    test(`Reads/writes boolean property`, t => {
        t.is(fooJson.bool, true);
        t.is(fooClass.bool, true);
    });

    const badJson = {
        id : 123,
        bar : '1',
        bool : 'true'
    };

    const errorMessages = [
        'The property Foo.id cannot be serialized into String.\nCause: The value is not a string value.',
        'The property Foo.bar cannot be serialized into Number.\nCause: The value is not a number value.',
        'The property Foo.bool cannot be serialized into Boolean.\nCause: The value is not a boolean value.',
    ];

    test(`Handles reads/writes error`, t => {

        return Foo.fromJsObject<Foo>(badJson, false)
            .then(() => t.fail('An error should be raised while serializing `badJson`'))
            .catch((err : Error[]) => {
                const messages = err.map(e => e.message);
                t.deepEqual(messages, errorMessages);
            });
    });

    test(`Handles reads/writes error quickly (fail fast)`, t => {

        return Foo.fromJsObject<Foo>(badJson, true)
            .then(() => t.fail('An error should be raised while serializing `badJson`'))
            .catch((err : Error) => t.is(err.message, errorMessages[0]));
    });

}());
