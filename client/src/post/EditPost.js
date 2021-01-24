import React, { Component } from 'react'
import { getPostById, updatePost } from './apiPost'
import { isAuthenticated } from '../auth'
import { Redirect } from 'react-router-dom'

class EditPost extends Component {
  constructor() {
    super()
    this.state = {
      id: '',
      title: '',
      body: '',
      error: false,
      fileSize: 0,
      loading: false,
      success: false,
    }
  }

  init = (postId) => {
    this.postData = new FormData()
    getPostById(postId).then((data) => {
      if (data.error) {
        this.setState({ error: true })
      } else {
        this.setState({
          id: data._id,
          title: data.title,
          body: data.body,
          error: false,
        })
      }
    })
  }

  componentDidMount() {
    const postId = this.props.match.params.postId
    this.init(postId)
  }

  isValid = () => {
    const { title, body, fileSize } = this.state

    if (fileSize > 100000) {
      this.setState({ error: 'File size should be less than 100kb' })
      return false
    }
    if (title.length === 0 || body.length === 0) {
      this.setState({ error: 'All fileds are required' })
      return false
    }

    return true
  }
  handleChange = (name) => (e) => {
    this.setState({ error: false })
    const value = name === 'photo' ? e.target.files[0] : e.target.value

    const fileSize = name === 'photo' ? e.target.files[0].size : 0
    this.postData.set(name, value)
    this.setState({ [name]: value, fileSize })
  }

  handleSubmit = (e) => {
    e.preventDefault()
    if (this.isValid()) {
      this.setState({ loading: true })
      const postId = this.state.id
      const token = isAuthenticated().token
      updatePost(postId, token, this.postData).then((data) => {
        if (data.error) {
          this.setState({ error: data.error })
        } else {
          this.setState({
            loading: false,
            title: '',
            photo: '',
            body: '',
            photo: '',
            error: false,
            success: true,
          })
        }
      })
    }
  }

  render() {
    const { title, body, success } = this.state
    if (success) {
      return <Redirect to={`/users/${isAuthenticated().user._id}`} />
    }

    return (
      <div className='container'>
        <h2 className='mt-5 mb-5'>{title}</h2>
        <form>
          <div className='form-group'>
            <label className='text-muted'>Post Photo</label>
            <input
              onChange={this.handleChange('photo')}
              type='file'
              accept='image/*'
              className='form-control'
            />
          </div>
          <div className='form-group'>
            <label className='text-muted'>Title</label>
            <input
              onChange={this.handleChange('title')}
              type='text'
              className='form-control'
              value={title}
              autoComplete='off'
            />
          </div>
          <div className='form-group'>
            <label className='text-muted'>Body</label>
            <textarea
              onChange={this.handleChange('body')}
              type='text'
              className='form-control'
              value={body}
              autoComplete='off'
            />
          </div>

          <button
            onClick={this.handleSubmit}
            className='btn btn-raised btn-primary'>
            Update Post
          </button>
        </form>
      </div>
    )
  }
}

export default EditPost
