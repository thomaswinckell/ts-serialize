import test from "ava"

import {Serializable, Serialize} from "../src";


async function runTests() {

    class Foo extends Serializable {

        @Serialize()
        public id: string;

        @Serialize()
        public bar: number;

        constructor(id : string, bar : number) {
            super();
            this.id = id;
            this.bar = bar;
        }
    }

    const foo = new Foo('abc', 1);
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
}


runTests();
