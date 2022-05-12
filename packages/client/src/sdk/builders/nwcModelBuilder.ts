import { permissionItem, tag, workflow } from "../../nwc";
import { Tag } from "../models/tag";
import { Workflow } from "../models/workflow";
import { WorkflowPermissionItem } from "../models/workflowPermissionItem";


export class NwcModelBuilder {
    public static tag = (tag: Tag): tag => (
        {
            name: tag.name,
            count: tag.count,
            colorIndex: tag.colorIndex
        }
    );

    public static permissionItem = (permission: WorkflowPermissionItem): permissionItem => ({
        id: permission.id,
        name: permission.name,
        type: permission.type
    })

    // public static workflowSource = (worklflow: Workflow): workflow => ({
    //     author: worklflow._nwcObject.author,
    //     created: worklflow._nwcObject.created,
    //     creator: worklflow._nwcObject.creator,
    //     datasources: worklflow._nwcObject.datasources,
    //     engineName: worklflow.engine!,
    //     eventConfiguration: worklflow._nwcObject.eventConfiguration,
    //     eventType: worklflow.eventType,
    //     hasPermissions: worklflow._nwcObject.hasPermissions,
    //     isActive: worklflow.isActive,
    //     isDeleted: worklflow._nwcObject.isDeleted,
    //     isLatest: worklflow._nwcObject.isLatest,
    //     isPublished: worklflow.isPublished,
    //     lastEdited: worklflow._nwcObject.lastEdited,
    //     lastModified: worklflow._nwcObject.lastModified,
    //     lastPublished: worklflow._nwcObject.lastPublished,
    //     latestId: worklflow._nwcObject.latestId,
    //     permissions: worklflow._nwcObject.permissions,
    //     publishAuthor: worklflow._nwcObject.publishAuthor,
    //     publishRequestedBy: worklflow._nwcObject.publishRequestedBy,
    //     publishedId: worklflow.publishedId,
    //     startEvents: worklflow._nwcObject.startEvents,
    //     status: worklflow.status!,
    //     tags: worklflow.tags.map((tag) => NwcModelBuilder.tag(tag)),
    //     version: worklflow.version!,
    //     workflowDescription: worklflow.description,
    //     workflowDefinition: "",
    //     workflowDesignVersion: worklflow.designVersion,
    //     workflowId: worklflow.id,
    //     workflowName: worklflow.name,
    //     workflowType: worklflow.type!,
    //     workflowVersionComments: worklflow.comments
    // });
}
