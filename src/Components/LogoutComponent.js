import React from 'react';
import { Link } from 'react-router-dom';
import { setUser, setUserLoggedIn } from '../redux/ActionCreators';
import { connect } from 'react-redux';

/*
    May
    This is the Logout Component.
    Will show the link back to the Login Component.
*/

const mapStateToProps = state => {
    return {
        defaultShip: state.defaultShip,
        currentShip: state.currentShip,
        trends: state.trends,
        loginAuth: state.loginAuth,
        options: state.options
    }
}

const mapDispatchToProps = (dispatch) => ({
    // setShipImo: (input) => { dispatch(setShipImo(input)) },
    // setCurrentShip: (input) => { dispatch(setCurrentShip(input)) },
    // setDailyInput: (input) => { dispatch(setDailyInput(input)) },
    // setShipOptions: (input) => { dispatch(setShipOptions(input)) },
    setUser: (input) => { dispatch(setUser(input)) },
    setUserLoggedIn: (input) => { dispatch(setUserLoggedIn(input)) },
});

class Logout extends React.Component {
    constructor(props) {
        super(props);

        this.handleLogout = this.handleLogout.bind(this);
    }

    async componentDidMount() {
        this.handleLogout();
    }

    handleLogout() {
        this.props.setUser(null);
        this.props.setUserLoggedIn(false);
        localStorage.clear();
    }

    render() {
        return (
            <div>
                <h1>Successfully Logged out!</h1>
                <h3>Click <Link to="/login">Login</Link> to log back in</h3>
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Logout)