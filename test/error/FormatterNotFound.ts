import test from "ava"

import {Serializable, Serialize} from "../../src"


(async function() {

    class NotSerializable {

    }

    class Foo extends Serializable {

        @Serialize()
        public bar : NotSerializable;
    }

    test(`Error message when there is no reader found`, t => {

        return Foo.fromJsObject<Foo>({})
            .then(() => t.fail('An error should be raised when an array reader is not found'))
            .catch((err : Error) => {
                const expected = "Cannot find reader for property Foo.bar of type 'NotSerializable'.";
                t.deepEqual(err.message, expected);
            });
    });

    test(`Error message when there is no writer found`, t => {

        return new Foo().toJson()
            .then(() => t.fail('An error should be raised when an array writer is not found'))
            .catch((err : Error) => {
                const expected = "Cannot find writer for property Foo.bar of type 'NotSerializable'.";
                t.deepEqual(err.message, expected);
            });
    });

    class FooArray extends Serializable {

        @Serialize(NotSerializable)
        public bar : NotSerializable[];

        constructor(bar : NotSerializable[]) {
            super();
            this.bar = bar;
        }
    }

    test(`Error message when there is no reader found for a generic type`, t => {

        return FooArray.fromJsObject<FooArray>({ bar : [{}]})
            .then(() => t.fail('An error should be raised when a reader for a generic type is not found'))
            .catch((err : Error) => {
                const expected = "Cannot find reader for property FooArray.bar[0] of type 'NotSerializable'.";
                t.deepEqual(err.message, expected);
            });
    });

    test(`Error message when there is no writer found for a generic type`, t => {

        return new FooArray([{}]).toJson()
            .then(() => t.fail('An error should be raised when a writer for a generic type is not found'))
            .catch((err : Error) => {
                const expected = "Cannot find writer for property FooArray.bar[0] of type 'NotSerializable'.";
                t.deepEqual(err.message, expected);
            });
    });

    class NotSerializableGenerics<T, U> {

    }

    class ComplexFoo extends Serializable {

        @Serialize([String,Array,[Map,[String,Number]]])
        public complexType: NotSerializableGenerics<String, Array<Map<String, Number>>>;
    }

    test(`Error message when there is no reader found with complex types`, t => {

        return ComplexFoo.fromJsObject<ComplexFoo>({})
            .then(() => t.fail('An error should be raised when a reader is not found'))
            .catch((err : Error) => {
                const expected = "Cannot find reader for property ComplexFoo.complexType of type 'NotSerializableGenerics<String, Array<Map<String, Number>>>'.";
                t.deepEqual(err.message, expected);
            });
    });

    test(`Error message when there is no writer found with complex types`, t => {

        return new ComplexFoo().toJson()
            .then(() => t.fail('An error should be raised when a writer is not found'))
            .catch((err : Error) => {
                const expected = "Cannot find writer for property ComplexFoo.complexType of type 'NotSerializableGenerics<String, Array<Map<String, Number>>>'.";
                t.deepEqual(err.message, expected);
            });
    });

}());
