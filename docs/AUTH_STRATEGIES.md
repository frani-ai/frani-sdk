# 🔐 Selecionando Estratégias de Autenticação

Este guia mostra como escolher quais estratégias de autenticação carregar no seu projeto.

## 📋 Estratégias Disponíveis

- **jwt** - JSON Web Tokens (recomendado para APIs)
- **oauth** - OAuth 2.0 (Google, Facebook, GitHub, etc.)
- **openid** - OpenID Connect (Auth0, Okta, etc.)

## 🎯 Configuração

### Opção 1: Via Variável de Ambiente (Recomendado)

Defina a variável `AUTH_STRATEGIES` no arquivo `.env`:

```env
# Apenas JWT (padrão)
AUTH_STRATEGIES=jwt

# JWT + OAuth
AUTH_STRATEGIES=jwt,oauth

# Todas as estratégias
AUTH_STRATEGIES=jwt,oauth,openid
```

Depois, use `AuthModule.forRootAsync()`:

```typescript
import { Module, ConfigModule, AuthModule } from "@frani/sdk";

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: ".env" }),
    AuthModule.forRootAsync(), // Lê AUTH_STRATEGIES do .env
  ],
})
export class AppModule {}
```

### Opção 2: Via Código (Configuração Estática)

```typescript
import { Module, AuthModule } from "@frani/sdk";

@Module({
  imports: [
    AuthModule.forRoot({
      strategies: ["jwt"], // Apenas JWT
      jwt: {
        secret: "my-secret",
        expiresIn: "1h",
      },
    }),
  ],
})
export class AppModule {}
```

### Opção 3: Via Factory Customizada

```typescript
import { Module, ConfigModule, AuthModule } from "@frani/sdk";

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: ".env" }),

    AuthModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        const env = configService.get("NODE_ENV");

        // Estratégias diferentes por ambiente
        const strategies = env === "production" ? ["jwt", "oauth"] : ["jwt"];

        return {
          strategies,
          jwt: {
            secret: configService.get("JWT_SECRET"),
            expiresIn: "1h",
          },
          oauth: {
            clientId: configService.get("OAUTH_CLIENT_ID"),
            clientSecret: configService.get("OAUTH_CLIENT_SECRET"),
            // ... outras configurações
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
})
export class AppModule {}
```

## 💡 Exemplos Práticos

### Exemplo 1: Apenas JWT (API Simples)

```env
# .env
AUTH_STRATEGIES=jwt
JWT_SECRET=my-super-secret
JWT_EXPIRES_IN=1h
```

```typescript
// app.module.ts
@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: ".env" }),
    AuthModule.forRootAsync(),
  ],
})
export class AppModule {}
```

**Resultado**: Apenas JWT será carregado. OAuth e OpenID não estarão disponíveis.

### Exemplo 2: JWT + OAuth (Login Social)

```env
# .env
AUTH_STRATEGIES=jwt,oauth

# JWT
JWT_SECRET=my-super-secret
JWT_EXPIRES_IN=1h

# OAuth (Google)
OAUTH_CLIENT_ID=google-client-id
OAUTH_CLIENT_SECRET=google-client-secret
OAUTH_REDIRECT_URI=http://localhost:3000/auth/oauth/callback
OAUTH_AUTHORIZATION_URL=https://accounts.google.com/o/oauth2/v2/auth
OAUTH_TOKEN_URL=https://oauth2.googleapis.com/token
OAUTH_USER_INFO_URL=https://www.googleapis.com/oauth2/v2/userinfo
OAUTH_SCOPE=openid,profile,email
```

```typescript
// app.module.ts
@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: ".env" }),
    AuthModule.forRootAsync(),
  ],
})
export class AppModule {}
```

**Resultado**: JWT e OAuth estarão disponíveis. OpenID não será carregado.

### Exemplo 3: Todas as Estratégias

```env
# .env
AUTH_STRATEGIES=jwt,oauth,openid

# JWT
JWT_SECRET=my-super-secret

# OAuth
OAUTH_CLIENT_ID=...
OAUTH_CLIENT_SECRET=...

# OpenID (Auth0)
OPENID_CLIENT_ID=...
OPENID_CLIENT_SECRET=...
OPENID_DISCOVERY_URL=https://your-domain.auth0.com/.well-known/openid-configuration
```

```typescript
// app.module.ts
@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: ".env" }),
    AuthModule.forRootAsync(),
  ],
})
export class AppModule {}
```

**Resultado**: Todas as 3 estratégias estarão disponíveis.

## 🔍 Verificando Estratégias Carregadas

Ao iniciar o servidor, você verá logs indicando quais estratégias foram registradas:

```
Estratégia de autenticação registrada: jwt
```

Se você configurou múltiplas estratégias:

```
Estratégia de autenticação registrada: jwt
Estratégia de autenticação registrada: oauth
Estratégia de autenticação registrada: openid
```

## ⚙️ Estratégias por Ambiente

Você pode carregar estratégias diferentes dependendo do ambiente:

```typescript
// config/auth.config.ts
export const authConfig = () => {
  const env = process.env.NODE_ENV || "development";

  const configs = {
    development: {
      strategies: ["jwt"], // Apenas JWT em dev
      jwt: { secret: "dev-secret", expiresIn: "24h" },
    },
    production: {
      strategies: ["jwt", "oauth", "openid"], // Todas em prod
      jwt: {
        secret: process.env.JWT_SECRET,
        expiresIn: "1h",
      },
      oauth: {
        clientId: process.env.OAUTH_CLIENT_ID,
        // ...
      },
      openid: {
        clientId: process.env.OPENID_CLIENT_ID,
        // ...
      },
    },
  };

  return configs[env as keyof typeof configs];
};

// app.module.ts
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [authConfig],
    }),

    AuthModule.forRootAsync({
      useFactory: (config: ConfigService) => config.get("auth"),
      inject: [ConfigService],
    }),
  ],
})
export class AppModule {}
```

## 🎯 Casos de Uso

### API Interna (Apenas JWT)

```env
AUTH_STRATEGIES=jwt
```

- Mais rápido (menos overhead)
- Ideal para microserviços
- Comunicação entre serviços

### Aplicação Web com Login Social (JWT + OAuth)

```env
AUTH_STRATEGIES=jwt,oauth
```

- Login tradicional (JWT)
- Login com Google/Facebook/GitHub (OAuth)
- Melhor UX para usuários

### Aplicação Enterprise (Todas)

```env
AUTH_STRATEGIES=jwt,oauth,openid
```

- Login tradicional (JWT)
- Login social (OAuth)
- SSO corporativo (OpenID)
- Máxima flexibilidade

## ⚡ Performance

Carregar apenas as estratégias necessárias melhora:

- **Tempo de inicialização**: Menos estratégias = startup mais rápido
- **Memória**: Menos instâncias carregadas
- **Segurança**: Menos superfície de ataque

## 🛡️ Boas Práticas

1. **Carregue apenas o necessário**

   ```env
   # ❌ Ruim - carrega tudo sem necessidade
   AUTH_STRATEGIES=jwt,oauth,openid

   # ✅ Bom - apenas o que você usa
   AUTH_STRATEGIES=jwt
   ```

2. **Use variáveis de ambiente**

   ```typescript
   // ❌ Ruim - hardcoded
   AuthModule.forRoot({ strategies: ["jwt", "oauth"] });

   // ✅ Bom - configurável
   AuthModule.forRootAsync();
   ```

3. **Valide configurações**
   ```typescript
   if (!configService.has("JWT_SECRET")) {
     throw new Error("JWT_SECRET é obrigatório!");
   }
   ```

## 📚 Documentação Relacionada

- [AuthModule - Documentação Completa](./AUTH.md)
- [ConfigModule - Gerenciamento de Configurações](./CONFIG.md)
- [Guia Rápido](../QUICK_START_TESTS.md)

## 🐛 Troubleshooting

### Erro: "Estratégia 'oauth' não encontrada"

Você tentou usar OAuth mas não configurou:

```env
# Adicione oauth às estratégias
AUTH_STRATEGIES=jwt,oauth
```

### Todas as estratégias estão carregando

Verifique se o `.env` está sendo lido:

```typescript
// Adicione no início do index.ts
import "dotenv/config";
```

### Estratégia não está disponível

Verifique os logs de inicialização para ver quais foram registradas:

```
Estratégia de autenticação registrada: jwt
```

Se não aparecer, a estratégia não foi configurada corretamente.

## 👤 Autor

Diogo Franco <diogo.franco85@gmail.com>
