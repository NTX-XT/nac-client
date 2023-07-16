import { connection } from "../../nac";
import { action } from "../../nac/models/action";
import { parameter } from "../../nac/models/parameter";
import { property } from "../../nac/models/property";
import { KnownStrings } from "../../utils/knownStrings";

export class ActionHelper {
    public static getPropertyFromParameterName = (action: action, parameterName: string): property | undefined => (action.configuration.properties.find(property => property.parameters.find(parameter => parameter.name === parameterName)));
    public static getParameter = (property: property | undefined, name: string): parameter | undefined => (property?.parameters.find(parameter => parameter.name === name));
    public static getXtensionInputParameter = (action: action): parameter | undefined => ActionHelper.getParameter(ActionHelper.getPropertyFromParameterName(action, KnownStrings.XtensionInput), KnownStrings.XtensionInput);
    public static getNamedParameterValue = (action: action, name: string): any | undefined => {
        const property = ActionHelper.getPropertyFromParameterName(action, name)
        const parameter = ActionHelper.getParameter(property, name)
        return ActionHelper.getParameterValue(parameter);
    }

    public static getParameterValue = (parameter: parameter | undefined): any | undefined => {
        if (parameter) {
            if (parameter.value) {
                if (parameter.value.primitiveValue) {
                    if (parameter.value.primitiveValue.valueType) {
                        if (parameter.value.primitiveValue.valueType.data.value.value) {
                            return parameter.value.primitiveValue.valueType.data.value.value
                        }
                        else if (typeof parameter.value.primitiveValue.valueType.data.value === 'string' || parameter.value.primitiveValue.valueType.data.value instanceof String) {
                            return parameter.value.primitiveValue.valueType.data.value
                        }
                    }
                }
            }
        }
        return undefined
    }

    public static getParameterValueKey = (parameter: parameter | undefined, key: string): any | undefined => Object.keys(ActionHelper.getParameterValue(parameter)).find((entryKey) => (entryKey.endsWith(key)));
    public static getComponentWorkflowIdParameter = (action: action): parameter | undefined => ActionHelper.getParameter(ActionHelper.getPropertyFromParameterName(action, KnownStrings.ComponentWorkflowId), KnownStrings.ComponentWorkflowId);
    public static getComponentWorkflowIdValue = (action: action): string | undefined => ActionHelper.getNamedParameterValue(action, KnownStrings.ComponentWorkflowId);
    public static getXtensionInputValue = (action: action): any | undefined => ActionHelper.getNamedParameterValue(action, KnownStrings.XtensionInput);
    public static getConnectionIdProperty = (action: action): property | undefined => ActionHelper.getPropertyFromParameterName(action, `['${KnownStrings.NTXConnectionId}']`)
    public static getConnectionIdParameter = (action: action): parameter | undefined => ActionHelper.getParameter(ActionHelper.getConnectionIdProperty(action), `['${KnownStrings.NTXConnectionId}']`);
    public static getConnectionId = (parameter?: parameter): string | undefined => ActionHelper.getParameterValue(parameter)
        ? ActionHelper.getParameterValue(parameter)[ActionHelper.getParameterValueKey(parameter, KnownStrings.NTXConnectionId)]?.data.id
        : undefined;

    public static getConnection = (parameter?: parameter): connection | undefined =>
        ActionHelper.getParameterValue(parameter)
            ? ActionHelper.getParameterValue(parameter)[ActionHelper.getParameterValueKey(parameter, KnownStrings.NTXConnectionId)]?.data
            : undefined

    public static getXtensionInput = (action: action): any | undefined => {
        const parameter = ActionHelper.getXtensionInputParameter(action)
        return (parameter)
            ? ActionHelper.getParameterValue(parameter)[ActionHelper.getParameterValueKey(parameter, KnownStrings.NTXConnectionId)]
            : undefined
    }


}
