import {APIGatewayProxyEvent, APIGatewayProxyResult} from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import {cors, validator} from 'middy/middlewares'
import {transpileSchema} from '@middy/validator/transpile'
import {getUserId} from '../../utils';
import {CreateBlogRequest} from "../../../requests/Blogs/CreateBlogRequest";
import {createBlog} from "../../../helpers/businessLogic/blogs";

export const handler = middy(
    async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
        const newBlog: CreateBlogRequest = JSON.parse(event.body)
        // TODO: Implement creating a new TODO item
        const userId = getUserId(event)
        const result = await createBlog(userId, newBlog)

        return {
            statusCode: 200,
            body: JSON.stringify({
                item: result
            }),
        }
    }
)

const schema = {
    type: 'object',
    required: ['body'],
    properties: {
        body: {
            type: 'object',
            properties: {
                title: {
                    type: 'string',
                    minLength: 1
                },
                content: {
                    type: 'string',
                    minLength: 1
                }
            },
            required: [
                'title',
                'content'
            ]
        }
    }
}

handler
    .use(
        validator({
            eventSchema: transpileSchema(schema)
        })
    )
    .use(
        cors({
            credentials: true
        })
    )
