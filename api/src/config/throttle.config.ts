import { parseEnv } from './config.validator.js';

export interface ThrottleConfig {
  throttle: {
    ttlMs: number;
    limit: number;
  };
}

export default (): ThrottleConfig => {
  const env = parseEnv();
  return {
    throttle: { ttlMs: env.THROTTLE_TTL_MS, limit: env.THROTTLE_LIMIT },
  };
};
