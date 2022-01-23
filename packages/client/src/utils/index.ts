import { property } from "lodash"

export const arrayToDictionary = <T>(array: T[], keyProperty: string): { [key: string]: T } => Object.assign({}, ...array.map((a) => ({ [a[keyProperty]]: a })))