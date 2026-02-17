# 🚀 Guia Rápido - Testes Unitários

## ⚡ Comandos Rápidos

```bash
# Executar todos os testes
npm test

# Modo watch (desenvolvimento)
npm run test:watch

# Com cobertura de código
npm run test:coverage

# Modo verbose (detalhado)
npm run test:verbose
```

## 📊 Status Atual

```
✅ 97 testes passando
✅ 7 suítes de teste
✅ 100% de sucesso
⏱️  ~0.6 segundos de execução
```

## 📁 Estrutura de Testes

```
tests/
├── setup.ts                              # Configuração global
├── core/
│   ├── di/
│   │   ├── container.spec.ts            # 8 testes ✅
│   │   └── container-decorator.spec.ts  # 9 testes ✅
│   ├── http/
│   │   ├── http-decorator.spec.ts       # 20 testes ✅
│   │   └── exceptions/
│   │       └── http-exception.spec.ts   # 25 testes ✅
│   └── metadata.spec.ts                 # 15 testes ✅
└── modules/
    ├── logger/
    │   └── logger.service.spec.ts       # 13 testes ✅
    └── health/
        └── health.controller.spec.ts    # 7 testes ✅
```

## 🎯 O Que Está Testado

### ✅ Core (Sistema Principal)

- **DependencyContainer** - Injeção de dependências
- **Decorators** - @Module, @Injectable, @Inject
- **HTTP Decorators** - @Controller, @Get, @Post, etc.
- **Exceções HTTP** - Todas as exceções 4xx e 5xx
- **Metadata** - Sistema de armazenamento de metadata

### ✅ Modules (Funcionalidades)

- **Logger** - Sistema de logging estruturado
- **Health** - Controller de health check

## 📝 Exemplo de Teste

```typescript
describe("Logger", () => {
  let logger: Logger;

  beforeEach(() => {
    logger = new Logger();
  });

  it("deve logar uma mensagem", () => {
    const spy = jest.spyOn(console, "log");
    logger.log("test message");

    expect(spy).toHaveBeenCalled();
    expect(spy.mock.calls[0][0].message).toBe("test message");
  });
});
```

## 🔧 Criar Novo Teste

1. **Criar arquivo** em `tests/` seguindo estrutura de `src/`

   ```bash
   touch tests/modules/user/user.service.spec.ts
   ```

2. **Template básico**

   ```typescript
   import "reflect-metadata";
   import { UserService } from "../../../src/modules/user/user.service";

   describe("UserService", () => {
     let service: UserService;

     beforeEach(() => {
       service = new UserService();
     });

     it("deve estar definido", () => {
       expect(service).toBeDefined();
     });
   });
   ```

3. **Executar**
   ```bash
   npm test
   ```

## 🐛 Troubleshooting

### Problema: Testes falhando

```bash
# Limpar cache do Jest
npm test -- --clearCache

# Executar teste específico
npm test -- user.service.spec.ts
```

### Problema: Cobertura baixa

```bash
# Ver relatório detalhado
npm run test:coverage

# Abrir relatório HTML
open coverage/lcov-report/index.html
```

### Problema: Testes lentos

```bash
# Executar em paralelo (padrão)
npm test

# Executar sequencial
npm test -- --runInBand
```

## 📈 Cobertura Atual

```
Statements   : 62.74%
Branches     : 22.72%
Functions    : 31.21%
Lines        : 63.18%
```

### Componentes com 100% de Cobertura

- ✅ DependencyContainer
- ✅ Container Decorators
- ✅ Metadata System
- ✅ Logger Service
- ✅ Health Controller

### Próximos Alvos

- ⚠️ HTTP Router (7.24% → 80%)
- ⚠️ HTTP Server (18.6% → 80%)
- ⚠️ HTTP Exceptions (64.77% → 90%)

## 🎨 Padrões de Teste

### ✅ Fazer

- Usar `describe` para agrupar testes
- Usar `beforeEach` para setup
- Usar `afterEach` para cleanup
- Nomear testes descritivamente
- Testar casos de sucesso e erro
- Mockar dependências externas

### ❌ Evitar

- Testes dependentes de ordem
- Testes que modificam estado global
- Testes sem assertions
- Testes muito longos (> 50 linhas)
- Duplicação de código de teste

## 🔗 Links Úteis

- [Documentação Completa](./TESTING.md)
- [Guia de Testes](./tests/README.md)
- [Changelog](./CHANGELOG.md)
- [Jest Docs](https://jestjs.io/)

## 💡 Dicas

1. **Use watch mode durante desenvolvimento**

   ```bash
   npm run test:watch
   ```

2. **Execute apenas testes modificados**

   ```bash
   npm test -- --onlyChanged
   ```

3. **Debug de testes**

   ```bash
   node --inspect-brk node_modules/.bin/jest --runInBand
   ```

4. **Atualizar snapshots**

   ```bash
   npm test -- -u
   ```

5. **Ver apenas falhas**
   ```bash
   npm test -- --onlyFailures
   ```

## 🎯 Metas

- [x] Implementar testes unitários básicos
- [x] Configurar Jest e ts-jest
- [x] Atingir 97 testes passando
- [x] Documentar sistema de testes
- [ ] Atingir 80% de cobertura geral
- [ ] Adicionar testes de integração
- [ ] Configurar CI/CD completo

---

**Última atualização**: 17 de Fevereiro de 2026
**Versão**: 1.0.0
**Status**: ✅ Operacional
