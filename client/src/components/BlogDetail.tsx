import { useHistory, useParams } from 'react-router-dom'
import React, { useEffect, useState } from 'react'

import Auth from '../auth/Auth'
import { Blog } from '../types/Blog'
import { Button, Form, Grid, Header, Icon, Image, Input, Loader, Modal } from 'semantic-ui-react'
import axios from 'axios'
import { deleteBlog, getBlog, getUploadUrl, patchBlog, uploadFile } from '../api/blogs-api'
import moment from 'moment'
import { UpdateBlogRequest } from '../types/UpdateBlogRequest'
import { UploadImage } from './UploadImage'

interface BlogProps {
  auth: Auth;
  match: {
    params: {
      blogId: string
    }
  }
}

interface FileState {
  file: any;
  uploadState: any
}

const BlogDetail: React.FC<BlogProps> = ({auth, match}) => {
  const history = useHistory();
  const [blog, setBlog] = useState<Blog>();
  const [open, setOpen] = useState<boolean>(false);
  const [openUpload, setOpenUpload] = useState(false);
  const [newBlog, setNewBlog] = useState<UpdateBlogRequest>({
    title: "",
    content: ""
  })
  const [uploadState, setFile] = useState<FileState>({
    file: undefined,
    uploadState: 0
  });

  useEffect(() => {
    let isSubscribed = true;

    getBlog(auth.getIdToken(), match.params.blogId).then(data => {
      setBlog(data);
    });

    return () => {
      isSubscribed = false
    }
  }, [])

  const handleEditBlog = async () => {
    try {
      await patchBlog(auth.getIdToken(), match.params.blogId, newBlog);
    } catch (e) {
      alert('Blog update failed')
    } finally {
      history.push("/")
    }
  }

  const handleDeleteBlog = async (blogId: string) => {
    await deleteBlog(auth.getIdToken(), blogId)
    history.push("/")
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    setFile({
      ...uploadState,
      file: files[0]
    })
  }

  const handleUploadFile = async (event: React.SyntheticEvent) => {
    event.preventDefault()

    try {
      if (!uploadState.file) {
        alert('File should be selected')
        return
      }

      setFile({...uploadState, uploadState: 1})
      const uploadUrl = await getUploadUrl(auth.getIdToken(), match.params.blogId)
      setFile({...uploadState, uploadState: 2})
      await uploadFile(uploadUrl, uploadState.file)
    } catch (e) {
      alert('Could not upload a file: ' + (e as Error).message)
    } finally {
      setFile({...uploadState, uploadState: 0})
      history.push("/")
    }
  }

  return (
    <div>
      {(blog != null) ? (
        <>
          <h1>{blog?.title}</h1>
          <p>Posted at: {moment(blog?.created_at).format("DD/MM/YYYY")}</p>
          <p>{blog?.modified_at && `Modified at: ${moment(blog.modified_at).format("DD/MM/YYYY")}`}</p>
          <Grid>
            <Grid.Column width={4}>
              {blog?.attachmentUrl && <Image src={blog.attachmentUrl} />}
            </Grid.Column>
            <Grid.Column width={9}>
              {blog?.content}
            </Grid.Column>
            <Grid.Column width={3}>
              <Modal onOpen={() => setOpen(true)}
                     onClose={() => setOpen(false)}
                     open={open}
                     trigger={<Button icon color="blue"><Icon name="pencil" /></Button>}
              >
                <Modal.Header>Post a new blog</Modal.Header>
                <Modal.Content>
                  <Modal.Description>
                    <Header>A new blog</Header>
                    <Form.Field>
                      <label>Title</label>
                      <Input fluid
                             style={{marginBottom: 5}}
                             value={newBlog.title}
                             onChange={(e) => setNewBlog({...newBlog, title: e.target.value})}
                             placeholder="Enter a new blog title..."
                      />

                    </Form.Field>
                    <div className="ui form">
                      <div className="field">
                        <label>Content</label>
                        <textarea value={newBlog.content} onChange={(e) => setNewBlog({...newBlog, content: e.target.value})} >{blog.content}</textarea>
                      </div>
                    </div>
                  </Modal.Description>
                </Modal.Content>
                <Modal.Actions>
                  <Button color="red" onClick={() => setOpen(false)}>Cancel</Button>
                  <Button color="green" onClick={() => handleEditBlog()}>Post</Button>
                </Modal.Actions>
              </Modal>
              <Button
                icon
                color="red"
                onClick={() => handleDeleteBlog(blog.blogId)}
              >
                <Icon name="delete" />
              </Button>
              <Modal onOpen={() => setOpenUpload(true)}
                     onClose={() => setOpenUpload(false)}
                     open={openUpload}
                     trigger={<Button>Upload</Button>}
              >
                <Modal.Header>Upload new file</Modal.Header>
                <Modal.Content>
                  <Form>
                    <Form.Field>
                      <label>File</label>
                      <input
                        type="file"
                        accept="image/*"
                        placeholder="Image to upload"
                        onChange={handleFileChange}
                      />
                    </Form.Field>
                  </Form>
                </Modal.Content>
                <Modal.Actions>
                  <Button color="red" onClick={() => setOpenUpload(false)}>Cancel</Button>
                  <Button color="green" onClick={handleUploadFile}>Upload</Button>
                </Modal.Actions>
              </Modal>
            </Grid.Column>
          </Grid>
        </>
        ) : (
        <>
          <Grid.Row>
            <Loader indeterminate active inline="centered">
              Loading BLOGS
            </Loader>
          </Grid.Row>
        </>
        )}
    </div>
  );
}

export default BlogDetail;
