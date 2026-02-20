/**
 * Entrada de versão depreciada.
 * Versões listadas aqui exibem aviso na inicialização mas permitem o servidor subir.
 */
export interface DeprecatedVersion {
  /** Versão exata (ex: "0.9.0") */
  version: string;
  /** Mensagem exibida ao usuário */
  message: string;
  /** Data a partir da qual a versão foi considerada depreciada (ISO 8601) */
  deprecatedAt: string;
}

/**
 * Entrada de versão bloqueada (ex: quebra de segurança).
 * Versões listadas aqui impedem a inicialização do servidor.
 */
export interface BlockedVersion {
  /** Versão exata (ex: "0.8.0") */
  version: string;
  /** Motivo do bloqueio (ex: CVE, vulnerabilidade) */
  reason: string;
  /** Data a partir da qual a versão foi bloqueada (ISO 8601) */
  blockedAt: string;
}

/**
 * Arquivo de controle de versão (hospedado no Git / URL pública).
 * O SDK busca este JSON ao iniciar e compara com a versão atual do package.
 */
export interface VersionControlFile {
  /** Última versão estável recomendada */
  latest: string;
  /** Versão mínima ainda suportada (opcional) */
  minSupported?: string;
  /** Versões depreciadas: aviso na inicialização */
  deprecated?: DeprecatedVersion[];
  /** Versões bloqueadas: impedem a inicialização */
  blocked?: BlockedVersion[];
}

export type VersionStatus = "ok" | "deprecated" | "blocked" | "outdated";

export interface VersionCheckResult {
  status: VersionStatus;
  currentVersion: string;
  latestVersion: string;
  message?: string;
  deprecatedAt?: string;
  blockedAt?: string;
  reason?: string;
}
