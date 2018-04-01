import React from 'react';
import { Router, Route } from 'dva/router';
import IndexPage from './routes/update_poi/IndexPage';
import CheckPage from "./routes/update_poi/CheckPage"

function RouterConfig({ history }) {
  return (
    <Router history={history}>
      <Route path="/" component={IndexPage} />
      <Route path="/check" component={CheckPage} />
    </Router>
  );
}

export default RouterConfig;