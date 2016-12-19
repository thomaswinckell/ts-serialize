import FieldSerializer from "./FieldSerializer"


namespace SerializersMapper {

    export function getFieldSerializers(target: Object): FieldSerializer[] {
        return Reflect.getMetadata("design:serializers", target) || [];
    }

    export function registerField(target: Object, field: FieldSerializer): void {
        const currentMetadata = getFieldSerializers(target);
        if (currentMetadata) {
            Reflect.defineMetadata("design:serializers", [...currentMetadata, field], target);
        } else {
            Reflect.defineMetadata("design:serializers", [field], target);
        }
    }
}

export default SerializersMapper