# ⚙️ ConfigModule - Frani SDK

Módulo de configuração similar ao NestJS para gerenciar variáveis de ambiente e configurações da aplicação.

## 📋 Índice

- [Instalação](#instalação)
- [Uso Básico](#uso-básico)
- [ConfigModule.forRoot()](#configmoduleforroot)
- [ConfigService](#configservice)
- [Integração com AuthModule](#integração-com-authmodule)
- [Exemplos](#exemplos)

## 🚀 Instalação

O ConfigModule já está incluído no Frani SDK. Basta importar:

```typescript
import { ConfigModule, ConfigService } from "@frani/sdk";
```

## 📖 Uso Básico

### 1. Configurar o Módulo

```typescript
import { Module, ConfigModule } from "@frani/sdk";

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ".env",
      load: [
        () => ({
          app: {
            name: "My App",
            port: 3000,
          },
        }),
      ],
    }),
  ],
})
export class AppModule {}
```

### 2. Usar o ConfigService

```typescript
import { Injectable, ConfigService } from "@frani/sdk";

@Injectable()
export class DatabaseService {
  constructor(private readonly configService: ConfigService) {
    const host = this.configService.get("DB_HOST", "localhost");
    const port = this.configService.getNumber("DB_PORT", 5432);

    console.log(`Conectando a ${host}:${port}`);
  }
}
```

## 🔧 ConfigModule.forRoot()

### Opções

```typescript
interface IConfigModuleOptions {
  // Se true, torna o módulo global
  isGlobal?: boolean;

  // Caminho para o arquivo .env
  envFilePath?: string;

  // Ignorar erro se .env não existir
  ignoreEnvFile?: boolean;

  // Schema de validação (futuro)
  validationSchema?: any;

  // Funções para carregar configurações
  load?: Array<() => Record<string, any>>;
}
```

### Exemplo Completo

```typescript
ConfigModule.forRoot({
  envFilePath: ".env",
  load: [
    // Configuração da aplicação
    () => ({
      app: {
        name: "AI Reviewer",
        port: parseInt(process.env.PORT || "3000"),
        environment: process.env.NODE_ENV || "development",
      },
    }),

    // Configuração do banco de dados
    () => ({
      database: {
        host: process.env.DB_HOST || "localhost",
        port: parseInt(process.env.DB_PORT || "5432"),
        name: process.env.DB_NAME || "mydb",
        user: process.env.DB_USER || "postgres",
        password: process.env.DB_PASSWORD || "",
      },
    }),

    // Configuração de features
    () => ({
      features: {
        auth: process.env.FEATURE_AUTH === "true",
        cache: process.env.FEATURE_CACHE === "true",
      },
    }),
  ],
});
```

## 📚 ConfigService API

### Métodos Principais

#### `get<T>(key: string, defaultValue?: T): T`

Obtém um valor de configuração. Suporta notação de ponto.

```typescript
configService.get("database.host", "localhost");
configService.get("JWT_SECRET");
```

#### `set(key: string, value: any): void`

Define um valor de configuração.

```typescript
configService.set("custom.key", "value");
```

#### `has(key: string): boolean`

Verifica se uma chave existe.

```typescript
if (configService.has("JWT_SECRET")) {
  // ...
}
```

#### `getAll(): Record<string, any>`

Obtém todas as configurações.

```typescript
const allConfig = configService.getAll();
```

### Métodos Tipados

#### `getString(key: string, defaultValue?: string): string`

```typescript
const secret = configService.getString("JWT_SECRET", "default");
```

#### `getNumber(key: string, defaultValue?: number): number`

```typescript
const port = configService.getNumber("PORT", 3000);
```

#### `getBoolean(key: string, defaultValue?: boolean): boolean`

```typescript
const debugMode = configService.getBoolean("DEBUG_MODE", false);
```

#### `getArray(key: string, defaultValue?: any[]): any[]`

```typescript
// De string separada por vírgula: "a,b,c" -> ['a', 'b', 'c']
const origins = configService.getArray("ALLOWED_ORIGINS", ["*"]);
```

### `load(config: Record<string, any>): void`

Carrega múltiplas configurações de uma vez.

```typescript
configService.load({
  database: {
    host: "localhost",
    port: 5432,
  },
  cache: {
    ttl: 3600,
  },
});
```

## 🔐 Integração com AuthModule

### Opção 1: Configuração Estática

```typescript
@Module({
  imports: [
    AuthModule.forRoot({
      jwt: {
        secret: "my-secret",
        expiresIn: "2h",
        algorithm: "HS256",
      },
    }),
  ],
})
export class AppModule {}
```

### Opção 2: Usando ConfigService (Recomendado)

```typescript
@Module({
  imports: [
    // 1. Configurar ConfigModule primeiro
    ConfigModule.forRoot({
      envFilePath: ".env",
    }),

    // 2. AuthModule usa ConfigService automaticamente
    AuthModule.forRootAsync(),
  ],
})
export class AppModule {}
```

### Opção 3: Factory Customizada

```typescript
@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: ".env" }),

    AuthModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        jwt: {
          secret: configService.get("JWT_SECRET"),
          expiresIn: configService.get("JWT_EXPIRES_IN", "1h"),
          algorithm: "HS256",
          issuer: configService.get("JWT_ISSUER"),
        },
        oauth: {
          clientId: configService.get("OAUTH_CLIENT_ID"),
          clientSecret: configService.get("OAUTH_CLIENT_SECRET"),
          redirectUri: configService.get("OAUTH_REDIRECT_URI"),
          // ... outras configurações
        },
      }),
      inject: [ConfigService],
    }),
  ],
})
export class AppModule {}
```

## 💡 Exemplos Práticos

### Exemplo 1: Configuração de Banco de Dados

```typescript
// app.module.ts
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [
        () => ({
          database: {
            type: "postgres",
            host: process.env.DB_HOST || "localhost",
            port: parseInt(process.env.DB_PORT || "5432"),
            database: process.env.DB_NAME || "mydb",
            username: process.env.DB_USER || "postgres",
            password: process.env.DB_PASSWORD || "",
            synchronize: process.env.NODE_ENV === "development",
          },
        }),
      ],
    }),
  ],
})
export class AppModule {}

// database.service.ts
@Injectable()
export class DatabaseService {
  constructor(private readonly configService: ConfigService) {
    const dbConfig = {
      host: this.configService.get("database.host"),
      port: this.configService.get("database.port"),
      database: this.configService.get("database.database"),
      user: this.configService.get("database.username"),
      password: this.configService.get("database.password"),
    };

    // Conectar ao banco
  }
}
```

### Exemplo 2: Feature Flags

```typescript
// feature.service.ts
@Injectable()
export class FeatureService {
  constructor(private readonly configService: ConfigService) {}

  isAuthEnabled(): boolean {
    return this.configService.getBoolean("FEATURE_AUTH", true);
  }

  isCacheEnabled(): boolean {
    return this.configService.getBoolean("FEATURE_CACHE", false);
  }

  getMaxUploadSize(): number {
    return this.configService.getNumber("MAX_UPLOAD_SIZE", 5242880); // 5MB
  }

  getAllowedOrigins(): string[] {
    return this.configService.getArray("ALLOWED_ORIGINS", ["*"]);
  }
}
```

### Exemplo 3: Configuração por Ambiente

```typescript
// config/database.config.ts
export const databaseConfig = () => {
  const env = process.env.NODE_ENV || "development";

  const configs = {
    development: {
      host: "localhost",
      port: 5432,
      database: "mydb_dev",
    },
    production: {
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || "5432"),
      database: process.env.DB_NAME,
      ssl: true,
    },
    test: {
      host: "localhost",
      port: 5433,
      database: "mydb_test",
    },
  };

  return { database: configs[env as keyof typeof configs] };
};

// app.module.ts
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [databaseConfig],
    }),
  ],
})
export class AppModule {}
```

## 🔒 Variáveis de Ambiente

### Arquivo .env

```env
# Application
NODE_ENV=development
PORT=3000
APP_NAME=My Application

# JWT
JWT_SECRET=super-secret-key
JWT_EXPIRES_IN=1h
JWT_ALGORITHM=HS256

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=mydb
DB_USER=postgres
DB_PASSWORD=password

# Features
FEATURE_AUTH=true
FEATURE_CACHE=false
DEBUG_MODE=true

# Arrays (separados por vírgula)
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:4200
CORS_METHODS=GET,POST,PUT,DELETE
```

## 🎯 Casos de Uso

### 1. Configuração Simples

```typescript
@Module({
  imports: [ConfigModule.forRoot()],
})
export class AppModule {}

// Usa .env automaticamente
```

### 2. Múltiplos Arquivos .env

```typescript
const envFile =
  process.env.NODE_ENV === "production"
    ? ".env.production"
    : ".env.development";

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: envFile,
    }),
  ],
})
export class AppModule {}
```

### 3. Configuração Híbrida (env + código)

```typescript
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ".env",
      load: [
        () => ({
          // Configurações do código sobrescrevem .env
          app: {
            name: "My App",
            version: "1.0.0",
          },
        }),
      ],
    }),
  ],
})
export class AppModule {}
```

## 🔍 Notação de Ponto

O ConfigService suporta notação de ponto para acessar valores aninhados:

```typescript
// Configuração carregada
{
  database: {
    host: 'localhost',
    port: 5432,
    credentials: {
      user: 'postgres',
      password: 'secret'
    }
  }
}

// Acesso
configService.get('database.host'); // 'localhost'
configService.get('database.port'); // 5432
configService.get('database.credentials.user'); // 'postgres'
```

## 🛡️ Boas Práticas

1. **Sempre use valores padrão**

   ```typescript
   configService.get("KEY", "default-value");
   ```

2. **Use métodos tipados**

   ```typescript
   configService.getNumber("PORT", 3000);
   configService.getBoolean("DEBUG", false);
   ```

3. **Não commite .env**

   ```gitignore
   .env
   .env.local
   .env.*.local
   ```

4. **Crie .env.example**

   ```env
   JWT_SECRET=your-secret-here
   DB_HOST=localhost
   ```

5. **Valide configurações críticas**
   ```typescript
   if (!configService.has("JWT_SECRET")) {
     throw new Error("JWT_SECRET não configurado!");
   }
   ```

## 📝 Licença

ISC

## 👤 Autor

Diogo Franco <diogo.franco85@gmail.com>
