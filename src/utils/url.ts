export const concatPath = (...paths: string[]) => paths.join('/').replaceAll(/\/{2,}/gi, '/');
