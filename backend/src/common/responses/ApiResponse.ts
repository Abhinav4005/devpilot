export class ApiResponse<T> {
    public success: boolean;
    public statusCode: number;
    public message: string
    public data: T | null;
    public meta: Record<string, unknown> | null;

    constructor(
        statusCode: number,
        data: T | null,
        message: string = "Success",
        meta: Record<string, unknown> | null = null
    ) {
        this.success = true;
        this.statusCode = statusCode;
        this.data = data;
        this.message = message;
        this.meta = meta;
    }
}