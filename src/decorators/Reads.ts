import MetadataHelper from "../metadata/MetadataHelper";
import Reader from "../reader/Reader";


export default function Reads<T>(reader: Reader<T>) {

    return function(target: any, classPropertyName?: string) {

        if(!classPropertyName) {
            throw '@Reads should be used on a class property';
        }

        MetadataHelper.setReader(target.constructor.prototype, classPropertyName, reader);
    }
}