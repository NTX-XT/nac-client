import { generate } from 'openapi-typescript-codegen'
import * as fs from 'fs'
import * as path from 'path'
import { Project, StructureKind, ts, createWrappedNode, ClassDeclaration, Program, MethodDeclaration, MethodDeclarationStructure, Scope, ImportDeclaration, ExportAssignment } from "ts-morph";

interface ITemplateMethodData {
    declaration: string
}

interface TemplateConfig {
    methods: ITemplateMethodData[]
}

const generatedClientNameClassName = 'Nwc'
const postfix = ''
const projectPath = './src/nwc'
const serviceClassName = 'Service' + postfix

generate({
    input: './../validationApp/public/NintexWorkflowCloudeXtended.swagger.json',
    output: projectPath,
    postfix: postfix,
    httpClient: 'axios',
    exportClient: true,
    clientName: generatedClientNameClassName
}).then(() => {
    const project = new Project()
    project.addSourceFilesAtPaths(path.join(projectPath, "**/*.ts"));
    addCachingToNWCClient(project);
    project.saveSync()
})

function addCachingToNWCClient(project: Project) {
    const serviceClassFile = project.getSourceFileOrThrow(path.join(projectPath, 'services/Service.ts'));
    const serviceClass = serviceClassFile.getClassOrThrow(serviceClassName);
    serviceClassFile.addImportDeclaration({
        moduleSpecifier: '../../cache',
        namedImports: ["Cacheable"]
    })

    // serviceClassFile.addImportDeclarations([{
    //     moduleSpecifier: 'node-cache',
    //     defaultImport: 'NodeCache'
    // }, {
    //     moduleSpecifier: '@type-cacheable/node-cache-adapter',
    //     namedImports: ['useAdapter']
    // }, {
    //     moduleSpecifier: '@type-cacheable/core',
    //     namedImports: ["Cacheable"]
    // }]);
    serviceClass.getChildIndex();
    // serviceClassFile.insertStatements(serviceClass.getChildIndex(), [
    //     "const client = new NodeCache({stdTTL:10000})",
    //     "const clientAdapter = useAdapter(client)"
    // ]);

    for (const methodDefinition of serviceClass.getMethods()) {
        const initialStructure = methodDefinition.getStructure();
        methodDefinition.setScope(Scope.Private);
        methodDefinition.rename(methodDefinition.getName() + "Cancelable");

        let returnType: string | undefined = initialStructure.returnType?.toString();
        if (returnType) {
            returnType = returnType.replace('CancelablePromise', 'Promise');
        }
        const newMethod = serviceClass
            .addMethod(initialStructure as MethodDeclarationStructure)
            .removeBody();
        if (returnType) {
            newMethod.setReturnType(returnType);
        }
        newMethod.setBodyText(`return this.${methodDefinition.getName()}(${methodDefinition.getParameters().map((p) => p.getName()).join(', ').trim()})`);
        newMethod.addDecorator({ name: "Cacheable", arguments: [] });
        const docs = methodDefinition.getJsDocs();
        for (const doc of docs) {
            doc.remove();
        }
    }
}

