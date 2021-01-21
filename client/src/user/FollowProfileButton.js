import React, { Component } from 'react'
import { follow, unfollow } from './apiUser'

class FollowProfileButton extends Component {
  followClickHandler = () => {
    this.props.onButtonClick(follow)
  }

  unFollowClickHandler = () => {
    this.props.onButtonClick(unfollow)
  }

  render() {
    return (
      <div className='d-inline-block'>
        {!this.props.following ? (
          <button
            onClick={this.followClickHandler}
            className='btn btn-success btn-raised mr-5'>
            Follow
          </button>
        ) : (
          <button
            onClick={this.unFollowClickHandler}
            className='btn btn-danger btn-raised'>
            UnFollow
          </button>
        )}
      </div>
    )
  }
}

export default FollowProfileButton
