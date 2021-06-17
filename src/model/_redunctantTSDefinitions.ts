
// // /* Properties */


// export interface TentacledSchema {
//     properties:        { [key: string]: any };
//     required:          any[];
//     "x-ntx-sdk-state": string;
//     "x-ntx-loading":   boolean;
// }


// export interface CreateRecordBodyFieldsSchema {
//     title:              string;
//     type:               string;
//     properties?:         { [key: string]: any }[];
//     required?:          string[];
//     "x-ntx-sdk-state"?: string;
//     format?:            string;
// }




// /* END PROPERTIES */

// /* IMAGE */

// export interface TentacledImage {
//     src:       null;
//     css:       null;
//     canvasSrc: string;
// }

// export interface PurpleImage {
//     svgIcon:        null | string;
//     svgLight:       boolean;
//     toolboxSrc:     string;
//     canvasSrc:      string;
//     configPanelSrc: string;
//     id?:            string[] | string;
// }







// export interface IndigoValue {
//     "createRecord.body.fields":            CreateRecordBodyFields;
//     "createRecord.path.NTX_CONNECTION_ID": PathNtxConnectionID;
//     "createRecord.query.objectApiName":    QueryObjectAPIName;
// }

// export interface CreateRecordBodyFields {
//     value:  CreateRecordBodyFieldsValue;
//     schema: CreateRecordBodyFieldsSchema;
// }


// export interface DescriptionCValue {
//     name:    string;
//     type:    DescriptionCType;
//     title:   string;
//     format?: string;
// }

// export enum DescriptionCType {
//     Boolean = "boolean",
//     String = "string",
// }




// export interface FluffyValueType {
//     type:       DesignerTypeEnum;
//     data:       FluffyData;
//     validators: any[];
// }

// export interface FluffyData {
//     name?:      DataName;
//     value:      string;
//     valuePath?: string;
// }

// export interface TentacledValueType {
//     type:       INWCWorkflowDefinitionDataType;
//     data:       TentacledData;
//     validators: any[];
// }

// export interface TentacledData {
//     value: string;
// }

// export interface FluffyVariable {
//     valueType: StickyValueType;
// }

// export interface StickyValueType {
//     type:       INWCWorkflowDefinitionDataType | DesignerTypeEnum;
//     data:       FluffyData;
//     validators: any[];
// }


// export interface StickyData {
//     value: IndecentValue;
// }

// export interface IndecentValue {
//     value:  HilariousValue;
//     schema: INWCWorkflowActionParameterValueSchema;
// }

// export interface HilariousValue {
//     "queryRecords.query.limit":            QueryRecordsQueryLimit;
//     "queryRecords.path.NTX_CONNECTION_ID": PathNtxConnectionID;
//     "queryRecords.query.objectApiName":    QueryObjectAPIName;
//     "queryRecords.query.conditions":       QueryRecordsQueryConditions;
// }

// export interface QueryRecordsQueryConditions {
//     data:   QueryRecordsQueryConditionsData;
//     value:  QueryRecordsQueryConditionsValue[];
//     schema: NQ2CQuoteCSchema;
// }

// export interface QueryRecordsQueryConditionsData {
//     value: AmbitiousValue;
// }

// export interface AmbitiousValue {
//     conditions:   Conditions;
//     relationship: Relationship;
// }

// export interface Conditions {
//     value: ConditionsValue[];
// }

// export interface ConditionsValue {
//     schema: INWCWorkflowActionParameterValueSchema;
//     value:  CunningValue;
//     data:   IndigoData;
// }

// export interface IndigoData {
//     id: number;
// }

// export interface CunningValue {
//     when:     When;
//     operator: Operator;
//     value:    MagentaValue;
// }

// export interface Operator {
//     literal: Literal;
//     data:    OperatorData;
//     schema:  NQ2CRoleCSchema;
// }

// export interface OperatorData {
//     label: string;
//     value: Literal;
//     data:  Literal;
// }

// export interface Literal {
//     schema: StatusClass;
//     arity:  string;
//     type:   string;
//     label:  string;
//     value:  string;
// }

// export interface MagentaValue {
//     variable: NQ2CQuoteCVariable;
//     schema:   StickySchema;
// }

// export interface StickySchema {
//     title:              string;
//     type:               CountType;
//     "x-ntx-visibility": string;
//     "x-ntx-rules":      XNtxRules;
// }

// export interface XNtxRules {
//     "x-ntx-visibility": XNtxVisibility;
// }

// export interface XNtxVisibility {
//     function: string;
//     value:    XNtxVisibilityValue[];
// }

// export interface XNtxVisibilityValue {
//     function?: string;
//     value:     FriskyValue[] | string;
// }

// export interface FriskyValue {
//     function?: string;
//     value:     MischievousValue[] | string;
// }

// export interface MischievousValue {
//     value: string[];
// }

// export interface When {
//     literal: string;
//     data:    WhenData;
//     schema:  NQ2CRoleCSchema;
// }

// export interface WhenData {
//     label: string;
//     value: string;
//     data:  string;
// }

// export interface Relationship {
//     value: RelationshipValue;
// }

// export interface RelationshipValue {
//     value: string;
//     label: string;
// }

// export interface QueryRecordsQueryConditionsValue {
//     literal?:  string;
//     data?:     WhenData;
//     schema?:   IndigoSchema;
//     variable?: NQ2CQuoteCVariable;
// }

// export interface IndigoSchema {
//     title:                           string;
//     "x-ntx-odata-fragment"?:         boolean;
//     "x-ntx-odata-fragment-version"?: number;
//     type?:                           CountType;
//     "x-ntx-visibility"?:             string;
//     "x-ntx-rules"?:                  XNtxRules;
// }

// export interface QueryRecordsQueryLimit {
//     literal: number;
//     schema:  QueryRecordsQueryLimitSchema;
// }

// export interface QueryRecordsQueryLimitSchema {
//     title:   string;
//     type:    CountType;
//     minimum: number;
//     maximum: number;
// }






// export interface PurpleType {
//     name:     DesignerTypeEnum;
//     version:  number;
//     subType?: string;
//     schema?:  CreateRecordBodyFieldsSchema;
// }

// export interface BraggadociousValue {
//     primitiveValue: StickyPrimitiveValue | null;
//     variable:       StickyVariable | null;
// }

// export interface StickyPrimitiveValue {
//     valueType:    HilariousValueType;
//     formatValues: TentacledValue[];
// }

// export interface HilariousValueType {
//     type:       INWCWorkflowDefinitionDataType;
//     data:       IndecentData;
//     validators: any[];
// }

// export interface IndecentData {
//     value: Value1;
// }

// export interface Value1 {
//     schema: INWCWorkflowActionParameterValueSchema;
//     value:  Value2;
// }

// export interface Value2 {
//     "retrieveRecord.path.NTX_CONNECTION_ID": PathNtxConnectionID;
//     "retrieveRecord.query.objectApiName":    QueryObjectAPIName;
//     "retrieveRecord.path.recordId":          RetrieveRecordPathRecordID;
//     "retrieveRecord.query.fields":           RetrieveRecordQueryFields;
// }

// export interface RetrieveRecordPathRecordID {
//     variable: DescriptionCVariable;
//     schema:   NQ2CQuoteCSchema;
// }

// export interface RetrieveRecordQueryFields {
//     value:  RetrieveRecordQueryFieldsValue[];
//     data:   Datum[];
//     schema: NQ2CQuoteCSchema;
// }

// export interface Datum {
//     label: string;
//     value: string;
//     data:  DatumData;
// }

// export interface DatumData {
//     name:  string;
//     label: string;
// }

// export interface RetrieveRecordQueryFieldsValue {
//     literal: string;
// }

// export interface StickyVariable {
//     valueType: AmbitiousValueType;
// }

// export interface AmbitiousValueType {
//     type:       PurpleType;
//     data:       TentacledData;
//     validators: any[];
// }



// export interface HilariousData {
//     field: string;
// }



// export interface DataType {
//     name:    DesignerTypeEnum;
//     version: number;
//     schema?: IndecentSchema;
// }

// export interface IndecentSchema {
//     title:      string;
//     type:       string;
//     properties: TentacledProperties;
// }

// export interface TentacledProperties {
//     id:  IDClass;
//     url: IDClass;
// }

// export interface IDClass {
//     type:                    string;
//     "x-ntx-summary":         string;
//     title:                   string;
//     properties?:             IDProperties;
//     "x-ntx-dynamic-schema"?: IDXNtxDynamicSchema;
// }

// export interface IDProperties {
//     attachment?:  Attachment;
//     attachments?: Attachments;
// }

// export interface Attachment {
//     type:            CountType;
//     format:          string;
//     "x-ntx-summary": string;
// }

// export interface Attachments {
//     type:            RecordIDSType;
//     items:           AttachmentsItems;
//     "x-ntx-summary": string;
// }

// export interface AttachmentsItems {
//     type:   CountType;
//     format: string;
// }

// export interface Fields {
//     parameter: ParameterEnum;
// }

// export enum ParameterEnum {
//     Fields = "fields",
//     ObjectAPIName = "objectApiName",
// }


// export interface FluffyImage {
//     src: null;
//     css: null;
// }



// export interface FluffyConstraint {
//     constraintType: INWCWorkflowDefinitionDataType;
//     data:           INWCWorkflowActionConstraintData;
// }


// export interface Choice {
//     type: CountType;
//     data: ChoiceData;
// }

// export interface ChoiceData {
//     text:  string;
//     value: string;
// }




// export interface RenderData {
//     variable: DescriptionCVariable;
//     schema:   RenderDataSchema;
//     data:     NQ2CRoleCData;
// }

// export interface RenderDataSchema {
//     type:            RecordIDSType;
//     "x-ntx-control": string;
// }

// export interface PurpleRenderOptions {
//     type:               string;
//     branchMenuCommands: null;
//     hasAddBranchOption: boolean;
//     branchInfo:         BranchInfo;
// }

// export interface BranchInfo {
//     hasMultipleBranches: boolean;
//     hasSingleBranch:     boolean;
//     name:                string;
// }




// export interface Definitions {
//     ErrorResponse:      ErrorResponse;
//     QueryRecordsArray:  QueryRecordsArray;
//     QueryRecordsObject: QueryRecordsObject;
// }

// export interface ErrorResponse {
//     title:      string;
//     type:       string;
//     properties: ErrorResponseProperties;
// }

// export interface ErrorResponseProperties {
//     status: StatusClass;
//     result: PurpleResult;
// }

// export interface PurpleResult {
//     type:       string;
//     properties: ResultProperties;
// }

// export interface ResultProperties {
//     errorMessage: StatusClass;
// }

// export interface QueryRecordsArray {
//     type:            RecordIDSType;
//     items:           StatusClass;
//     "x-ntx-summary": string;
// }

// export interface QueryRecordsObject {
//     title:      string;
//     type:       string;
//     properties: QueryRecordsObjectProperties;
// }

// export interface QueryRecordsObjectProperties {
//     recordIds: QueryRecordsArray;
//     count:     URLClass;
// }

// export interface URLClass {
//     type:            CountType;
//     "x-ntx-summary": string;
// }






// export interface PurpleResponses {
//     "200": DefaultClass;
// }

// export interface DefaultClass {
//     description: string;
// }


// export interface StickyProperties {
//     files: Files;
// }

// export interface Files {
//     "x-ntx-summary": string;
//     "x-ntx-oneOf":   XNtxOneOf[];
// }

// export interface XNtxOneOf {
//     type:    RecordIDSType;
//     format?: string;
//     items?:  AttachmentsItems;
// }

// export interface PurpleXNtxDynamicSchema {
//     operationId:  string;
//     "value-path": string;
//     parameters:   StickyParameters;
// }

// export interface StickyParameters {
//     context:       string;
//     objectApiName: Fields;
// }

// export interface FluffyResponses {
//     "200":   Purple200;
//     default: Default;
// }

// export interface Purple200 {
//     description: string;
//     schema:      IDClass;
// }

// export interface Default {
//     description: DefaultDescription;
//     schema:      DefaultSchema;
// }

// export enum DefaultDescription {
//     Ok = "OK",
//     OperationFailed = "Operation Failed",
// }

// export interface DefaultSchema {
//     $ref: Ref;
// }

// export enum Ref {
//     DefinitionsErrorResponse = "#/definitions/ErrorResponse",
//     DefinitionsQueryRecordsObject = "#/definitions/QueryRecordsObject",
// }

// export interface NtxConnectionIDHTTPSNeuSfxNxcNintexIoAPIV1Fields {
//     get: NTXCONNECTIONIDHTTPSNeuSfxNxcNintexIoAPIV1FieldsGet;
// }

// export interface NTXCONNECTIONIDHTTPSNeuSfxNxcNintexIoAPIV1FieldsGet {
//     tags:               string[];
//     summary:            string;
//     description:        string;
//     operationId:        string;
//     parameters:         PostParameter[];
//     responses:          DeleteResponses;
//     "x-ntx-visibility": string;
//     "x-ntx-security":   XNtxSecurity[];
// }

// export interface DeleteResponses {
//     "200":   DefaultClass;
//     default: Default;
// }

// export interface NTXCONNECTIONIDHTTPSNeuSfxNxcNintexIoAPIV1Objects {
//     get: NTXCONNECTIONIDHTTPSNeuSfxNxcNintexIoAPIV1ObjectsGet;
// }

// export interface NTXCONNECTIONIDHTTPSNeuSfxNxcNintexIoAPIV1ObjectsGet {
//     tags:               string[];
//     summary:            string;
//     description:        string;
//     operationId:        string;
//     produces:           string[];
//     parameters:         PostParameter[];
//     responses:          TentacledResponses;
//     "x-ntx-visibility": string;
//     "x-ntx-security":   XNtxSecurity[];
// }

// export interface TentacledResponses {
//     "200":   Fluffy200;
//     default: Default;
// }

// export interface Fluffy200 {
//     description: DefaultDescription;
//     schema:      HilariousSchema;
// }

// export interface HilariousSchema {
//     type:       string;
//     properties: IndigoProperties;
// }

// export interface IndigoProperties {
//     status: StatusClass;
//     result: FluffyResult;
// }

// export interface FluffyResult {
//     type:  RecordIDSType;
//     items: ResultItems;
// }

// export interface ResultItems {
//     type:       string;
//     properties: ItemsProperties;
// }

// export interface ItemsProperties {
//     label: StatusClass;
//     name:  StatusClass;
// }

// export interface NTXCONNECTIONIDHTTPSNeuSfxNxcNintexIoAPIV1Records {
//     post: NTXCONNECTIONIDHTTPSNeuSfxNxcNintexIoAPIV1RecordsPost;
//     get:  NTXCONNECTIONIDHTTPSNeuSfxNxcNintexIoAPIV1RecordsGet;
// }

// export interface NTXCONNECTIONIDHTTPSNeuSfxNxcNintexIoAPIV1RecordsGet {
//     tags:             string[];
//     summary:          string;
//     description:      string;
//     operationId:      string;
//     parameters:       INWCWorkflowActionXtensionParameter[];
//     responses:        StickyResponses;
//     "x-ntx-security": XNtxSecurity[];
// }





// export interface ParameterXNtxQueryBuilder {
//     schema:     XNtxOrderbyBuilderSchema;
//     format:     string;
//     exclusions: Exclusions;
// }

// export interface StickyResponses {
//     "200":   Default;
//     default: Default;
// }

// export interface NTXCONNECTIONIDHTTPSNeuSfxNxcNintexIoAPIV1RecordsPost {
//     tags:             string[];
//     summary:          string;
//     description:      string;
//     operationId:      string;
//     parameters:       PostParameter[];
//     responses:        IndigoResponses;
//     "x-ntx-security": XNtxSecurity[];
// }

// export interface IndigoResponses {
//     "201":   Purple201;
//     default: Default;
// }

// export interface Purple201 {
//     description: string;
//     schema:      AmbitiousSchema;
// }

// export interface AmbitiousSchema {
//     title:      string;
//     type:       string;
//     properties: IndecentProperties;
// }

// export interface IndecentProperties {
//     id:  URLClass;
//     url: URLClass;
// }

// export interface NTXCONNECTIONIDHTTPSNeuSfxNxcNintexIoAPIV1RecordsRecordID {
//     patch:  Delete;
//     delete: Delete;
//     get:    NTXCONNECTIONIDHTTPSNeuSfxNxcNintexIoAPIV1RecordsRecordIDGet;
// }

// export interface Delete {
//     tags:             string[];
//     summary:          string;
//     description:      string;
//     operationId:      string;
//     parameters:       PostParameter[];
//     responses:        DeleteResponses;
//     "x-ntx-security": XNtxSecurity[];
// }

// export interface NTXCONNECTIONIDHTTPSNeuSfxNxcNintexIoAPIV1RecordsRecordIDGet {
//     tags:             string[];
//     summary:          string;
//     description:      string;
//     operationId:      string;
//     parameters:       AmbitiousParameter[];
//     responses:        FluffyResponses;
//     "x-ntx-security": XNtxSecurity[];
// }



// export interface FluffyItems {
//     type:                   CountType;
//     "x-ntx-dynamic-values": FluffyXNtxDynamicValues;
// }

// export interface FluffyXNtxDynamicValues {
//     "value-path":       string;
//     "value-title":      string;
//     "value-collection": string;
//     operationId:        string;
//     parameters:         StickyParameters;
// }

// export interface NTXCONNECTIONIDHTTPSNeuSfxNxcNintexIoAPIV1RecordsRecordIDAttachments {
//     get:  NTXCONNECTIONIDHTTPSNeuSfxNxcNintexIoAPIV1AttachmentRecordIDGet;
//     post: NTXCONNECTIONIDHTTPSNeuSfxNxcNintexIoAPIV1RecordsRecordIDAttachmentsPost;
// }

// export interface NTXCONNECTIONIDHTTPSNeuSfxNxcNintexIoAPIV1RecordsRecordIDAttachmentsPost {
//     tags:             string[];
//     summary:          string;
//     description:      string;
//     operationId:      string;
//     parameters:       PostParameter[];
//     responses:        IndecentResponses;
//     "x-ntx-security": XNtxSecurity[];
// }

// export interface IndecentResponses {
//     "201":   Fluffy201;
//     default: DefaultClass;
// }

// export interface Fluffy201 {
//     description: DefaultDescription;
//     schema:      CunningSchema;
// }

// export interface CunningSchema {
//     title:      string;
//     type:       string;
//     properties: HilariousProperties;
// }

// export interface HilariousProperties {
//     attachmentId:  CurrentItemClass;
//     attachmentIds: IDS;
// }

// export interface SecurityDefinitions {
//     oauth2: SecurityDefinitionsOauth2;
// }

// export interface SecurityDefinitionsOauth2 {
//     type:             string;
//     flow:             string;
//     authorizationUrl: string;
//     tokenUrl:         string;
//     scopes:           Scopes;
// }

// export interface Scopes {
//     api:           string;
//     refresh_token: string;
// }


// export interface Author {
//     id:             string;
//     email:          string;
//     externalId:     string;
//     firstName:      string;
//     lastName:       string;
//     name:           string;
//     nintexTenantId: string;
//     roles:          string[];
//     permissions:    string[];
//     tenantId:       string;
//     tenantName:     string;
//     displayName:    string;
// }






