"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchVersionControl = fetchVersionControl;
exports.checkVersion = checkVersion;
exports.runVersionCheck = runVersionCheck;
exports.applyVersionCheckResult = applyVersionCheckResult;
const axios_1 = __importDefault(require("axios"));
const DEFAULT_TIMEOUT_MS = 5000;
/**
 * Compara duas versões no formato semver (ex: 1.0.0).
 * @returns -1 se a < b, 0 se a === b, 1 se a > b
 */
function compareVersions(a, b) {
  const partsA = a.replace(/^v/, "").split(".").map(Number);
  const partsB = b.replace(/^v/, "").split(".").map(Number);
  const maxLen = Math.max(partsA.length, partsB.length);
  for (let i = 0; i < maxLen; i += 1) {
    const numA = partsA[i] ?? 0;
    const numB = partsB[i] ?? 0;
    if (numA < numB) return -1;
    if (numA > numB) return 1;
  }
  return 0;
}
function normalizeVersion(v) {
  return v.replace(/^v/, "").trim();
}
/**
 * Busca o arquivo de controle de versão na URL configurada.
 */
async function fetchVersionControl(url, timeoutMs = DEFAULT_TIMEOUT_MS) {
  const response = await axios_1.default.get(url, {
    timeout: timeoutMs,
    headers: { Accept: "application/json" },
    validateStatus: (status) => status === 200,
  });
  const data = response.data;
  if (!data || typeof data.latest !== "string") {
    throw new Error(
      "version-control.json inválido: campo 'latest' obrigatório",
    );
  }
  const control = {
    latest: normalizeVersion(data.latest),
    deprecated: Array.isArray(data.deprecated) ? data.deprecated : [],
    blocked: Array.isArray(data.blocked) ? data.blocked : [],
  };
  if (data.minSupported != null && typeof data.minSupported === "string") {
    control.minSupported = normalizeVersion(data.minSupported);
  }
  return control;
}
/**
 * Verifica a versão atual contra o arquivo de controle.
 * Ordem: bloqueada > depreciada > desatualizada > ok.
 */
function checkVersion(currentVersion, control) {
  const current = normalizeVersion(currentVersion);
  const latest = control.latest;
  const findBlocked = () =>
    (control.blocked ?? []).find(
      (b) => normalizeVersion(b.version) === current,
    );
  const findDeprecated = () =>
    (control.deprecated ?? []).find(
      (d) => normalizeVersion(d.version) === current,
    );
  const blocked = findBlocked();
  if (blocked) {
    return {
      status: "blocked",
      currentVersion: current,
      latestVersion: latest,
      reason: blocked.reason,
      blockedAt: blocked.blockedAt,
      message: `Versão ${current} está bloqueada desde ${blocked.blockedAt}. ${blocked.reason}`,
    };
  }
  const deprecated = findDeprecated();
  if (deprecated) {
    return {
      status: "deprecated",
      currentVersion: current,
      latestVersion: latest,
      message: deprecated.message,
      deprecatedAt: deprecated.deprecatedAt,
    };
  }
  if (compareVersions(current, latest) < 0) {
    return {
      status: "outdated",
      currentVersion: current,
      latestVersion: latest,
      message: `Há uma versão mais recente: v${latest}. Considere atualizar.`,
    };
  }
  return {
    status: "ok",
    currentVersion: current,
    latestVersion: latest,
  };
}
/**
 * Executa a verificação completa: busca o arquivo na URL e compara a versão atual.
 * Se a URL não estiver configurada (env vazia), retorna null (verificação desabilitada).
 */
async function runVersionCheck(
  currentVersion,
  versionControlUrl,
  timeoutMs = DEFAULT_TIMEOUT_MS,
) {
  if (!versionControlUrl || versionControlUrl.trim() === "") {
    return null;
  }
  const control = await fetchVersionControl(
    versionControlUrl.trim(),
    timeoutMs,
  );
  return checkVersion(currentVersion, control);
}
const ESC = "\x1b";
const R = `${ESC}[0m`;
const YW = `${ESC}[33m`;
const RD = `${ESC}[31m`;
const GR = `${ESC}[32m`;
const GY = `${ESC}[90m`;
/**
 * Exibe o resultado da verificação no console e, se a versão estiver bloqueada,
 * lança um erro impedindo a inicialização.
 */
function applyVersionCheckResult(result) {
  if (result === null) return;
  switch (result.status) {
    case "blocked": {
      const msg =
        result.message ??
        `Versão v${result.currentVersion} bloqueada desde ${result.blockedAt}. ${result.reason ?? ""}`;
      console.error(`\n  ${RD}✖ Versão bloqueada${R}`);
      console.error(`  ${GY}${msg}${R}`);
      console.error(
        `  ${GY}Atualize para v${result.latestVersion} ou superior.${R}\n`,
      );
      throw new Error(`Inicialização bloqueada: ${msg}`);
    }
    case "deprecated":
      console.warn(
        `\n  ${YW}⚠ Versão depreciada (v${result.currentVersion})${R}`,
      );
      console.warn(`  ${GY}${result.message ?? ""}${R}`);
      if (result.deprecatedAt) {
        console.warn(`  ${GY}Depreciada em: ${result.deprecatedAt}${R}`);
      }
      console.warn(
        `  ${GY}Recomendado: atualizar para v${result.latestVersion}${R}\n`,
      );
      break;
    case "outdated":
      console.info(`  ${GY}ℹ ${result.message ?? ""}${R}\n`);
      break;
    case "ok":
      console.info(`  ${GR}✓ Versão atual (v${result.currentVersion})${R}\n`);
      break;
    default:
      break;
  }
}
//# sourceMappingURL=version-check.js.map
