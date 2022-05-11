/*
 * This function is not intended to be invoked directly. Instead it will be
 * triggered by an HTTP starter function.
 *
 * Before running this sample, please:
 * - create a Durable activity function (default name is "Hello")
 * - create a Durable HTTP starter function
 * - run 'npm install durable-functions' from the wwwroot folder of your
 *    function app in Kudu
 */

import * as df from 'durable-functions'
import { IOrchestrationActivities } from './../shared'

const orchestrator = df.orchestrator(function* (context) {
	const outputs: any[] = []

	const config: IOrchestrationActivities = context.df.getInput()
	for (const activity of config.activities) {
		outputs.push(yield context.df.callActivity(activity.activityName, activity.input))
	}

	return outputs
})

export default orchestrator
