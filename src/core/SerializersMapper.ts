import FieldSerializer from "./FieldSerializer"


const metadataKey = "design:serializers";

namespace SerializersMapper {

    export function getFieldSerializers(target: Object): FieldSerializer[] {
        return Reflect.getMetadata(metadataKey, target) || [];
    }

    export function registerField(target: Object, field: FieldSerializer): void {
        const currentMetadata = getFieldSerializers(target);
        if (currentMetadata) {
            Reflect.defineMetadata(metadataKey, [...currentMetadata, field], target);
        } else {
            Reflect.defineMetadata(metadataKey, [field], target);
        }
    }
}

export default SerializersMapper