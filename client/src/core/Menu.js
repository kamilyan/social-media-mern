import React from 'react'
import { Link, withRouter } from 'react-router-dom'

const isActive = (history, path) => {
  if (history.location.pathname === path) {
    return { color: '#ff9900' }
  } else {
    return { color: '#ffffff' }
  }
}

export const signout = (next) => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('jwt')
  }
  next()
  return fetch('http://localhost:8080/api/signout', {
    method: 'GET',
  })
    .then((res) => {
      return res.json()
    })
    .catch((err) => console.error(err))
}

export const isAuthenticated = () => {
  if (typeof window == 'undefined') {
    return false
  }

  if (localStorage.getItem('jwt')) {
    return JSON.parse(localStorage.getItem('jwt'))
  } else {
    return false
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
              <a
                style={{ cursor: 'pointer', color: '#fff' }}
                className='nav-link'
                onClick={() => signout(() => history.push('/'))}>
                Sign Out
              </a>
            </li>
            <li className='nav-item'>
              <a className='nav-link'>{isAuthenticated().user.name}</a>
            </li>
          </>
        )}
      </ul>
    </div>
  )
}

export default withRouter(Menu)
