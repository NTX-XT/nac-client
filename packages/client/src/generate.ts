import { prototype } from 'form-data';
import { generate, Indent } from 'openapi-typescript-codegen'
import * as path from 'path'
import { Project, MethodDeclarationStructure, Scope, TypeAliasDeclarationStructure, OptionalKind, ImportDeclarationStructure, ExportDeclarationStructure, MethodDeclaration } from "ts-morph";

const generatedClientNameClassName = 'Nwc'
const projectPath = './src/nwc'
const serviceClassName = 'DefaultService'

generate({
    input: './../validationApp/public/NintexWorkflowCloudeXtended.swagger.json',
    output: projectPath,
    //    postfix: postfix,
    httpClient: 'axios',
    clientName: generatedClientNameClassName,
    indent: Indent.TAB
}).then(() => {
    const project = new Project()
    project.addSourceFilesAtPaths(path.join(projectPath, "**/*.ts"));
    addCachingToNWCClient(project);
    project.saveSync()
})

function addCachingToNWCClient(project: Project) {
    const serviceClassFile = project.getSourceFileOrThrow(path.join(projectPath, `services/${serviceClassName}.ts`));
    const serviceClass = serviceClassFile.getClassOrThrow(serviceClassName);
    serviceClassFile.addImportDeclarations([{
        moduleSpecifier: '@type-cacheable/core',
        namedImports: ["Cacheable"]
    }, {
        moduleSpecifier: '../core/ApiError',
        namedImports: ["ApiError"]
    }])
    const additionalTypes: OptionalKind<TypeAliasDeclarationStructure>[] = []
    for (const methodDefinition of serviceClass.getMethods()) {
        const initialStructure = methodDefinition.getStructure() as MethodDeclarationStructure;
        methodDefinition.setScope(Scope.Private);
        methodDefinition.rename(methodDefinition.getName() + "Cancelable");

        /* Handle return types */

        let returnType: string | undefined = initialStructure.returnType?.toString().trim();
        if (returnType) {
            let arg = returnType.substring(0, returnType.length - 1).replace('CancelablePromise<', '').split('\r\n').join('')
            if (arg.startsWith('{')) {


                arg = `{${arg.replace('{', '').trim()}`
                const typeName = `${initialStructure.name}ResponseType`
                const existingTypeDeclaration = additionalTypes.find((type) => type.name === arg)
                if (!existingTypeDeclaration) {
                    additionalTypes.push({
                        name: typeName,
                        type: arg,
                        isExported: true
                    })
                }
                arg = typeName
                methodDefinition.setReturnType(`CancelablePromise<${arg}>`)
            }
            returnType = `Promise<${arg}>`
        }

        const newMethod = serviceClass
            .addMethod(initialStructure)
            .removeBody();
        if (returnType) {
            newMethod.setReturnType(returnType);
        }

        for (const parameter of newMethod.getParameters()) {
            if (parameter.getType().isObject()) {
                const typeName = `${newMethod.getName()}${parameter.getName().charAt(0).toUpperCase()}${parameter.getName().slice(1)}`
                const existingTypeDeclaration = additionalTypes.find((type) => type.name === typeName)
                if (!existingTypeDeclaration) {
                    const parameterText = initialStructure.parameters?.find((p) => p.name === parameter.getName().toString())?.type?.toString()
                    if (parameterText)
                        additionalTypes.push({
                            name: typeName,
                            type: parameterText,
                            isExported: true
                        })
                }
                parameter.setType(typeName)
                methodDefinition.getParameter(parameter.getName())?.setType(typeName)
            }
        }

        newMethod.setBodyText(`return this.${methodDefinition.getName()}(${methodDefinition.getParameters().map((p) => p.getName()).join(', ').trim()}).then((response) => Promise.resolve(response)).catch((error: ApiError) => Promise.reject(error))`);
        newMethod.addDecorator({ name: "Cacheable", arguments: [] });
        const docs = methodDefinition.getJsDocs();
        for (const doc of docs) {
            doc.remove();
        }
    }

    if (additionalTypes.length > 0) {
        const additionalTypesFile = project.createSourceFile(path.join(projectPath, 'models/additionalTypes.ts'), undefined, { overwrite: true })
        additionalTypesFile.addTypeAliases(additionalTypes)
        additionalTypesFile.fixMissingImports()
        // const foundNamedImports = additionalTypesFile.getImportDeclarations()[0]

        // const typeNames = foundNamedImports.getNamedImports().map((namedImport) => namedImport.getName())
        // const importDeclarations = typeNames.map((typeName) => {
        //     return {
        //         moduleSpecifier: `./${typeName}`,
        //         namedImports: [typeName]
        //     } as OptionalKind<ImportDeclarationStructure>
        // })
        // additionalTypesFile.insertImportDeclarations(0, importDeclarations)
        // foundNamedImports.remove()

        additionalTypesFile.insertStatements(0, ['/* istanbul ignore file */', '/* tslint:disable */', '/* eslint-disable */'])
        serviceClassFile.fixMissingImports()
        const indexFile = project.getSourceFileOrThrow(path.join(projectPath, 'index.ts'))
        const exportDeclarations = additionalTypes.map((type) => {
            return {
                moduleSpecifier: `./models/additionalTypes`,
                namedExports: [type.name],
                isTypeOnly: true,
            } as OptionalKind<ExportDeclarationStructure>
        })
        indexFile.addExportDeclarations(exportDeclarations)
    }
}

