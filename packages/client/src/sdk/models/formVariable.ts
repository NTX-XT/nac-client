export interface FormVariable {
    config: {
        config: {
            schema: any;
            value: { [key: string]: any; };
        };
        dataSourceId: string;
        dataSourceLabel: string;
        outputSchema: any;
        usedVariables: { [key: string]: any; };
    };
}
