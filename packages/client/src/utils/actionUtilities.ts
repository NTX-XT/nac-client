import { action } from "../nwc/models/action";
import { parameter } from "../nwc/models/parameter";
import { property } from "../nwc/models/property";
import { KnownStrings } from "./knownStrings";

export class ActionUtilities {
    public static getPropertyFromParameterName = (action: action, parameterName: string): property | undefined => (action.configuration.properties.find(property => property.parameters.find(parameter => parameter.name === parameterName)));
    public static getParameter = (property: property | undefined, name: string): parameter | undefined => (property?.parameters.find(parameter => parameter.name === name));
    public static getXtensionInputParameter = (action: action): parameter | undefined => ActionUtilities.getParameter(ActionUtilities.getPropertyFromParameterName(action, KnownStrings.XtensionInput), KnownStrings.XtensionInput);
    public static getNamedParameterValue = (action: action, name: string): any | undefined => ActionUtilities.getParameterValue(ActionUtilities.getParameter(ActionUtilities.getPropertyFromParameterName(action, name), name));
    public static getParameterValue = (parameter: parameter | undefined): any | undefined => parameter?.value.primitiveValue?.valueType.data.value.value;
    public static getParameterValueKey = (parameter: parameter | undefined, key: string): any | undefined => Object.keys(ActionUtilities.getParameterValue(parameter)).find((entryKey) => (entryKey.endsWith(key)));
    public static getComponentWorkflowIdValue = (action: action): string | undefined => ActionUtilities.getNamedParameterValue(action, KnownStrings.ComponentWorkflowId);
    public static getXtensionInputValue = (action: action): any | undefined => ActionUtilities.getNamedParameterValue(action, KnownStrings.XtensionInput);
    public static getConnectionId = (parameter?: parameter): string | undefined => ActionUtilities.getParameterValue(parameter)
        ? ActionUtilities.getParameterValue(parameter)[ActionUtilities.getParameterValueKey(parameter, KnownStrings.NTXConnectionId)]?.data.id
        : undefined;

    public static flatten = (action: action, allActions?: action[]): action[] => {
        if (allActions === null || allActions === undefined) {
            allActions = [] as action[];
        }
        allActions.push(action);
        if (action.next) {
            this.flatten(action.next, allActions);
        }
        action.children.forEach(a => this.flatten(a, allActions));
        return allActions;
    };
}
