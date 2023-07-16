import { FormControlProperies } from "./formControlProperies";

export interface FormControl {
    id: string;
    properties: FormControlProperies;
    sourceVariable: {
        autoGenerateName: boolean,
        displayName: string,
        id: string
    }
}

