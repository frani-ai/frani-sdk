export declare class HttpException extends Error {
  readonly message: string;
  readonly statusCode: number;
  readonly error?: string | undefined;
  constructor(message: string, statusCode: number, error?: string | undefined);
  toJSON(): {
    statusCode: number;
    error: string;
    message: string;
    dateTime: string;
  };
}
export declare class BadRequestException extends HttpException {
  constructor(message?: string);
}
export declare class UnauthorizedException extends HttpException {
  constructor(message?: string);
}
export declare class PaymentRequiredException extends HttpException {
  constructor(message?: string);
}
export declare class ForbiddenException extends HttpException {
  constructor(message?: string);
}
export declare class NotFoundException extends HttpException {
  constructor(message?: string);
}
export declare class MethodNotAllowedException extends HttpException {
  constructor(message?: string);
}
export declare class NotAcceptableException extends HttpException {
  constructor(message?: string);
}
export declare class ProxyAuthenticationRequiredException extends HttpException {
  constructor(message?: string);
}
export declare class RequestTimeoutException extends HttpException {
  constructor(message?: string);
}
export declare class ConflictException extends HttpException {
  constructor(message?: string);
}
export declare class GoneException extends HttpException {
  constructor(message?: string);
}
export declare class LengthRequiredException extends HttpException {
  constructor(message?: string);
}
export declare class PreconditionFailedException extends HttpException {
  constructor(message?: string);
}
export declare class PayloadTooLargeException extends HttpException {
  constructor(message?: string);
}
export declare class UriTooLongException extends HttpException {
  constructor(message?: string);
}
export declare class UnsupportedMediaTypeException extends HttpException {
  constructor(message?: string);
}
export declare class RangeNotSatisfiableException extends HttpException {
  constructor(message?: string);
}
export declare class ExpectationFailedException extends HttpException {
  constructor(message?: string);
}
export declare class ImATeapotException extends HttpException {
  constructor(message?: string);
}
export declare class MisdirectedRequestException extends HttpException {
  constructor(message?: string);
}
export declare class UnprocessableEntityException extends HttpException {
  constructor(message?: string);
}
export declare class LockedException extends HttpException {
  constructor(message?: string);
}
export declare class FailedDependencyException extends HttpException {
  constructor(message?: string);
}
export declare class TooEarlyException extends HttpException {
  constructor(message?: string);
}
export declare class UpgradeRequiredException extends HttpException {
  constructor(message?: string);
}
export declare class PreconditionRequiredException extends HttpException {
  constructor(message?: string);
}
export declare class TooManyRequestsException extends HttpException {
  constructor(message?: string);
}
export declare class RequestHeaderFieldsTooLargeException extends HttpException {
  constructor(message?: string);
}
export declare class UnavailableForLegalReasonsException extends HttpException {
  constructor(message?: string);
}
export declare class InternalServerErrorException extends HttpException {
  constructor(message?: string);
}
export declare class NotImplementedException extends HttpException {
  constructor(message?: string);
}
export declare class BadGatewayException extends HttpException {
  constructor(message?: string);
}
export declare class ServiceUnavailableException extends HttpException {
  constructor(message?: string);
}
export declare class GatewayTimeoutException extends HttpException {
  constructor(message?: string);
}
export declare class HttpVersionNotSupportedException extends HttpException {
  constructor(message?: string);
}
export declare class VariantAlsoNegotiatesException extends HttpException {
  constructor(message?: string);
}
export declare class InsufficientStorageException extends HttpException {
  constructor(message?: string);
}
export declare class LoopDetectedException extends HttpException {
  constructor(message?: string);
}
export declare class NotExtendedException extends HttpException {
  constructor(message?: string);
}
export declare class NetworkAuthenticationRequiredException extends HttpException {
  constructor(message?: string);
}
//# sourceMappingURL=http-exception.d.ts.map
