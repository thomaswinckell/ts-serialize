import "reflect-metadata";
import {default as ObjectMetadata, PartialObjectMetadata} from "./ObjectMetadata";

const metadataKey = "design:serializers";

namespace MetadataHelper {

    export function hasMetadata(target: Object): boolean {
        return !!Reflect.getMetadata(metadataKey, target);
    }

    export function getMetadata<T>(target: Object): ObjectMetadata {
        return Reflect.getMetadata(metadataKey, target) || {};
    }

    export function registerMetadata<T>(target: Object, metadata: ObjectMetadata): void {
        setPartialMetadata(target, metadata);
    }

    function setPartialMetadata(target: Object, partialMetadata: PartialObjectMetadata) {
        const metadata = getMetadata(target);
        let newMetadata = {};

        const keys = Object.keys(metadata).concat(Object.keys(partialMetadata))
            .filter((value, index, self) => self.indexOf(value) === index);

        keys.forEach(propName => {
            newMetadata[propName] = {
                ...metadata[propName],
                ...(partialMetadata[propName] || {})
            };
        });

        Reflect.defineMetadata(metadataKey, newMetadata, target);
    }

    export function setJsonName(target: Object, propName: string, jsonName: string): void {
        setPartialMetadata(target, {[propName] : { jsonName }});
    }
}

export default MetadataHelper;