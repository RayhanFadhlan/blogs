export class ResponseDto<T = any> {
  success: boolean;
  message: string;
  data: T | null;
  statusCode: number;
  constructor(
    status: 'success' | 'error',
    message: string,
    statusCode: number = 200,
    data: T | null = null,
  ) {

    this.success = true ? status === 'success' : false;
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
  }

  static success<T>(message: string, statusCode : number, data: T): ResponseDto<T> {
    return new ResponseDto<T>('success', message, statusCode, data);
  }

  static error<T>(message: string, statusCode : number, data: T): ResponseDto<T> {
    return new ResponseDto('error', message, statusCode, data);
  }
}
