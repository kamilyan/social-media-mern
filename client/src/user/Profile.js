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
      loading: true,
    }
  }

  init = (userId) => {
    const token = isAuthenticated().token
    getUserProfile(userId, token).then((data) => {
      if (data.error) {
        this.setState({ redirectToSignin: true })
      } else {
        this.setState({ user: data, loading: false })
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
    const { redirectToSignin, user, loading } = this.state
    if (redirectToSignin) return <Redirect to='/signin' />
    const photoUrl = user._id
      ? `${process.env.REACT_APP_API_URL}/api/users/${
          user._id
        }/photo?${new Date().getTime()}`
      : DefaultAvatar
    return (
      <div className='container'>
        <h2 className='mt-5 mb-5'>Profile</h2>
        {loading ? (
          <div className='jumbotron text-center'>
            <h2>Loading...</h2>
          </div>
        ) : (
          <>
            <div className='row'>
              <div className='col-md-6'>
                <img
                  style={{ height: '30vh', width: 'auto' }}
                  className='img-thumbnail'
                  src={photoUrl}
                  onError={(e) => (e.target.src = `${DefaultAvatar}`)}
                  alt={user.name}
                />
              </div>
              <div className='col-md-6'>
                <div className='lead mt-2'>
                  <p>Hello {user.name}</p>
                  <p>Hello {user.email}</p>
                  <p>{`Joined ${new Date(user.created).toDateString()}`}</p>
                </div>
                {isAuthenticated().user &&
                  isAuthenticated().user._id === user._id && (
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
            <div className='row'>
              <div className='col md-12 mt-5'>
                <hr />
                <p className='lead'>{user.about}</p>
                <hr />
              </div>
            </div>
          </>
        )}
      </div>
    )
  }
}

export default Profile