import { AzureFunction, Context, HttpRequest } from '@azure/functions'
import path from 'path'
import { readFile } from 'fs/promises'
import { OpenAPIV2 } from 'openapi-types'

const swagger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
	const swaggerDocumentPath = path.join(context.executionContext.functionDirectory, 'swagger.json')
	const swaggerDocument: OpenAPIV2.Document = await readFile(swaggerDocumentPath, { encoding: 'utf8' }).then(data => JSON.parse(data))
	if (req.query.generic !== undefined) {
		swaggerDocument.info.title = `${swaggerDocument.info.title} (generic)`
		const parametersDocumentPath = path.join(context.executionContext.functionDirectory, 'swagger_parameters.json')
		const parametersDocument: OpenAPIV2.Document = await readFile(parametersDocumentPath, { encoding: 'utf8' }).then(data => JSON.parse(data))
		swaggerDocument.parameters = parametersDocument.parameters
		const refs: OpenAPIV2.ReferenceObject[] = Object.keys(parametersDocument.parameters!).map(paramName => ({
			$ref: `#/parameters/${paramName}`,
		}))
		for (const pathName in swaggerDocument.paths) {
			swaggerDocument.paths[pathName].parameters = refs
		}
	} else {
		const securityDocumentPath = path.join(context.executionContext.functionDirectory, 'swagger_oauth2.json')
		const securityDocument: OpenAPIV2.Document = await readFile(securityDocumentPath, { encoding: 'utf8' }).then(data => JSON.parse(data))
		swaggerDocument.securityDefinitions = securityDocument.securityDefinitions
		swaggerDocument.security = securityDocument.security
	}
	context.res = {
		status: 200,
		body: swaggerDocument,
	}
}

export default swagger
