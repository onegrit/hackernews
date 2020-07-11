import React, { Component } from 'react'
import { AUTH_TOKEN } from '../constants'
import { gql } from 'apollo-boost'
import { Mutation } from 'react-apollo'


const SIGNUP_MUTATION = gql`
    mutation SignupMutation($email:String!,$password:String!,$name:String!){
        signup(email:$email,password:$password,name:$name){
            token
        }
    }
`
const LOGIN_MUTATION = gql`
    mutation LoginMutation($email:String!,$password:String!){
        login(email:$email,password:$password){
            token
        }
    }
`
/**
 * 1. One state is **for users that already have an account** and only need to login. 
 *      In this state, the component will only render two `input` fields for the user to provide their `email` and `password`. 
 *      Notice that `state.login` will be `true` in this case.
 * 2. The second state is for **users that haven’t created an account yet**, and thus still need to 
 *      sign up. Here, you also render a third `input` field where users can provide their `name`. 
 *      In this case, `state.login` will be `false`.
 * 3. The method `_confirm` will be used to implement the mutations that we need to send for the login functionality.


 */
class Login extends Component {
    state = {
        login: true, // Switch between Login and SignUp
        email: '',
        password: '',
        name: '',
    }
    _confirm = async (data) => {
        // 用户完成身份验证后，保存Token到localStorage,然后导航到首页/根目录
        const { token } = this.state.login ? data.login : data.signup
        this._saveUserData(token)
        this.props.history.push('/')
    }

    _saveUserData = token => {
        localStorage.setItem(AUTH_TOKEN, token)
    }

    render() {
        const { login, email, password, name } = this.state
        return (
            <div>
                <h4 className="mv3">{login ? 'Login' : 'Sign Up'}</h4>
                <div className="flex felx-column">
                    {!login && (
                        <input
                            value={name}
                            onChange={e => this.setState({ name: e.target.value })}
                            type="text"
                            placeholder="Your name"
                        />
                    )}
                    <input
                        value={email}
                        onChange={e => this.setState({ email: e.target.value })}
                        type="text"
                        placeholder="Your email address"
                    />
                    <input
                        value={password}
                        onChange={e => this.setState({ password: e.target.value })}
                        type="password"
                        placeholder="Choose a safe password"
                    />
                </div>
                <div className="flex mt3">
                    {/* 
                       If the user wants to just login, you’re calling the loginMutation, otherwise you’re using the signupMutation, 
                       and the mutation will be triggered on the div’s onClick event. GraphQL mutations receive the email, password 
                       and name state values as params passed on the variables prop. Lastly, after the mutation has finished, 
                       we call the _confirm function, passing the data returned by the mutation as an argument. 
                    */}
                    <Mutation
                        mutation={login ? LOGIN_MUTATION : SIGNUP_MUTATION}
                        variables={{ email, password, name }}
                        onCompleted={data => this._confirm(data)}
                    >
                        {
                            mutation => (
                                <div className="pointer mr2 button" onClick={mutation}>
                                    {login ? 'login' : 'create account'}
                                </div>
                            )
                        }
                    </Mutation>
                    <div
                        className="pointer button"
                        onClick={() => this.setState({ login: !login })}
                    >
                        {login ? 'need to create an account' : 'already have an account'}
                    </div>
                </div>
            </div>
        )
    }

}


export default Login