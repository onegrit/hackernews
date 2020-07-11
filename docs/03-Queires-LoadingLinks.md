# Queries: Loading Links

### Preparing the React components

The first piece of functionality you’ll implement in the app is loading and displaying a list of `Link` elements. You’ll walk up our way in the React component hierarchy and start with the component that’ll render a single link. 您将在应用程序中实现的第一项功能是加载并显示“链接”元素列表。 您将逐步进入React组件层次结构，并从呈现单个链接的组件开始。

Create a new file called `Link.js` in the `components` directory and add the following code:   

[ ](https://github.com/howtographql/react-apollo/blob/master/src/components/Link.js)[  .../hackernews-react-apollo/src/components/Link.js](https://github.com/howtographql/react-apollo/blob/master/src/components/Link.js)

```js
import React, { Component } from 'react'

class Link extends Component {
  render() {
    return (
      <div>
        <div>
          {this.props.link.description} ({this.props.link.url})
        </div>
      </div>
    )
  }
}

export default Link
     
```

This is a simple React component that expects a `link` in its `props` and renders the link’s `description` and `url`. Easy as pie! 🍰

Next, you’ll implement the component that renders a list of links.

Again, in the `components` directory, go ahead and create a new file called `LinkList.js`. Then add the following code:

[ ](https://github.com/howtographql/react-apollo/blob/master/src/components/LinkList.js)[  .../hackernews-react-apollo/src/components/LinkList.js](https://github.com/howtographql/react-apollo/blob/master/src/components/LinkList.js)

```js
import React, { Component } from 'react'
import Link from './Link'

class LinkList extends Component {
  render() {
    const linksToRender = [
      {
        id: '1',
        description: 'Prisma turns your database into a GraphQL API 😎',
        url: 'https://www.prismagraphql.com',
      },
      {
        id: '2',
        description: 'The best GraphQL client',
        url: 'https://www.apollographql.com/docs/react/',
      },
    ]

    return (
      <div>{linksToRender.map(link => <Link key={link.id} link={link} />)}</div>
    )
  }
}

export default LinkList    
```

Here, you’re using local mock data for now to make sure  the component setup works. You’ll soon replace this with some actual  data loaded from the server - patience, young Padawan!

To complete the setup, open `App.js` and replace the current contents with the following:    

[ ](https://github.com/howtographql/react-apollo/blob/master/src/components/App.js)[  .../hackernews-react-apollo/src/components/App.js](https://github.com/howtographql/react-apollo/blob/master/src/components/App.js)      


Run the app to check if everything works so far! The app should now display the two links from the `linksToRender` array:


![img](https://imgur.com/VJzRyjq.png)


### Writing the GraphQL query

Next you’ll load the actual links that are stored in the database. The first thing you need to do for that is define the GraphQL query you want to send to the API.

Here is what it looks like:     

```graphql
{
  feed {
    links {
      id
      createdAt
      description
      url
    }
  }
} 
```

You could now simply execute this query in a [Playground](https://www.prisma.io/docs/graphql-ecosystem/graphql-playground/overview-chaha125ho) (against the *application schema*) and retrieve the results from your GraphQL server. But how can you use it inside your JavaScript code?

### Queries with Apollo Client

When using Apollo, you’ve got two ways of sending queries to the server.

The first one is to directly use the [query](https://www.apollographql.com/docs/react/api/apollo-client.html#ApolloClient.query) method on the `ApolloClient` directly. This is a very direct way of fetching data and will allow you to process the response as a *promise*.

A practical example would look as follows:

```js
client.query({
  query: gql`
    {
      feed {
        links {
          id
        }
      }
    }
  `
}).then(response => console.log(response.data.feed))
```
   

A more declarative way when using React however is to use new Apollo’s [render prop API](https://dev-blog.apollodata.com/introducing-react-apollo-2-1-c837cc23d926) to manage your GraphQL data just using components.


With this approach, all you need to do when it comes to data fetching is pass the GraphQL query as prop and `<Query />` component will fetch the data for you under the hood, then it’ll make it available in the component’s [render prop function](https://reactjs.org/docs/render-props.html).



In general, the process for you to add some data fetching logic will be very similar every time:(常规数据查询处理逻辑)

1. write the query as a JavaScript constant using the `gql` parser function
2. use the `<Query />` component passing the GraphQL query as prop
3. access the query results that gets injected into the component’s `render prop function`

Open up `LinkList.js` and add the query to the top of the file:

​      

[ ](https://github.com/howtographql/react-apollo/blob/master/src/components/LinkList.js)[  .../hackernews-react-apollo/src/components/LinkList.js](https://github.com/howtographql/react-apollo/blob/master/src/components/LinkList.js)

```js
const FEED_QUERY = gql`
  {
    feed {
      links {
        id
        createdAt
        url
        description
      }
    }
  }
`
   
```

Also replace the current `return` with the following:

 [ ](https://github.com/howtographql/react-apollo/blob/master/src/components/LinkList.js)[  .../hackernews-react-apollo/src/components/LinkList.js](https://github.com/howtographql/react-apollo/blob/master/src/components/LinkList.js)

```js
return (
  <Query query={FEED_QUERY}>
    {() => linksToRender.map(link => <Link key={link.id} link={link} />)}
  </Query>
)
```

What’s going on here?

1. First, you create the JavaScript constant called `FEED_QUERY` that stores the query. The `gql` function is used to parse the plain string that contains the GraphQL  code (if you’re unfamiliar with the backtick-syntax, you can read up on  JavaScript’s [tagged template literals](http://wesbos.com/tagged-template-literals/)).
2. Finally, you wrap the returned code with `<Query />` component passing `FEED_QUERY` as prop. 

> **Note**: Notice that we’re returning `linksToRender` as a function result, that’s due to `render prop function` provided by `<Query />` component.



For this code to work, you also need to import the corresponding  dependencies. Add the following two lines to the top of the file, right  below the other import statements:

​
[ ](https://github.com/howtographql/react-apollo/blob/master/src/components/LinkList.js)[  .../hackernews-react-apollo/src/components/LinkList.js](https://github.com/howtographql/react-apollo/blob/master/src/components/LinkList.js)      



Awesome, that’s all your data fetching code, can you  believe that? But as you can see, it’s not receiving server data, so  let’s make it happen 🤩



You can now finally remove the mock data and render actual links that are fetched from the server thanks to `<Query />` render prop function.

Still in `LinkList.js`, update the `component` as follows:      

[ ](https://github.com/howtographql/react-apollo/blob/master/src/components/LinkList.js)[  .../hackernews-react-apollo/src/components/LinkList.js](https://github.com/howtographql/react-apollo/blob/master/src/components/LinkList.js)

```js
class LinkList extends Component {
  render() {
    return (
      <Query query={FEED_QUERY}>
        {({ loading, error, data }) => {
          if (loading) return <div>Fetching</div>
          if (error) return <div>Error</div>
    
          const linksToRender = data.feed.links
    
          return (
            <div>
              {linksToRender.map(link => <Link key={link.id} link={link} />)}
            </div>
          )
        }}
      </Query>
    )
  }
}     
```

Let’s walk through what’s happening in this code. As expected, Apollo injected several props into the component’s `render prop function`. These props themselves provide information about the *state* of the network request:

1. `loading`: Is `true` as long as the request is still ongoing and the response hasn’t been received.
2. `error`: In case the request fails, this field will contain information about what exactly went wrong.
3. `data`: This is the actual data that was received from the server. It has the `links` property which represents a list of `Link` elements.
4. 

> In fact, the injected props contain even more functionality. You can read more in the [API overview](https://www.apollographql.com/docs/react/essentials/queries.html#render-prop).

That’s it! You should see the exact same screen as before.


> **Note**: If the browser on `http://localhost:4000` only says error and is empty otherwise, you probably forgot to have  your server running. Note that for the app to work the server needs to  run as well - so you have two running processes in your terminal: One  for the server and one for the React app. To start the server, navigate  into the `server` directory and run `yarn start`.