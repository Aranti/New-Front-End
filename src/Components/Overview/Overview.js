import React from 'react';
import OverviewCard from './OverviewCard';
import OverviewTable from './OverviewTable';
import Header from '../HeaderComponent';
import axios from 'axios';
import { baseUrl } from '../../shared/baseUrl';
import { connect } from 'react-redux';
import { setShipImo, setCurrentShip, setShipOptions } from '../../redux/ActionCreators';

const mapStateToProps = state => {
    return {
        defaultShip: state.defaultShip,
        overview: state.overview,
        loginAuth: state.loginAuth,
        options: state.options
    }
}

const mapDispatchToProps = dispatch => ({
    setCurrentShip: (input) => { dispatch(setCurrentShip(input)) },
    setShipImo: (input) => { dispatch(setShipImo(input)) },
    setShipOptions: (input) => { dispatch(setShipOptions(input)) },
});

class Overview extends React.Component {
    constructor(props) {
        super(props)

        this.getShipInfo = this.getShipInfo.bind(this);
    }

    componentDidMount() {
        // if(this.props.options.shipoptions === []) {
        this.getShipInfo();
        // }
    }

    getShipInfo = () => {
        const loggedInUserId = localStorage.getItem("userid");
        const currentshipvalue = sessionStorage.getItem('currentshipvalue');
        const currentshiplabel = sessionStorage.getItem('currentshiplabel');
        let urls = baseUrl + process.env.REACT_APP_SHIP_INFO
        axios({
            method: 'get',
            url: urls,
            params: {
                id: this.props.loginAuth.user !== null ? this.props.loginAuth.user['id'] : loggedInUserId
            }
        })
        .then((res) => {
            // this.props.setShipOptions(res.data['Result']);
            // this.props.setShipImo(res.data['Result'][0]['value']);
            // this.props.setCurrentShip(res.data['Result'][0]);
            // console.log(res.data)
            this.props.setShipOptions(res.data['Result']);
            if(typeof currentshiplabel !== typeof null && typeof currentshipvalue !== typeof null) {
                this.props.setShipImo(currentshipvalue);
                this.props.setCurrentShip({'label': currentshiplabel, 'value': currentshipvalue});
            }
            else {
                this.props.setShipImo(res.data['Result'][0]['value']);
                this.props.setCurrentShip(res.data['Result'][0]);
            }
        })
        .catch((error) => {
            console.log(error)
        });
    
        // return result;
    }

    render() {
        return (
            <div>
                <Header isOverview={true} />
                <OverviewCard />
                <OverviewTable />
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Overview);