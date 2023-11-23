import { HttpResponseCode } from "./http-response-code";
import { InternalError, InternalErrorInfo } from "./internal-error";

export interface UnauthorizationErrorInfo extends InternalErrorInfo { }

export class UnauthorizationError extends InternalError<UnauthorizationErrorInfo> {
    constructor(info?: UnauthorizationErrorInfo) {
        super(info);
        this.code = info?.code ?? HttpResponseCode.UNAUTHORIZATION_ERROR;
    }
}