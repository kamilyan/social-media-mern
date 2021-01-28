import React, { Component } from 'react'
import { Link, Redirect } from 'react-router-dom'
import { signin, authenticate } from '../auth'
import SocialLogin from './SocialLogin'

class Signin extends Component {
  constructor() {
    super()
    this.state = {
      email: '',
      password: '',
      error: '',
      success: false,
      loading: false,
    }
  }

  handleChange = (name) => (e) => {
    this.setState({ error: '' })
    this.setState({ [name]: e.target.value })
  }

  handleSubmit = (e) => {
    e.preventDefault()
    this.setState({ loading: true })
    const { email, password } = this.state
    const user = { email, password }

    signin(user).then((data) => {
      if (data && data.error) {
        this.setState({ error: data.error, loading: false })
      } else {
        authenticate(data, () => {
          this.setState({ success: true })
        })
      }
    })
  }

  render() {
    const { email, password, error, success, loading } = this.state

    if (success) {
      return <Redirect to='/' />
    }

    return (
      <div className='container'>
        <h2 className='mt-5 mb-5'>SignIn</h2>
        <hr />
        <SocialLogin />
        <hr />
        {error && <div className='alert alert-danger'>{error}</div>}
        {loading && (
          <div className='jumbotron text-center'>
            <h2>Loading...</h2>
          </div>
        )}

        <form>
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
            Submit
          </button>
        </form>
        <p>
          <Link to='/forgot-password' className='btn btn-raised btn-danger'>
            {' '}
            Forgot Password
          </Link>
        </p>
      </div>
    )
  }
}

export default Signin
