import { getPackageRef } from "./package-ref";

const ESC = "\x1b";
const R = `${ESC}[0m`; // reset
const B = `${ESC}[1m`; // bold
const CY = `${ESC}[36m`; // cyan
const GR = `${ESC}[32m`; // green
const YW = `${ESC}[33m`; // yellow
const GY = `${ESC}[90m`; // gray
const WH = `${ESC}[97m`; // bright white

function getArt(): string[] {
  const pkg = getPackageRef();
  return [
    `${CY}${B}  ███████╗██████╗  █████╗ ███╗   ██╗██╗${R}`,
    `${CY}${B}  ██╔════╝██╔══██╗██╔══██╗████╗  ██║██║${R}`,
    `${CY}${B}  █████╗  ██████╔╝███████║██╔██╗ ██║██║${R}`,
    `${CY}${B}  ██╔══╝  ██╔══██╗██╔══██║██║╚██╗██║██║${R}`,
    `${CY}${B}  ██║     ██║  ██║██║  ██║██║ ╚████║██║${R}`,
    `${CY}${B}  ╚═╝     ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝╚═╝  ${GY}SDK v${pkg.version}${R}`,
  ];
}

const divider = `  ${GY}${"─".repeat(44)}${R}`;

function row(label: string, value: string, valueColor = WH): string {
  return `  ${GY}◆${R}  ${YW}${label.padEnd(13)}${R}${valueColor}${value}${R}`;
}

export function printBanner(port: number): void {
  const pkg = getPackageRef();
  const env = process.env["NODE_ENV"] ?? "development";
  const envColor = env === "production" ? GR : YW;

  console.log("");
  getArt().forEach((line) => console.log(line));
  console.log("");
  console.log(divider);
  console.log(row("Framework", pkg.name));
  console.log(row("Version", `v${pkg.version}`));
  console.log(row("Node.js", process.version));
  console.log(row("Environment", env, envColor));
  console.log(row("Port", String(port), GR));
  console.log(divider);
}

export function printListeningLine(port: number): void {
  console.log(
    `\n  ${GR}${B}▶  Listening${R}  ${WH}http://localhost:${port}${R}\n`,
  );
}
