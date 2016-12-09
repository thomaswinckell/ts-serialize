import * as assert      from "power-assert"
import {isEqual}        from "lodash"
import {Optional, Some} from "scalts"

import {Serializable, Serialize, SerializeOpt} from "../src"
import {SerializeArray} from "../src/core/SerializeArray"


describe('ts-serialize', () => {

    class User extends Serializable< User > {

        @Serialize< string >('_id')
        public id : string;

        @SerializeOpt< string >( String )
        public name : Optional< string >;

        @Serialize< number >()
        private age : number;

        @SerializeArray< User >( User )
        public children : User[];

        @Serialize< string >()
        public language : string;

        get isAdult() : boolean { return this.age > 18; }

        constructor(id : string, name : Optional< string >, age : number, children : Array< User > = [], language : string = 'english') {
            super();
            this.id = id;
            this.name = name;
            this.age = age;
            this.children = children;
            this.language = language;
        }
    }

    const json = {
        _id : 'identifier',
        garbage : '!!!!!!!!!! GARBAGE GARBAGE GARBAGE GARBAGE GARBAGE GARBAGE GARBAGE GARBAGE GARBAGE GARBAGE !!!!!!',
        name  : 'Dad',
        age   : '40',
        children : [{
            _id   : 'son',
            name  : 'David',
            age   : 13,
        }, {
            _id   : 'daughter',
            name  : 'Jane',
            age   : 18,
        }],
    };

    const cleanJson = {
        _id : 'identifier',
        name  : 'Dad',
        age   : 40,
        language : 'english',
        children : [{
             _id   : 'son',
             name  : 'David',
             age   : 13,
             language : 'english',
             children : []
        }, {
             _id   : 'daughter',
             name  : 'Jane',
             age   : 18,
             language : 'english',
             children : []
        }],
    };

    const referenceUser = new User(json._id, Some(json.name), +json.age, [ new User("son", Some("David"), 13), new User("daughter", Some("Jane"), 18) ]);
    const mbUsersFromJson = User.fromStringAsArray< User >(JSON.stringify([json]));

    mbUsersFromJson.fold< void >( errors => errors.forEach( e => e.print() ), json => console.log(json) );

    it('can unmarhsall Users without errors', () => {
        assert( mbUsersFromJson.isRight );
        assert( mbUsersFromJson.right().get().head.nonEmpty );
    });

    if(mbUsersFromJson.isLeft || mbUsersFromJson.right().get().head.isEmpty) { return false; }

    const userFromJson = mbUsersFromJson.right().get().head.get();

    it('unmarhsalling keeps the prototype', () => {

        assert( User.prototype.isPrototypeOf( userFromJson ) );
        assert( userFromJson instanceof User );

        assert( Serializable.prototype.isPrototypeOf( userFromJson ) );
        assert( userFromJson instanceof Serializable );
    });

    it('unmarhsalling keeps the computed properties', () => {
        assert( userFromJson.isAdult );
    });

    it('unmarhsalling keeps the default values', () => {
        assert.strictEqual( userFromJson.language, 'english' );
    });

    it('unmarhsalling don\'t loose and don\'t take too much data', () => {
        assert( isEqual( userFromJson, referenceUser ) );
    });

    it('marhsalling don\'t loose and don\'t take too much data', () => {
        assert( isEqual( userFromJson.toJson(), cleanJson ) );
    });
});