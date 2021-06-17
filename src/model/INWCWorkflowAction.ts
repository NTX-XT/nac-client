import { INWCWorlfowActionConfiguration } from "./INWCWorlfowActionConfiguration";
import { INWCWorkflowActionRenderOptions } from "./INWCWorkflowActionRenderOptions";

export interface INWCWorkflowAction {
    id: string;
    configuration: INWCWorlfowActionConfiguration;
    className: string;
    renderOptions: INWCWorkflowActionRenderOptions;
    requiredZone: any;
    invalidZone: any;
    requiredZoneErrorMessage: any;
    definesZone: any;
    _metaData?: string[];
    children: INWCWorkflowAction[];
    next: INWCWorkflowAction;
    previous: string;
    parent: string;
}
