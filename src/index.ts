// Core exports
export * from "./core";

// Modules exports
export * from "./modules";

// Re-export commonly used items for convenience
export { HttpServer } from "./core/http/http-server";
export { Router } from "./core/http/http-router";
export {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  HttpStatus,
  Catch,
  Interceptor,
} from "./core/http/http-decorator";
export { Injectable, Module, Inject } from "./core/di/container-decorator";
export { Container, DependencyContainer } from "./core/di/container";
export { Logger } from "./modules/logger/logger.service";
export { ConfigModule, ConfigService } from "./modules/config";
export { HttpClientModule, HttpClientService } from "./modules/http-client";
export { validateDTO } from "./helpers";
export {
  AuthModule,
  AuthService,
  JwtStrategy,
  OAuthStrategy,
  OpenIDStrategy,
  JwtAuthGuard,
  RolesGuard,
} from "./modules/auth";
export { CacheModule, CacheConnectionService } from "./modules/cache";
export { ValidationException } from "./core/http";
export { MongooseModule, MongooseConnectionService } from "./modules/mongoose";
