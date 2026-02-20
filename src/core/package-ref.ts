import path from "path";

/** Lê package.json em tempo de execução (sem import estático) para não sair do rootDir. */
function loadPackageJson(): { name: string; version: string } {
  // path dinâmico: não adiciona package.json ao programa TypeScript
  const pkgPath = path.join(__dirname, "..", "..", "package.json");
  // eslint-disable-next-line global-require
  return require(pkgPath) as { name: string; version: string };
}

let cached: { name: string; version: string } | null = null;

export function getPackageRef(): { name: string; version: string } {
  if (cached === null) cached = loadPackageJson();
  return cached;
}
