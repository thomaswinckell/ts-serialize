import test from "ava"

import {Serializable, Serialize} from "../../src"


(async function() {

    class Foo {

        @Serializable(String, Number)
        public simpleMap : Map<string, number>;

        @Serializable(String, Map, [String, Number])
        public mapOfMap : Map<string, Map<string, number>>;

        constructor(simpleMap: Map<string, number>, mapOfMap : Map<string, Map<string, number>>) {
            this.simpleMap = simpleMap;
            this.mapOfMap = mapOfMap;
        }
    }

    const simpleMap = new Map();
    simpleMap.set('foo', 1);
    simpleMap.set('bar', 2);

    const simpleMap2 = new Map();
    simpleMap2.set('foo2', 3);
    simpleMap2.set('bar2', 4);

    const mapOfMap = new Map();
    mapOfMap.set('foo', simpleMap);
    mapOfMap.set('bar', simpleMap2);

    const foo = new Foo(simpleMap, mapOfMap);

    const fooJson = await Serialize.writes(foo, Foo) as any;
    const fooClass = await Serialize.reads(fooJson, Foo);

    test(`Reads/writes simple Map property of Serializable`, t => {
        t.deepEqual(fooJson.simpleMap, {foo: 1, bar: 2});
        t.deepEqual(fooClass.simpleMap, simpleMap);
    });

    test(`Reads/writes Map of Map property of Serializable`, t => {
        t.deepEqual(fooJson.mapOfMap, { foo : {foo: 1, bar: 2}, bar : {"foo2": 3, "bar2": 4}  });
        t.deepEqual(fooClass.mapOfMap, mapOfMap);
    });

    const badJson = {
        simpleMap : "map",
        mapOfMap : {foo : {foo: 1, bar: 2}, bar: 2},
    };

    const errorMessages = [
        'Foo.simpleMap cannot be serialized into Map<String, Number>.\nCause: The value is not a Map.',
        'Foo.mapOfMap[bar] cannot be serialized into Map<String, Number>.\nCause: The value is not a Map.',
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
