import React from 'react';
import { baseUrl } from '../../shared/baseUrl';
import axios from 'axios';
import { connect } from 'react-redux';
import HeaderComponent from '../HeaderComponent';
import { Loading } from '../LoadingComponent';
import AisTable from './AisTable';
import { setAisData, setAisError, setAisLoading } from '../../redux/ActionCreators';

const aisurl = baseUrl + process.env.REACT_APP_AIS_DATA;

const mapStateToProps = state => {
    return {
        currentShip: state.currentShip,
        ais: state.ais
    }
}

const mapDispatchToProps = (dispatch) => ({
    setAisData: (input) => { dispatch(setAisData(input))},
    setAisError: (input) => { dispatch(setAisError(input))},
    setAisLoading: (input) => { dispatch(setAisLoading(input))}
})

class AisComponent extends React.Component {
    constructor(props) {
        super(props);

        this.getAisData = this.getAisData.bind(this);
    }

    componentDidMount() {
        this.props.setAisLoading(true);
        this.getAisData();
    }

    componentDidUpdate(prevProps, prevState) {
        if(prevProps.currentShip.currentShip !== this.props.currentShip.currentShip) {
            this.props.setAisLoading(true);
            this.getAisData();
        }
    }

    getAisData = () => {
        // let firstshipvalue = localStorage.getItem('firstshipvalue')
        let param = {'ship_imo': this.props.currentShip.currentShip['value']};

        axios({
            method: 'get',
            url: aisurl,
            params: param
        })
        .then(response => {
            // console.log(response.data);
            this.props.setAisData(response.data)
        })
        .catch(error => {
            // console.log(error.message)
            this.props.setAisError(error);
        })
    }

    render() {
        return (
            <>
                <HeaderComponent isOverview={false} />
                <div>{this.props.ais.loading === true ? <Loading /> : this.props.ais.errMess !== null ? this.props.ais.errMess.message : <AisTable />}</div>
            </>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AisComponent);