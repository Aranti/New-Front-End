import React from 'react';
import DailyComponent from '../Components/Daily/DailyComponent';
import { Interactive } from '../Components/Interactive/Interactive';
import Trends from '../Components/Trends/Trends';
import Overview from './Overview/Overview';
// import Header from '../Components/HeaderComponent';
import UploadFile from './UploadComponent';
import Spreadsheet from './DailyInput/Spreadsheet';
import NotFoundComponent from './NotFoundComponent';
import Login from './LoginComponent';
import Logout from './LogoutComponent';
import Registration from './RegistrationComponent';
import DailyIssuesComponent from './DailyIssues/DailyIssuesComponent';
import AisComponent from './Ais/AisComponent';
import NewIVComponent from './Maintenance/New Intervention/NewIVComponent';
import SpreadsheetForBallast from './DailyInput/spreadsheetForBallast';
// import SpreadsheetForLoaded from './DailyInput/spreadsheetForLoaded';
// import SpreadsheetForFuelCons from './DailyInput/spreadsheetForFuelCons';
import ReportComponent from './Reports/ReportComponent';
import PerformancePage from './Performance/PerformancePage';
import {  Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';
import { setShipImo, setCurrentShip, setShipOptions } from '../redux/ActionCreators';
import { baseUrl } from '../shared/baseUrl';
import axios from 'axios';
import ChangePassword from './changePassword';
import Speedsuggestion from './SpeedSuggestion/Speedsuggestion';
// import PdfCreator from './createPdf';

class Main extends React.Component {
    componentDidMount() {
        this.getShipInfo();
    }

    getShipInfo = () => {
        const { loginAuth, setShipOptions, setShipImo, setCurrentShip } = this.props;
        const loggedInUserId = localStorage.getItem('userid');
        const currentshipvalue = sessionStorage.getItem('currentshipvalue');
        const currentshiplabel = sessionStorage.getItem('currentshiplabel');
        let urls = baseUrl + process.env.REACT_APP_SHIP_INFO;
        axios({
            method: 'get',
            url: urls,
            params: {
                id: loginAuth.user !== null ? loginAuth.user['id'] : loggedInUserId
            }
        })
        .then((res) => {
            setShipOptions(res.data['Result']);
            if (currentshiplabel && currentshipvalue) {
                setShipImo(currentshipvalue);
                setCurrentShip({ 'label': currentshiplabel, 'value': currentshipvalue });
            } else {
                setShipImo(res.data['Result'][0]['value']);
                setCurrentShip(res.data['Result'][0]);
            }
        })
        .catch((error) => {
            console.log(error)
        });
    }

    render() {
        const loggedInUser = localStorage.getItem('username');

        return (
            <div>
                {
                    loggedInUser ? (
                        <Routes>
                            <Route path="/overview" element={<Overview />} />
                            <Route path="/performance" element={<PerformancePage />} />
                            <Route path="/ship_obs" element={<DailyComponent />} />
                            <Route path="/ais" element={<AisComponent />} />
                            <Route path="/issues" element={<DailyIssuesComponent />} />
                            <Route path="/dailyinput" element={<Spreadsheet />} />
                            <Route path="/new_data_entry" element={<SpreadsheetForBallast />} />
                            <Route path="/interactive" element={<Interactive />} />
                            <Route path="/create_new_iv" element={<NewIVComponent />} />
                            <Route path="/reports" element={<ReportComponent />} />
                            <Route path="/changepassword" element={<ChangePassword />} />
                            <Route path="/Speedsuggestion" element={<Speedsuggestion />} />
                            <Route path="/trends" element={<Trends />} />
                            <Route path="*" element={<Navigate to="/overview" />} />
                        </Routes>
                    ) : (
                        <Routes>
                            <Route path="/login" element={<Login />} />
                            <Route path="/logout" element={<Logout />} />
                            <Route path="*" element={<Navigate to="/login" />} />
                        </Routes>
                    )
                }
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        defaultShip: state.defaultShip,
        overview: state.overview,
        loginAuth: state.loginAuth,
        options: state.options,
        dailyData: state.dailyData,
        dailyCollapsible: state.dailyCollapsible
    }
}

const mapDispatchToProps = dispatch => ({
    setCurrentShip: (input) => { dispatch(setCurrentShip(input)) },
    setShipImo: (input) => { dispatch(setShipImo(input)) },
    setShipOptions: (input) => { dispatch(setShipOptions(input)) },
});

export default connect(mapStateToProps, mapDispatchToProps)(Main);