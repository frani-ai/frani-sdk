export interface IRouter {
  method: string,
  path: string,
  handler: Function,
  statusCode?: number,
}

