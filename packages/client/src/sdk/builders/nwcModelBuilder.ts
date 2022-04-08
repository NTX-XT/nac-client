import { tag, workflowSource } from "../../nwc";
import { Tag } from "../models/tag";
import { Workflow } from "../models/workflow";


export class NwcModelBuilder {
    public static tag = (tag: Tag): tag => (
        {
            name: tag.name,
            count: tag.count,
            colorIndex: tag.colorIndex
        }
    );

    public static workflowSource = (worklflow: Workflow): workflowSource => ({
        author: worklflow.originalSource.author,
        created: worklflow.originalSource.created,
        creator: worklflow.originalSource.creator,
        datasources: worklflow.originalSource.datasources,
        engineName: worklflow.engine!,
        eventConfiguration: worklflow.originalSource.eventConfiguration,
        eventType: worklflow.eventType,
        hasPermissions: worklflow.originalSource.hasPermissions,
        isActive: worklflow.isActive,
        isDeleted: worklflow.originalSource.isDeleted,
        isLatest: worklflow.originalSource.isLatest,
        isPublished: worklflow.isPublished,
        lastEdited: worklflow.originalSource.lastEdited,
        lastModified: worklflow.originalSource.lastModified,
        lastPublished: worklflow.originalSource.lastPublished,
        latestId: worklflow.originalSource.latestId,
        permissions: worklflow.originalSource.permissions,
        publishAuthor: worklflow.originalSource.publishAuthor,
        publishRequestedBy: worklflow.originalSource.publishRequestedBy,
        publishedId: worklflow.publishedId,
        startEvents: worklflow.originalSource.startEvents,
        status: worklflow.status!,
        tags: worklflow.tags.map((tag) => NwcModelBuilder.tag(tag)),
        version: worklflow.version!,
        workflowDescription: worklflow.description,
        workflowDefinition: "",
        workflowDesignVersion: worklflow.designVersion,
        workflowId: worklflow.id,
        workflowName: worklflow.name,
        workflowType: worklflow.type!,
        workflowVersionComments: worklflow.comments
    });
}
