import React from 'react';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';

// import layout
import Layout from '../components/Layout'

// import route
import Home from './home';
import MyNotes from './mynotes';
import Favorites from './favorites';
import NotePage from './note'
import SignUp from './signup'
import SignIn from './signin'
import NewNote from './new'
import { useQuery, gql } from '@apollo/client'
import EditNote from './edit';
// import { Component } from 'react';

// check if login-in
const PrivateRoute = ({ component: Component, ...rest }) => {
  const { loading, error, data } = useQuery(IS_LOGGED_IN);
  {/* if the data is loading, display a loading message*/}
  if (loading) return <p>Loading...</p>
  {/* if there is an error, display a error message*/}
  if (error) return <p>Error signing in!</p>
  // 若使用者已登入，則將他們路由至要求的元件
  // 否則重新導向至登入頁面
  return (
    <Route
      {...rest}
      render={props => 
        data.isLoggedIn === true ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: '/signin',
              state: { from: props.location }
            }}
          />
        )
      }
    />
  )
}

const IS_LOGGED_IN = gql`
  {
    isLoggedIn @client
  }
`

const Pages = () => {
  return (
    <Router>
      {/* wrap the routes inside layout */}
      <Layout>
        <Route exact path="/" component={Home} />
        {/* 新增私人路徑 */}
        <PrivateRoute path="/mynotes" component={MyNotes} />
        <PrivateRoute path="/favorites" component={Favorites} />
        <PrivateRoute path="/new" component={NewNote} />
        <PrivateRoute path="/edit/:id" component={EditNote} />
        <Route path="/note/:id" component={NotePage} />
        <Route path="/signup" component={SignUp} />
        <Route path="/signin" component={SignIn} />
      </Layout>
    </Router>
  )
}

export default Pages;