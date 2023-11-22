import { apiEndpoint } from '../config'
import { Todo } from '../types/Todo';
import { CreateTodoRequest } from '../types/CreateTodoRequest';
import Axios from 'axios'
import { UpdateTodoRequest } from '../types/UpdateTodoRequest';
import { CreateBlogRequest } from '../types/CreateBlogRequest'
import { UpdateBlogRequest } from '../types/UpdateBlogRequest'
import { Blog } from '../types/Blog'

export async function getBlogs(idToken: string): Promise<Blog[]> {
  console.log('Fetching blogs')

  const response = await Axios.get(`${apiEndpoint}/blogs`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
  })
  console.log('Blogs:', response.data.items)
  return response.data.items
}

export async function getBlog(idToken: string,
                              blogId: string) {
  const response = await Axios.get(`${apiEndpoint}/blogs/${blogId}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
  })

  return response.data.item;
}
export async function createBlog(
  idToken: string,
  newBlog: CreateBlogRequest
): Promise<Blog> {
  const response = await Axios.post(`${apiEndpoint}/blogs`,  JSON.stringify(newBlog), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.item
}

export async function patchBlog(
  idToken: string,
  blogId: string,
  updatedBlog: UpdateBlogRequest
): Promise<void> {
  await Axios.patch(`${apiEndpoint}/blogs/${blogId}`, JSON.stringify(updatedBlog), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function deleteBlog(
  idToken: string,
  blogId: string
): Promise<void> {
  await Axios.delete(`${apiEndpoint}/blogs/${blogId}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function getUploadUrl(
  idToken: string,
  blogId: string
): Promise<string> {
  const response = await Axios.post(`${apiEndpoint}/blogs/${blogId}/attachment`, '', {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.uploadUrl
}

export async function uploadFile(uploadUrl: string, file: Buffer): Promise<void> {
  await Axios.put(uploadUrl, file)
}
