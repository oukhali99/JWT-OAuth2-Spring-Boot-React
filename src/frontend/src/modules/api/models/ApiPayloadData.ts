export enum ApiErrorCode {
    SUCCESS = "SUCCESS",
    NONSPECIFIC_ERROR = "NONSPECIFIC_ERROR",
    BAD_JWT_TOKEN = "BAD_JWT_TOKEN",
}

export class ApiPayloadData<T = any> {
    constructor(
        public errorCode: ApiErrorCode,
        public content: T,
    ) {}

    isSuccess(): boolean {
        return this.errorCode === ApiErrorCode.SUCCESS;
    }
}
