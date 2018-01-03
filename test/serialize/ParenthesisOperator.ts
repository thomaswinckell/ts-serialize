import test from "ava"

import {Serializable, Serialize} from "../../src"


(async function() {

    try {

        @Serializable({
            bar: String
        })
        class Bar {
            bar: string;
        }

        @Serializable({
            bar2: String
        })
        class Bar2 {
            bar2: string;
        }

        @Serializable({
            foo: ['(', Bar, '&', Bar2, ')', '|', String]
        })
        class Foo {

            public foo: (Bar & Bar2) | string;

            constructor(foo: (Bar & Bar2) | string) {
                this.foo = foo;
            }
        }

        /*const foo = new Foo({bar: "bar", bar2: "bar2"});
        const fooJson = await Serialize.writes(foo, Foo) as any;
        const fooClass = await Serialize.reads(fooJson, Foo);

        test(`Reads/writes (Bar&Bar2)|string property as Bar&Bar2`, t => {
            t.is(fooJson.foo.bar, 'bar');
            t.is(fooJson.foo.bar2, 'bar2');
            t.is((fooClass.foo as any).bar, 'bar');
            t.is((fooClass.foo as any).bar2, 'bar2');
        });*/

        const foo2 = new Foo("abc");
        const foo2Json = await Serialize.writes(foo2, Foo) as any;
        console.log('foo2Json')
        console.log(foo2Json)
        const foo2Class = await Serialize.reads(foo2Json, Foo);

        test(`Reads/writes (Bar&Bar2)|string property as string`, t => {
            t.is(foo2Json.foo, 'abc');
            t.is(foo2Class.foo, 'abc');
        });

        /*const badJson = {
            foo: {bar: "bar"},
        };

        const errorMessages = [
            'Foo.foo.bar2 cannot be serialized into String.\nCause: The value is not a string value.',
        ];

        test(`Handles reads/writes error with & operator`, t => {

            return Serialize.reads(badJson, Foo, false)
                .then(() => t.fail('An error should be raised while serializing `badJson`'))
                .catch((err: Error[]) => {
                    const messages = err.map(e => e.message);
                    t.deepEqual(messages, errorMessages);
                });
        });*/
    } catch(e) {
        console.error(e);
    }

}());