import React, { Component } from 'react'
import { isAuthenticated } from '../auth'
import { createPost } from './apiPost'
import { Redirect } from 'react-router-dom'

class CreatePost extends Component {
  constructor() {
    super()
    this.state = {
      title: '',
      body: '',
      photo: '',
      error: '',
      user: {},
      fileSize: 0,
      loading: false,
      redirectToProfile: false,
    }
  }

  componentDidMount() {
    this.postData = new FormData()
    this.setState({ user: isAuthenticated().user })
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
    this.setState({ error: '' })
    const value = name === 'photo' ? e.target.files[0] : e.target.value

    const fileSize = name === 'photo' ? e.target.files[0].size : 0

    this.postData.set(name, value)
    this.setState({ [name]: value, fileSize })
  }

  handleSubmit = (e) => {
    e.preventDefault()
    if (this.isValid()) {
      this.setState({ loading: true })
      const userId = isAuthenticated().user._id
      const token = isAuthenticated().token
      createPost(userId, token, this.postData).then((data) => {
        if (data && data.error) {
          this.setState({ error: data.error })
        } else {
          this.setState({
            loading: false,
            title: '',
            body: '',
            photo: '',
            redirectToProfile: true,
          })
        }
      })
    }
  }

  render() {
    const { title, body, user, error, loading, redirectToProfile } = this.state

    if (redirectToProfile) {
      return <Redirect to={`/users/${user._id}`} />
    }

    return (
      <div className='container'>
        <h2 className='mt-5 mb-5'>Create a new post</h2>
        {error && <div className='alert alert-danger'>{error}</div>}
        {loading && (
          <div className='jumbotron text-center'>
            <h2>Loading...</h2>
          </div>
        )}

        <form>
          <div className='form-group'>
            <label className='text-muted'>Profile Photo</label>
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
            Create Post
          </button>
        </form>
      </div>
    )
  }
}

export default CreatePost
