# 🧪 Testes do Módulo de Autenticação

Testes completos para o módulo de autenticação do Frani SDK.

## 📊 Estatísticas

- **Total de testes**: 108
- **Taxa de sucesso**: 100% ✅
- **Suítes de teste**: 5
- **Tempo de execução**: ~2 segundos

## 📁 Estrutura

```
tests/modules/auth/
├── dto/
│   └── login.dto.spec.ts              # 36 testes - DTOs de autenticação
├── guards/
│   ├── jwt-auth.guard.spec.ts         # 17 testes - Guard JWT
│   └── roles.guard.spec.ts            # 21 testes - Guard de roles
├── strategies/
│   └── jwt.strategy.spec.ts           # 25 testes - Estratégia JWT
└── auth.service.spec.ts               # 19 testes - Serviço de autenticação
```

## 🎯 Cobertura de Testes

### 1. DTOs (36 testes)

#### LoginDto (14 testes)

- ✅ Constructor com email e password
- ✅ Constructor com username e password
- ✅ Validação de dados válidos
- ✅ Erro quando email/username não fornecidos
- ✅ Erro quando password não fornecido
- ✅ Erro quando password muito curto
- ✅ Múltiplos erros de validação

#### RegisterDto (16 testes)

- ✅ Constructor com todos os campos
- ✅ Constructor sem campos opcionais
- ✅ Validação de dados válidos
- ✅ Erro quando email não fornecido
- ✅ Validação de email (formato correto/incorreto)
- ✅ Erro quando password não fornecido
- ✅ Erro quando password muito curto
- ✅ Múltiplos erros de validação

#### RefreshTokenDto (6 testes)

- ✅ Constructor com refreshToken
- ✅ Validação de token válido
- ✅ Erro quando token não fornecido
- ✅ Erro quando token vazio
- ✅ Aceitar diferentes formatos de token

### 2. JWT Strategy (25 testes)

#### Constructor (2 testes)

- ✅ Criar instância com configuração customizada
- ✅ Usar configuração padrão

#### sign() (3 testes)

- ✅ Gerar token JWT válido
- ✅ Gerar tokens diferentes para usuários diferentes
- ✅ Incluir dados do usuário no payload

#### validate() (5 testes)

- ✅ Validar token válido
- ✅ Retornar null para token inválido
- ✅ Retornar null quando token não fornecido
- ✅ Retornar null para token expirado
- ✅ Validar token com secret correto

#### generateTokenPair() (3 testes)

- ✅ Gerar access e refresh tokens
- ✅ Tokens devem ser diferentes
- ✅ Refresh token deve conter tipo

#### decode() (3 testes)

- ✅ Decodificar token sem validar
- ✅ Retornar null para token inválido
- ✅ Decodificar token expirado sem erro

#### isExpired() (4 testes)

- ✅ Retornar false para token válido
- ✅ Retornar true para token expirado
- ✅ Retornar true para token inválido
- ✅ Retornar true para token sem exp

#### updateConfig() (2 testes)

- ✅ Atualizar configuração
- ✅ Mesclar com configuração existente

#### Integração (2 testes)

- ✅ Fluxo completo de autenticação
- ✅ Rejeitar token com secret incorreto

### 3. JWT Auth Guard (17 testes)

#### canActivate() (12 testes)

- ✅ Retornar true para token válido
- ✅ Lançar exceção quando token não fornecido
- ✅ Lançar exceção quando header não existe
- ✅ Lançar exceção para token inválido
- ✅ Lançar exceção para formato inválido
- ✅ Lançar exceção quando token vazio
- ✅ Adicionar usuário ao contexto
- ✅ Aceitar Bearer maiúsculo
- ✅ Rejeitar quando tipo não é Bearer
- ✅ Lançar exceção genérica para erros inesperados

#### Integração (3 testes)

- ✅ Fluxo completo de autenticação
- ✅ Rejeitar token expirado
- ✅ Rejeitar token com secret incorreto

### 4. Roles Guard (21 testes)

#### setRequiredRoles() (3 testes)

- ✅ Definir roles necessárias
- ✅ Sobrescrever roles anteriores
- ✅ Aceitar array vazio

#### canActivate() (12 testes)

- ✅ Retornar true quando usuário tem role
- ✅ Retornar true quando usuário tem uma das roles
- ✅ Lançar exceção quando usuário não tem role
- ✅ Lançar exceção quando usuário não autenticado
- ✅ Retornar true quando nenhuma role necessária
- ✅ Lançar exceção quando usuário não tem roles
- ✅ Lançar exceção quando propriedade roles não existe
- ✅ Case-sensitive na comparação
- ✅ Aceitar múltiplas roles

#### forRoles() (3 testes)

- ✅ Criar instância com roles definidas
- ✅ Criar instâncias independentes
- ✅ Funcionar com canActivate

#### Integração (3 testes)

- ✅ Fluxo completo de autorização
- ✅ Acesso hierárquico de roles
- ✅ Guard sem roles (acesso público)

### 5. Auth Service (19 testes)

#### constructor (1 teste)

- ✅ Criar instância e registrar estratégias

#### registerStrategy() (1 teste)

- ✅ Registrar nova estratégia

#### getStrategy() (4 testes)

- ✅ Retornar estratégia JWT
- ✅ Retornar estratégia OAuth
- ✅ Retornar estratégia OpenID
- ✅ Retornar undefined para não registrada

#### loginWithCredentials() (4 testes)

- ✅ Autenticar com credenciais válidas
- ✅ Lançar exceção quando usuário não existe
- ✅ Lançar exceção quando senha inválida
- ✅ Logar erro quando falha

#### validateToken() (2 testes)

- ✅ Validar token válido
- ✅ Retornar null para token inválido

#### refreshAccessToken() (3 testes)

- ✅ Gerar novo access token
- ✅ Lançar exceção para refresh token inválido
- ✅ Logar erro quando falha

#### hashPassword() (3 testes)

- ✅ Gerar hash de senha
- ✅ Gerar hashes diferentes
- ✅ Aceitar rounds customizado

#### comparePassword() (3 testes)

- ✅ Retornar true para senha correta
- ✅ Retornar false para senha incorreta
- ✅ Case-sensitive

#### URLs (2 testes)

- ✅ Gerar URL OAuth
- ✅ Gerar URL OpenID

#### isTokenExpired() (2 testes)

- ✅ Retornar false para token válido
- ✅ Retornar true para token expirado

#### Integração (1 teste)

- ✅ Fluxo completo de autenticação

## 🚀 Executar Testes

### Todos os testes de autenticação

```bash
npm test -- --testPathPatterns=auth
```

### Teste específico

```bash
# JWT Strategy
npm test -- jwt.strategy.spec.ts

# Guards
npm test -- jwt-auth.guard.spec.ts
npm test -- roles.guard.spec.ts

# DTOs
npm test -- login.dto.spec.ts

# Service
npm test -- auth.service.spec.ts
```

### Com cobertura

```bash
npm run test:coverage -- --testPathPatterns=auth
```

### Watch mode

```bash
npm run test:watch -- --testPathPatterns=auth
```

## 📝 Exemplos de Testes

### Teste de Strategy

```typescript
it("deve gerar um token JWT válido", () => {
  const user: IAuthUser = {
    id: "123",
    email: "test@example.com",
    roles: ["user"],
  };

  const token = jwtStrategy.sign(user);

  expect(token).toBeDefined();
  expect(typeof token).toBe("string");
  expect(token.split(".")).toHaveLength(3);
});
```

### Teste de Guard

```typescript
it("deve retornar true para token válido", async () => {
  const user: IAuthUser = { id: "123", email: "test@example.com" };
  const token = jwtStrategy.sign(user);

  const context: any = {
    request: {
      headers: {
        authorization: `Bearer ${token}`,
      },
    },
  };

  const result = await jwtAuthGuard.canActivate(context);

  expect(result).toBe(true);
  expect(context.user).toBeDefined();
});
```

### Teste de DTO

```typescript
it("deve retornar array vazio para dados válidos", () => {
  const dto = new LoginDto({
    email: "test@example.com",
    password: "password123",
  });

  const errors = dto.validate();

  expect(errors).toEqual([]);
});
```

## ✅ Boas Práticas Implementadas

1. **Isolamento**: Cada teste é independente
2. **Cleanup**: Uso de `beforeEach` e `afterEach`
3. **Mocking**: Mocks de Logger e dependências
4. **Nomenclatura**: Nomes descritivos em português
5. **Organização**: Agrupamento lógico com `describe`
6. **Cobertura**: Testes de sucesso e falha
7. **Integração**: Testes de fluxo completo

## 🎯 Resultados

```
Test Suites: 5 passed, 5 total
Tests:       108 passed, 108 total
Snapshots:   0 total
Time:        ~2 seconds
```

## 📚 Documentação

Para mais informações sobre o módulo de autenticação:

- [Documentação do Módulo](../../../docs/AUTH.md)
- [README do Módulo](../../../src/modules/auth/README.md)
- [Exemplos de Uso](../../../examples/auth-example.ts)

---

**Última atualização**: 18 de Fevereiro de 2026
**Versão**: 1.0.0
