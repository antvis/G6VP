import request from 'umi-request';
import { localLoadGraphConfig } from './Constants';

export interface ConnectProps {
  httpServerURL: string;
  uri: string;
  username: string;
  password: boolean;
}

export const connectNeo4jService = async (params: ConnectProps) => {
  const { uri, username, password, httpServerURL } = params;

  const result = await request(`${httpServerURL}/api/neo4j/connect`, {
    method: 'POST',
    data: {
      uri,
      username,
      password,
      httpServerURL,
    },
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (result.success) {
    const { httpServerURL } = result.data;
    localStorage.setItem('Neo4j_HTTP_SERVER', httpServerURL);
    localStorage.setItem('Neo4j_CONNECT_URI', uri);
  }

  return result;
};

export const queryGraphSchema = async () => {
  const httpServerURL = localStorage.getItem('Neo4j_HTTP_SERVER');
  const result = await request(`${httpServerURL}/api/neo4j/schema`, {
    method: 'GET',
  });

  return result.data;
};
