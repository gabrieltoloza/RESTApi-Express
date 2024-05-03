import {createRequire} from 'node:module'
const require = createRequire(import.meta.url)

// funcion para importar Json
export const readJson = (path) => require(path)