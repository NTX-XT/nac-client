import { connection } from "client/src/nwc";
import { action } from "../../nwc/models/action";
import { parameter } from "../../nwc/models/parameter";
import { property } from "../../nwc/models/property";
import { KnownStrings } from "../../utils/knownStrings";

export class ActionHelper {
    public static getPropertyFromParameterName = (action: action, parameterName: string): property | undefined => (action.configuration.properties.find(property => property.parameters.find(parameter => parameter.name === parameterName)));
    public static getParameter = (property: property | undefined, name: string): parameter | undefined => (property?.parameters.find(parameter => parameter.name === name));
    public static getXtensionInputParameter = (action: action): parameter | undefined => ActionHelper.getParameter(ActionHelper.getPropertyFromParameterName(action, KnownStrings.XtensionInput), KnownStrings.XtensionInput);
    public static getNamedParameterValue = (action: action, name: string): any | undefined => ActionHelper.getParameterValue(ActionHelper.getParameter(ActionHelper.getPropertyFromParameterName(action, name), name));
    public static getParameterValue = (parameter: parameter | undefined): any | undefined => parameter?.value.primitiveValue?.valueType.data.value.value;
    public static getParameterValueKey = (parameter: parameter | undefined, key: string): any | undefined => Object.keys(ActionHelper.getParameterValue(parameter)).find((entryKey) => (entryKey.endsWith(key)));
    public static getComponentWorkflowIdValue = (action: action): string | undefined => ActionHelper.getNamedParameterValue(action, KnownStrings.ComponentWorkflowId);
    public static getXtensionInputValue = (action: action): any | undefined => ActionHelper.getNamedParameterValue(action, KnownStrings.XtensionInput);
    public static getConnectionId = (parameter?: parameter): string | undefined => ActionHelper.getParameterValue(parameter)
        ? ActionHelper.getParameterValue(parameter)[ActionHelper.getParameterValueKey(parameter, KnownStrings.NTXConnectionId)]?.data.id
        : undefined;

    public static getConnection = (parameter?: parameter): connection | undefined =>
        ActionHelper.getParameterValue(parameter)
            ? ActionHelper.getParameterValue(parameter)[ActionHelper.getParameterValueKey(parameter, KnownStrings.NTXConnectionId)]?.data
            : undefined
}
