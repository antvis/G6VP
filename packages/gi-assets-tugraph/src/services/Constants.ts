const isOnline = location.origin.indexOf("storehouse") !== -1;

export const HTTP_SERVICE_URL = isOnline
  ? location.origin
  : "http://localhost:7001";
export const TUGRAPH_DEFAULT_GRAPHNAME = localStorage.getItem(
  "CURRENT_TUGRAPH_SUBGRAPH"
);
