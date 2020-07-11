# Routing 路由

In this section, you’ll learn how to use the [react-router](https://github.com/ReactTraining/react-router) library with Apollo to implement some navigation functionality!

## Install dependencies

First add the required dependencies to the app. Open a terminal, navigate to your project directory and type:
      

[$](https://github.com/howtographql/react-apollo/blob/master/hackernews-react-apollo)[.../hackernews-react-apollo](https://github.com/howtographql/react-apollo/blob/master/hackernews-react-apollo)

```bash
yarn add react-router react-router-dom
```
      

## Create a Header 创建Header组件

Before moving on to configure the different routes for your application, you need to create a `Header` component that users can use to navigate between the different parts of your app.

Create a new file in `src/components` and call it `Header.js`. Then paste the following code inside of it:      

[ ](https://github.com/howtographql/react-apollo/blob/master/src/components/Header.js)[  .../hackernews-react-apollo/src/components/Header.js](https://github.com/howtographql/react-apollo/blob/master/src/components/Header.js)

```js
import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { withRouter } from 'react-router'

class Header extends Component {
  render() {
    return (
      <div className="flex pa1 justify-between nowrap orange">
        <div className="flex flex-fixed black">
          <div className="fw7 mr1">Hacker News</div>
          <Link to="/" className="ml1 no-underline black">
            new
          </Link>
          <div className="ml1">|</div>
          <Link to="/create" className="ml1 no-underline black">
            submit
          </Link>
        </div>
      </div>
    )
  }
}

export default withRouter(Header)
```

 This simply renders two `Link` components that users can use to navigate between the `LinkList` and the `CreateLink` components.


> Don’t get confused by the “other” `Link` component that is used here. The one that you’re using in the `Header` has nothing to do with the `Link` component that you wrote before, they just happen to have the same name. This [Link](https://github.com/ReactTraining/react-router/blob/master/packages/react-router-dom/docs/api/Link.md) stems from the `react-router-dom` package and allows you to navigate between routes inside of your application.

## Setup routes 设置路由

You’ll configure the different routes for the app in the project’s root component: `App`.

Open the corresponding file `App.js` and update `render` to include the `Header` as well as `LinkList` and the `CreateLink` components under different routes:      

[ ](https://github.com/howtographql/react-apollo/blob/master/src/components/App.js)[  .../hackernews-react-apollo/src/components/App.js](https://github.com/howtographql/react-apollo/blob/master/src/components/App.js)

```js
render() {
  return (
    <div className="center w85">
      <Header />
      <div className="ph3 pv1 background-gray">
        <Switch>
          <Route exact path="/" component={LinkList} />
          <Route exact path="/create" component={CreateLink} />
        </Switch>
      </div>
    </div>
  )
}
```

For this code to work, you need to import the required dependencies of `react-router-dom`.

Add the following statement to the top of the file:
      

[ ](https://github.com/howtographql/react-apollo/blob/master/src/components/App.js) [  .../hackernews-react-apollo/src/components/App.js](https://github.com/howtographql/react-apollo/blob/master/src/components/App.js)

```js
import Header from './Header'
import { Switch, Route } from 'react-router-dom'
```

Now you need to wrap the `App` with `BrowserRouter` so that all child components of `App` will get access to the routing functionality.

Open `index.js` and add the following import statement to the top:      

[ ](https://github.com/howtographql/react-apollo/blob/master/src/index.js)[  .../hackernews-react-apollo/src/index.js](https://github.com/howtographql/react-apollo/blob/master/src/index.js)

```js
import { BrowserRouter } from 'react-router-dom'
```

 Now update `ReactDOM.render` and wrap the whole app with the `BrowserRouter`:      

[ ](https://github.com/howtographql/react-apollo/blob/master/src/index.js)[  .../hackernews-react-apollo/src/index.js](https://github.com/howtographql/react-apollo/blob/master/src/index.js)

```js
ReactDOM.render(
  <BrowserRouter>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </BrowserRouter>,
  document.getElementById('root')
)
```

That’s it. If you run the app again, you can now access two URLs. `http://localhost:3000/` will render `LinkList` and `http://localhost:3000/create` renders the `CreateLink` component you just wrote in the previous section.

![img](https://imgur.com/X9bmkQH.png)


## Implement navigation

To wrap up this section, you need to implement an automatic redirect from the `CreateLink` component to the `LinkList` component after a mutation was performed.


Open `CreateLink.js` and update the `<Mutation />` component to look as follows:

[ ](https://github.com/howtographql/react-apollo/blob/master/src/components/CreateLink.js)[  .../hackernews-react-apollo/src/components/CreateLink.js](https://github.com/howtographql/react-apollo/blob/master/src/components/CreateLink.js)

```js
<Mutation
  mutation={POST_MUTATION}
  variables={{ description, url }}
  onCompleted={() => this.props.history.push('/')}
>
  {postMutation => <button onClick={postMutation}>Submit</button>}
</Mutation>
```

After the mutation was performed, `react-router-dom` will now navigate back to the `LinkList` component that’s accessible on the root route: `/`.



> **Note**: It won’t display the newly created `Link`, it’ll just redirect to the root route, you could always refresh to see  the changes made. We’ll see how to update the data after the `Mutation` is being triggered on the `More Mutations and Updating the Store` chapter!