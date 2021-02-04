import React, { Component } from 'react'
import { getPosts } from './apiPost'
import DefaultPost from '../images/nature.jpg'
import { Link } from 'react-router-dom'
class Posts extends Component {
  constructor() {
    super()
    this.state = {
      posts: [],
      loading: true,
      page: 1,
    }
  }
  loadMore = (number) => {
    this.setState({ ...this.state, page: this.state.page + number })
  }

  loadLess = (number) => {
    this.setState({ ...this.state, page: this.state.page - number })
  }

  componentDidMount() {
    getPosts(this.state.page).then((data) => {
      if (data && data.error) {
        console.log(data.error)
      } else {
        this.setState({ posts: data, loading: false, page: this.state.page })
      }
    })
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.page !== prevState.page) {
      getPosts(this.state.page).then((data) => {
        if (data && data.error) {
          console.log(data.error)
        } else {
          this.setState({ posts: data, loading: false, page: this.state.page })
        }
      })
    }
  }

  renderPosts = (posts) => {
    return (
      <div className='row'>
        {posts.map((post, i) => {
          const posterId = post.postedBy ? `/users/${post.postedBy._id}` : ''
          const posterName = post.postedBy ? post.postedBy.name : ' Unknown'

          return (
            <div className='card col-md-4' key={i}>
              <div className='card-body'>
                <img
                  src={`/api/posts/${post._id}/photo`}
                  alt={post.title}
                  onError={(i) => (i.target.src = DefaultPost)}
                  className='img-thumbnail mb-3'
                  style={{ height: '30vh', width: '100%' }}
                />
                <h5 className='card-title'>{post.title}</h5>
                <p className='card-text'>{post.body.substring(0, 50)}</p>
                <br />
                <p className='font-italic mark'>
                  Posted by <Link to={`${posterId}`}>{posterName}</Link>
                </p>
                <Link
                  to={`/posts/${post._id}`}
                  className='btn btn-raised btn-sm btn-primary'>
                  Read more
                </Link>{' '}
                on {new Date(post.created).toDateString()}
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  render() {
    const { posts, loading, page } = this.state
    return (
      <div className='container'>
        {loading ? (
          <div class='loader'></div>
        ) : (
          <>
            <h2 className='mt-5 mb-5'>Recent Posts</h2>
            {this.renderPosts(posts)}
          </>
        )}
        {page > 1 ? (
          <button
            className='btn btn-raised btn-warning mr-5 mt-5 mb-5'
            onClick={() => this.loadLess(1)}>
            Previous ({this.state.page - 1})
          </button>
        ) : (
          ''
        )}

        {posts.length ? (
          <button
            className='btn btn-raised btn-success mt-5 mb-5'
            onClick={() => this.loadMore(1)}>
            Next ({page + 1})
          </button>
        ) : (
          ''
        )}
      </div>
    )
  }
}

export default Posts
