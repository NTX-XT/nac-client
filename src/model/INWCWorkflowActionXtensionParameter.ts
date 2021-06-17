

export interface INWCWorkflowActionXtensionParameter {
    type: string;
    name: string;
    in: string;
    required?: boolean;
    description?: any;
    minLength?: number;
    maximum?: number;
    minimum?: number;
    collectionFormat?: string;
    uniqueItems?: boolean;
    items?: any;
    default?: string;
    schema?: any;
    "x-ntx-event-context"?: boolean;
    "x-ntx-event-consolidate"?: boolean;
    "x-ntx-visibility"?: string;
    "x-ntx-initial"?: number;
    "x-ntx-query-builder"?: any;
    "x-ntx-orderby-builder"?: any;
    "x-ntx-summary": string;
    "x-ntx-dynamic-values"?: any;
}
