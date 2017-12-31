import test from "ava"

import {Serializable, Serialize, JsonName} from "../../src"


(async function() {

    try {

        @Serializable({
            id: String,
        })
        class Foo {

            @JsonName("_id")
            public id: string;

            constructor(id: string) {
                this.id = id;
            }
        }

        const foo = new Foo('abc');
        const fooJson = await Serialize.writes(foo, Foo) as any;
        const fooClass = await Serialize.reads(fooJson, Foo);

        test(`@JsonName should change the property name of the json object, not the class object.`, t => {
            t.is(fooJson._id, 'abc');
            t.is(fooJson.id, undefined);
            t.is(fooClass.id, 'abc');
        });

    } catch(e) {
        console.error(e);
    }

}());
