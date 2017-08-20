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

}());
