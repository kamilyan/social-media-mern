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
    }
  }

  componentDidMount() {
    getPosts().then((data) => {
      if (data && data.error) {
        console.log(data.error)
      } else {
        this.setState({ posts: data, loading: false })
      }
    })
  }

  renderPosts = (posts) => {
    return (
      <div className='row'>
        {posts.map((post, i) => {
          const posterId = post.postedBy ? `users/${post.postedBy._id}` : ''
          const posterName = post.postedBy ? post.postedBy.name : ' Unknown'

          return (
            <div className='card col-md-4' key={i}>
              <div className='card-body'>
                <img
                  src={`${process.env.REACT_APP_API_URL}/api/posts/${post._id}/photo`}
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
    const { posts, loading } = this.state
    return (
      <div className='container'>
        {loading ? (
          <div className='jumbotron text-center'>
            <h2>Loading...</h2>
          </div>
        ) : (
          <>
            <h2 className='mt-5 mb-5'>Recent Posts</h2>
            {this.renderPosts(posts)}
          </>
        )}
      </div>
    )
  }
}

export default Posts
