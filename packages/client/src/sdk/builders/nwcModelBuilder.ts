import { tag, workflowSource } from "../../nwc";
import { Workflow } from "../models/workflow";


export class NwcModelBuilder {
    public static tag = (tag: string): tag => ({ name: tag });

    public static workflowSource = (worklflow: Workflow): workflowSource => ({
        author: worklflow.source.author,
        created: worklflow.source.created,
        creator: worklflow.source.creator,
        datasources: worklflow.source.datasources,
        engineName: worklflow.engine,
        eventConfiguration: worklflow.source.eventConfiguration,
        eventType: worklflow.eventType,
        hasPermissions: worklflow.source.hasPermissions,
        isActive: worklflow.isActive,
        isDeleted: worklflow.source.isDeleted,
        isLatest: worklflow.source.isLatest,
        isPublished: worklflow.isPublished,
        lastEdited: worklflow.source.lastEdited,
        lastModified: worklflow.source.lastModified,
        lastPublished: worklflow.source.lastPublished,
        latestId: worklflow.source.latestId,
        permissions: worklflow.source.permissions,
        publishAuthor: worklflow.source.publishAuthor,
        publishRequestedBy: worklflow.source.publishRequestedBy,
        publishedId: worklflow.publishedId,
        startEvents: worklflow.source.startEvents,
        status: worklflow.status,
        tags: worklflow.tags.map((tag) => NwcModelBuilder.tag(tag)),
        version: worklflow.version,
        workflowDescription: worklflow.description,
        workflowDefinition: "",
        workflowDesignVersion: worklflow.designVersion,
        workflowId: worklflow.id,
        workflowName: worklflow.name,
        workflowType: worklflow.type,
        workflowVersionComments: worklflow.comments
    });
}
