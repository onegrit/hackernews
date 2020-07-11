import React from 'react';
import ReactDOM from 'react-dom';
import './styles/index.css';
import App from './components/App';
import * as serviceWorker from './serviceWorker';
// 1. You’re importing the required dependencies from the installed packages.
import { ApolloProvider } from 'react-apollo'
import { ApolloClient } from 'apollo-client'
import { createHttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { BrowserRouter } from 'react-router-dom';

/**
 * 2. Here you create the httpLink that will connect your ApolloClient instance with the GraphQL API, 
 *    your GraphQL server will be running on http://localhost:4000.
 */
const httpLink = createHttpLink({
  uri: 'http://localhost:4000'
})
/**
 * 3. Now you instantiate ApolloClient by passing in the httpLink and a new instance of an InMemoryCache.
 */
const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache()
})

/**
 * 当启用Route时，需要将App封装在BrowserRouter内部
 */
ReactDOM.render(
  <BrowserRouter>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </BrowserRouter>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
