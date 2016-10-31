import FieldSerializer from "./FieldSerializer";


class FieldsMapper {

    private mapper : { [ constructorName : string ] : FieldSerializer[] } = {};

    getFieldByConstructorName( constructorName : string ) : FieldSerializer[] {
        return this.mapper[ constructorName ] || [];
    }

    registerField( constructorName : string, field : FieldSerializer ) : void {
        if( this.mapper[ constructorName ] ) {
            this.mapper[constructorName] = this.mapper[constructorName].concat( field );
        } else {
            this.mapper[constructorName] = [ field ];
        }
    }
}

export default new FieldsMapper();