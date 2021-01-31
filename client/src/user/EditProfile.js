import React, { Component } from 'react'
import { isAuthenticated } from '../auth'
import { getUserProfile, updateUser } from './apiUser'
import { Redirect } from 'react-router-dom'
import DefaultAvatar from '../images/avatar.png'

class EditProfile extends Component {
  constructor() {
    super()
    this.state = {
      id: '',
      name: '',
      email: '',
      password: '',
      redirectToProfile: false,
      error: '',
      loading: false,
      fileSize: 0,
      about: '',
    }
  }
  init = (userId) => {
    const token = isAuthenticated().token
    getUserProfile(userId, token).then((data) => {
      if (data && data.error) {
        this.setState({ redirectToSignin: true })
      } else {
        this.setState({
          id: data._id,
          name: data.name,
          email: data.email,
          about: data.about,
        })
      }
    })
  }

  componentDidMount() {
    this.userData = new FormData()
    const userId = this.props.match.params.userId
    this.init(userId)
  }

  isValid = () => {
    const { name, email, password, fileSize } = this.state

    if (fileSize > 100000) {
      this.setState({ error: 'File size should be less than 100kb' })
      return false
    }
    if (name.length === 0) {
      this.setState({ error: 'name is required' })
      return false
    }

    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    if (!re.test(String(email).toLowerCase())) {
      this.setState({ error: 'A valid email is required' })
      return false
    }

    if (password.length >= 1 && password.length <= 5) {
      this.setState({ error: 'Password must be at least 6 characters' })
      return false
    }
    return true
  }

  handleChange = (name) => (e) => {
    this.setState({ error: '' })
    const value = name === 'photo' ? e.target.files[0] : e.target.value

    const fileSize = name === 'photo' ? e.target.files[0].size : 0
    this.userData.set(name, value)
    this.setState({ [name]: value, fileSize })
  }

  handleSubmit = (e) => {
    e.preventDefault()
    if (this.isValid()) {
      this.setState({ loading: true })

      let { id, name: updateNavName } = this.state

      if (
        isAuthenticated().user._id != id &&
        isAuthenticated().user.role == 'admin'
      ) {
        updateNavName = undefined
      }
      const token = isAuthenticated().token
      updateUser(id, token, this.userData, updateNavName).then((data) => {
        if (data && data.error) {
          this.setState({ error: data && data.error })
        } else {
          this.setState({
            redirectToProfile: true,
          })
        }
      })
    }
  }

  render() {
    const {
      id,
      name,
      email,
      password,
      redirectToProfile,
      error,
      loading,
      about,
    } = this.state

    if (redirectToProfile) {
      return <Redirect to={`/users/${id}`} />
    }

    const photoUrl = id
      ? `/api/users/${id}/photo?${new Date().getTime()}`
      : DefaultAvatar

    return (
      <div className='container'>
        <h2 className='mt-5 mb-5'>Edit Profile</h2>
        {error && <div className='alert alert-danger'>{error}</div>}
        {loading && (
          <div className='jumbotron text-center'>
            <h2>Loading...</h2>
          </div>
        )}

        <img
          style={{ height: '30vh', width: 'auto' }}
          className='img-thumbnail'
          src={photoUrl}
          onError={(e) => (e.target.src = `${DefaultAvatar}`)}
          alt={name}
        />

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
            <label className='text-muted'>Name</label>
            <input
              onChange={this.handleChange('name')}
              type='text'
              className='form-control'
              value={name}
              autoComplete='off'
            />
          </div>
          <div className='form-group'>
            <label className='text-muted'>About</label>
            <textarea
              onChange={this.handleChange('about')}
              type='text'
              className='form-control'
              value={about}
              autoComplete='off'
            />
          </div>
          <div className='form-group'>
            <label className='text-muted'>Email</label>
            <input
              onChange={this.handleChange('email')}
              type='email'
              className='form-control'
              value={email}
              autoComplete='off'
            />
          </div>
          <div className='form-group'>
            <label className='text-muted'>Password</label>
            <input
              onChange={this.handleChange('password')}
              type='password'
              className='form-control'
              value={password}
              autoComplete='off'
            />
          </div>
          <button
            onClick={this.handleSubmit}
            className='btn btn-raised btn-primary'>
            Update
          </button>
        </form>
      </div>
    )
  }
}

export default EditProfile
