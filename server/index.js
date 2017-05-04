/* @flow */

import express from 'express';
import graphQLHTTP from 'express-graphql';
import path from 'path';
import IsomorphicRouter from 'isomorphic-relay-router';
import ReactDOMServer from 'react-dom/server';
import { match } from 'react-router';
import Relay from 'react-relay';
// import { schema } from './data/schema';
import routes from '../app/routes';

const dotenv = require('dotenv');
const postgraphql = require('postgraphql').postgraphql;
const cors = require('cors');

const app = express();

// Load the config from .env file.
dotenv.load();
const {
  SERVER_PORT,
  DB_STRING,
  DB_SCHEMA,
  DB_DEFAULT_ROLE,
  SECRET,
  TOKEN,
} = process.env;

// Mount the PostGraphQL as middleware.
app.use(postgraphql(DB_STRING, DB_SCHEMA, {
  pgDefaultRole: DB_DEFAULT_ROLE,
  classicIds: true,
  graphiql: true,
  jwtSecret: SECRET,
  jwtPgTypeIdentifier: TOKEN,
}));

// app.use('/graphql', graphQLHTTP({ schema, pretty: true, graphiql: true }));
app.use(express.static('public'));

// serve isomorphic app
app.use((req, res, next) => {
  // must use absolute url for network layer
  const networkLayer = new Relay.DefaultNetworkLayer(`http://localhost:${SERVER_PORT}/graphql`);

  match({ routes, location: req.url }, (error, redirectLocation, renderProps) => {
    const render = ({ data, props }) => {
      const reactOutput = ReactDOMServer.renderToString(IsomorphicRouter.render(props));
      res.render(path.resolve(__dirname, 'views', 'index.ejs'), {
        preloadedData: data,
        reactOutput,
      });
    };

    if (error) {
      next(error);
    } else if (redirectLocation) {
      res.redirect(302, redirectLocation.pathname + redirectLocation.search);
    } else if (renderProps) {
      IsomorphicRouter.prepareData(renderProps, networkLayer)
                       .then(render)
                       .catch(next);
    } else {
      res.status(404).send('Not Found');
    }
  });
});

app.listen(SERVER_PORT, () => {
  console.log(`Listening on port ${SERVER_PORT}`); // eslint-disable-line no-console
});
