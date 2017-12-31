import "reflect-metadata";
import {default as ObjectMetadata} from "./ObjectMetadata";

const metadataKey = "design:serializers";

namespace MetadataHelper {

    export function hasMetadata(target: Object): boolean {
        return !!Reflect.getMetadata(metadataKey, target);
    }

    export function getMetadata<T>(target: Object): ObjectMetadata {
        return Reflect.getMetadata(metadataKey, target) || {};
    }

    export function registerMetadata<T>(target: Object, metadata: ObjectMetadata): void {
        Reflect.defineMetadata(metadataKey, metadata, target);
    }
}

export default MetadataHelper;