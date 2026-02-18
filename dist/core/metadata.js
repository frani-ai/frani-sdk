"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defineMetadata = defineMetadata;
exports.getMetadata = getMetadata;
const metadataStore = new WeakMap();
function defineMetadata(target, data) {
  metadataStore.set(target, data);
}
function getMetadata(target) {
  return metadataStore.get(target);
}
//# sourceMappingURL=metadata.js.map
