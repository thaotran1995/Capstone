import dateFormat from 'dateformat'
import { History } from 'history'
import update from 'immutability-helper'
import * as React from 'react'
import {
  Button,
  Modal,
  Divider,
  Grid,
  Header,
  Icon,
  Input,
  Image,
  Loader, TextArea, Form
} from 'semantic-ui-react'
import moment from "moment"

import { createBlog, deleteBlog, getBlogs, patchBlog } from '../api/blogs-api'
import Auth from '../auth/Auth'
import { Blog } from '../types/Blog'
import { Link } from 'react-router-dom'

interface BlogsProps {
  auth: Auth
  history: History
}

interface BlogsState {
  blogs: Blog[]
  newBlogTitle: string
  newBlogContent: string
  loadingBlogs: boolean,
  open: boolean,
}

export class Blogs extends React.PureComponent<BlogsProps, BlogsState> {
  state: BlogsState = {
    blogs: [],
    newBlogTitle: '',
    newBlogContent: '',
    loadingBlogs: true,
    open: false,
  }

  subscribed = true;

  handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newBlogTitle: event.target.value })
  }
  onEditButtonClick = (blogId: string) => {
    this.props.history.push(`/blogs/${blogId}/edit`)
  }

  onBlogCreate = async (event: React.ChangeEvent<HTMLButtonElement>) => {
    try {
      const newBlog = await createBlog(this.props.auth.getIdToken(), {
        title: this.state.newBlogTitle,
        content: this.state.newBlogContent
      })
      this.setState({
        blogs: [...this.state.blogs, newBlog],
        newBlogTitle: '',
        newBlogContent: '',
        open: false
      })

      console.log(newBlog)
    } catch {
      alert('Blog creation failed')
    }
  }

  onBlogDelete = async (blogId: string) => {
    try {
      await deleteBlog(this.props.auth.getIdToken(), blogId)
      this.setState({
        blogs: this.state.blogs.filter(blog => blog.blogId !== blogId)
      })
    } catch {
      alert('Todo deletion failed')
    }
  }

  /*
  onTodoCheck = async (pos: number) => {
    try {
      const todo = this.state.todos[pos]
      await patchTodo(this.props.auth.getIdToken(), todo.todoId, {
        name: todo.name,
        dueDate: todo.dueDate,
        done: !todo.done
      })
      this.setState({
        todos: update(this.state.todos, {
          [pos]: { done: { $set: !todo.done } }
        })
      })
    } catch {
      alert('Todo deletion failed')
    }
  }
  */

  async componentDidMount() {
    try {
      const blogs = await getBlogs(this.props.auth.getIdToken())
      this.setState({
        blogs,
        loadingBlogs: false
      })
    } catch (e) {
      alert(`Failed to fetch todos: ${(e as Error).message}`)
    }
  }

  componentWillUnmount() {
    this.subscribed = false;
  }

  render() {
    return (
      <div>
        <Header as="h1">BLOGS</Header>

        {this.renderCreateBlogInput()}

        {this.renderBlogs()}
      </div>
    )
  }

  renderCreateBlogInput() {
    return (
      <Grid.Row>
        <Grid.Column width={16}>
        </Grid.Column>
        <Grid.Column width={16}>
          <Divider />
        </Grid.Column>
        <Modal onClose={() => this.setState({open: false})}
               onOpen={() => this.setState({open: true})}
               open={this.state.open}
               trigger={<Button>Post a new blog</Button>}
        >
          <Modal.Header>Post a new blog</Modal.Header>
          <Modal.Content>
            <Modal.Description>
              <Header>A new blog</Header>
              <Form.Field>
                <label>Title</label>
                <Input fluid
                       style={{marginBottom: 5}}
                       onChange={this.handleTitleChange}
                       placeholder="Enter a new blog title..."
                />

              </Form.Field>
              <div className="ui form">
                <div className="field">
                  <label>Content</label>
                  <textarea onChange={(e) => this.setState({newBlogContent: e.target.value})}></textarea>
                </div>
              </div>
            </Modal.Description>
          </Modal.Content>
          <Modal.Actions>
            <Button color="red" onClick={() => this.setState({open: false})}>Cancel</Button>
            <Button color="green" onClick={(event: any) => this.onBlogCreate(event)}>Post</Button>
          </Modal.Actions>
        </Modal>
      </Grid.Row>
    )
  }

  renderBlogs() {
    if (this.state.loadingBlogs) {
      return this.renderLoading()
    }

    return this.renderTodosList()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading BLOGS
        </Loader>
      </Grid.Row>
    )
  }

  renderTodosList() {
    return (
      <Grid padded>
        {this.state.blogs.map((blog, pos) => {
          return (
            <Grid.Row key={blog.blogId}>
              <Grid.Column width={1} verticalAlign="middle">
                <Link to={"/blogs/" + blog.blogId}>{blog.title}</Link>
              </Grid.Column>
              <Grid.Column width={10} verticalAlign="middle">
                {blog.content}
              </Grid.Column>
              <Grid.Column width={3} floated="right">
                {moment(blog.created_at).format("DD/MM/YYYY")}
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="blue"
                  onClick={() => this.onEditButtonClick(blog.blogId)}
                >
                  <Icon name="pencil" />
                </Button>
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="red"
                  onClick={() => this.onBlogDelete(blog.blogId)}
                >
                  <Icon name="delete" />
                </Button>
              </Grid.Column>
              {blog.attachmentUrl && (
                <Image src={blog.attachmentUrl} size="small" wrapped />
              )}
              <Grid.Column width={16}>
                <Divider />
              </Grid.Column>
            </Grid.Row>
          )
        })}
      </Grid>
    )
  }

  calculateDueDate(): string {
    const date = new Date()
    date.setDate(date.getDate() + 7)

    return dateFormat(date, 'yyyy-mm-dd') as string
  }
}
