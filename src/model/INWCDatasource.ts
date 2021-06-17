export interface INWCDataSource {
    id:               string;
    name:             string;
    description:      string;
    contractId:       string;
    operationId:      string;
    connectionId:     string;
    createdByUserId:  string;
    createdDate:      Date;
    modifiedByUserId: string;
    modifiedDate:     Date;
    isInvalid:        boolean;
    isEditable:       boolean;
}
