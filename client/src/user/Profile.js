import React, { Component } from 'react'
import { isAuthenticated } from '../auth'
import { Redirect, Link } from 'react-router-dom'
import { getUserProfile } from './apiUser'
import DefaultAvatar from '../images/avatar.png'
import DeleteUser from './DeleteUser'

class Profile extends Component {
  constructor(props) {
    super(props)

    this.state = {
      user: '',
      redirectToSignin: false,
    }
  }

  init = (userId) => {
    const token = isAuthenticated().token
    getUserProfile(userId, token).then((data) => {
      if (data.error) {
        this.setState({ redirectToSignin: true })
      } else {
        this.setState({ user: data })
      }
    })
  }

  componentDidMount() {
    const userId = this.props.match.params.userId
    this.init(userId)
  }

  componentDidUpdate(prevProps) {
    if (this.props.match.params.userId !== prevProps.match.params.userId) {
      const userId = this.props.match.params.userId
      this.init(userId)
    }
  }

  render() {
    const { redirectToSignin, user } = this.state
    if (redirectToSignin) return <Redirect to='/signin' />
    return (
      <div className='container'>
        <h2 className='mt-5 mb-5'>Profile</h2>
        <div className='row'>
          <div className='col-md-6'>
            <img
              className='card-img-top'
              src={DefaultAvatar}
              alt={user.name}
              style={{ width: '100%', height: '25vh' }}
            />
          </div>
          <div className='col-md-6'>
            <div className='lead mt-2'>
              <p>Hello {user.name}</p>
              <p>Hello {user.email}</p>
              <p>{`Joined ${new Date(user.created).toDateString()}`}</p>
            </div>
            {isAuthenticated().user && isAuthenticated().user._id === user._id && (
              <div className='d-inline-block'>
                <Link
                  className='btn btn-raised btn-success mr-5'
                  to={`/users/${user._id}/edit`}>
                  Edit Profile
                </Link>
                <DeleteUser userId={user._id} />
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }
}

export default Profile
