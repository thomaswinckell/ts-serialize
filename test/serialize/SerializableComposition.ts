import test from "ava"

import {Serializable, Serialize} from "../../src"


(async function() {

    class Bar {

        @Serializable()
        public str : string;

        constructor(s: string) {
            this.str = s;
        }
    }

    class Foo {

        @Serializable()
        public bar : Bar;

        @Serializable(Bar)
        public barList : Bar[];

        constructor(bar: Bar, barList: Bar[]) {
            this.bar = bar;
            this.barList = barList;
        }
    }

    const foo = new Foo(new Bar("titi"), [new Bar("toto"), new Bar("tata")]);
    const fooJson = await Serialize.writes(foo, Foo) as any;
    const fooClass = await Serialize.reads(fooJson, Foo);

    test(`Reads/writes Serializable with Serializable property`, t => {
        t.deepEqual(fooJson.bar, {str : 'titi'});
        t.is(fooClass.bar.str, 'titi');
    });

    test(`Reads/writes Serializable with Serializable[] property`, t => {
        t.deepEqual(fooJson.barList, [{str : 'toto'}, {str: 'tata'}]);
    });

    const badJson = {
        bar : {str: 123},
        barList : [{str: 1}, {str: 2}],
    };

    const errorMessages = [
        'Foo.bar.str cannot be serialized into String.\nCause: The value is not a string value.',
        'Foo.barList[0].str cannot be serialized into String.\nCause: The value is not a string value.',
        'Foo.barList[1].str cannot be serialized into String.\nCause: The value is not a string value.',
    ];

    test(`Handles reads/writes error`, t => {

        return Serialize.reads(badJson, Foo, [], false)
            .then(() => t.fail('An error should be raised while serializing `badJson`'))
            .catch((err : Error[]) => {
                const messages = err.map(e => e.message);
                t.deepEqual(messages, errorMessages);
            });
    });

}());
