import "reflect-metadata";
import PropMetadata from "./PropMetadata";

const metadataKey = "design:serializers";

namespace ObjectMetadata {

    export function hasObjectMetadata(target: Object): boolean {
        return !!Reflect.getMetadata(metadataKey, target);
    }

    export function getObjectMetadata<T>(target: Object): PropMetadata<T>[] {
        return Reflect.getMetadata(metadataKey, target) || [];
    }

    export function registerProperty<T>(target: Object, field: PropMetadata<T>): void {
        const objectMetadata = getObjectMetadata(target);
        if (objectMetadata) {
            Reflect.defineMetadata(metadataKey, [...objectMetadata, field], target);
        } else {
            Reflect.defineMetadata(metadataKey, [field], target);
        }
    }
}

export default ObjectMetadata;