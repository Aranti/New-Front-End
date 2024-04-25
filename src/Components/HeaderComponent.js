import React, { Component } from 'react';
import { Nav, Navbar, NavbarBrand, NavbarToggler, Collapse, NavItem, Container, Button, Tooltip } from 'reactstrap';
import { NavLink, Link, useLocation } from 'react-router-dom';
// import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFile, faPrint, faPlus, faCross, faUserCircle } from "@fortawesome/free-solid-svg-icons";
import "../../public/CommonCss/style.css";
import Select from 'react-select';
import { setShipImo, setDailyInput, setCurrentShip, setShipOptions, setUser, setUserLoggedIn, setDailyInputType } from '../redux/ActionCreators';
import { connect } from 'react-redux';
import axios from 'axios';
import {baseUrl} from '../shared/baseUrl';
// import { pdfCreator } from '../shared/createPdf';
import { Table, Col, Row, Modal, ModalBody, ModalTitle, ModalFooter } from 'react-bootstrap';
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faEllipsisV, faPlus, faCross } from "@fortawesome/free-solid-svg-icons";
import { SpreadsheetComponent, SheetsDirective, SheetDirective, RangesDirective } from '@syncfusion/ej2-react-spreadsheet';
import { RangeDirective, ColumnsDirective, ColumnDirective } from '@syncfusion/ej2-react-spreadsheet';
const logo = require("../../public/logo/logo_circular_ocean_intel.png")

const urls = baseUrl + process.env.REACT_APP_SEND_BACKEND;

/*
    May
    This component renders the navigation tab on the top of the application.
    This tab contains the links to all the pages of the application.
*/

// function getShipInfo() {
//     let result;
//     let urls = baseUrl + '/ship_info';
//     axios({
//         method: 'get',
//         url: urls
//     })
//     .then((res) => {
//         result = res.data
//         console.log(res.data)
//     })
//     .catch((error) => {
//         console.log(error)
//     });

//     return result;
// }

// var options = await getShipInfo();
// console.log("OPTIONS", options)

// var options = [
//     {
//         value: 9591301, label: "ATM Book"
//     },
//     {
//         value: 6461325, label: "RTM Pandier"
//     },
//     {
//         value: 9591302, label: "ATM Book Special"
//     }
// ];

const mapStateToProps = state => {
    return {
        defaultShip: state.defaultShip,
        currentShip: state.currentShip,
        trends: state.trends,
        loginAuth: state.loginAuth,
        options: state.options,
        dailyCollapsible: state.dailyCollapsible,
        dailyData: state.dailyData
    }
}

const mapDispatchToProps = (dispatch) => ({
    setShipImo: (input) => { dispatch(setShipImo(input)) },
    setCurrentShip: (input) => { dispatch(setCurrentShip(input)) },
    setDailyInput: (input) => { dispatch(setDailyInput(input)) },
    setDailyInputType: (input) => { dispatch(setDailyInputType(input)) },
    setShipOptions: (input) => { dispatch(setShipOptions(input)) },
    setUser: (input) => { dispatch(setUser(input)) },
    setUserLoggedIn: (input) => { dispatch(setUserLoggedIn(input)) },
});

class Header extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isNavOpen: false,
            isReportOpen: false,
            isPrintOpen: false,
            ship_imo: null,
            ship_info: [],
            isModal1Open: false,
            isModal2Open: false,
            // defaultShip: {value: 9591301, label: "ATM Book"}
            defaultShip: this.props.defaultShip.defaultShip,
            selectedFile: null,
            location: window.location.hash
        }

        this.toggleNav = this.toggleNav.bind(this);
        this.toggleReport = this.toggleReport.bind(this);
        this.togglePrint = this.togglePrint.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.getShipInfo = this.getShipInfo.bind(this);
        // this.modal1Show = this.modal1Show.bind(this);
        // this.modal1Hide = this.modal1Hide.bind(this);
        // this.modal2Show = this.modal2Show.bind(this);
        // this.modal2Hide = this.modal2Hide.bind(this);
        this.handleNavLinkCLick = this.handleNavLinkCLick.bind(this);
        // this.onNoonUpload = this.onNoonUpload.bind(this);
        // this.onLogsUpload = this.onLogsUpload.bind(this);
        this.handleLogoutClick = this.handleLogoutClick.bind(this);
        // this.createReport = this.createReport.bind(this);
    }

    async componentDidMount() {
        // this.getChartData();
        // if(this.props.options.shipoptions !== []) {
        //     this.getShipInfo();
        // }
        const currentshipvalue = sessionStorage.getItem('currentshipvalue');
        const currentshiplabel = sessionStorage.getItem('currentshiplabel');
        const daily_input = sessionStorage.getItem('daily_input');
        const daily_input_type = sessionStorage.getItem('daily_input_type');
        if(typeof currentshiplabel !== typeof null && typeof currentshipvalue !== typeof null) {
            this.props.setCurrentShip({'label': currentshiplabel, 'value': currentshipvalue})
            if(currentshipvalue === 9592301 || currentshipvalue === '9592301') {
                this.props.setDailyInput('logs')
            }
            else {
                this.props.setDailyInput('noon')
            }
            // if(typeof daily_input !== typeof null) {
            this.props.setDailyInput('noon')
            // }
            // if(typeof daily_input_type !== typeof null) {
            this.props.setDailyInputType('fuel')
            // }
        }
    }

    async componentDidUpdate(prevProps, prevState) {
        // if(prevProps.trends.trends !== this.props.trends.trends) {
        //     this.setState({
        //         ship_imo: this.props.trends.ship_imo,
        //     });
        // }
        // if(prevProps.defaultShip.defaultShip !== this.props.defaultShip.defaultShip) {
        //     this.setState({
        //         defaultShip: this.props.defaultShip.defaultShip
        //     })
        // }
        // if(prevState.location !== window.location.hash) {
        //     this.setState({
        //         location: window.location.hash
        //     });
        // }
        // console.log(this.state.ship_info)
    }

    shouldComponentUpdate(nextProps, nextState) {
        if(this.props !== nextProps || this.state !== nextState) {
            return true;
        }
        else {
            return false;
        }
    }

    toggleNav() {
        this.setState({
            isNavOpen: !this.state.isNavOpen
        });
    }

    toggleReport() {
        this.setState({
            isReportOpen: !this.state.isReportOpen
        });
    }

    togglePrint() {
        this.setState({
            isPrintOpen: !this.state.isPrintOpen
        });
    }

    handleLogoutClick() {
        // Logs the user out of the application.
        // Clears the local storage or the cookies stored
        // to remember the user when he was logged in.
        this.props.setUser(null);
        this.props.setUserLoggedIn(false);
        localStorage.clear();
    }

    getShipInfo = () => {
        // Gets the list of dictionaries of all the ships that match the
        // account id. Dictionaries are of the format {'label': ship_name, 'value': ship_imo}
        // If there is a previously selected ship during the same session, then set that ship as
        // the current ship, else set the first ship in the list as the current ship.
        let urls = baseUrl + process.env.REACT_APP_SHIP_INFO
        const currentshipvalue = sessionStorage.getItem('currentshipvalue');
        const currentshiplabel = sessionStorage.getItem('currentshiplabel');
        axios({
            method: 'get',
            url: urls,
            params: {
                id: this.props.loginAuth.user['id']
            }
        })
        .then((res) => {
            this.props.setShipOptions(res.data['Result']);
            this.props.setShipOptions(res.data['Result']);
            if(typeof currentshiplabel !== typeof null && typeof currentshipvalue !== typeof null) {
                this.props.setShipImo(currentshipvalue);
                this.props.setCurrentShip({'label': currentshiplabel, 'value': currentshipvalue});
            }
            else {
                this.props.setShipImo(res.data['Result'][0]['value']);
                this.props.setCurrentShip(res.data['Result'][0]);
                localStorage.setItem("firstshipvalue", res.data['Result'][0]['value']);
            }

            
            // this.setState({
            //     ship_info: res.data['Result']
            // })
            console.log(res.data)
        })
        .catch((error) => {
            console.log(error)
        });
    
        // return result;
    }

    handleChange = (selectedOption) => {
        // Selects the ships

        this.props.setShipImo(selectedOption['value']);
        this.props.setCurrentShip(selectedOption);
        sessionStorage.setItem('currentshipvalue', selectedOption['value']);
        sessionStorage.setItem('currentshiplabel', selectedOption['label']);
        localStorage.setItem('firstshipvalue', selectedOption['value'])
        console.log(selectedOption);
        // console.log(window.location.hash === '#/daily')
    }

    handleNavLinkCLick(e) {
        e.preventDefault();
    }

    render() {
        // const options = getShipInfo();
        const loggedInUser = localStorage.getItem('username');
        // console.log('currentship', currentship)
        return(
            <div>
                <Navbar className="navbar-style" light expand="md">
                    {/* <Container> */}
                        <NavbarToggler onClick={this.toggleNav} />
                        <NavbarBrand className="mr-auto"><img src={require("../../public/logo/logo_circular_ocean_intel.png").default} height="30" width="41" alt="OceanIntel.ai" /></NavbarBrand>
                        {this.props.isOverview !== true ? <Select id="ship-select" className="selects" menuPortalTarget={document.body} options={this.props.options.shipoptions && this.props.options.shipoptions} value={this.props.currentShip.currentShip && this.props.currentShip.currentShip} onChange={this.handleChange}></Select> : <div className="selects"></div>}
                        <Collapse isOpen={this.state.isNavOpen} navbar>
                            <Nav navbar style={{marginLeft: "10px", overflowY: "initial"}}>
                                <NavItem style={{marginLeft: "10px"}} eventkey={1} className="dropdown">
                                    <NavLink className="a-link navlink-style" activeClassName='navlink-style-active' exact={true} to='/overview'>Overview</NavLink>
                                </NavItem>
                                <NavItem style={{marginLeft: "10px"}} eventkey={2} className="dropdown">
                                    <div className="dropdownbtn a-link" style={{color: window.location.href.includes('insights') || window.location.href.includes('issues') ? '#f921fb' : 'white'}}>Issues</div>
                                    <div className="dropdown-content">
                                        <NavLink className="a-sublink navlink-style" activeClassName='navlink-style-active' exact={true} to='/insights'>Insights</NavLink>
                                        <NavLink className="a-sublink navlink-style" activeClassName='navlink-style-active' exact={true} to='/issues'>Issues</NavLink>
                                    </div>
                                </NavItem>
                                <NavItem style={{marginLeft: "10px"}} eventkey={2} className="dropdown">
                                    <div className="dropdownbtn a-link" style={{color: window.location.href.includes('dailyinput') || window.location.href.includes('new_data_entry') || window.location.href.includes('create_new_iv') || window.location.href.includes('edit_iv') ? '#f921fb' : 'white'}}>Inputs</div>
                                    <div className="dropdown-content">
                                        <NavLink className="a-sublink navlink-style" activeClassName='navlink-style-active' exact={true} to='/dailyinput'>Logs &amp; Noon Reports</NavLink>
                                        <NavLink className="a-sublink navlink-style" activeClassName='navlink-style-active' exact={true} to='/new_data_entry'>New Performance Data Entry</NavLink>
                                        {/* <NavLink exact={true} to='/ballast_condition'>Ballast Condition</NavLink>
                                        <NavLink exact={true} to='/fuel_cons'>Fuel Cons</NavLink> */}
                                        {/* <NavLink exact={true} to='/ais_data'>AIS Feeds</NavLink> */}
                                        {/* <NavLink exact={true} to='/vdr'>VDR Feeds</NavLink> */}
                                        {/* <NavLink exact={true} to='/forms'>Other Forms</NavLink> */}
                                        <div className="subdropdown">
                                            <div className="subdropdownbtn a-sublink">Maintenance</div>
                                            <div className='dropdown-subcontent submenu'>
                                                <NavLink className="a-sublink navlink-style" activeClassName='navlink-style-active' exact={true} to='/create_new_iv'>Create New Intervention</NavLink>
                                                <NavLink className="a-sublink navlink-style" activeClassName='navlink-style-active' exact={true} to='/edit_iv'>Edit Existing Intervention</NavLink>
                                            </div>
                                        </div>
                                    </div>
                                </NavItem>
                                
                                <NavItem style={{marginLeft: "10px"}} eventkey={4} className="dropdown">
                                    <div className="dropdownbtn a-link" style={{color: window.location.href.includes('ship_obs') || window.location.href.includes('ais') ? '#f921fb' : 'white'}}>Daily Data</div>
                                    <div className="dropdown-content">
                                        <NavLink className="a-sublink navlink-style" activeClassName='navlink-style-active' exact={true} to='/ship_obs'>Ship Observations</NavLink>
                                        <NavLink className="a-sublink navlink-style" activeClassName='navlink-style-active' exact={true} to='/ais'>AIS Data</NavLink>
                                    </div>
                                </NavItem>
                                <NavItem style={{marginLeft: "10px"}} eventkey={9} className="dropdown">
                                    <div className="dropdownbtn a-link" style={{color: window.location.href.includes('performance') || window.location.href.includes('performance_indicators') ? '#f921fb' : 'white'}}>Performance</div>
                                    <div className="dropdown-content">
                                        <NavLink className="a-sublink navlink-style" activeClassName='navlink-style-active' exact={true} to='/performance'>Voyage Performance</NavLink>
                                        <NavLink className="a-sublink navlink-style" activeClassName='navlink-style-active' exact={true} to='/performance_indicators'>Performance Indicators</NavLink>
                                    </div>
                                    
                                </NavItem>
                                <NavItem style={{marginLeft: "10px"}} eventkey={6} className="dropdown">
                                    <NavLink className="a-link navlink-style" activeClassName='navlink-style-active' exact={true} to='/trends'>Trends</NavLink>
                                </NavItem>
                                <NavItem style={{marginLeft: "10px"}} eventkey={5} className="dropdown">
                                    <NavLink className="a-link navlink-style" activeClassName='navlink-style-active' exact={true} to='/interactive'>Interactive</NavLink>
                                </NavItem>
                                
                                <NavItem style={{marginLeft: "10px"}} eventkey={7} className="dropdown">
                                    <NavLink className="a-link navlink-style" activeClassName='navlink-style-active' exact={true} to='/reports'>Reports</NavLink>
                                </NavItem>
                                <NavItem style={{marginLeft: "10px"}} eventkey={10} className="dropdown">
                                    <NavLink className="a-link navlink-style" activeClassName='navlink-style-active' exact={true} to='/Speedsuggestion'>Optimize Speed</NavLink>
                                </NavItem>
                                {
                                    typeof loggedInUser !== typeof null ?
                                    <NavItem style={{marginLeft: "10px"}} eventkey={8} className="dropdown">
                                        <div className="dropdownbtn a-link"><FontAwesomeIcon icon={faUserCircle} /><>{loggedInUser}</></div>
                                        <div className="dropdown-content">
                                            <NavLink className="a-sublink navlink-style" activeClassName='navlink-style-active' exact={true} to='/changepassword'>Change Password</NavLink>
                                            <NavLink className="a-sublink navlink-style" activeClassName='navlink-style-active' onClick={this.handleLogoutClick} exact={true} to='/logout'>Logout</NavLink>
                                            {/* <NavLink exact={true} to='/ais'>AIS Feeds</NavLink>
                                            <NavLink exact={true} to='/vdr'>VDR Feeds</NavLink>
                                            <NavLink exact={true} to='/forms'>Other Forms</NavLink> */}
                                        </div>
                                    </NavItem> : ""
                                }
                            </Nav>
                            {
                                // typeof loggedInUser !== typeof null ?
                                //     <div onClick={this.handleLogoutClick} style={{cursor: "pointer"}}>
                                //         <FontAwesomeIcon icon={faUserCircle} /><>{loggedInUser}</>
                                //     </div>
                                //  :
                                // ""
                            }
                            {/* <Button id="report" style={{marginLeft: "5px", float: "right"}} size="sm" variant="outline-secondary" onClick={this.createReport}><FontAwesomeIcon icon={faFile} /></Button>
                            <Tooltip placement="bottom" isOpen={this.state.isReportOpen} target="report" toggle={this.toggleReport}>Create Report</Tooltip>
                            <Button id="print" style={{marginLeft: "5px", float: "right"}} size="sm" variant="outline-primary"><FontAwesomeIcon icon={faPrint} /></Button>
                            <Tooltip placement="bottom" isOpen={this.state.isPrintOpen} target="print" toggle={this.togglePrint}>Print</Tooltip> */}
                        </Collapse>
                    {/* </Container> */}
                </Navbar>
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);