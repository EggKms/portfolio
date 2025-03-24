/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { readFileSync } from 'fs';
import * as yaml from 'js-yaml';
import { join } from 'path';

const env = process.env.NODE_ENV;
const YAML_CONFIG_FILENAME = `${env}.yaml`;

export default () => {
  const config = yaml.load(
    readFileSync(join(__dirname, YAML_CONFIG_FILENAME), 'utf8'),
    // readFileSync(join('dist', 'config', YAML_CONFIG_FILENAME), 'utf8'), // webpack 동작
  ) as Record<string, any>;

  if (config.http.port < 1024 || config.http.port > 49151) {
    throw new Error('HTTP port must be between 1024 and 49151');
  }

  return config;
};
