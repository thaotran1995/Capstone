import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { getUserId } from '../../utils'
import {UpdateBlogRequest} from "../../../requests/Blogs/UpdateBlogRequest";
import {updateBlog} from "../../../helpers/businessLogic/blogs";

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
      const blogId = event.pathParameters.blogId
      const updatedTodo: UpdateBlogRequest = JSON.parse(event.body)
      // TODO: Update a TODO item with the provided id using values in the "updatedTodo" object
      const userId = getUserId(event);

      await updateBlog(userId, blogId, updatedTodo);

      return {
          statusCode: 200,
          body: JSON.stringify({})
      }
  }
)

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
