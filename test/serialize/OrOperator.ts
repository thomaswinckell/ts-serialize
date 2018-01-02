import test from "ava"

import {Serializable, Serialize} from "../../src"


(async function() {

    @Serializable({
        id: [String, '|', Number]
    })
    class Foo {

        public id: string|number;

        constructor(id: string|number) {
            this.id = id;
        }
    }

    const foo = new Foo('abc');
    const fooJson = await Serialize.writes(foo, Foo) as any;
    const fooClass = await Serialize.reads(fooJson, Foo);

    const fooNumber = new Foo(123);
    const fooNumberJson = await Serialize.writes(fooNumber, Foo) as any;
    const fooNumberClass = await Serialize.reads(fooNumberJson, Foo);

    test(`Reads/writes string|number property`, t => {
        t.is(fooJson.id, 'abc');
        t.is(fooClass.id, 'abc');

        t.is(fooNumberJson.id, 123);
        t.is(fooNumberClass.id, 123);
    });

    const badJson = {
        id : [],
    };

    const errorMessages = [
        'Foo.id cannot be serialized into String|Number.\nCause: The value is not a number value.',
    ];

    test(`Handles reads/writes error`, t => {

        return Serialize.reads(badJson, Foo, false)
            .then(() => t.fail('An error should be raised while serializing `badJson`'))
            .catch((err : Error[]) => {
                const messages = err.map(e => e.message);
                t.deepEqual(messages, errorMessages);
            });
    });

}());
