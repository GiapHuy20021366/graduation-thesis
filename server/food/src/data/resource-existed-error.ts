import { HttpResponseCode } from "./http-response-code";
import { InternalError, InternalErrorInfo } from "./internal-error";

export interface ResourceExistedErrorInfo extends InternalErrorInfo { }

export class ResourceExistedError extends InternalError<ResourceExistedErrorInfo> {
    constructor(info?: ResourceExistedErrorInfo) {
        super(info);
        this.code = info?.code ?? HttpResponseCode.RESOURCE_EXISTED;
    }
}
