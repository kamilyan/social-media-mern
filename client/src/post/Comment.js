import React, { Component } from 'react'
import { performComment, performUncomment } from './apiPost'
import { isAuthenticated } from '../auth'
import { Link } from 'react-router-dom'

class Comment extends Component {
  state = {
    text: '',
  }

  handleChange = (e) => {
    this.setState({ text: e.target.value })
  }

  addComment = (e) => {
    e.preventDefault()
    const token = isAuthenticated().token
    const postId = this.props.postId
    const comment = { text: this.state.text }

    performComment(postId, token, comment).then((data) => {
      if (data.error) {
        console.log(data.error)
      } else {
        this.setState({ text: '' })
        this.props.onUpdateComments(data.comments)
      }
    })
  }

  render() {
    return (
      <div>
        <h2 className='mt-5 mb-5'>Leave a comment</h2>
        <form onSubmit={this.addComment}>
          <div className='form-group'>
            <input
              type='text'
              onChange={this.handleChange}
              className='form-control'
            />
          </div>
        </form>
      </div>
    )
  }
}

export default Comment
