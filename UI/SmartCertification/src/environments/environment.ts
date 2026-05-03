import { EnvironmentConfiguration } from "../app/models/environment-configuration";

const serverUrl = 'https://localhost:44384/api';


export const environment: EnvironmentConfiguration = {
  env_name: 'dev',
  production: false,
  apiUrl: serverUrl,
  cacheTimeInMinutes: 30
};