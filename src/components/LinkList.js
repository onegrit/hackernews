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
const FEED_QUERY = gql`
    {
        feed{
            links{
                id
                createdAt
                url
                description
            }
        }
    }

`

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
                    ({loading,error,data}) => {
                        if (loading) return <div>Fetching...</div>
                        if (error) return <div>Error</div>

                        const linksToRender = data.feed.links
                        
                        return(
                            <div>
                                {linksToRender.map(link => <Link key={link.id} link={link}/>)}
                            </div>
                        )
                    }
                    
                }
            </Query>
        )
    }
}

export default LinkList