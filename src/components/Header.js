import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { withRouter } from 'react-router'
import {AUTH_TOKEN} from '../constants'


/**
 * 1. You first retrieve the `authToken` from local storage. If the `authToken` is not available, 
 *  the **submit**-button won’t be rendered any more. That way you make sure only authenticated 
 *  users can create new links.
    2. You’re also adding a second button to the right of the `Header` that users can use to login and logout.



 */
class Header extends Component {
    render() {
        const authToken = localStorage.getItem(AUTH_TOKEN)
        return (
            <div className="flex pal justify-between nowrap orange">
                <div className="flex felx-fixed black">
                    <div className="fw7 mr1">Hacker News</div>
                    <Link to="/" className="ml1 no-underline black" >New</Link>
                    <div className="ml1">|</div>
                    <Link to="/search" className="ml1 no-underline black">Search</Link>
                    {
                        authToken && (
                            <div className="flex">
                                <div className="ml1">|</div>
                                <Link to="/create" className="ml1 no-underline black">Submit</Link>
                            </div>
                        )
                    }
                </div>
                <div className="flex flex-fixed">
                    {authToken
                        ? (
                            <div
                                className="ml1 pointer black"
                                onClick={
                                    () => {
                                        localStorage.removeItem(AUTH_TOKEN)
                                        this.props.history.push('/')
                                    }
                                }
                            >Logout</div>
                        )
                        : (
                            <Link to="/login" className="ml1 no-underline black">Login</Link>
                        )
                    }
                </div>
            </div>
        )
    }
}

export default withRouter(Header)