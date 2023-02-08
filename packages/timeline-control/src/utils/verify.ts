import { isNaN as isNaNLodash } from 'lodash';
export namespace VerifyNamespace {

  export function isUndefined(value: any) {
    return value === undefined;
  }

  export function isNaN(value: any) {
    return isNaNLodash(value);
  }

}
