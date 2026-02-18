"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.printBanner = printBanner;
const package_json_1 = __importDefault(require("../../package.json"));
const ESC = "\x1b";
const R = `${ESC}[0m`; // reset
const B = `${ESC}[1m`; // bold
const CY = `${ESC}[36m`; // cyan
const GR = `${ESC}[32m`; // green
const YW = `${ESC}[33m`; // yellow
const GY = `${ESC}[90m`; // gray
const WH = `${ESC}[97m`; // bright white
const art = [
  `${CY}${B}  ███████╗██████╗  █████╗ ███╗   ██╗██╗${R}`,
  `${CY}${B}  ██╔════╝██╔══██╗██╔══██╗████╗  ██║██║${R}`,
  `${CY}${B}  █████╗  ██████╔╝███████║██╔██╗ ██║██║${R}`,
  `${CY}${B}  ██╔══╝  ██╔══██╗██╔══██║██║╚██╗██║██║${R}`,
  `${CY}${B}  ██║     ██║  ██║██║  ██║██║ ╚████║██║${R}`,
  `${CY}${B}  ╚═╝     ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝╚═╝  ${GY}SDK v${package_json_1.default.version}${R}`,
];
const divider = `  ${GY}${"─".repeat(44)}${R}`;
function row(label, value, valueColor = WH) {
  return `  ${GY}◆${R}  ${YW}${label.padEnd(13)}${R}${valueColor}${value}${R}`;
}
function printBanner(port) {
  const env = process.env["NODE_ENV"] ?? "development";
  const envColor = env === "production" ? GR : YW;
  console.log("");
  art.forEach((line) => console.log(line));
  console.log("");
  console.log(divider);
  console.log(row("Framework", package_json_1.default.name));
  console.log(row("Version", `v${package_json_1.default.version}`));
  console.log(row("Node.js", process.version));
  console.log(row("Environment", env, envColor));
  console.log(row("Port", String(port), GR));
  console.log(divider);
  console.log(
    `\n  ${GR}${B}▶  Listening${R}  ${WH}http://localhost:${port}${R}\n`,
  );
}
//# sourceMappingURL=banner.js.map
