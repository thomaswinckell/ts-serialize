import test from "ava"

import {Serializable, Serialize} from "../../src"


(async function() {

    class NotSerializable {

    }

    @Serializable({
        bar: NotSerializable
    })
    class Foo {
        public bar : NotSerializable;
    }

    test(`Error message when there is no reader found`, t => {

        return Serialize.reads({}, Foo)
            .then(() => t.fail('An error should be raised when an array reader is not found'))
            .catch((err : Error) => {
                const expected = "Cannot find reader for Foo.bar of type NotSerializable.";
                t.deepEqual(err.message, expected);
            });
    });

    test(`Error message when there is no writer found`, t => {

        return Serialize.writes(new Foo(), Foo)
            .then(() => t.fail('An error should be raised when an array writer is not found'))
            .catch((err : Error) => {
                const expected = "Cannot find writer for Foo.bar of type NotSerializable.";
                t.deepEqual(err.message, expected);
            });
    });

    @Serializable({
        bar: [Array, [NotSerializable]]
    })
    class FooArray {

        public bar : NotSerializable[];

        constructor(bar : NotSerializable[]) {
            this.bar = bar;
        }
    }

    test(`Error message when there is no reader found for a generic type`, t => {

        return Serialize.reads( { bar : [{}]}, FooArray)
            .then(() => t.fail('An error should be raised when a reader for a generic type is not found'))
            .catch((err : Error) => {
                const expected = "Cannot find reader for FooArray.bar[0] of type NotSerializable.";
                t.deepEqual(err.message, expected);
            });
    });

    test(`Error message when there is no writer found for a generic type`, t => {

        return Serialize.writes(new FooArray([{}]), FooArray)
            .then(() => t.fail('An error should be raised when a writer for a generic type is not found'))
            .catch((err : Error) => {
                const expected = "Cannot find writer for FooArray.bar[0] of type NotSerializable.";
                t.deepEqual(err.message, expected);
            });
    });

    class NotSerializableGenerics<T, U> {

    }

    @Serializable({
        complexType: [NotSerializableGenerics, [String,Array,[Map,[String,Number]]]]
    })
    class ComplexFoo {
        public complexType: NotSerializableGenerics<String, Array<Map<String, Number>>>;
    }

    test(`Error message when there is no reader found with complex types`, t => {

        return Serialize.reads( {}, ComplexFoo)
            .then(() => t.fail('An error should be raised when a reader is not found'))
            .catch((err : Error) => {
                const expected = "Cannot find reader for ComplexFoo.complexType of type NotSerializableGenerics<String, Array<Map<String, Number>>>.";
                t.deepEqual(err.message, expected);
            });
    });

    test(`Error message when there is no writer found with complex types`, t => {

        return Serialize.writes(new ComplexFoo(), ComplexFoo)
            .then(() => t.fail('An error should be raised when a writer is not found'))
            .catch((err : Error) => {
                const expected = "Cannot find writer for ComplexFoo.complexType of type NotSerializableGenerics<String, Array<Map<String, Number>>>.";
                t.deepEqual(err.message, expected);
            });
    });

}());
