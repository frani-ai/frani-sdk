"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NetworkAuthenticationRequiredException =
  exports.NotExtendedException =
  exports.LoopDetectedException =
  exports.InsufficientStorageException =
  exports.VariantAlsoNegotiatesException =
  exports.HttpVersionNotSupportedException =
  exports.GatewayTimeoutException =
  exports.ServiceUnavailableException =
  exports.BadGatewayException =
  exports.NotImplementedException =
  exports.InternalServerErrorException =
  exports.UnavailableForLegalReasonsException =
  exports.RequestHeaderFieldsTooLargeException =
  exports.TooManyRequestsException =
  exports.PreconditionRequiredException =
  exports.UpgradeRequiredException =
  exports.TooEarlyException =
  exports.FailedDependencyException =
  exports.LockedException =
  exports.ValidationException =
  exports.UnprocessableEntityException =
  exports.MisdirectedRequestException =
  exports.ImATeapotException =
  exports.ExpectationFailedException =
  exports.RangeNotSatisfiableException =
  exports.UnsupportedMediaTypeException =
  exports.UriTooLongException =
  exports.PayloadTooLargeException =
  exports.PreconditionFailedException =
  exports.LengthRequiredException =
  exports.GoneException =
  exports.ConflictException =
  exports.RequestTimeoutException =
  exports.ProxyAuthenticationRequiredException =
  exports.NotAcceptableException =
  exports.MethodNotAllowedException =
  exports.NotFoundException =
  exports.ForbiddenException =
  exports.PaymentRequiredException =
  exports.UnauthorizedException =
  exports.BadRequestException =
  exports.HttpException =
    void 0;
class HttpException extends Error {
  constructor(message, statusCode, error) {
    super(message);
    this.message = message;
    this.statusCode = statusCode;
    this.error = error;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
  toJSON() {
    return {
      statusCode: this.statusCode,
      error: this.error || this.name,
      message: this.message,
      dateTime: new Date().toISOString(),
    };
  }
}
exports.HttpException = HttpException;
// 4xx Client Errors
class BadRequestException extends HttpException {
  constructor(message = "Bad Request") {
    super(message, 400, "Bad Request");
  }
}
exports.BadRequestException = BadRequestException;
class UnauthorizedException extends HttpException {
  constructor(message = "Unauthorized") {
    super(message, 401, "Unauthorized");
  }
}
exports.UnauthorizedException = UnauthorizedException;
class PaymentRequiredException extends HttpException {
  constructor(message = "Payment Required") {
    super(message, 402, "Payment Required");
  }
}
exports.PaymentRequiredException = PaymentRequiredException;
class ForbiddenException extends HttpException {
  constructor(message = "Forbidden") {
    super(message, 403, "Forbidden");
  }
}
exports.ForbiddenException = ForbiddenException;
class NotFoundException extends HttpException {
  constructor(message = "Not Found") {
    super(message, 404, "Not Found");
  }
}
exports.NotFoundException = NotFoundException;
class MethodNotAllowedException extends HttpException {
  constructor(message = "Method Not Allowed") {
    super(message, 405, "Method Not Allowed");
  }
}
exports.MethodNotAllowedException = MethodNotAllowedException;
class NotAcceptableException extends HttpException {
  constructor(message = "Not Acceptable") {
    super(message, 406, "Not Acceptable");
  }
}
exports.NotAcceptableException = NotAcceptableException;
class ProxyAuthenticationRequiredException extends HttpException {
  constructor(message = "Proxy Authentication Required") {
    super(message, 407, "Proxy Authentication Required");
  }
}
exports.ProxyAuthenticationRequiredException =
  ProxyAuthenticationRequiredException;
class RequestTimeoutException extends HttpException {
  constructor(message = "Request Timeout") {
    super(message, 408, "Request Timeout");
  }
}
exports.RequestTimeoutException = RequestTimeoutException;
class ConflictException extends HttpException {
  constructor(message = "Conflict") {
    super(message, 409, "Conflict");
  }
}
exports.ConflictException = ConflictException;
class GoneException extends HttpException {
  constructor(message = "Gone") {
    super(message, 410, "Gone");
  }
}
exports.GoneException = GoneException;
class LengthRequiredException extends HttpException {
  constructor(message = "Length Required") {
    super(message, 411, "Length Required");
  }
}
exports.LengthRequiredException = LengthRequiredException;
class PreconditionFailedException extends HttpException {
  constructor(message = "Precondition Failed") {
    super(message, 412, "Precondition Failed");
  }
}
exports.PreconditionFailedException = PreconditionFailedException;
class PayloadTooLargeException extends HttpException {
  constructor(message = "Payload Too Large") {
    super(message, 413, "Payload Too Large");
  }
}
exports.PayloadTooLargeException = PayloadTooLargeException;
class UriTooLongException extends HttpException {
  constructor(message = "URI Too Long") {
    super(message, 414, "URI Too Long");
  }
}
exports.UriTooLongException = UriTooLongException;
class UnsupportedMediaTypeException extends HttpException {
  constructor(message = "Unsupported Media Type") {
    super(message, 415, "Unsupported Media Type");
  }
}
exports.UnsupportedMediaTypeException = UnsupportedMediaTypeException;
class RangeNotSatisfiableException extends HttpException {
  constructor(message = "Range Not Satisfiable") {
    super(message, 416, "Range Not Satisfiable");
  }
}
exports.RangeNotSatisfiableException = RangeNotSatisfiableException;
class ExpectationFailedException extends HttpException {
  constructor(message = "Expectation Failed") {
    super(message, 417, "Expectation Failed");
  }
}
exports.ExpectationFailedException = ExpectationFailedException;
class ImATeapotException extends HttpException {
  constructor(message = "I'm a teapot") {
    super(message, 418, "I'm a teapot");
  }
}
exports.ImATeapotException = ImATeapotException;
class MisdirectedRequestException extends HttpException {
  constructor(message = "Misdirected Request") {
    super(message, 421, "Misdirected Request");
  }
}
exports.MisdirectedRequestException = MisdirectedRequestException;
class UnprocessableEntityException extends HttpException {
  constructor(message = "Unprocessable Entity") {
    super(message, 422, "Unprocessable Entity");
  }
}
exports.UnprocessableEntityException = UnprocessableEntityException;
/** Exceção 422 com detalhes de validação (ex.: erros Zod) para uso em validateDTO */
class ValidationException extends UnprocessableEntityException {
  constructor(message = "Validation failed", errors) {
    super(message);
    this.errors = errors;
  }
  toJSON() {
    const base = super.toJSON();
    if (this.errors?.length) return { ...base, errors: this.errors };
    return base;
  }
}
exports.ValidationException = ValidationException;
class LockedException extends HttpException {
  constructor(message = "Locked") {
    super(message, 423, "Locked");
  }
}
exports.LockedException = LockedException;
class FailedDependencyException extends HttpException {
  constructor(message = "Failed Dependency") {
    super(message, 424, "Failed Dependency");
  }
}
exports.FailedDependencyException = FailedDependencyException;
class TooEarlyException extends HttpException {
  constructor(message = "Too Early") {
    super(message, 425, "Too Early");
  }
}
exports.TooEarlyException = TooEarlyException;
class UpgradeRequiredException extends HttpException {
  constructor(message = "Upgrade Required") {
    super(message, 426, "Upgrade Required");
  }
}
exports.UpgradeRequiredException = UpgradeRequiredException;
class PreconditionRequiredException extends HttpException {
  constructor(message = "Precondition Required") {
    super(message, 428, "Precondition Required");
  }
}
exports.PreconditionRequiredException = PreconditionRequiredException;
class TooManyRequestsException extends HttpException {
  constructor(message = "Too Many Requests") {
    super(message, 429, "Too Many Requests");
  }
}
exports.TooManyRequestsException = TooManyRequestsException;
class RequestHeaderFieldsTooLargeException extends HttpException {
  constructor(message = "Request Header Fields Too Large") {
    super(message, 431, "Request Header Fields Too Large");
  }
}
exports.RequestHeaderFieldsTooLargeException =
  RequestHeaderFieldsTooLargeException;
class UnavailableForLegalReasonsException extends HttpException {
  constructor(message = "Unavailable For Legal Reasons") {
    super(message, 451, "Unavailable For Legal Reasons");
  }
}
exports.UnavailableForLegalReasonsException =
  UnavailableForLegalReasonsException;
// 5xx Server Errors
class InternalServerErrorException extends HttpException {
  constructor(message = "Internal Server Error") {
    super(message, 500, "Internal Server Error");
  }
}
exports.InternalServerErrorException = InternalServerErrorException;
class NotImplementedException extends HttpException {
  constructor(message = "Not Implemented") {
    super(message, 501, "Not Implemented");
  }
}
exports.NotImplementedException = NotImplementedException;
class BadGatewayException extends HttpException {
  constructor(message = "Bad Gateway") {
    super(message, 502, "Bad Gateway");
  }
}
exports.BadGatewayException = BadGatewayException;
class ServiceUnavailableException extends HttpException {
  constructor(message = "Service Unavailable") {
    super(message, 503, "Service Unavailable");
  }
}
exports.ServiceUnavailableException = ServiceUnavailableException;
class GatewayTimeoutException extends HttpException {
  constructor(message = "Gateway Timeout") {
    super(message, 504, "Gateway Timeout");
  }
}
exports.GatewayTimeoutException = GatewayTimeoutException;
class HttpVersionNotSupportedException extends HttpException {
  constructor(message = "HTTP Version Not Supported") {
    super(message, 505, "HTTP Version Not Supported");
  }
}
exports.HttpVersionNotSupportedException = HttpVersionNotSupportedException;
class VariantAlsoNegotiatesException extends HttpException {
  constructor(message = "Variant Also Negotiates") {
    super(message, 506, "Variant Also Negotiates");
  }
}
exports.VariantAlsoNegotiatesException = VariantAlsoNegotiatesException;
class InsufficientStorageException extends HttpException {
  constructor(message = "Insufficient Storage") {
    super(message, 507, "Insufficient Storage");
  }
}
exports.InsufficientStorageException = InsufficientStorageException;
class LoopDetectedException extends HttpException {
  constructor(message = "Loop Detected") {
    super(message, 508, "Loop Detected");
  }
}
exports.LoopDetectedException = LoopDetectedException;
class NotExtendedException extends HttpException {
  constructor(message = "Not Extended") {
    super(message, 510, "Not Extended");
  }
}
exports.NotExtendedException = NotExtendedException;
class NetworkAuthenticationRequiredException extends HttpException {
  constructor(message = "Network Authentication Required") {
    super(message, 511, "Network Authentication Required");
  }
}
exports.NetworkAuthenticationRequiredException =
  NetworkAuthenticationRequiredException;
//# sourceMappingURL=http-exception.js.map
