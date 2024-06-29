import { BaseException } from './exception.abstract';
import { ExceptionParams, ExceptionType } from './exception.type';

export const createException = (exceptionType: ExceptionType) => {
  return <C extends number, T extends string>(
    defaultStatusCode: C,
    defaultMessage: T,
  ) => {
    return class extends BaseException<C, T> {
      constructor(arg?: ExceptionParams<T>) {
        super(exceptionType, defaultStatusCode, defaultMessage);

        if (arg) {
          this.composedMessage = composeExceptionMessage(defaultMessage, arg);
        }
      }
    };
  };
};

function composeExceptionMessage(message: string, options = {}): string {
  return message.replace(
    /{{([a-zA-Z0-9_-]+)}}/g,
    (_: string, matched: string) => {
      return options[matched];
    },
  );
}
