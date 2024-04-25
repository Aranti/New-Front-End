import React, { useState} from 'react';
import { Link, useHistory } from 'react-router-dom';
import '../../public/CommonCss/style.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCheck } from "@fortawesome/free-solid-svg-icons";
import { Card } from 'react-bootstrap';
import { useSelector, useDispatch} from 'react-redux';
import { setUserLoggedIn, setUser, setLoginError, setUsername, setPassword } from '../redux/ActionCreators';
// import { Control, Form, Errors } from 'react-redux-form';
import { connect } from 'react-redux';
import { baseUrl } from '../shared/baseUrl';
import axios from 'axios';
import { createBrowserHistory } from 'history';
// import history from 'history/hash';

const loginurl = baseUrl + process.env.REACT_APP_LOGIN
let history = createBrowserHistory();
// var history = useHistory()
const required = (val) => val && val.length;
const maxLength = (len) => (val) => !(val) || (val.length >= len);
const minLength = (len) => (val) => val && (val.length >= len);
const isNumber = (val) => !isNaN(Number(val));
const validEmail = (val) => /^[A-Z0-9._%+-]+@[A-Z]{2,4}$/i.test(val);

/*
    May
    As the name suggests this is the component that renders the
    Login page of the application.
    Checks if the required fields are filled first and then sends
    the request to the backend to get the user authenticated.
*/

const mapStateToProps = state => {
    return {
        dailyData: state.dailyData,
        trends: state.trends,
        loginAuth: state.loginAuth
    }
}

const mapDispatchToProps = (dispatch) => ({
    setUserLoggedIn: (input) => { dispatch(setUserLoggedIn(input)) },
    setUser: (input) => { dispatch(setUser(input)) },
    setLoginError: (input) => { dispatch(setLoginError(input)) },
    setUsername: (input) => { dispatch(setUsername(input)) },
    setPassword: (input) => { dispatch(setPassword(input)) },
})

class Login extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            username: "",
            password: "",
            empty_username: "",
            empty_password: ""
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    // const isUserLoggedIn = useSelector((state) => state.isUserLoggedIn);
    // const user = useSelector((state) => state.user);
    // const loginerror = useSelector((state) => state.loginerror);
    // const dispatch = useDispatch();
    
    // const [user, setUser] = useState();
    componentDidMount() {

    }

    componentDidUpdate(prevProps, prevState) {
        if(prevState.username !== this.state.username) {
            this.setState({
                username: this.state.username
            })
        }
        if(prevState.username !== this.state.password) {
            this.setState({
                password: this.state.password
            })
        }
    }

    handleChange = (e) => {
        if(e.target.id === 'username') {
            this.props.setUsername(e.target.value);
        }
        if(e.target.id === 'password') {
            this.props.setPassword(e.target.value);
        }
        // const {id, value} = e.target;
        // this.setState(prevState => ({
        //     ...prevState,
        //     [id]: value
        // }));
    }

    handleSubmit = async (e) => {
        e.preventDefault();
        if(this.props.loginAuth.username === "") {
            this.setState({
                empty_username: "Please fill this field!"
            })
        }
        else if(this.props.loginAuth.password === "") {
            this.setState({
                empty_password: "Please fill this field!"
            })
        }
        else {
            await axios({
                method: "post",
                url: loginurl,
                params: {
                    username: this.props.loginAuth.username,
                    password: this.props.loginAuth.password
                }
            })
            .then(response => {
                // if(typeof response.data === String) {
                //     console.log("IF ENTERED!!!!!!!!!!!!!!!!");
                //     history.push('/login')
                //     this.props.setLoginError("Username or Password incorrect."));
                // }
                // else {
                // this.props.setUserLoggedIn(true);
                this.props.setUser(response.data);
                // console.log(response.data)
                localStorage.setItem('username', response.data['name']);
                localStorage.setItem('userid', response.data['id']);
                this.props.history.push('/overview');
                // window.location.pathname.replace('login', 'overview');
                // history.replace('/#/overview')
                // }
            })
            .catch(error => {
                // history.push('/login')
                this.props.setLoginError("user name or password incorrect *!!!");
            })
        }
    }

    render() {
        // const loggedInUserId = localStorage.getItem("userid");
        // const loggedInUser = localStorage.getItem("username");

        // if(typeof loggedInUserId === typeof String) {
        //     this.props.history.push('/overview');
        //     let userinfo = {'name': loggedInUser, 'id': loggedInUserId}
        //     this.props.setUser(userinfo);
        // }
        // else {
        return(
            <div className="">
                <div className="row">
                    <div className="col-md-12 col-sm-12">                    
                        <Card className="logincard">
                            <div className="login-wrapper" style={{paddingTop: "10px", paddingLeft: "30px", paddingRight: "30px", paddingBottom: "10px"}}>
                                <form onSubmit={this.handleSubmit}>
                                    <div className="form-group">
                                        <label htmlFor="username">Username</label>
                                        <input
                                            type="email"
                                            id="username"
                                            className="form-control"
                                            placeholder="Enter Username"
                                            onChange={this.handleChange}
                                        />
                                        { this.state.username === "" ? <small style={{color: 'red'}}>{this.state.empty_username}</small> : "" }
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="password">Password</label>
                                        <input
                                            type="password"
                                            id="password"
                                            className="form-control"
                                            placeholder="Enter Password"
                                            onChange={this.handleChange}
                                        />
                                        { this.state.password === "" ? <small style={{color: 'red'}}>{this.state.empty_password}</small> : "" }
                                    </div>
                                    <div className="form-group" style={{paddingLeft: "20px"}}>
                                        <input
                                            type="checkbox"
                                            id="remember"
                                            className="form-check-input"                                  
                                        />
                                        <label htmlFor="remember">Remember Me</label>
                                    </div>
                                    <div className="form-group">
                                        {
                                            // user !== null ?
                                            // <Link to="/overview" style={{color: "white", textDecoration: "none"}}>
                                                <button
                                                    type="submit"
                                                    className="btn btn-success"
                                                    // onSubmit={handleSubmit}
                                                ><FontAwesomeIcon icon={faUserCheck} />Sign In</button>
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
                                    </div>
                                    { this.props.loginAuth.loginerror !== null ? <small style={{color: 'red'}}>{this.props.loginAuth.loginerror}</small> : "" }
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
            </div>
        );
        // }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);