import React, { Component } from 'react'
import { getPostById, removePost, performLike, performUnlike } from './apiPost'
import DefaultPost from '../images/nature.jpg'
import { Link, Redirect } from 'react-router-dom'
import { isAuthenticated } from '../auth'

class SinglePost extends Component {
  state = {
    post: '',
    loading: true,
    successDeleted: false,
    like: false,
    likes: 0,
    successLike: false,
  }

  componentDidMount() {
    const postId = this.props.match.params.postId
    getPostById(postId).then((data) => {
      if (data.error) {
        console.log(data.error)
      } else {
        this.setState({
          post: data,
          like: this.checkFoundLike(data.likes),
          likes: data.likes.length,
          loading: false,
        })
      }
    })
  }

  deletePostHandler = () => {
    const postId = this.props.match.params.postId
    const token = isAuthenticated().token
    removePost(postId, token).then((data) => {
      if (data.error) {
        console.log(data.error)
      } else {
        this.setState({ successDeleted: true })
      }
    })
  }

  deleteConfirmed = () => {
    let answer = window.confirm('Are you sure you want to delete the account?')
    if (answer) {
      this.deletePostHandler()
    }
  }

  checkFoundLike = (likes) => {
    const userId = isAuthenticated() && isAuthenticated().user._id
    let found = likes.indexOf(userId) !== -1
    return found
  }

  likeToggleHandler = () => {
    if (!isAuthenticated()) {
      this.setState({ successLike: true })
      return false
    }

    let callApi = this.state.like ? performUnlike : performLike
    const postId = this.state.post._id
    const token = isAuthenticated().token
    callApi(postId, token).then((data) => {
      if (data.error) {
        console.log(data.error)
      } else {
        this.setState({
          like: !this.state.like,
          likes: data.likes.length,
        })
      }
    })
  }

  renderPost = (post) => {
    const posterId = post.postedBy ? `users/${post.postedBy._id}` : ''
    const posterName = post.postedBy ? post.postedBy.name : ' Unknown'

    const { like, likes } = this.state

    return (
      <div className='card-body'>
        <img
          src={`${process.env.REACT_APP_API_URL}/api/posts/${post._id}/photo`}
          alt={post.title}
          onError={(i) => (i.target.src = DefaultPost)}
          className='img-thumbnail mb-3'
          style={{ height: '40vh', width: '100%', objectFit: 'cover' }}
        />

        {like ? (
          <h3 onClick={this.likeToggleHandler}>
            <i
              className='fa fa-thumbs-up text-success bg-dark'
              style={{ padding: '10px', borderRadius: '50%' }}
            />{' '}
            {likes} like
          </h3>
        ) : (
          <h3 onClick={this.likeToggleHandler}>
            <i
              className='fa fa-thumbs-up text-warning bg-dark'
              style={{ padding: '10px', borderRadius: '50%' }}
            />{' '}
            {likes} like
          </h3>
        )}

        <p className='card-text'>{post.body}</p>
        <br />
        <p className='font-italic mark'>
          Posted by <Link to={`${posterId}`}>{posterName}</Link>
        </p>
        <div className='d-inline-block'>
          <Link to={`/`} className='btn btn-raised btn-sm btn-primary mr-5'>
            Back to posts
          </Link>
          {isAuthenticated().user &&
            isAuthenticated().user._id === post.postedBy._id && (
              <>
                {' '}
                <Link
                  to={`/posts/${post._id}/edit`}
                  className='btn btn-raised btn-sm btn-warning mr-5'>
                  Update Post
                </Link>
                <button
                  onClick={this.deleteConfirmed}
                  className='btn btn-raised btn-danger'>
                  {' '}
                  Delete Post
                </button>
              </>
            )}
        </div>
      </div>
    )
  }

  render() {
    const { post, loading, successDeleted, successLike } = this.state

    if (successDeleted) {
      return <Redirect to={'/'} />
    } else if (successLike) {
      return <Redirect to={'/signin'} />
    }

    return (
      <div className='container'>
        <h2 className='display-2 mt-5 mb-5'>{post.title}</h2>
        {loading ? (
          <div className='jumbotron text-center'>
            <h2>Loading...</h2>
          </div>
        ) : (
          this.renderPost(post)
        )}
      </div>
    )
  }
}

export default SinglePost
