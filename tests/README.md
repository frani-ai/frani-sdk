# Testes Unitários - Frani SDK

Este diretório contém os testes unitários para o Frani SDK.

## Estrutura de Testes

```
tests/
├── setup.ts                           # Configuração global dos testes
├── core/
│   ├── di/
│   │   ├── container.spec.ts         # Testes do container de DI
│   │   └── container-decorator.spec.ts # Testes dos decorators de DI
│   ├── http/
│   │   ├── http-decorator.spec.ts    # Testes dos decorators HTTP
│   │   └── exceptions/
│   │       └── http-exception.spec.ts # Testes das exceções HTTP
│   └── metadata.spec.ts              # Testes do sistema de metadata
└── modules/
    ├── logger/
    │   └── logger.service.spec.ts    # Testes do serviço de Logger
    └── health/
        └── health.controller.spec.ts # Testes do HealthController
```

## Executar Testes

### Executar todos os testes

```bash
npm test
```

### Executar testes em modo watch

```bash
npm run test:watch
```

### Executar testes com cobertura

```bash
npm run test:coverage
```

### Executar testes em modo verbose

```bash
npm run test:verbose
```

## Cobertura de Testes

Os testes cobrem os seguintes componentes:

### Core

- ✅ **DependencyContainer**: Registro e resolução de dependências
- ✅ **Decorators de DI**: @Module, @Injectable, @Inject
- ✅ **Decorators HTTP**: @Controller, @Get, @Post, @Put, @Delete, @HttpStatus, @Catch
- ✅ **Exceções HTTP**: HttpException e todas as exceções derivadas (4xx e 5xx)
- ✅ **Sistema de Metadata**: defineMetadata e getMetadata

### Modules

- ✅ **Logger Service**: Todos os níveis de log (log, warn, debug, error)
- ✅ **Health Controller**: Rotas de health check

## Tecnologias Utilizadas

- **Jest**: Framework de testes
- **ts-jest**: Preset do Jest para TypeScript
- **@types/jest**: Tipos TypeScript para Jest

## Convenções

1. **Nomenclatura**: Arquivos de teste devem terminar com `.spec.ts`
2. **Localização**: Testes devem estar na pasta `tests/` espelhando a estrutura de `src/`
3. **Describe blocks**: Agrupar testes relacionados
4. **beforeEach/afterEach**: Limpar mocks e spies entre testes
5. **Cobertura**: Manter cobertura acima de 80%

## Exemplos

### Teste de Serviço

```typescript
describe("Logger", () => {
  let logger: Logger;

  beforeEach(() => {
    logger = new Logger();
  });

  it("deve logar uma mensagem", () => {
    const spy = jest.spyOn(console, "log");
    logger.log("test");
    expect(spy).toHaveBeenCalled();
  });
});
```

### Teste de Controller

```typescript
describe("HealthController", () => {
  let controller: HealthController;
  let logger: Logger;

  beforeEach(() => {
    logger = new Logger();
    controller = new HealthController(logger);
  });

  it("deve retornar ok", () => {
    expect(controller.index()).toBe("ok");
  });
});
```

### Teste de Exceção

```typescript
it("deve lançar BadRequestException", () => {
  expect(() => {
    throw new BadRequestException("Invalid");
  }).toThrow(BadRequestException);
});
```

## Adicionar Novos Testes

1. Crie um arquivo `.spec.ts` na pasta apropriada em `tests/`
2. Importe `reflect-metadata` no topo do arquivo
3. Organize os testes em blocos `describe`
4. Use `beforeEach` para setup e `afterEach` para cleanup
5. Execute `npm test` para verificar

## CI/CD

Os testes são executados automaticamente:

- Em cada commit (via husky pre-commit hook)
- Em pull requests
- No pipeline de CI/CD

## Troubleshooting

### Erro: Cannot find module

- Verifique os path mappings no `jest.config.js`
- Certifique-se de que `reflect-metadata` está importado

### Testes falhando aleatoriamente

- Verifique se os mocks estão sendo limpos corretamente
- Use `jest.clearAllMocks()` no `afterEach`

### Cobertura baixa

- Execute `npm run test:coverage` para ver relatório detalhado
- Adicione testes para casos não cobertos
