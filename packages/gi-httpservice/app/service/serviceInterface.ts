export interface ILanguageQueryParams {
  value: string;
  graphName?: string;
  gremlinServer?: string;
  authorization?: string;
  limit: number;
}

export interface INeighborsParams {
  ids: string[];
  sep?: number;
  graphName?: string;
  gremlinServer?: string;
  authorization?: string;
  limit: number;
}
