import { readFileSync } from 'node:fs';

const config = JSON.parse(readFileSync(new URL('config.json', import.meta.url), 'utf-8'));

import { createLogger } from '@/lib/logger';

export const logger = createLogger({ level: config.logLevel });
