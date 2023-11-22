import * as AWS from 'aws-sdk'
import {DocumentClient} from "aws-sdk/clients/dynamodb"
import * as winston from "winston"

import {createLogger} from "../../utils/logger"
import {BlogItem} from "../../models/Blogs/BlogItem"
import {BlogUpdate} from "../../models/Blogs/BlogUpdate"
import {AttachmentUtils} from "../fileStorage/attachmentUtils";

const AWSXRay = require('aws-xray-sdk')

const XAWS = AWSXRay.captureAWS(AWS)

export class BlogsAccess {
    private readonly blogsTable: string = process.env.BLOGS_TABLE
    private readonly logger: winston.Logger = createLogger("Blogs Data access layer")
    private readonly blogsCreatedAtIndex: string = process.env.BLOGS_CREATED_AT_INDEX
    private readonly bucketName: string = process.env.ATTACHMENT_S3_BUCKET;
    private readonly attachmentUtil: AttachmentUtils = new AttachmentUtils();

    private blogClient: DocumentClient

    constructor() {
        this.blogClient = new XAWS.DynamoDB.DocumentClient()
    }

    public async createBlog(userId: string, blog: BlogItem): Promise<BlogItem> {
        this.logger.info("Blogs Data access layer for creating a new blog: initiate")

        if (userId) {
            this.logger.info("Blogs Data access layer for creating a new blog: ready to create")

            await this.blogClient.put({
                TableName: this.blogsTable,
                Item: blog
            }).promise()

            return blog
        } else {
            this.logger.error("Unauthenticated access")
        }
    }

    public async uploadImage(userId: string, blogId: string, attachmentId: string): Promise<string> {
        const attachmentUrl = `https://${this.bucketName}.s3.amazonaws.com/${attachmentId}`;

        if (userId) {
            await this.blogClient.update({
                TableName: this.blogsTable,
                Key: {
                    blogId, userId
                },
                UpdateExpression: "set #attachmentUrl = :attachmentUrl",
                ExpressionAttributeNames: {
                    "#attachmentUrl": "attachmentUrl"
                },
                ExpressionAttributeValues: {
                    ":attachmentUrl": attachmentUrl
                }
            }).promise();

            this.logger.info(`Url ${await this.attachmentUtil.createAttachmentPresignedUrl(attachmentId)}`);

            return await this.attachmentUtil.createAttachmentPresignedUrl(attachmentId);
        } else {
            this.logger.error("Unauthenticated operation");
        }

        return await this.attachmentUtil.createAttachmentPresignedUrl(attachmentId);
    }

    public async getBlogs(userId: string): Promise<BlogItem[]> {
        this.logger.info("Blogs Data access layer for getting all blogs: initiate")

        if (userId) {
            this.logger.info("Blogs Data access layer for getting all blogs: ready to get")

            const result = await this.blogClient.query({
                TableName: this.blogsTable,
                IndexName: this.blogsCreatedAtIndex,
                KeyConditionExpression: "#userId = :userId",
                ExpressionAttributeNames: {
                    "#userId": "userId"
                },
                ExpressionAttributeValues: {
                    ":userId": userId
                },
            }).promise();

            this.logger.info("Getting all blogs successfully: ", result.Items)

            return result.Items as BlogItem[]
        } else {
            this.logger.error("Unauthenticated access")
        }
    }

    public async getBlog(userId: string, blogId: string): Promise<BlogItem> {
        if (userId) {
            this.logger.info("Blogs Data access layer for getting all blogs: ready to get")

            const result = await this.blogClient.get({
                TableName: this.blogsTable,
                Key: {userId, blogId}
            }).promise()

            this.logger.info("Getting all blogs successfully: ", result.Item)

            return result.Item as BlogItem
        } else {
            this.logger.error("Unauthenticated access")
        }
    }

    public async updateBlog(userId: string, blogId: string, blog: BlogUpdate) {
        if (userId) {
            this.logger.info("Blogs Data access layer for updating a blog: ready to update")

            await this.blogClient.update({
                TableName: this.blogsTable,
                Key: {userId, blogId},
                UpdateExpression: "set #title = :title, #content = :content, #modified_at = :modified_at",
                ExpressionAttributeNames: {
                    "#title": "title",
                    "#content": "content",
                    "#modified_at": "modified_at"
                },
                ExpressionAttributeValues: {
                    ":title": blog.title,
                    ":content": blog.content,
                    ":modified_at": blog.modified_at
                }
            }).promise()
        } else {
            this.logger.error("Unauthenticated access")
        }
    }

    public async deleteBlog(userId: string, blogId: string) {
        if (userId) {
            this.logger.info("Blogs Data access layer for delete a blog: ready to delete")

            await this.blogClient.delete({
                TableName: this.blogsTable,
                Key: {userId, blogId}
            }).promise()
                .then(() => this.logger.info(`Blog ${blogId} is deleted successfully`))
                .catch((error) => this.logger.info(`Blog ${blogId} is deleted with error: ${error}`))

        } else {
            this.logger.error("Unauthenticated access")
        }
    }
}