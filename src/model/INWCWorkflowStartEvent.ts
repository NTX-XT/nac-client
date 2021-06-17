
export interface INWCWorkflowStartEvent {
    eventGroup: string;
    eventType: string;
    eventTypeOption: string;
    eventTypeDisplayName: string;
    configuration: any[];
    conditional: any;
    properties: any[];
    xtensionEventConfiguration: any;
    transformation: any;
    webformDefinition?: string;
	webformVersion?: string;
    metadataConfiguration? : any;
    formMetadata?: any;
    eventData?: { [key: string]: string } 
}
