# Frani SDK

SDK para desenvolvimento de aplicações Node.js com TypeScript, incluindo sistema de injeção de dependências, servidor HTTP e logging.

## 🚀 Recursos

- ✅ **Injeção de Dependências**: Sistema completo de DI com decorators
- ✅ **Servidor HTTP**: Servidor HTTP nativo com suporte a rotas e controllers
- ✅ **Decorators**: @Controller, @Get, @Post, @Put, @Delete, @Injectable, @Module
- ✅ **Exceções HTTP**: Exceções tipadas para todos os status codes HTTP
- ✅ **Interceptors**: Suporte a interceptors globais e por rota
- ✅ **Exception Filters**: Tratamento customizado de exceções
- ✅ **Logger**: Sistema de logging estruturado
- ✅ **ConfigModule**: Gerenciamento de configurações e variáveis de ambiente (similar ao NestJS)
- ✅ **Módulos Dinâmicos**: Suporte a forRoot() e forRootAsync() (similar ao NestJS)
- ✅ **Autenticação**: JWT, OAuth 2.0 e OpenID Connect
- ✅ **Guards**: Proteção de rotas com autenticação e autorização
- ✅ **Testes Unitários**: Cobertura completa com Jest

## 📦 Instalação

```bash
npm install
```

## 🛠️ Scripts Disponíveis

### Desenvolvimento

```bash
# Iniciar em modo desenvolvimento
npm run start:dev

# Iniciar em modo debug
npm run start:debug

# Build do projeto
npm run build

# Iniciar em produção
npm run start:prod
```

### Testes

```bash
# Executar todos os testes
npm test

# Executar testes em modo watch
npm run test:watch

# Executar testes com cobertura
npm run test:coverage

# Executar testes em modo verbose
npm run test:verbose
```

### Qualidade de Código

```bash
# Verificar tipos TypeScript
npm run type-check
```

## 📝 Exemplo de Uso

### Criar um Controller

```typescript
import { Controller, Get, Post } from "@core/http";
import { Injectable } from "@core/di/container-decorator";

@Controller("users")
export class UserController {
  @Get("/")
  listUsers() {
    return { users: [] };
  }

  @Get("/:id")
  getUser() {
    return { id: 1, name: "John" };
  }

  @Post("/")
  @HttpStatus(HttpStatusCode.CREATED)
  createUser() {
    return { id: 1, name: "John" };
  }
}
```

### Criar um Service

```typescript
import { Injectable } from "@core/di/container-decorator";
import { Logger } from "@modules/logger/logger.service";

@Injectable()
export class UserService {
  constructor(private readonly logger: Logger) {}

  findAll() {
    this.logger.log("Finding all users");
    return [];
  }
}
```

### Criar um Module

```typescript
import { Module } from "@core/di/container-decorator";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";

@Module({
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
```

### Configurar Módulos Dinâmicos

```typescript
import { Module, ConfigModule, AuthModule } from "@frani/sdk";

@Module({
  imports: [
    // ConfigModule - gerencia variáveis de ambiente
    ConfigModule.forRoot({
      envFilePath: ".env",
      load: [
        () => ({
          app: { name: "My App", port: 3000 },
        }),
      ],
    }),

    // AuthModule - configuração automática via ConfigService
    AuthModule.forRootAsync(),
  ],
})
export class AppModule {}
```

### Usar ConfigService

```typescript
import { Injectable, ConfigService } from "@frani/sdk";

@Injectable()
export class DatabaseService {
  constructor(private readonly configService: ConfigService) {
    const host = this.configService.get("DB_HOST", "localhost");
    const port = this.configService.getNumber("DB_PORT", 5432);
    const debug = this.configService.getBoolean("DEBUG_MODE", false);
  }
}
```

### Inicializar a Aplicação

```typescript
import { HttpServer } from "@frani/sdk";
import { AppModule } from "./app.module";

async function main() {
  const app = new HttpServer(3000);
  app.registerModule(AppModule);
  app.listen();
}

main();
```

## 🧪 Testes

O projeto possui uma suíte completa de testes unitários com **97 testes** cobrindo:

- ✅ Sistema de Injeção de Dependências
- ✅ Decorators (DI e HTTP)
- ✅ Exceções HTTP
- ✅ Sistema de Metadata
- ✅ Logger Service
- ✅ Controllers

### Cobertura de Testes

```
Test Suites: 7 passed, 7 total
Tests:       97 passed, 97 total
```

Para mais detalhes sobre os testes, consulte [tests/README.md](./tests/README.md).

## 📂 Estrutura do Projeto

```
frani-sdk/
├── src/
│   ├── core/
│   │   ├── di/              # Sistema de injeção de dependências
│   │   ├── http/            # Servidor HTTP e decorators
│   │   └── metadata.ts      # Sistema de metadata
│   └── modules/
│       ├── app.module.ts    # Módulo principal
│       ├── health/          # Health check
│       └── logger/          # Sistema de logging
├── tests/                   # Testes unitários
├── examples/                # Exemplos de uso
└── dist/                    # Build output
```

## 🔧 Configuração

### TypeScript

O projeto usa TypeScript com configurações rigorosas. Veja `tsconfig.json` para detalhes.

### Path Aliases

```typescript
@core/*   -> src/core/*
@modules/* -> src/modules/*
```

## 🎯 Recursos Avançados

### Interceptors

```typescript
export class AuthInterceptor implements IInterceptor {
  async intercept(context: HttpContext): Promise<boolean> {
    // Lógica de autenticação
    return true;
  }
}

// Aplicar globalmente
app.setGlobalInterceptor(AuthInterceptor);

// Ou por rota
@Get('/protected')
@Interceptor(AuthInterceptor)
protectedRoute() {}
```

### Exception Filters

```typescript
@Catch()
export class GlobalExceptionFilter implements IExceptionFilter {
  async catch(exception: HttpException, context: HttpContext) {
    // Tratamento customizado de exceções
  }
}

app.setGlobalExceptionFilter(GlobalExceptionFilter);
```

## 📚 Documentação Adicional

- [ConfigModule - Gerenciamento de Configurações](./docs/CONFIG.md)
- [AuthModule - Sistema de Autenticação](./docs/AUTH.md)
- [Testes - Guia de Testes](./TESTING.md)
- [Changelog - Histórico de Mudanças](./CHANGELOG.md)

## 📄 Licença

ISC

## 👤 Autor

Diogo Franco <diogo.franco85@gmail.com>

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

### Convenções de Commit

- Os testes são executados automaticamente no pre-commit hook
- O código é formatado automaticamente com Prettier
- Mantenha a cobertura de testes acima de 80%
