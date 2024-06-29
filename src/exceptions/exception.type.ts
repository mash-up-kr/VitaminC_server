export type ExceptionOptions = {
  cause?: any;
  statusCode?: number;
  [additional: string]: any;
};

export enum ExceptionType {
  USER = 'USER',
  INTERNAL = 'INTERNAL',
  EXTERNAL = 'EXTERNAL',
}

export type ExceptionParams<
  T extends string,
  U extends string = never,
> = T extends `${infer _}{{${infer K}}}${infer Rest}`
  ? ExceptionParams<Rest, U | K>
  : {
      [key in U]: string | number;
    };
