# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

## [1.0.0] - 2026-02-17

### ✨ Adicionado

#### Sistema de Testes Unitários

- **Jest** configurado como framework de testes
- **97 testes unitários** implementados com 100% de sucesso
- **7 suítes de teste** cobrindo componentes principais
- Configuração de cobertura de código
- Scripts de teste no package.json:
  - `npm test` - Executar todos os testes
  - `npm run test:watch` - Modo watch
  - `npm run test:coverage` - Com cobertura
  - `npm run test:verbose` - Modo verbose

#### Arquivos de Teste Criados

1. `tests/core/di/container.spec.ts` - Testes do DependencyContainer
2. `tests/core/di/container-decorator.spec.ts` - Testes dos decorators de DI
3. `tests/core/metadata.spec.ts` - Testes do sistema de metadata
4. `tests/core/http/http-decorator.spec.ts` - Testes dos decorators HTTP
5. `tests/core/http/exceptions/http-exception.spec.ts` - Testes das exceções HTTP
6. `tests/modules/logger/logger.service.spec.ts` - Testes do Logger
7. `tests/modules/health/health.controller.spec.ts` - Testes do HealthController

#### Configuração

- `jest.config.js` - Configuração completa do Jest
- `tests/setup.ts` - Setup global dos testes
- Path mappings configurados (@core, @modules)
- Mock de console para testes limpos

#### Documentação

- `README.md` - Documentação principal do projeto
- `tests/README.md` - Guia de testes
- `TESTING.md` - Documentação detalhada de testes
- `CHANGELOG.md` - Histórico de mudanças
- `.github/workflows/test.yml` - CI/CD workflow

#### Cobertura de Testes

- **DependencyContainer**: 100% ✅
  - Registro de instâncias
  - Resolução de dependências
  - Injeção automática
  - Padrão Singleton
- **Decorators de DI**: 100% ✅
  - @Module
  - @Injectable
  - @Inject
- **Sistema de Metadata**: 100% ✅
  - defineMetadata
  - getMetadata
  - Isolamento de metadata
- **Decorators HTTP**: 79% ✅
  - @Controller
  - @Get, @Post, @Put, @Delete
  - @HttpStatus
  - @Catch
- **Exceções HTTP**: 64% ⚠️
  - HttpException base
  - Exceções 4xx (Client Errors)
  - Exceções 5xx (Server Errors)
  - Serialização JSON
- **Logger Service**: 100% ✅
  - log(), warn(), debug(), error()
  - Contexto e metadata
  - Formato estruturado
- **Health Controller**: 100% ✅
  - Health check endpoint
  - Error handling
  - Injeção de dependências

#### Melhorias no Projeto

- Adicionado `coverage/` ao .gitignore
- Pre-commit hook já configurado para executar testes
- Integração com Prettier mantida
- Type checking configurado

### 📊 Estatísticas

```
Test Suites: 7 passed, 7 total
Tests:       97 passed, 97 total
Snapshots:   0 total
Time:        ~0.5s

Cobertura:
- Statements:   62.74%
- Branches:     22.72%
- Functions:    31.21%
- Lines:        63.18%
```

### 🎯 Componentes Testados

#### Core (100% dos componentes principais)

- ✅ Sistema de Injeção de Dependências
- ✅ Sistema de Metadata
- ✅ Decorators HTTP
- ✅ Exceções HTTP

#### Modules (100% dos módulos existentes)

- ✅ Logger Service
- ✅ Health Controller

### 🔧 Dependências Adicionadas

```json
{
  "devDependencies": {
    "jest": "^29.x",
    "@types/jest": "^29.x",
    "ts-jest": "^29.x"
  }
}
```

### 📝 Convenções Estabelecidas

1. **Nomenclatura**: Arquivos de teste terminam com `.spec.ts`
2. **Localização**: Estrutura de `tests/` espelha `src/`
3. **Organização**: Uso de `describe` para agrupar testes relacionados
4. **Limpeza**: `beforeEach` e `afterEach` para isolamento
5. **Mocking**: Mocks de console e dependências externas

### 🚀 Próximos Passos

Para versões futuras:

- [ ] Aumentar cobertura de branches para 80%+
- [ ] Adicionar testes de integração
- [ ] Testar http-router (atualmente 7.24%)
- [ ] Testar http-server (atualmente 18.6%)
- [ ] Adicionar testes E2E
- [ ] Configurar CI/CD completo
- [ ] Adicionar badges de cobertura

### 🐛 Correções

- Ajustados testes de @HttpStatus para lidar com ordem de decorators
- Configurado mock de console para evitar poluição de output

---

## Formato

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/lang/pt-BR/).

### Tipos de Mudanças

- **Adicionado** para novas funcionalidades
- **Modificado** para mudanças em funcionalidades existentes
- **Descontinuado** para funcionalidades que serão removidas
- **Removido** para funcionalidades removidas
- **Corrigido** para correções de bugs
- **Segurança** para vulnerabilidades
