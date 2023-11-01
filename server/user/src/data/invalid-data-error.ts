import { HttpResponseCode } from "./http-response-code";
import { InternalError, InternalErrorInfo } from "./internal-error";

export interface InvalidDataErrorInfor extends InternalErrorInfo {}

export class InvalidDataError extends InternalError<InvalidDataErrorInfor> {
    constructor(info?: InvalidDataErrorInfor) {
        super(info);
        this.code = info?.code ?? HttpResponseCode.BAD_REQUEST;
    }
}
