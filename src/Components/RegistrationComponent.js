import React, { useState } from 'react';
import { Card } from 'react-bootstrap';
import '../../public/CommonCss/style.css';

function Registration(props) {
    const [state, setState] = useState({
        email: "",
        password: "",
        confirmPassword: "",
        organization: "",
        contact: null
    });
    const handleChange = (e) => {
        const {id, value} = e.target;
        setState(prevState => ({
            ...prevState,
            [id]: value
        }));
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        if(state.password === state.confirmPassword) {
            sendDetailsToServer(); //Saves the details to the backend server
        }
        else{
            props.showError('Passwords do not match!');
        }
    }
    return(
        <Card className="logincard">
            <div className="login-wrapper" style={{paddingTop: "10px", paddingLeft: "30px", paddingRight: "30px", paddingBottom: "10px"}}>
                <form>
                <div className="form-group text-left">
                        <label htmlFor="organization">Organization Name</label>
                        <input type="text"
                            className="form-control"
                            id="organization"
                            placeholder="Enter Organization's name"
                            value={state.name}
                            onChange={handleChange}
                            required={true}
                        />
                    </div>
                    <div className="form-group text-left">
                        <label htmlFor="email">Email</label>
                        <input type="email"
                            className="form-control"
                            id="email"
                            aria-describedby="emailHelp"
                            placeholder="Enter email"
                            value={state.email}
                            onChange={handleChange}
                            required={true}
                        />
                        <small id="emailHelp" className="form-text text-muted">We will never share your email with anyone else.</small>
                    </div>
                    <div className="form-group text-left">
                        <label htmlFor="contact">Contact</label>
                        <input type="number"
                            className="form-control"
                            id="contact"
                            placeholder="Enter Contact Number"
                            value={state.contact}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group text-left">
                        <label htmlFor="password">Password</label>
                        <input type="password"
                            className="form-control"
                            id="password"
                            placeholder="Enter password"
                            value={state.password}
                            onChange={handleChange}
                            required={true}
                        />
                    </div>
                    <div className="form-group text-left">
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <input type="password"
                            className="form-control"
                            id="confirmPassword"
                            placeholder="Confirm password"
                            value={state.confirmPassword}
                            onChange={handleChange}
                            required={true}
                        />
                    </div>
                    <button 
                        type="submit"
                        className="btn btn-primary"
                        onSubmit={handleSubmit}
                    >Sign Up</button>
                </form>
            </div>
        </Card>
    );
}

export default Registration;