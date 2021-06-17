import { INWCConnectorActionInfo } from "./INWCConnectorActionInfo";
import { INWCConnectorEventInfo } from "./INWCConnectorEventInfo";

export interface INWCConnectorInfo {
    id: string;
    name: string;
    enabled: boolean;
    active: boolean;
    events: INWCConnectorEventInfo[]
    actions: INWCConnectorActionInfo[]
}

