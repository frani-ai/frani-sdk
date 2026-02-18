"use strict";
var __decorate =
  (this && this.__decorate) ||
  function (decorators, target, key, desc) {
    var c = arguments.length,
      r =
        c < 3
          ? target
          : desc === null
            ? (desc = Object.getOwnPropertyDescriptor(target, key))
            : desc,
      d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
      r = Reflect.decorate(decorators, target, key, desc);
    else
      for (var i = decorators.length - 1; i >= 0; i--)
        if ((d = decorators[i]))
          r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return (c > 3 && r && Object.defineProperty(target, key, r), r);
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
const container_decorator_1 = require("../../core/di/container-decorator");
let Logger = class Logger {
  log(description, context) {
    this.meta("log", description, context);
  }
  warn(description, context) {
    this.meta("warn", description, context);
  }
  debug(description, context) {
    this.meta("debug", description, context);
  }
  error(description, context) {
    this.meta("error", description, context);
  }
  meta(level, message, context) {
    const loggerAttributes = {
      dateTime: new Date().toISOString(),
      level,
      context,
      message,
      environment: process.env.NODE_ENV,
    };
    console[level](loggerAttributes);
  }
};
exports.Logger = Logger;
exports.Logger = Logger = __decorate(
  [(0, container_decorator_1.Injectable)()],
  Logger,
);
//# sourceMappingURL=logger.service.js.map
