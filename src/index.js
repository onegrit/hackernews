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
import { AUTH_TOKEN } from './constants';
import { setContext } from 'apollo-link-context';
// Subscription Feature
import { split } from 'apollo-link'
import { WebSocketLink } from 'apollo-link-ws'
import { getMainDefinition } from 'apollo-utilities'


/**
 * 2. Here you create the httpLink that will connect your ApolloClient instance with the GraphQL API, 
 *    your GraphQL server will be running on http://localhost:4000.
 */
const httpLink = createHttpLink({
  uri: 'http://localhost:4000'
})

// 为ApolloClient发起的所有request添加Auth认证标;这个中间件在ApolloClient每次向服务器发送请求时都会被调用
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem(AUTH_TOKEN)
  return {
    headers: {
      ...headers,
      authorization: token ? `Bear ${token}` : ''
    }
  }
})
// Subscription Feature->
const wsLink = new WebSocketLink({
  uri: `ws://localhost:4000`,
  options: {
    reconnect: true,
    connectionParams: {
      authToken: localStorage.getItem(AUTH_TOKEN)
    }
  }
})
// split()中间件用于路由特定的请求，第一个参数是test函数，返回Boolean;如果True，则将请求转发到wsLink，否则作为
//常规的http请求处理
const link = split(
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query)
    return kind === 'OperationDefinition' && operation === 'subscription'
  },
  wsLink,
  authLink.concat(httpLink)
)


// <- Subscription Feature

/**
 * 3. Now you instantiate ApolloClient by passing in the httpLink and a new instance of an InMemoryCache.
 */
const client = new ApolloClient({
  link,
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
