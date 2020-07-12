import React, { Component } from 'react'
import Link from './Link'
import { gql } from 'apollo-boost'
import { Query } from 'react-apollo'


/**
 * 常规捕获后台数据逻辑
 * 1. write the query as a JavaScript constant using the `gql` parser function
 * 2. use the `<Query />` component passing the GraphQL query as prop
 * 3. 1. access the query results that gets injected into the component’s `render prop function`
 */
//1. write the query as a JavaScript constant using the `gql` parser function
export const FEED_QUERY = gql`
    {
        feed{
            links{
                id
                createdAt
                url
                description
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

class LinkList extends Component {
    /**
     * You start by reading the current state of the cached data for the FEED_QUERY from the store.
        Now you’re retrieving the link that the user just voted for from that list. You’re also manipulating that link 
        by resetting its votes to the votes that were just returned by the server.
        Finally, you take the modified data and write it back into the store.
     * @param {*} store 
     * @param {*} createVote 
     * @param {*} linkId 
     */
    _updateCacheAfterVote = (store, createVote, linkId) => {
        const data = store.readQuery({ query: FEED_QUERY })
        const votedLink = data.feed.links.find(link => link.id === linkId)
        votedLink.votes = createVote.link.votes

        store.writeQuery({ query: FEED_QUERY, data })
    }

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
            {
                id: '3',
                description: 'Very good movies website',
                url: 'https://www.youbube.com',
            },
        ]
        return (
            // 2. use the `<Query />` component passing the GraphQL query as prop
            <Query query={FEED_QUERY}>
                {/* 
                    3. access the query results that gets injected into the component’s `render prop function`
                */}
                {
                    ({ loading, error, data }) => {
                        if (loading) return <div>Fetching...</div>
                        if (error) return <div>Error</div>

                        const linksToRender = data.feed.links

                        return (
                            <div>
                                {linksToRender.map((link, index) =>
                                    <Link
                                        key={link.id}
                                        link={link}
                                        index={index}
                                        updateCacheAfterVote={this._updateCacheAfterVote}
                                    />)}
                            </div>
                        )
                    }

                }
            </Query>
        )
    }
}

export default LinkList