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
import CreatePost from './post/CreatePost'
import SinglePost from './post/SinglePost'
import EditPost from './post/EditPost'
import PrivateRoute from './auth/PrivateRoute'
import ForgotPassword from './user/ForgotPassword'
import ResetPassword from './user/ResetPassword'
import Admin from './admin/Admin'

const MainRouter = () => {
  return (
    <div>
      <Menu />
      <Switch>
        <Route exact path='/' component={Home} />
        <Route exact path='/forgot-password' component={ForgotPassword} />
        <Route
          exact
          path='/reset-password/:resetPasswordToken'
          component={ResetPassword}
        />
        <Route exact path='/posts/:postId' component={SinglePost} />
        <PrivateRoute exact path='/posts/:postId/edit' component={EditPost} />
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
        <PrivateRoute exact path='/createPost' component={CreatePost} />
        <PrivateRoute exact path='/admin' component={Admin} />
      </Switch>
    </div>
  )
}

export default MainRouter
