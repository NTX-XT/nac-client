/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { actionConstraint } from './actionConstraint';
import type { property } from './property';

export type actionConfiguration = {
	id: string;
	name: string;
	originalName: string;
	subHeader?: string;
	image: {
svgIcon?: string;
svgLight?: boolean;
toolboxSrc: string;
canvasSrc: string;
configPanelSrc: string;
};
	serverInfo: {
className: string;
};
	properties: Array<property>;
	stateConfiguration?: any;
	isDisabled: boolean;
	operationId?: string;
	xtensionId?: string;
	xtension?: {
operationId: string;
id: string;
isAsyncAction: boolean;
engineVersion: number;
};
	actionConstraint?: actionConstraint;
	constraints: Array<actionConstraint>;
	isHidden?: boolean;
	isHiddenInToolbox?: boolean;
	isPublishable?: boolean;
	isCollapsed?: boolean;
};
