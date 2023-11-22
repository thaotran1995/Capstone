import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { getUserId } from '../../utils';
import {getBlogs} from "../../../helpers/businessLogic/blogs";

// TODO: Get all TODO items for a current user
export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
      // Write your code here
      const userId = await getUserId(event)
      const blogs = await getBlogs(userId)

      return {
          statusCode: 200,
          body: JSON.stringify({
              items: blogs
          })
      }
  }
)

handler.use(
  cors({
    credentials: true
  })
)
