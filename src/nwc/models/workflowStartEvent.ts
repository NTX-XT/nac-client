/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type workflowStartEvent = {
	eventGroup?: string;
	eventType: string;
	eventTypeOption?: string;
	eventTypeDisplayName?: string;
	configuration?: Array<string>;
	nativeEventConfiguration?: string;
	properties?: Array<string>;
	xtensionEventConfiguration?: string;
	transformation?: string;
	webformDefinition?: string;
	webformVersion?: string;
	metadataConfiguration?: string;
	formMetadata?: {
publishToUrlOnly?: boolean;
publishToAllOrg?: boolean;
participantVisible?: boolean;
};
};
