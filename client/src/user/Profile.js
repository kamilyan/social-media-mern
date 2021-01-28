import React, { Component } from 'react'
import { isAuthenticated } from '../auth'
import { Redirect, Link } from 'react-router-dom'
import { getUserProfile } from './apiUser'
import DefaultAvatar from '../images/avatar.png'
import DeleteUser from './DeleteUser'
import FollowProfileButton from './FollowProfileButton'
import ProfileTabs from './ProfileTabs'
import { getPostsByUser } from '../post/apiPost'

class Profile extends Component {
  constructor(props) {
    super(props)

    this.state = {
      user: { following: [], followers: [] },
      redirectToSignin: false,
      loading: true,
      following: false,
      posts: [],
    }
  }

  checkFollow = (user) => {
    const jwt = isAuthenticated()
    const match = user.followers.find((follower) => {
      return follower._id === jwt.user._id
    })
    return match
  }

  clickFollowButton = (callApi) => {
    const token = isAuthenticated().token

    callApi(token, this.state.user._id).then((data) => {
      if (data && data.error) {
        this.setState({ error: data && data.error })
      } else {
        this.setState({ user: data, following: !this.state.following })
      }
    })
  }

  init = (userId) => {
    const token = isAuthenticated().token
    getUserProfile(userId, token).then((data) => {
      if (data && data.error) {
        this.setState({ redirectToSignin: true })
      } else {
        let following = this.checkFollow(data)
        this.setState({ user: data, loading: false, following })
        this.loadPosts(data._id)
      }
    })
  }

  loadPosts = (userId) => {
    const token = isAuthenticated().token
    getPostsByUser(userId, token).then((data) => {
      if (data && data.error) {
        console.log(data.error)
      } else {
        this.setState({ posts: data })
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
    const { redirectToSignin, user, loading, posts } = this.state
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
              <div className='col-md-4'>
                <img
                  style={{ height: '30vh', width: 'auto' }}
                  className='img-thumbnail'
                  src={photoUrl}
                  onError={(e) => (e.target.src = `${DefaultAvatar}`)}
                  alt={user.name}
                />
              </div>
              <div className='col-md-8'>
                <div className='lead mt-2'>
                  <p>Hello {user.name}</p>
                  <p>Hello {user.email}</p>
                  <p>{`Joined ${new Date(user.created).toDateString()}`}</p>
                </div>
                {isAuthenticated().user &&
                isAuthenticated().user._id === user._id ? (
                  <div className='d-inline-block'>
                    <Link
                      className='btn btn-raised btn-info mr-5'
                      to={`/createPost`}>
                      Create Post
                    </Link>
                    <Link
                      className='btn btn-raised btn-success mr-5'
                      to={`/users/${user._id}/edit`}>
                      Edit Profile
                    </Link>
                    <DeleteUser userId={user._id} />
                  </div>
                ) : (
                  <FollowProfileButton
                    following={this.state.following}
                    onButtonClick={this.clickFollowButton}
                  />
                )}
              </div>
            </div>
            <div className='row'>
              <div className='col md-12 mt-5'>
                <hr />
                <p className='lead'>{user.about}</p>
                <hr />
                <ProfileTabs
                  followers={user.followers}
                  following={user.following}
                  posts={posts}
                />
              </div>
            </div>
          </>
        )}
      </div>
    )
  }
}

export default Profile
