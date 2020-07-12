import React, { Component } from 'react'
import { withApollo } from 'react-apollo'
import gql from 'graphql-tag'
import Link from './Link'

const FEED_SEARCH_QUERY = gql`
    query FeedSearchQuery($filter:String!){
        feed(filter:$filter){
            links{
                id
                url
                description
                createdAt
                postedBy{
                    id
                    name
                }
                votes{
                    id
                    user{
                        id
                    }
                }
            }
        }
    }
`

/**
 * 组件：搜索组件
 */
class Search extends Component {

    state = {
        links: [], //links field in the component state will hold all the links to be rendered,
        filter: ''
    }
    _executeSearch = async () => {
        const { filter } = this.state
        const result = await this.props.client.query({
            query: FEED_SEARCH_QUERY,
            variables: { filter },
        })
        const links = result.data.feed.links
        this.setState({ links })
    }
    render() {
        return (
            <div>
                <div>Search
                    <input
                        type='text'
                        onChange={e => this.setState({ filter: e.target.value })}
                    />
                    <button onClick={() => this._executeSearch()}>OK</button>
                </div>
                {this.state.links.map((link, index) => (
                    <Link key={link.id} link={link} index={index} />
                ))}
            </div>
        )
    }
}
/**
 * But this time we actually want to load the data every time the user hits the search-button - not upon the initial 
 * load of the component. That’s the purpose of the withApollo function. This function injects the ApolloClient 
 * instance that you created in index.js into the Search component as a new prop called client.
 * withApollo函数向Search组件的属性中注入了ApolloClient实例-client，因此可以通过this.props.client进行访问
 */

export default withApollo(Search)