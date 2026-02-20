"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPackageRef = getPackageRef;
const path_1 = __importDefault(require("path"));
/** Lê package.json em tempo de execução (sem import estático) para não sair do rootDir. */
function loadPackageJson() {
  // path dinâmico: não adiciona package.json ao programa TypeScript
  const pkgPath = path_1.default.join(__dirname, "..", "..", "package.json");
  // eslint-disable-next-line global-require
  return require(pkgPath);
}
let cached = null;
function getPackageRef() {
  if (cached === null) cached = loadPackageJson();
  return cached;
}
//# sourceMappingURL=package-ref.js.map
