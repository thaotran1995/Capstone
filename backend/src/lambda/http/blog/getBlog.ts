import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { getUserId } from '../../utils';
import {getBlog} from "../../../helpers/businessLogic/blogs";

// TODO: Get all TODO items for a current user
export const handler = middy(
    async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
        // Write your code here
        const userId = await getUserId(event)
        const blogId = event.pathParameters.blogId
        const blog = await getBlog(userId, blogId)

        return {
            statusCode: 200,
            body: JSON.stringify({
                item: blog
            })
        }
    }
)

handler.use(
    cors({
        credentials: true
    })
)
