# Controle de versão do SDK

O SDK verifica a versão em uso na **inicialização** do servidor (ao chamar `app.listen()`). A verificação usa um arquivo JSON hospedado no Git (ou em qualquer URL pública) e pode:

- **Informar** se a versão está atual
- **Avisar** se a versão está depreciada (servidor sobe normalmente)
- **Bloquear** a inicialização em caso urgente (ex.: vulnerabilidade de segurança), exibindo a **data de bloqueio**

## Configuração

Variável de ambiente:

```bash
FRANI_VERSION_CONTROL_URL=https://raw.githubusercontent.com/SEU_ORG/frani-sdk/main/version-control.json
```

- Se **não** estiver definida, a verificação é **desativada** e o servidor inicia sem checagem.
- A URL deve retornar um JSON válido no formato abaixo (ex.: arquivo no repositório acessível via raw no GitHub/GitLab).

## Formato do arquivo (`version-control.json`)

O arquivo deve ficar no repositório e ser servido como JSON. Exemplo:

```json
{
  "latest": "1.0.0",
  "minSupported": "1.0.0",
  "deprecated": [
    {
      "version": "0.9.0",
      "message": "Atualize para 1.0.0. Suporte encerrado em breve.",
      "deprecatedAt": "2025-01-15"
    }
  ],
  "blocked": [
    {
      "version": "0.8.0",
      "reason": "Vulnerabilidade de segurança crítica (CVE-XXXX). Atualize imediatamente.",
      "blockedAt": "2025-02-01"
    }
  ]
}
```

### Campos

| Campo          | Obrigatório | Descrição                                                                                          |
| -------------- | ----------- | -------------------------------------------------------------------------------------------------- |
| `latest`       | Sim         | Última versão estável recomendada (ex: `"1.0.0"`).                                                 |
| `minSupported` | Não         | Versão mínima ainda considerada suportada.                                                         |
| `deprecated`   | Não         | Lista de versões **depreciadas**: exibe aviso na subida, mas **não bloqueia**.                     |
| `blocked`      | Não         | Lista de versões **bloqueadas**: **impede** a inicialização e exibe motivo e **data de bloqueio**. |

### Entrada em `deprecated`

| Campo          | Tipo   | Descrição                                                                                   |
| -------------- | ------ | ------------------------------------------------------------------------------------------- |
| `version`      | string | Versão exata (ex: `"0.9.0"`).                                                               |
| `message`      | string | Mensagem exibida ao usuário.                                                                |
| `deprecatedAt` | string | Data em que a versão foi considerada depreciada (recomendado ISO 8601, ex: `"2025-01-15"`). |

### Entrada em `blocked`

| Campo       | Tipo   | Descrição                                                                                    |
| ----------- | ------ | -------------------------------------------------------------------------------------------- |
| `version`   | string | Versão exata (ex: `"0.8.0"`).                                                                |
| `reason`    | string | Motivo do bloqueio (ex.: CVE, vulnerabilidade).                                              |
| `blockedAt` | string | **Data a partir da qual a versão foi bloqueada** (recomendado ISO 8601, ex: `"2025-02-01"`). |

## Comportamento na inicialização

1. Ao chamar `app.listen()`, o SDK (se `FRANI_VERSION_CONTROL_URL` estiver definida) busca o JSON na URL.
2. Compara a versão atual do `package.json` com o arquivo:
   - **Bloqueada** (versão está em `blocked`): exibe motivo e **data de bloqueio** e **lança erro**, impedindo a subida do servidor.
   - **Depreciada** (versão está em `deprecated`): exibe **mensagem** e **data de depreciação** e **permite** a subida.
   - **Desatualizada** (versão &lt; `latest`): exibe aviso para atualizar e sobe.
   - **Atual** (versão &gt;= `latest` e não depreciada/bloqueada): exibe confirmação e sobe.

## Exemplo de uso programático

Se quiser usar a verificação fora do `listen()` (ex.: em script ou CLI):

```typescript
import {
  runVersionCheck,
  applyVersionCheckResult,
} from "@core/version-control";
import pkg from "./package.json";

const url = process.env.FRANI_VERSION_CONTROL_URL;
const result = await runVersionCheck(pkg.version, url);
applyVersionCheckResult(result); // pode lançar se status === "blocked"
```

## Hospedagem no Git

1. Mantenha o arquivo `version-control.json` na raiz (ou em um caminho fixo) do repositório.
2. Use a URL **raw** do arquivo, por exemplo:
   - **GitHub**: `https://raw.githubusercontent.com/ORG/REPO/BRANCH/version-control.json`
   - **GitLab**: `https://gitlab.com/ORG/REPO/-/raw/BRANCH/version-control.json`
3. Ao liberar uma nova versão ou bloquear uma antiga, atualize o JSON e faça commit/push; na próxima inicialização, os clientes que usam o SDK receberão a nova política.
