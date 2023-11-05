import { HttpResponseCode } from "./http-response-code";
import { InternalError, InternalErrorInfo } from "./internal-error";

export interface ResourceExistedErrorInfor extends InternalErrorInfo { }

export class ResourceExistedError extends InternalError<ResourceExistedErrorInfor> {
    constructor(info?: ResourceExistedErrorInfor) {
        super(info);
        this.code = info?.code ?? HttpResponseCode.RESOURCE_EXISTED;
    }
}
