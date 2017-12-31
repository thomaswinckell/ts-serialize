import MetadataHelper from "../metadata/MetadataHelper";
import Writer from "../writer/Writer";


export default function Writes<T>(writer: Writer<T>) {

    return function(target: any, classPropertyName?: string) {

        if(!classPropertyName) {
            throw '@Writes should be used on a class property';
        }

        MetadataHelper.setWriter(target.constructor.prototype, classPropertyName, writer);
    }
}