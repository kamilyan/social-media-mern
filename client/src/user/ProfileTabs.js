import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import DefaultAvatar from '../images/avatar.png'

class ProfileTabs extends Component {
  render() {
    const { following, followers, posts } = this.props
    return (
      <>
        <div className='row'>
          <div className='col-md-4'>
            <h3 className='text-primary'>Followers</h3>
            <hr />
            {followers.map((person, i) => (
              <div key={i}>
                <Link to={`users/$person._id`}>
                  <img
                    style={{ borderRadius: '50%', border: '1px solid black' }}
                    className='float-left mr-2'
                    height='30px'
                    width='30px'
                    src={`${process.REACT_APP_API_URL}/api/users/${person._id}/photo`}
                    alt={person.name}
                    onError={(e) => (e.target.src = `${DefaultAvatar}`)}
                  />
                  <div>
                    <p className='lead'>{person.name}</p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
          <div className='col-md-4'>
            <h3 className='text-primary'>Following</h3>
            <hr />
            {following.map((person, i) => (
              <div key={i}>
                <Link to={`/users/$person._id`}>
                  <img
                    style={{ borderRadius: '50%', border: '1px solid black' }}
                    className='float-left mr-2'
                    height='30px'
                    width='30px'
                    src={`${process.REACT_APP_API_URL}/api/users/${person._id}/photo`}
                    alt={person.name}
                    onError={(e) => (e.target.src = `${DefaultAvatar}`)}
                  />
                  <div>
                    <p className='lead'>{person.name}</p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
          <div className='col-md-4'>
            <h3 className='text-primary'>Posts</h3>
            <hr />
            {posts.map((post, i) => (
              <div key={i}>
                <Link to={`/posts/${post._id}`}>
                  <div>
                    <p className='lead'>{post.title}</p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </>
    )
  }
}

export default ProfileTabs
