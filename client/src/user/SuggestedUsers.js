import React, { Component } from 'react'
import { follow, suggestedUsers } from './apiUser'
import DefaultAvatar from '../images/avatar.png'
import { Link } from 'react-router-dom'
import { isAuthenticated } from '../auth'

class SuggestedUsers extends Component {
  constructor() {
    super()
    this.state = {
      users: [],
      error: false,
      success: false,
      followMsg: '',
    }
  }

  componentDidMount() {
    const token = isAuthenticated().token
    const userId = isAuthenticated().user._id
    suggestedUsers(userId, token).then((data) => {
      if (data && data.error) {
        console.log(data.error)
      } else {
        this.setState({ users: data })
      }
    })
  }

  followHandler = (followUser, i) => {
    const token = isAuthenticated().token

    follow(token, followUser._id).then((data) => {
      if (data && data.error) {
        this.setState({ error: data.error })
      } else {
        let toFollow = this.state.users
        toFollow.splice(i, 1)
        this.setState({
          users: toFollow,
          success: true,
          followMsg: `Following ${followUser.name}`,
        })
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
            <button
              onClick={() => this.followHandler(user, i)}
              className='btn btn-raised btn-info float-right btn-sm'>
              Follow
            </button>
          </div>
        </div>
      ))}
    </div>
  )

  render() {
    const { users, success, followMsg } = this.state
    return (
      <div className='container'>
        <h2 className='mt-5 mb-5'>Suggested Accounts</h2>
        {success && (
          <div className='alert alert-success'>
            <p>{followMsg}</p>
          </div>
        )}
        {this.renderUsers(users)}
      </div>
    )
  }
}

export default SuggestedUsers
