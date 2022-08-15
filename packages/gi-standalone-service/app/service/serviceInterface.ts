export interface ILanguageQueryParams {
  value: string;
  graphName?: string;
  gremlinServer?: string;
  authorization?: string;
}

export interface INeighborsParams {
  ids: string[];
  sep?: number;
  graphName?: string;
  gremlinServer?: string;
}
