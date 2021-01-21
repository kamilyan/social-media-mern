import React from 'react'
import { Route, Switch } from 'react-router-dom'
import Home from './core/Home'
import Menu from './core/Menu'
import Signup from './user/Signup'
import Signin from './user/Signin'
import Profile from './user/Profile'
import Users from './user/Users'
import EditProfile from './user/EditProfile'
import SuggestedUsers from './user/SuggestedUsers'
import PrivateRoute from './auth/PrivateRoute'

const MainRouter = () => {
  return (
    <div>
      <Menu />
      <Switch>
        <Route exact path='/' component={Home} />
        <Route exact path='/users' component={Users} />
        <Route exact path='/signup' component={Signup} />
        <Route exact path='/signin' component={Signin} />
        <PrivateRoute
          exact
          path='/users/:userId/edit'
          component={EditProfile}
        />
        <PrivateRoute exact path='/suggestedUsers' component={SuggestedUsers} />
        <PrivateRoute exact path='/users/:userId' component={Profile} />
      </Switch>
    </div>
  )
}

export default MainRouter
