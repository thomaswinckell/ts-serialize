import * as assert      from "power-assert"
import {isEqual}        from "lodash"
import {Optional, Some, None} from "scalts"

import {Serializable, Serialize, SerializeOpt, SerializeArray} from "../src"


describe('ts-serialize', () => {

    class Role extends Serializable {

        @Serialize()
        public id : string;

        @SerializeOpt( String )
        public name : Optional< string >;

        constructor(id : string, name : Optional< string > = None) {
            super();
            this.id = id;
            this.name = name;
        }
    }

    class User extends Serializable {

        @Serialize('_id')
        public id : string;

        @SerializeOpt( String )
        public name : Optional< string >;

        @Serialize()
        private age : number;

        @SerializeArray( User )
        public children : User[];

        @Serialize()
        public role : Role;

        @Serialize()
        public language : string;

        get isAdult() : boolean { return this.age > 18; }

        constructor(id : string, name : Optional< string >, age : number, role : Role, children : Array< User > = [], language : string = 'english') {
            super();
            this.id = id;
            this.name = name;
            this.age = age;
            this.role = role;
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
            role: {
                id: '123456'
            },
        }, {
            _id   : 'daughter',
            name  : 'Jane',
            age   : 18,
            role: {
                id: '123456'
            },
        }],
        role: {
            id: '123456'
        },
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
             children : [],
             role: {
                id: '123456',
                name : null
             },
        }, {
             _id   : 'daughter',
             name  : 'Jane',
             age   : 18,
             language : 'english',
             children : [],
             role: {
                id: '123456',
                name : null
             },
        }],
        role: {
            id: '123456',
            name : null
        },
    };

    const referenceUser = new User(json._id, Some(json.name), +json.age, new Role("123456"), [ new User("son", Some("David"), 13, new Role("123456")), new User("daughter", Some("Jane"), 18, new Role("123456")) ]);
    const mbUsersFromJson = User.fromStringAsArray< User >(JSON.stringify([json]));

    mbUsersFromJson.fold< void >( errors => errors.forEach( e => e.print() ), json => console.log(json) );

    it('can unmarhsall Users without errors', () => {
        assert( mbUsersFromJson.isRight );
        assert( mbUsersFromJson.right().get().head.nonEmpty );
    });

    if(mbUsersFromJson.isLeft || mbUsersFromJson.right().get().head.isEmpty) { return false; }

    const userFromJson = mbUsersFromJson.right().get().head.get();
    const roleFromJson = userFromJson.role;

    it('unmarhsalling keeps the prototype', () => {

        assert( User.prototype.isPrototypeOf( userFromJson ) );
        assert( userFromJson instanceof User );

        assert( Serializable.prototype.isPrototypeOf( userFromJson ) );
        assert( userFromJson instanceof Serializable );

        assert( Role.prototype.isPrototypeOf( roleFromJson ) );
        assert( roleFromJson instanceof Role );

        assert( Serializable.prototype.isPrototypeOf( roleFromJson ) );
        assert( roleFromJson instanceof Serializable );
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