import 'source-map-support/register'

import {APIGatewayProxyEvent, APIGatewayProxyResult} from 'aws-lambda'
import * as middy from 'middy'
import {cors, httpErrorHandler, validator} from 'middy/middlewares'
import {transpileSchema} from '@middy/validator/transpile'

import {getUserId} from '../../utils'
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

const schema = {
    type: 'object',
    required: ['pathParameters'],
    properties: {
        pathParameters: {
            type: 'object',
            required: ['blogId'],
            properties: {
                blogId: {
                    type: 'string',
                    minLength: 1
                }
            }
        }
    }
}

handler
    .use(
        validator({
            eventSchema: transpileSchema(schema)
        })
    )
    .use(httpErrorHandler())
    .use(
        cors({
            credentials: true
        })
    )
