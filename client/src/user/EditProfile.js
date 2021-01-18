import React, { Component } from 'react'
import { isAuthenticated } from '../auth'
import { getUserProfile, updateUser } from './apiUser'
import { Redirect } from 'react-router-dom'

class EditProfile extends Component {
  constructor() {
    super()
    this.state = {
      id: '',
      name: '',
      email: '',
      password: '',
      redirectToProfile: false,
    }
  }
  init = (userId) => {
    const token = isAuthenticated().token
    getUserProfile(userId, token).then((data) => {
      if (data.error) {
        this.setState({ redirectToSignin: true })
      } else {
        this.setState({ id: data._id, name: data.name, email: data.email })
      }
    })
  }

  componentDidMount() {
    const userId = this.props.match.params.userId
    this.init(userId)
  }

  handleChange = (name) => (e) => {
    this.setState({ error: '', success: false })
    this.setState({ [name]: e.target.value })
  }

  handleSubmit = (e) => {
    e.preventDefault()
    const { name, email, password, id } = this.state
    const user = { name, email, password: password || undefined, id }
    const token = isAuthenticated().token
    updateUser(user, token).then((data) => {
      if (data.error) {
        this.setState({ error: data.error })
      } else {
        this.setState({
          redirectToSignin: true
        })
      }
    })
   
  }

  render() {
    const { id, name, email, password, redirectToProfile } = this.state

    if (redirectToProfile) {
      return <Redirect to={`/users/${id}`} />
    }
    return (
      <div className='container'>
        <h2 className='mt-5 mb-5'>Edit Profile</h2>
        <form>
          <div className='form-group'>
            <label className='text-muted'>Name</label>
            <input
              onChange={this.handleChange('name')}
              type='text'
              className='form-control'
              value={name}
            />
          </div>
          <div className='form-group'>
            <label className='text-muted'>Email</label>
            <input
              onChange={this.handleChange('email')}
              type='email'
              className='form-control'
              value={email}
            />
          </div>
          <div className='form-group'>
            <label className='text-muted'>Password</label>
            <input
              onChange={this.handleChange('password')}
              type='password'
              className='form-control'
              value={password}
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
