import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { getUserId } from '../../utils'
import {deleteBlog} from "../../../helpers/businessLogic/blogs";

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
      const blogId = event.pathParameters.blogId
      // TODO: Remove a TODO item by id
      const userId = getUserId(event);

      await deleteBlog(userId, blogId)
    
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
