import { OpenAPIV2 } from "openapi-types";

export const arrayToDictionary = <T>(array: T[], keyProperty: string): { [key: string]: T } => Object.assign({}, ...array.map((a) => ({ [a[keyProperty]]: a })))
export const flattenTree = <Type>(node: Type, childPropertyName: string, childNodeArrayPropertyName?: string): Type[] => _flattenTree<Type>(node, childPropertyName, childNodeArrayPropertyName)

const _flattenTree = <Type>(node: Type, childNodePropertyName: string, childNodeArrayPropertyName?: string, arrayResult: Type[] = []): Type[] => {
    arrayResult.push(node);
    if (node[childNodePropertyName]) {
        _flattenTree(node[childNodePropertyName], childNodePropertyName, childNodeArrayPropertyName, arrayResult);
    }
    if (childNodeArrayPropertyName && node[childNodeArrayPropertyName]) {
        node[childNodeArrayPropertyName].forEach((child: Type) => _flattenTree(child, childNodePropertyName, childNodeArrayPropertyName, arrayResult));
    } return arrayResult;
}
export const findOperation = (paths: OpenAPIV2.PathsObject, operationId: string): OpenAPIV2.OperationObject | undefined => {
    for (const key of Object.keys(paths)) {
        for (const verb of Object.keys(OpenAPIV2.HttpMethods).map(key => OpenAPIV2.HttpMethods[key])) {
            if (paths[key][verb] && paths[key][verb].operationId === operationId) {
                return paths[key][verb]
            }
        }
    }
    return undefined
}