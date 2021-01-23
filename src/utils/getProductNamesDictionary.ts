import { flatten } from "fp-ts/lib/Array";
import { pipe } from "fp-ts/lib/function";
import { map as mapRecord, collect } from "fp-ts/lib/Record";
import TNames from "types/TNames";

const getProductNamesDictionary = (names: TNames) =>
  pipe(
    names,
    mapRecord((record) => record.B),
    mapRecord(mapRecord((productRecord) => productRecord.N)),
    mapRecord(collect((key, value) => ({ id: Number(key), name: value }))),
    collect((_, value) => value),
    flatten
  );

export default getProductNamesDictionary;
