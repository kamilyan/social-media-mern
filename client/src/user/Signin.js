import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'

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

  authenticate = (jwt, next) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('jwt', JSON.stringify(jwt))
      next()
    }
  }

  handleSubmit = (e) => {
    e.preventDefault()
    this.setState({ loading: true })
    const { email, password } = this.state
    const user = { email, password }

    this.signin(user).then((data) => {
      if (data.error) {
        this.setState({ error: data.error, loading: false })
      } else {
        this.authenticate(data, () => {
          this.setState({ success: true })
        })
      }
    })
  }

  signin = (user) => {
    return fetch('http://localhost:8080/api/signin', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    })
      .then((res) => {
        return res.json()
      })
      .catch((err) => console.error(err))
  }

  render() {
    const { email, password, error, success, loading } = this.state

    if (success) {
      return <Redirect to='/' />
    }

    return (
      <div className='container'>
        <h2 className='mt-5 mb-5'>SignIn</h2>

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
      </div>
    )
  }
}

export default Signin
