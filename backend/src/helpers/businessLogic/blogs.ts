import {v4} from "uuid"

import {AttachmentUtils} from "../fileStorage/attachmentUtils"
import {BlogsAccess} from "../dataLayer/BlogsAccess"
import {createLogger} from "../../utils/logger"
import {CreateBlogRequest} from "../../requests/Blogs/CreateBlogRequest"
import {BlogItem} from "../../models/Blogs/BlogItem";
import {UpdateBlogRequest} from "../../requests/Blogs/UpdateBlogRequest";

const blogAccess = new BlogsAccess()
const logger = createLogger("Business layer for blogs application")
const attachmentUtil = new AttachmentUtils()

export const createBlog = async (userId: string, request: CreateBlogRequest) => {
    const blogId = v4()
    logger.info("Business layer, create a new blog")

    logger.info(request)

  return await blogAccess.createBlog(userId, {
      userId: userId,
      blogId: blogId,
      title: request.title,
      content: request.content,
      created_at: new Date().toISOString(),
      modified_at: null,
      attachmentUrl: null,
  })
}

export const uploadImage = async (userId: string, blogId: string) => {
    const attachmentId = v4();
    return await blogAccess.uploadImage(userId, blogId, attachmentId)
}

export const getBlogs = async (userId: string): Promise<BlogItem[]> => {
    return await blogAccess.getBlogs(userId)
}

export const getBlog = async (userId: string, blogId: string): Promise<BlogItem> => {
    return await blogAccess.getBlog(userId, blogId);
}


export const updateBlog = async (userId: string, blogId: string, request: UpdateBlogRequest) => {
    await blogAccess.updateBlog(userId, blogId, {
        title: request.title,
        content: request.content,
        modified_at: new Date().toISOString(),
    })
}

export const deleteBlog = async (userId: string, blogId: string) => {
    await attachmentUtil.deleteAttachmentPresignedUrl(blogId)
    await blogAccess.deleteBlog(userId, blogId)
}