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
  exports.Interceptor =
  exports.Catch =
  exports.Delete =
  exports.Put =
  exports.Post =
  exports.Get =
  exports.Controller =
  exports.HttpServer =
    void 0;
// HTTP Server
var http_server_1 = require("./http-server");
Object.defineProperty(exports, "HttpServer", {
  enumerable: true,
  get: function () {
    return http_server_1.HttpServer;
  },
});
// Decorators
var http_decorator_1 = require("./http-decorator");
Object.defineProperty(exports, "Controller", {
  enumerable: true,
  get: function () {
    return http_decorator_1.Controller;
  },
});
Object.defineProperty(exports, "Get", {
  enumerable: true,
  get: function () {
    return http_decorator_1.Get;
  },
});
Object.defineProperty(exports, "Post", {
  enumerable: true,
  get: function () {
    return http_decorator_1.Post;
  },
});
Object.defineProperty(exports, "Put", {
  enumerable: true,
  get: function () {
    return http_decorator_1.Put;
  },
});
Object.defineProperty(exports, "Delete", {
  enumerable: true,
  get: function () {
    return http_decorator_1.Delete;
  },
});
Object.defineProperty(exports, "Catch", {
  enumerable: true,
  get: function () {
    return http_decorator_1.Catch;
  },
});
Object.defineProperty(exports, "Interceptor", {
  enumerable: true,
  get: function () {
    return http_decorator_1.Interceptor;
  },
});
// Exceptions
var http_exception_1 = require("./exceptions/http-exception");
Object.defineProperty(exports, "HttpException", {
  enumerable: true,
  get: function () {
    return http_exception_1.HttpException;
  },
});
// 4xx Client Errors
Object.defineProperty(exports, "BadRequestException", {
  enumerable: true,
  get: function () {
    return http_exception_1.BadRequestException;
  },
});
Object.defineProperty(exports, "UnauthorizedException", {
  enumerable: true,
  get: function () {
    return http_exception_1.UnauthorizedException;
  },
});
Object.defineProperty(exports, "PaymentRequiredException", {
  enumerable: true,
  get: function () {
    return http_exception_1.PaymentRequiredException;
  },
});
Object.defineProperty(exports, "ForbiddenException", {
  enumerable: true,
  get: function () {
    return http_exception_1.ForbiddenException;
  },
});
Object.defineProperty(exports, "NotFoundException", {
  enumerable: true,
  get: function () {
    return http_exception_1.NotFoundException;
  },
});
Object.defineProperty(exports, "MethodNotAllowedException", {
  enumerable: true,
  get: function () {
    return http_exception_1.MethodNotAllowedException;
  },
});
Object.defineProperty(exports, "NotAcceptableException", {
  enumerable: true,
  get: function () {
    return http_exception_1.NotAcceptableException;
  },
});
Object.defineProperty(exports, "ProxyAuthenticationRequiredException", {
  enumerable: true,
  get: function () {
    return http_exception_1.ProxyAuthenticationRequiredException;
  },
});
Object.defineProperty(exports, "RequestTimeoutException", {
  enumerable: true,
  get: function () {
    return http_exception_1.RequestTimeoutException;
  },
});
Object.defineProperty(exports, "ConflictException", {
  enumerable: true,
  get: function () {
    return http_exception_1.ConflictException;
  },
});
Object.defineProperty(exports, "GoneException", {
  enumerable: true,
  get: function () {
    return http_exception_1.GoneException;
  },
});
Object.defineProperty(exports, "LengthRequiredException", {
  enumerable: true,
  get: function () {
    return http_exception_1.LengthRequiredException;
  },
});
Object.defineProperty(exports, "PreconditionFailedException", {
  enumerable: true,
  get: function () {
    return http_exception_1.PreconditionFailedException;
  },
});
Object.defineProperty(exports, "PayloadTooLargeException", {
  enumerable: true,
  get: function () {
    return http_exception_1.PayloadTooLargeException;
  },
});
Object.defineProperty(exports, "UriTooLongException", {
  enumerable: true,
  get: function () {
    return http_exception_1.UriTooLongException;
  },
});
Object.defineProperty(exports, "UnsupportedMediaTypeException", {
  enumerable: true,
  get: function () {
    return http_exception_1.UnsupportedMediaTypeException;
  },
});
Object.defineProperty(exports, "RangeNotSatisfiableException", {
  enumerable: true,
  get: function () {
    return http_exception_1.RangeNotSatisfiableException;
  },
});
Object.defineProperty(exports, "ExpectationFailedException", {
  enumerable: true,
  get: function () {
    return http_exception_1.ExpectationFailedException;
  },
});
Object.defineProperty(exports, "ImATeapotException", {
  enumerable: true,
  get: function () {
    return http_exception_1.ImATeapotException;
  },
});
Object.defineProperty(exports, "MisdirectedRequestException", {
  enumerable: true,
  get: function () {
    return http_exception_1.MisdirectedRequestException;
  },
});
Object.defineProperty(exports, "UnprocessableEntityException", {
  enumerable: true,
  get: function () {
    return http_exception_1.UnprocessableEntityException;
  },
});
Object.defineProperty(exports, "LockedException", {
  enumerable: true,
  get: function () {
    return http_exception_1.LockedException;
  },
});
Object.defineProperty(exports, "FailedDependencyException", {
  enumerable: true,
  get: function () {
    return http_exception_1.FailedDependencyException;
  },
});
Object.defineProperty(exports, "TooEarlyException", {
  enumerable: true,
  get: function () {
    return http_exception_1.TooEarlyException;
  },
});
Object.defineProperty(exports, "UpgradeRequiredException", {
  enumerable: true,
  get: function () {
    return http_exception_1.UpgradeRequiredException;
  },
});
Object.defineProperty(exports, "PreconditionRequiredException", {
  enumerable: true,
  get: function () {
    return http_exception_1.PreconditionRequiredException;
  },
});
Object.defineProperty(exports, "TooManyRequestsException", {
  enumerable: true,
  get: function () {
    return http_exception_1.TooManyRequestsException;
  },
});
Object.defineProperty(exports, "RequestHeaderFieldsTooLargeException", {
  enumerable: true,
  get: function () {
    return http_exception_1.RequestHeaderFieldsTooLargeException;
  },
});
Object.defineProperty(exports, "UnavailableForLegalReasonsException", {
  enumerable: true,
  get: function () {
    return http_exception_1.UnavailableForLegalReasonsException;
  },
});
// 5xx Server Errors
Object.defineProperty(exports, "InternalServerErrorException", {
  enumerable: true,
  get: function () {
    return http_exception_1.InternalServerErrorException;
  },
});
Object.defineProperty(exports, "NotImplementedException", {
  enumerable: true,
  get: function () {
    return http_exception_1.NotImplementedException;
  },
});
Object.defineProperty(exports, "BadGatewayException", {
  enumerable: true,
  get: function () {
    return http_exception_1.BadGatewayException;
  },
});
Object.defineProperty(exports, "ServiceUnavailableException", {
  enumerable: true,
  get: function () {
    return http_exception_1.ServiceUnavailableException;
  },
});
Object.defineProperty(exports, "GatewayTimeoutException", {
  enumerable: true,
  get: function () {
    return http_exception_1.GatewayTimeoutException;
  },
});
Object.defineProperty(exports, "HttpVersionNotSupportedException", {
  enumerable: true,
  get: function () {
    return http_exception_1.HttpVersionNotSupportedException;
  },
});
Object.defineProperty(exports, "VariantAlsoNegotiatesException", {
  enumerable: true,
  get: function () {
    return http_exception_1.VariantAlsoNegotiatesException;
  },
});
Object.defineProperty(exports, "InsufficientStorageException", {
  enumerable: true,
  get: function () {
    return http_exception_1.InsufficientStorageException;
  },
});
Object.defineProperty(exports, "LoopDetectedException", {
  enumerable: true,
  get: function () {
    return http_exception_1.LoopDetectedException;
  },
});
Object.defineProperty(exports, "NotExtendedException", {
  enumerable: true,
  get: function () {
    return http_exception_1.NotExtendedException;
  },
});
Object.defineProperty(exports, "NetworkAuthenticationRequiredException", {
  enumerable: true,
  get: function () {
    return http_exception_1.NetworkAuthenticationRequiredException;
  },
});
//# sourceMappingURL=index.js.map
