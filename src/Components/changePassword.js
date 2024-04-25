import React from 'react';
import { Card } from 'react-bootstrap';
import { setChangePassword, setConfirmChangePassword, setChangePasswordError, setChangePasswordLoading, setUsername,
        setChangePasswordResponse, setUser, setUserLoggedIn
} from '../redux/ActionCreators';
import { connect } from 'react-redux';
import { baseUrl } from '../shared/baseUrl';
import axios from 'axios';
import Header from './HeaderComponent';
import { Loading } from './LoadingComponent';
import {  Redirect, Route, HashRouter } from 'react-router-dom';

const changeurl = baseUrl + process.env.REACT_APP_CHANGE_PASSWORD;

const mapStateToProps = state => {
    return {
        password: state.password,
        loginAuth: state.loginAuth,
        currentShip: state.currentShip
    }
}

const mapDispatchToProps = (dispatch) => ({
    setChangePassword: (input) => { dispatch(setChangePassword(input)) },
    setConfirmChangePassword: (input) => { dispatch(setConfirmChangePassword(input)) },
    setChangePasswordError: (input) => { dispatch(setChangePasswordError(input)) },
    setChangePasswordLoading: (input) => { dispatch(setChangePasswordLoading(input)) },
    setChangePasswordResponse: (input) => { dispatch(setChangePasswordResponse(input)) },
    setUser: (input) => { dispatch(setUser(input)) },
    setUserLoggedIn: (input) => { dispatch(setUserLoggedIn(input)) },
    // setUsername: (input) => { dispatch(setUsername(input)) },
})

class ChangePassword extends React.Component {
    constructor(props) {
        super(props)

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(e) {
        if(e.target.id === 'password') {
            this.props.setChangePassword(e.target.value);
        }
        if(e.target.id === 'confirmpassword') {
            this.props.setConfirmChangePassword(e.target.value);
        }
        // if(e.target.id === 'username') {
        //     this.props.setUsername(e.target.value)
        // }
    }

    handleSubmit = async(e) => {
        e.preventDefault();
        // if(this.props.loginAuth.username === "") {
        //     alert("Please enter your username!");
        // }
        if(this.props.password.change_password === "") {
            alert("Please enter the new password!")
        }
        else if(this.props.password.confirm_change_password === "") {
            alert("Please confirm new password!");
        }
        else {
            const loggedInUserId = localStorage.getItem('userid');
            let param = {
                // 'ship_imo': this.props.currentShip.currentShip['value'],
                'id': this.props.loginAuth.user ? this.props.loginAuth.user['id'] : loggedInUserId,
                'newpassword': this.props.password.confirm_change_password
            }

            await axios({
                method: "post",
                url: changeurl,
                params: param
            })
            .then(res => {
                this.props.setChangePasswordResponse(res.data);
                setTimeout(() => {
                    this.props.setUser(null);
                    this.props.setUserLoggedIn(false);
                    localStorage.clear();

                    //LOCALHOST
                    // window.location.href = process.env.REACT_APP_LOCALHOST_LOGOUT

                    //TESTING
                    window.location.href = process.env.REACT_APP_SHIP_INTEL_2_LOGOUT

                    // ACTUAL
                    // window.location.href = process.env.REACT_APP_SHIP_LINK_2_LOGOUT
                }, 5000)
                // this.props.history.push('/logout')
            })
            .catch(error => {
                this.props.setChangePasswordError(error);
            })
        }
    }

    render() {
        return (
            <>
                <Header isOverview={false} />
                <div className="row">
                    <div className="col-md-12 col-sm-12">                    
                        <Card className="logincard">
                            <div className="login-wrapper" style={{paddingTop: "10px", paddingLeft: "30px", paddingRight: "30px", paddingBottom: "10px"}}>
                                <form onSubmit={this.handleSubmit}>
                                    {/* <div className="form-group">
                                        <label htmlFor="username">Username</label>
                                        <input
                                            type="email"
                                            id="username"
                                            className="form-control"
                                            placeholder="Enter Username"
                                            onChange={this.handleChange}
                                        />
                                        { this.state.username === "" ? <small style={{color: 'red'}}>{this.state.empty_username}</small> : "" }
                                    </div> */}
                                    <div className="form-group">
                                        <label htmlFor="password">New Password</label>
                                        <input
                                            type="password"
                                            id="password"
                                            className="form-control"
                                            placeholder="Enter Password"
                                            onChange={this.handleChange}
                                        />
                                        {/* { this.state.password === "" ? <small style={{color: 'red'}}>{this.state.empty_password}</small> : "" } */}
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="confirmpassword">Confirm New Password</label>
                                        <input
                                            type="text"
                                            id="confirmpassword"
                                            className="form-control"
                                            placeholder="Re-Enter Password"
                                            onChange={this.handleChange}
                                        />
                                        {/* { this.state.password === "" ? <small style={{color: 'red'}}>{this.state.empty_password}</small> : "" } */}
                                    </div>
                                    {/* <div className="form-group" style={{paddingLeft: "20px"}}>
                                        <input
                                            type="checkbox"
                                            id="remember"
                                            className="form-check-input"                                  
                                        />
                                        <label htmlFor="remember">Remember Me</label>
                                    </div> */}
                                    <div className="form-group">
                                        {
                                            // user !== null ?
                                            // <Link to="/overview" style={{color: "white", textDecoration: "none"}}>
                                                <button
                                                    type="submit"
                                                    className="btn btn-success"
                                                    // onSubmit={handleSubmit}
                                                >Change Password</button>
                                                
                                            //</Link> 
                                            // :
                                            // <Link to="/login" style={{color: "white", textDecoration: "none"}}>
                                            //     <button
                                            //         type="submit"
                                            //         className="btn btn-success"
                                            //         onClick={handleSubmit}
                                            //     ><FontAwesomeIcon icon={faUserCheck} />Sign In</button>
                                            // </Link>
                                        }
                                        {
                                            this.props.password.change_password_loading === true ?
                                            <Loading /> :
                                            this.props.password.change_password_error !== null ?
                                            <small style={{color: 'red'}}>{this.props.password.change_password_error.message}</small> :
                                            this.props.password.change_password_response !== null ?
                                            <small style={{color: 'green'}}>{this.props.password.change_password_response+" You will be logged out in a few seconds. Log in with the new password."}</small> : ""
                                        }
                                    </div>
                                    {/* { this.props.loginAuth.loginerror !== null ? <small style={{color: 'red'}}>{this.props.loginAuth.loginerror}</small> : "" } */}
                                    {/* <small style={{color: 'red'}}>{this.props.loginAuth.loginerror}</small> */}
                                    {/* <div className="form-group">
                                        <Link to="/changepassword">Change Password?</Link>
                                    </div>
                                    <div></div> */}
                                    {/* <div className="form-group">
                                        New to ShipIntel?<Link to="/register">Sign Up</Link> now
                                    </div> */}
                                </form>
                            </div>
                        </Card>                    
                    </div>
                </div>
            </>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ChangePassword);
