import React, { Component } from 'react'
import { AUTH_TOKEN } from '../constants'
import { timeDifferenceForDate } from '../utils'
import { Mutation } from 'react-apollo'
import { gql } from 'apollo-boost'
// 注意：文档中的gql引用的是下面的包
// import gql from 'grapqhql-tag'

const VOTE_MUTATION = gql`
    mutation VoteMutation($linkId:ID!){
        vote(linkId:$linkId){
            id
            link{
                id
                votes{
                    id
                    user{
                        id
                    }
                }
            }
            user{
                id
            }
        }
    }
`

class Link extends Component {
    render() {
        const authToken = localStorage.getItem(AUTH_TOKEN)

        return (
            <Mutation
                mutation={VOTE_MUTATION}
                variables={{ linkId: this.props.link.id }}
                update={(store, { data: { vote } }) =>
                    this.props.updateStoreAfterVote(store, vote, this.props.link.id)
                }
            >
                {
                    voteMutation => (
                        <div className="flex mt2 items-start">
                            <div className="flex items-center">
                                <span className="gray">{this.props.index + 1}.</span>
                                {/* 只有用户经过身份验证后才允许vote */}
                                {authToken && (
                                    // The update function that you’re passing as prop to the <Mutation /> component will be called directly 
                                    // after the server returned the response. It receives the payload of the mutation (data) and the current 
                                    // cache (store) as arguments. You can then use this input to determine a new state for the cache.
                                    <div className="ml1 gray f11" onClick={voteMutation}>
                                        ▲
                                    </div>

                                )}
                            </div>
                            <div className="ml1">
                                <div>
                                    {this.props.link.description} ({this.props.link.url})
                    </div>
                                <div className="f6 1h-copy gray">
                                    {this.props.link.votes.length} votes | by {' '}
                                    {this.props.link.postedBy
                                        ? this.props.link.postedBy.name
                                        : 'Unknow'
                                    } {' '}
                                    {timeDifferenceForDate(this.props.link.createdAt)}
                                </div>
                            </div>
                            <div>{this.props.link.description} ({this.props.link.url})</div>
                        </div>
                    )
                }

            </Mutation>
        )
    }
}

export default Link