import { HttpResponseCode } from "./http-response-code";

export interface InternalErrorInfo {
    code?: number;
    message?: string;
    data?: any;
}

export class InternalError<T extends InternalErrorInfo> extends Error {
    protected _code: number;
    protected _data?: any;

    constructor(infor?: T) {
        super(infor?.message);
        this._code = infor?.code ?? HttpResponseCode.INTERNAL_SERVER_ERROR;
        this._data = infor?.data;

        Object.setPrototypeOf(this, InternalError.prototype);
    }

    get code(): number {
        return this._code;
    }

    set code(value: number) {
        this._code = value;
    }

    get data(): any {
        return this._data;
    }
}