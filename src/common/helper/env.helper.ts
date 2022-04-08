import { existsSync } from 'fs';
import { resolve } from 'path';

export function getEnvPath(dest: string): string {
  const env: string | undefined = process.env.NODE_ENV;

  if (env) {
    const filePath = resolve(`${dest}/${env}.env`);

    if (existsSync(filePath)) {
      return filePath;
    }
  }

  return resolve(`${dest}/local.env`);
}
