import React, { Component } from 'react'
import { gql } from 'apollo-boost'
import { Mutation } from 'react-apollo'

/**
 * 
 * 1.First you need to define the mutation in your JavaScript code and wrap your component 
 * with the `graphql` container. 
 */
const POST_MUTATION = gql`
    mutation PostMutation($description:String!,$url:String!){
        post(description:$description,url:$url){
            id
            createdAt
            url
            description
        }
    }
`

class CreateLink extends Component {
    state = {
        description: '',
        url: ''
    }

    render() {
        const { description, url } = this.state
        return (
            <div>
                <div className="flex flex-column mt3">
                    <input
                        className="mb2"
                        value={description}
                        onChange={(e) => this.setState({ description: e.target.value })}
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
                {/* 2. 使用Mutation组件封装Submit按钮 */}
                <Mutation
                    mutation={POST_MUTATION}
                    variables={{ description, url }}
                    // implement an automatic redirect from the CreateLink component to the LinkList component 
                    // after a mutation was performed 提交后自动重定向到列表页面
                    onCompleted={() => this.props.history.push('/')}
                >
                    {
                        (postMutation) => (
                            <button onClick={postMutation}>Submit</button>
                        )
                    }
                </Mutation>
            </div>
        )
    }
}

export default CreateLink