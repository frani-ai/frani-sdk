const metadataStore = new WeakMap()

export function defineMetadata(target: Function, data: unknown) {
  metadataStore.set(target, data)
}

export function getMetadata(target: any) {
  return metadataStore.get(target)
}