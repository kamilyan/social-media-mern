import React, { Component } from 'react'
import { getUsers } from './apiUser'
import DefaultAvatar from '../images/avatar.png'
import { Link } from 'react-router-dom'
class Users extends Component {
  constructor() {
    super()
    this.state = {
      users: [],
      loading: true,
    }
  }

  componentDidMount() {
    getUsers().then((data) => {
      if (data && data.error) {
        console.log(data.error)
      } else {
        this.setState({ users: data, loading: false })
      }
    })
  }

  renderUsers = (users) => (
    <div className='row'>
      {users.map((user, i) => (
        <div className='card col-md-4' key={i}>
          <img
            style={{ height: '30vh', width: 'auto' }}
            className='img-thumbnail'
            src={`/api/users/${user._id}/photo`}
            onError={(e) => (e.target.src = `${DefaultAvatar}`)}
            alt={user.name}
          />
          <div className='card-body'>
            <h5 className='card-title'>{user.name}</h5>
            <p className='card-text'>{user.email}</p>
            <Link
              to={`/users/${user._id}`}
              className='btn btn-raised btn-sm btn-primary'>
              View Profile
            </Link>
          </div>
        </div>
      ))}
    </div>
  )

  render() {
    const { users, loading } = this.state
    return (
      <div className='container'>
        <h2 className='mt-5 mb-5'>Users</h2>
        {loading ? <div class='loader'></div> : <>{this.renderUsers(users)}</>}
      </div>
    )
  }
}

export default Users
