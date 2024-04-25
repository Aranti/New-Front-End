import React from 'react';
import TrendsCard from './TrendsCard';
import Header from '../HeaderComponent';
// import { setDropdown, setCompare, setDuration, setOutliers, setAnomalies, setMulti, getTrends } from '../../redux/ActionCreators';
// import { connect } from 'react-redux';

// const mapStateToProps = state => {
//     return {
//         trends: state.trends
//     }
// }

// const mapDispatchToProps = (dispatch) => ({
//     getTrends: () => { dispatch(getTrends()) },
//     setDropdown: (input) => { dispatch(setDropdown(input)) },
//     setCompare: (input) => { dispatch(setCompare(input)) },
//     setDuration: (input) => { dispatch(setDuration(input)) },
//     setOutliers: (input) => { dispatch(setOutliers(input)) },
//     setAnomalies: (input) => { dispatch(setAnomalies(input)) },
//     setMulti: (input) => { dispatch(setMulti(input)) }
// })

class Trends extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <React.Fragment>
                <Header isOverview={false} />
                <TrendsCard
                    // trends={this.props.trends}
                    // trendsData={this.props.trends.trendsData}
                    // isLoading={this.props.trends.isLoading}
                    // errMess={this.props.trends.errMess}
                    // _setDropdown={this.props.setDropdown}
                    // _setCompare={this.props.setCompare}
                    // _setDuration={this.props.setDuration}
                    // _setOutliers={this.props.setOutliers}
                    // _setAnomalies={this.props.setAnomalies}
                    // _setMulti={this.props.setMulti}
                    // getTrends={getTrends}
                />
            </React.Fragment>
        );
    }
}

export default Trends;