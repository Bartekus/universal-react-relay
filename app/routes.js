/* @flow */

import React from 'react';
import { Route, IndexRoute } from 'react-router';

import App from './components/App'
import HomePage from './containers/HomePage'
import PostIndexPage from './containers/PostIndexPage'
import PostPage from './containers/PostPage'
import RegisterPage from './containers/RegisterPage'
import LoginPage from './containers/LoginPage'
import {
  homeQueries,
  postIndexQueries,
  postQueries,
} from './queries'

export default (
  <Route path="/" component={App}>
    <IndexRoute component={HomePage} queries={homeQueries}/>
    <Route path="posts">
      <IndexRoute component={PostIndexPage} queries={postIndexQueries}/>
      <Route path=":postId" component={PostPage} queries={postQueries}/>
    </Route>
    <Route path="login" component={LoginPage}/>
    <Route path="register" component={RegisterPage}/>
  </Route>
);

// import App from './containers/App/App';
// import TodoApp from './containers/TodoApp/TodoApp';
// import userQuery from './queries/userQuery';
//
// export default (
//   <Route path="/" component={App}>
//     <IndexRoute component={TodoApp} queries={userQuery} />
//   </Route>
// );
