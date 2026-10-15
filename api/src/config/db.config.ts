import { parseEnv } from './config.validator.js';

export interface DbConfig {
  db: {
    url: string;
    poolMax: number;
    redisUrl: string;
  };
}

export default (): DbConfig => {
  const env = parseEnv();
  return {
    db: {
      url: env.DATABASE_URL,
      poolMax: env.DATABASE_POOL_MAX,
      redisUrl: env.REDIS_URL,
    },
  };
};
