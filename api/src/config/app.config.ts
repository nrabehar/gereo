import { parseEnv } from './config.validator.js';

export interface AppConfig {
  app: {
    env: 'development' | 'test' | 'production';
    isProduction: boolean;
    host: string;
    port: number;
    corsOrigins: string[];
    trustProxy: boolean;
    swaggerEnabled: boolean;
  };
}

export default (): AppConfig => {
  const env = parseEnv();
  return {
    app: {
      env: env.NODE_ENV,
      isProduction: env.NODE_ENV === 'production',
      host: env.HOST,
      port: env.PORT,
      corsOrigins: env.CORS_ORIGINS,
      trustProxy: env.TRUST_PROXY,
      swaggerEnabled: env.SWAGGER_ENABLED,
    },
  };
};
