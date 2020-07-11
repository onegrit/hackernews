# Mutations: Creating Links

In this section, you’ll learn how you can send mutations with Apollo. It’s actually not that different from sending queries and follows the same  three steps that were mentioned before, with minor (but logical)  differences in the last two steps:

1. write the mutation as a JavaScript constant using the `gql` parser function
2. use the `<Mutation />` component passing the GraphQL mutation and variables (if needed) as props
3. use the mutation function that gets injected into the component’s `render prop function`
 

## Preparing the React components

Like before, let’s start by writing the React component where users will be able to add new links.

Create a new fi5.into it:      

[ ](https://github.com/howtographql/react-apollo/blob/master/src/components/CreateLink.js)[  .../hackernews-react-apollo/src/components/CreateLink.js](https://github.com/howtographql/react-apollo/blob/master/src/components/CreateLink.js)

```js
import React, { Component } from 'react'

class CreateLink extends Component {
  state = {
    description: '',
    url: '',
  }

  render() {
    const { description, url } = this.state
    return (
      <div>
        <div className="flex flex-column mt3">
          <input
            className="mb2"
            value={description}
            onChange={e => this.setState({ description: e.target.value })}
            type="text"
            placeholder="A description for the link"
          />
          <input
            className="mb2"
            value={url}
            onChange={e => this.setState({ url: e.target.value })}
            type="text"
            placeholder="The URL for the link"
          />
        </div>
        <button onClick={`... you'll implement this 🔜`}>Submit</button>
      </div>
    )
  }
}

export default CreateLink
```

This is a standard setup for a React component with two `input` fields where users can provide the `url` and `description` of the `Link` they want to create. **The data that’s typed into these fields is stored in the component’s `state` and will be used when the mutation is sent**.



## Writing the mutation

But how can you now actually send the mutation to your server? Let’s follow the three steps from before.

First you need to define the mutation in your JavaScript code and wrap your component with the `graphql` container. You’ll do that in a similar way as with the query before.

In `CreateLink.js`, add the following statement to the top of the file:      

[ ](https://github.com/howtographql/react-apollo/blob/master/src/components/CreateLink.js)[  .../hackernews-react-apollo/src/components/CreateLink.js](https://github.com/howtographql/react-apollo/blob/master/src/components/CreateLink.js)

```js
const POST_MUTATION = gql`
  mutation PostMutation($description: String!, $url: String!) {
    post(description: $description, url: $url) {
      id
      createdAt
      url
      description
    }
  }
`
```

 Also replace the current `button` with the following:

[ ](https://github.com/howtographql/react-apollo/blob/master/src/components/CreateLink.js)[  .../hackernews-react-apollo/src/components/CreateLink.js](https://github.com/howtographql/react-apollo/blob/master/src/components/CreateLink.js)

```js
<Mutation mutation={POST_MUTATION} variables={{ description, url }}>
  {() => (
    <button onClick={`... you'll implement this 🔜`}>
      Submit
    </button>
  )}
</Mutation>
```

Let’s take a closer look again to understand what’s going on:

1. You first create the JavaScript constant called `POST_MUTATION` that stores the mutation.
2. Now, you wrap the `button` element as `render prop function` result with `<Mutation />` component passing `POST_MUTATION` as prop.
3. Lastly you pass *description* and *url* states as `variables` prop.

Before moving on, you need to import the Apollo dependencies. Add the following to the top of `CreateLink.js`:      

[ ](https://github.com/howtographql/react-apollo/blob/master/src/components/CreateLink.js)[  .../hackernews-react-apollo/src/components/CreateLink.js](https://github.com/howtographql/react-apollo/blob/master/src/components/CreateLink.js)

```js
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'
```



Let’s see the mutation in action!

Still in `CreateLink.js`, replace `<Mutation />` component as follows:

[ ](https://github.com/howtographql/react-apollo/blob/master/src/components/CreateLink.js)[  .../hackernews-react-apollo/src/components/CreateLink.js](https://github.com/howtographql/react-apollo/blob/master/src/components/CreateLink.js)

```js
<Mutation mutation={POST_MUTATION} variables={{ description, url }}>
  {postMutation => <button onClick={postMutation}>Submit</button>}
</Mutation>
```

As promised, all you need to do is call the function that Apollo injects into `<Mutation />` component’s `render prop function` inside onClick button’s event.



Go ahead and see if the mutation works. To be able to test the code, open `App.js` and change `render` to look as follows:

​      

[ ](https://github.com/howtographql/react-apollo/blob/master/src/components/App.js)[  .../hackernews-react-apollo/src/components/App.js](https://github.com/howtographql/react-apollo/blob/master/src/components/App.js)

```js
render() {
  return <CreateLink />
}
```

Next, import the `CreateLink` component by adding the following statement to the top of `App.js`:

[ ](https://github.com/howtographql/react-apollo/blob/master/src/components/App.js)[  .../hackernews-react-apollo/src/components/App.js](https://github.com/howtographql/react-apollo/blob/master/src/components/App.js)

```js
import CreateLink from './CreateLink'
```

Now, run `yarn start`, you’ll see the following screen:

![img](https://imgur.com/AJNlEfj.png)


Two input fields and a **submit**-button - not very pretty but functional.

Enter some data into the fields, e.g.:

- **Description**: `The best learning resource for GraphQL`
- **URL**: `www.howtographql.com`
- Then click the **submit**-button. You won’t get any visual feedback in the UI, but let’s see if the query actually worked by checking the current list of links in a Playground.



You can open a Playground again by navigating to `http://localhost:4000` in your browser. Then send the following query:

​     

```graphql
# Try to write your query here
{
  feed {
    links {
      description
      url
    }
  }
}
```



You’ll see the following server response:     

```js
{
  "data": {
    "feed": {
      "links": [
        // ...
        {
          "description": "The best learning resource for GraphQL",
          "url": "www.howtographql.com"
        }
      ]
    }
  }
}
```

  Awesome! The mutation works, great job! 💪