

export interface ConnectionActionConfigurationItemValue {
    key: string;
    name: string;
    value: string | ConnectionActionConfigurationItemValue[] | undefined;
    type: "value" | "variable" | "unsupported" | "dictionary";
}
