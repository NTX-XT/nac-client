
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