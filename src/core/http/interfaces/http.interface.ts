export interface IRouter {
  method: string;
  path: string;
  handler: Function;
  statusCode?: number;
  /** Regex para match de path com :param (quando existir) */
  pathRegex?: RegExp;
  /** Nomes dos parâmetros de path na ordem (ex: ['id', 'slug']) */
  pathParamNames?: string[];
}
