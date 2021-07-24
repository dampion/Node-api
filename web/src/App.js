// index.js
// This is the main entry point of our application
import React from 'react';
import ReactDOM from 'react-dom';

// import global style
import GlobalStyle from './components/GlobalStyle';
// 匯入路徑
import Pages from './pages'

// import apollo client lib
import {
  ApolloClient,
  ApolloProvider,
  createHttpLink,
  InMemoryCache
} from '@apollo/client';
import { setContext } from 'apollo-link-context';

// set up API URI and cache
const uri = process.env.API_URI;
const httpLink = createHttpLink({ uri })
const cache = new InMemoryCache();

// 在每一個 req 都加上token
const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      authorization: localStorage.getItem('token') || ''
    }
  };
})

// set up apollo client
const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache,
  resolvers: {},
  connectToDevTools: true
});

// check for a local token
const data = {
  isLoggedIn: !!localStorage.getItem('token')
};

// write the cache data on initial load
cache.writeData({ data });
// 在重設快取後寫入快取資料
client.onResetStore(() => { cache.writeData({ data })});
// <React.Fragment></React.Fragment> === <>

const App = () => {
  return (
    <ApolloProvider client={client}>
      <GlobalStyle />
      <Pages />
    </ApolloProvider>
  )
}

ReactDOM.render(<App />, document.getElementById('root'));