import React, { Component } from 'react'
import { signup } from '../auth'
import { Link } from 'react-router-dom'
class Signup extends Component {
  constructor() {
    super()
    this.state = {
      name: '',
      email: '',
      password: '',
      error: '',
      success: false,
    }
  }

  handleChange = (name) => (e) => {
    this.setState({ error: '', success: false })
    this.setState({ [name]: e.target.value })
  }

  handleSubmit = (e) => {
    e.preventDefault()
    const { name, email, password } = this.state
    const user = { name, email, password }

    signup(user).then((data) => {
      if (data && data.error) {
        this.setState({ error: data && data.error })
      } else {
        this.setState({
          error: '',
          name: '',
          email: '',
          password: '',
          success: true,
        })
      }
    })
  }

  render() {
    const { name, email, password, error, success } = this.state
    return (
      <div className='container'>
        <h2 className='mt-5 mb-5'>Signup</h2>

        {error && <div className='alert alert-danger'>{error}</div>}
        {success && (
          <div className='alert alert-info'>
            New Account is created! Please <Link to='/signin'>Sign in</Link>
          </div>
        )}

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
            Submit
          </button>
        </form>
      </div>
    )
  }
}

export default Signup
