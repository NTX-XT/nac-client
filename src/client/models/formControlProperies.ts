import { FormRow } from "./formRow";
import { FormControlDatasourceConfig } from "./formVariableConfig";


export interface FormControlProperies {
    rows?: FormRow[];
    dataSourceConfiguration?: FormControlDatasourceConfig;
    items?: any
}
