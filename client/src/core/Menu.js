import React from 'react'
import { Link, withRouter } from 'react-router-dom'
import { isAuthenticated, signout } from '../auth'

const isActive = (history, path) => {
  if (history.location.pathname === path) {
    return { color: '#ff9900' }
  } else {
    return { color: '#ffffff' }
  }
}

const Menu = ({ history }) => {
  return (
    <div>
      <ul className='nav nav-tabs bg-primary'>
        <li className='nav-item'>
          <Link style={isActive(history, '/')} className='nav-link' to='/'>
            Home
          </Link>
        </li>
        <li className='nav-item'>
          <Link
            style={isActive(history, '/users')}
            className='nav-link'
            to='/users'>
            Users
          </Link>
        </li>
        <li className='nav-item'>
          <Link
            to={'/createPost'}
            style={isActive(history, '/createPost')}
            className='nav-link'>
            Create Post
          </Link>
        </li>
        {!isAuthenticated() ? (
          <>
            <li className='nav-item'>
              <Link
                style={isActive(history, '/signin')}
                className='nav-link'
                to='/signin'>
                Sign In
              </Link>
            </li>
            <li className='nav-item'>
              <Link
                style={isActive(history, '/signup')}
                className='nav-link'
                to='/signup'>
                Sign Up
              </Link>
            </li>
          </>
        ) : (
          <>
            <li className='nav-item'>
              <Link
                to={'/suggestedUsers'}
                style={isActive(history, '/suggestedUser')}
                className='nav-link'>
                Suggested Accounts
              </Link>
            </li>

            <li className='nav-item'>
              <Link
                to={`/users/${isAuthenticated().user._id}`}
                style={isActive(
                  history,
                  `/users/${isAuthenticated().user._id}`
                )}
                className='nav-link'>
                {`${isAuthenticated().user.name}'s profile`}
              </Link>
            </li>
            <li className='nav-item'>
              <span
                style={{ cursor: 'pointer', color: '#fff' }}
                className='nav-link'
                onClick={() => signout(() => history.push('/'))}>
                Sign Out
              </span>
            </li>
          </>
        )}
      </ul>
    </div>
  )
}

export default withRouter(Menu)
