import test from "ava"

import {Serializable, Serialize} from "../../src"


(async function() {

    class Bar extends Serializable {

        @Serialize()
        public str : string;

        constructor(s: string) {
            super();
            this.str = s;
        }
    }

    class Foo extends Serializable {

        @Serialize()
        public bar : Bar;

        @Serialize(Bar)
        public barList : Bar[];

        constructor(bar: Bar, barList: Bar[]) {
            super();
            this.bar = bar;
            this.barList = barList;
        }
    }

    const foo = new Foo(new Bar("titi"), [new Bar("toto"), new Bar("tata")]);
    const fooJson = await foo.toJson();
    const fooClass = await Foo.fromJsObject<Foo>(fooJson);

    test(`Reads/writes Serializable with Serializable property`, t => {
        t.deepEqual(fooJson.bar, {str : 'titi'});
    });

    test(`Reads/writes Serializable with Serializable[] property`, t => {
        t.deepEqual(fooJson.barList, [{str : 'toto'}, {str: 'tata'}]);
    });

    const badJson = {
        bar : {str: 123},
        barList : [{str: 1}, {str: 2}],
    };

    const errorMessages = [
        'The property Foo.bar.str cannot be serialized into String.\nCause: The value is not a string value.',
        'The property Foo.barList[0].str cannot be serialized into String.\nCause: The value is not a string value.',
        'The property Foo.barList[1].str cannot be serialized into String.\nCause: The value is not a string value.',
    ];

    test(`Handles reads/writes error`, t => {

        return Foo.fromJsObject<Foo>(badJson, false)
            .then(() => t.fail('An error should be raised while serializing `badJson`'))
            .catch((err : Error[]) => {
                const messages = err.map(e => e.message);
                t.deepEqual(messages, errorMessages);
            });
    });

}());
