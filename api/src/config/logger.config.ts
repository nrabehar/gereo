import { parseEnv } from './config.validator.js';

export interface LoggerConfig {
  logger: {
    level: 'fatal' | 'error' | 'warn' | 'info' | 'debug' | 'trace' | 'silent';
  };
}

export default (): LoggerConfig => ({
  logger: { level: parseEnv().LOG_LEVEL },
});
