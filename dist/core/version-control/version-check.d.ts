import type {
  VersionControlFile,
  VersionCheckResult,
} from "./version-control.types";
/**
 * Busca o arquivo de controle de versão na URL configurada.
 */
export declare function fetchVersionControl(
  url: string,
  timeoutMs?: number,
): Promise<VersionControlFile>;
/**
 * Verifica a versão atual contra o arquivo de controle.
 * Ordem: bloqueada > depreciada > desatualizada > ok.
 */
export declare function checkVersion(
  currentVersion: string,
  control: VersionControlFile,
): VersionCheckResult;
/**
 * Executa a verificação completa: busca o arquivo na URL e compara a versão atual.
 * Se a URL não estiver configurada (env vazia), retorna null (verificação desabilitada).
 */
export declare function runVersionCheck(
  currentVersion: string,
  versionControlUrl: string | undefined,
  timeoutMs?: number,
): Promise<VersionCheckResult | null>;
/**
 * Exibe o resultado da verificação no console e, se a versão estiver bloqueada,
 * lança um erro impedindo a inicialização.
 */
export declare function applyVersionCheckResult(
  result: VersionCheckResult | null,
): void;
//# sourceMappingURL=version-check.d.ts.map
