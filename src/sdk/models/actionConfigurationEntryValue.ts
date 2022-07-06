export interface ActionConfigurationEntryValue {
    key: string;
    name: string;
    value: string | ActionConfigurationEntryValue[] | undefined;
    type: "value" | "variable" | "unsupported" | "dictionary";
}
