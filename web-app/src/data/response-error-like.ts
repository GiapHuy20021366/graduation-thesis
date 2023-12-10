export interface ResponseErrorLike<Target, Reason> {
    code: number;
    msg: string;
    data?: {
        target: Target;
        reason: Reason;
    }
}