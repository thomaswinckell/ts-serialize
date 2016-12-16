import FieldSerializer from "./FieldSerializer"


namespace FieldsMapper {

    let mapper: { [ constructorName: string ]: FieldSerializer[] } = {};

    export function getFieldByConstructorName(constructorName: string): FieldSerializer[] {
        return mapper[constructorName] || [];
    }

    export function registerField(constructorName: string, field: FieldSerializer): void {
        if (mapper[constructorName]) {
            mapper[constructorName] = mapper[constructorName].concat(field);
        } else {
            mapper[constructorName] = [field];
        }
    }
}

export default FieldsMapper