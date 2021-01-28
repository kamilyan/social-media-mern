import React, { Component } from 'react'
import { performComment, performUncomment } from './apiPost'
import { isAuthenticated } from '../auth'
import { Link } from 'react-router-dom'
import DefaultAvatar from '../images/avatar.png'

class Comment extends Component {
  state = {
    text: '',
    error: '',
  }

  handleChange = (e) => {
    this.setState({ error: '' })
    this.setState({ text: e.target.value })
  }

  isValid = () => {
    const { text } = this.state
    if (text.length < 4 || text.length > 100) {
      this.setState({ error: 'Comment should be between 4-100 characters' })
      return false
    }
    return true
  }

  addComment = (e) => {
    e.preventDefault()

    if (!isAuthenticated()) {
      this.setState({ error: 'Please signin' })
      return false
    }

    if (this.isValid()) {
      const token = isAuthenticated().token
      const postId = this.props.postId
      const comment = { text: this.state.text }

      performComment(postId, token, comment).then((data) => {
        if (data && data.error) {
          console.log(data.error)
        } else {
          this.setState({ text: '' })
          this.props.onUpdateComments(data.comments)
        }
      })
    }
  }

  deleteCommentHandler = (comment) => {
    const token = isAuthenticated().token
    const postId = this.props.postId

    performUncomment(postId, token, comment).then((data) => {
      if (data && data.error) {
        console.log(data.error)
      } else {
        this.props.onUpdateComments(data.comments)
      }
    })
  }

  deleteConfirmed = (comment) => {
    let answer = window.confirm('Are you sure you want to delete your comment?')
    if (answer) {
      this.deleteCommentHandler(comment)
    }
  }

  render() {
    const { comments } = this.props
    const { error } = this.state
    return (
      <div>
        <h2 className='mt-5 mb-5'>Leave a comment</h2>
        <form onSubmit={this.addComment}>
          <div className='form-group'>
            <input
              type='text'
              value={this.state.text}
              onChange={this.handleChange}
              className='form-control'
              placeholder='Leave a comment...'
            />
            <button className='btn btn-raised btn-success mt-2'>Post</button>
          </div>
        </form>
        {error && <div className='alert alert-danger'>{error}</div>}

        <div className='col-md-12'>
          <h3 className='text-primary'>{comments.length} Comments</h3>
          <hr />
          {comments.map((comment, i) => (
            <div key={i}>
              <Link to={`/users/${comment.postedBy._id}`}>
                <img
                  style={{ borderRadius: '50%', border: '1px solid black' }}
                  className='float-left mr-2'
                  height='30px'
                  width='30px'
                  src={`/api/users/${comment.postedBy._id}/photo`}
                  alt={comment.postedBy.name}
                  onError={(e) => (e.target.src = `${DefaultAvatar}`)}
                />
              </Link>
              <div>
                <p className='lead'>{comment.text}</p>
                <p className='font-italic mark'>
                  Posted by{' '}
                  <Link to={`/users/${comment.postedBy._id}`}>
                    on {new Date(comment.created).toDateString()}
                  </Link>
                  <span>
                    {isAuthenticated().user &&
                      isAuthenticated().user._id === comment.postedBy._id && (
                        <>
                          <span
                            onClick={() => this.deleteConfirmed(comment)}
                            className='text-danger float-right mr-1'>
                            {' '}
                            Remove
                          </span>
                        </>
                      )}
                  </span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }
}

export default Comment
