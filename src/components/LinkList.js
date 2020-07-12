import React, { Component, Fragment } from 'react'
import Link from './Link'
import { gql } from 'apollo-boost'
import { Query } from 'react-apollo'
import { LINKS_PER_PAGE } from '../constants'

/**
 * 常规捕获后台数据逻辑
 * 1. write the query as a JavaScript constant using the `gql` parser function
 * 2. use the `<Query />` component passing the GraphQL query as prop
 * 3. 1. access the query results that gets injected into the component’s `render prop function`
 */
//1. write the query as a JavaScript constant using the `gql` parser function
export const FEED_QUERY = gql`
    query FeedQuery($first:Int,$skip:Int,$orderBy:LinkOrderByInput){
        {
            feed(first:$first,skip:$skip,orderBy:$orderBy){
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
                count
            }
        }
    }

`

const NEW_LINKS_SUBSCRIPTION = gql`
    subscription{
        newLink{
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
`

const NEW_VOTES_SUBSCRIPTION = gql`
    subscription{
        newVote{
            id
            link
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
            user{
                id
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
        const isNewPage = this.props.location.pathname.includes('new')
        const page = parseInt(this.props.match.params.page, 10)

        const skip = isNewPage ? (page - 1) * LINKS_PER_PAGE : 0
        const first = isNewPage ? LINKS_PER_PAGE : 100
        const orderBy = isNewPage ? 'createdAt_DESC' : null
        const data = store.readQuery({
            query: FEED_QUERY,
            variables: { first, skip, orderBy }
        })
        const votedLink = data.feed.links.find(link => link.id === linkId)
        votedLink.votes = createVote.link.votes

        store.writeQuery({ query: FEED_QUERY, data })
    }
    // 订阅新建link
    _subscribeToNewLinks = subscribeToMore => {
        subscribeToMore({
            document: NEW_LINKS_SUBSCRIPTION,
            updateQuery: (prev, { subscriptionData }) => {
                if (!subscriptionData) return prev
                const newLink = subscriptionData.data.newLink
                const exists = prev.feed.links.find(({ id }) => id === newLink.id)
                if (exists) return prev

                return Object.assign({}, prev, {
                    feed: {
                        links: [newLink, ...prev.feed.links],
                        count: prev.feed.links.length + 1,
                        __typename: prev.feed.__typename
                    }
                })
            }
        })
    }

    _subscribeToNewVotes = subscribeToMore => {
        subscribeToMore({
            document: NEW_VOTES_SUBSCRIPTION
        })
    }

    _getQueryVariables = () => {
        const isNewPage = this.props.location.pathname.includes('new')
        const page = parseInt(this.props.match.params.page, 10)

        const skip = isNewPage ? (page - 1) * LINKS_PER_PAGE : 0
        const first = isNewPage ? LINKS_PER_PAGE : 100
        const orderBy = isNewPage ? 'createdAt_DESC' : null

        return { first, skip, orderBy }

    }
    // 根据投票数排序链接：返回top 10
    _getLinksToRender = data => {
        const isNewPage = this.props.location.pathname.includes('new')
        if (isNewPage) {
            return data.feed.links
        }
        const rankedLinks = data.feed.links.slice()
        rankedLinks.sort((l1, l2) => l2.votes.length - l1.votes.length)
        return rankedLinks
    }
    _nextPage = data => {
        const page = parseInt(this.props.match.params.page, 10)
        if (page <= data.feed.count / LINKS_PER_PAGE) {
            const nextPage = page + 1
            this.props.history.push(`/new/${nextPage}`)
        }
    }
    _previousPage = () => {
        const page = parseInt(this.props.match.params.page, 10)
        if (page > 1) {
            const previousPage = page - 1
            this.props.history.push(`/new/${previousPage}`)
        }
    }
    render() {
        return (
            // 2. use the `<Query />` component passing the GraphQL query as prop
            <Query query={FEED_QUERY} variables={this._getQueryVariables()}>
                {/* 
                    3. access the query results that gets injected into the component’s `render prop function`
                */}
                {
                    ({ loading, error, data, subscribeToMore }) => { // subscribeToMore:Subscription Feature
                        if (loading) return <div>Fetching...</div>
                        if (error) return <div>Error</div>

                        //Subscription Feature
                        this._subscribeToNewLinks(subscribeToMore)
                        this._subscribeToNewVotes(subscribeToMore)

                        const linksToRender = data.feed.links
                        const isNewPage = this.props.location.pathname.includes('new')
                        const pageIndex = this.props.match.params.page
                            ? (this.props.match.params.page - 1) * LINKS_PER_PAGE
                            : 0

                        return (
                            <Fragment>
                                {linksToRender.map((link, index) =>
                                    <Link
                                        key={link.id}
                                        link={link}
                                        index={index + pageIndex}
                                        updateStoreAfterVote={this._updateCacheAfterVote}
                                    />)}
                                {isNewPage && (
                                    <div className="flex ml4 mv3 gray">
                                        <div className="pointer mr2" onClick={() => this._previousPage}>
                                            Previous
                                            </div>
                                        <div className="pointer" onClick={() => this._nextPage(data)}>Next</div>
                                    </div>
                                )}
                            </Fragment>

                        )
                    }

                }
            </Query>
        )
    }
}

export default LinkList