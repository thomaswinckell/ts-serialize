import MetadataHelper from "../metadata/MetadataHelper";


export default function JsonName(jsonName : string) {

    return function(target: any, classPropertyName?: string) {

        if(!classPropertyName) {
            throw '@JsonName should be used on a class property';
        }

        MetadataHelper.setJsonName(target.constructor.prototype, classPropertyName, jsonName);
    }
}