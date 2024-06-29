import { ExceptionType } from './exception.type';

export abstract class BaseException<StatusCode = number, Message = string> {
  composedMessage: string;
  constructor(
    public type: ExceptionType,
    public statusCode: StatusCode,
    public message: Message,
  ) {
    this.type = type;
    this.statusCode = statusCode;
    this.message = message;
  }
}
