import {BlogItem} from "./BlogItem"
import { Key } from "aws-sdk/clients/dynamodb"

export interface PagedBlogs {
    items: BlogItem[],
    key: Key

}