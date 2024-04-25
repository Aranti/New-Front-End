import React from 'react';
import HeaderComponent from '../HeaderComponent';
import '../../../public/CommonCss/performance.css';
import { Container, Row, Col, Form } from 'react-bootstrap';
import Map from './Map';
import axios from 'axios';
import { baseUrl } from '../../shared/baseUrl';
import { connect } from 'react-redux';
import { setBaselineActualFoc, setBaselineActualFocSpeed, setPerformanceDeviation, setPerformanceTable,
    setShipOptions, setShipImo, setCurrentShip
 } from '../../redux/ActionCreators';
import { Loading } from '../LoadingComponent';
import PerformancePageTable from './PerformancePageTable';


const baseline_actual_foc_url = baseUrl + process.env.REACT_APP_PERFORMANCE_ACTUAL_BASELINE_FOC
const baseline_actual_foc_speed_url = baseUrl + process.env.REACT_APP_PERFORMANCE_ACTUAL_BASELINE_FOC_SPEED
const performance_deviation = baseUrl + process.env.REACT_APP_PERFORMANCE_DEVIATION
const performance_table = baseUrl + process.env.REACT_APP_PERFORMANCE_TABLE

const mapStateToProps = state => {
    return {
        performance: state.performance,
        currentShip: state.currentShip,
        loginAuth: state.loginAuth,
    }
}

const mapDispatchToProps = (dispatch) => ({
    setBaselineActualFoc: (input) => { dispatch(setBaselineActualFoc(input)) },
    setBaselineActualFocSpeed: (input) => { dispatch(setBaselineActualFocSpeed(input)) },
    setPerformanceDeviation: (input) => { dispatch(setPerformanceDeviation(input)) },
    setPerformanceTable: (input) => { dispatch(setPerformanceTable(input))},
    setShipOptions: (input) => { dispatch(setShipOptions(input))},
    setShipImo: (input) => { dispatch(setShipImo(input))},
    setCurrentShip: (input) => { dispatch(setCurrentShip(input))},
})

class PerformancePage extends React.Component {
    constructor(props) {
        super(props);

        this.plotlyGraphForBaselineActualFoc_Loaded = this.plotlyGraphForBaselineActualFoc_Loaded.bind(this);
        this.plotlyGraphForBaselineActualFocSpeed_Loaded = this.plotlyGraphForBaselineActualFocSpeed_Loaded.bind(this);
        this.plotlyGraphForDeviation_Loaded = this.plotlyGraphForDeviation_Loaded.bind(this);
        this.plotlyGraphForBaselineActualFoc_Ballast = this.plotlyGraphForBaselineActualFoc_Ballast.bind(this);
        this.plotlyGraphForBaselineActualFocSpeed_Ballast = this.plotlyGraphForBaselineActualFocSpeed_Ballast.bind(this);
        this.plotlyGraphForDeviation_Ballast = this.plotlyGraphForDeviation_Ballast.bind(this);
        this.baselineActualFOC = this.baselineActualFOC.bind(this);
        this.baselineActualFOCSpeed = this.baselineActualFOCSpeed.bind(this);
        this.performanceDeviation = this.performanceDeviation.bind(this);
        this.performanceTable = this.performanceTable.bind(this);
        this.getShipInfo = this.getShipInfo.bind(this);
    }

    componentDidMount() {
        this.baselineActualFOC();
        this.baselineActualFOCSpeed();
        this.performanceDeviation();
        this.performanceTable();
        // this.getShipInfo();
    }

    componentDidUpdate(prevProps, prevState) {
        if(prevProps.currentShip.currentShip !== this.props.currentShip.currentShip) {
            this.baselineActualFOC();
            this.baselineActualFOCSpeed();
            this.performanceDeviation();
            this.performanceTable();
        }
        if(prevProps.performance.baseline_actual_foc !== this.props.performance.baseline_actual_foc) {
            this.plotlyGraphForBaselineActualFoc_Loaded();
            this.plotlyGraphForBaselineActualFoc_Ballast();
        }
        if(prevProps.performance.baseline_actual_foc_speed !== this.props.performance.baseline_actual_foc_speed) {
            this.plotlyGraphForBaselineActualFocSpeed_Loaded();
            this.plotlyGraphForBaselineActualFocSpeed_Ballast();
        }
        if(prevProps.performance.performance_deviation !== this.props.performance.performance_deviation) {
            this.plotlyGraphForDeviation_Loaded();
            this.plotlyGraphForDeviation_Ballast();
        }
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
            this.props.setShipOptions(res.data['Result']);
            if(typeof currentshiplabel !== typeof null && typeof currentshipvalue !== typeof null) {
                this.props.setShipImo(currentshipvalue);
                this.props.setCurrentShip({'label': currentshiplabel, 'value': currentshipvalue});
            }
            else {
                this.props.setShipImo(res.data['Result'][0]['value']);
                this.props.setCurrentShip(res.data['Result'][0]);
            }
            // this.props.setShipImo(res.data['Result'][0]['value']);
            // this.props.setCurrentShip(res.data['Result'][0]);
        })
        .catch((error) => {
            console.log(error)
        });
    
        // return result;
    }

    baselineActualFOC = () => {
        let param = {'ship_imo': this.props.currentShip.currentShip['value']}

        axios({
            method: 'get',
            url: baseline_actual_foc_url,
            params: param
        })
        .then(response => {
            this.props.setBaselineActualFoc(response.data)
        })
        .catch(error => {
            console.log(error)
        })
    }

    baselineActualFOCSpeed = () => {
        let param = {'ship_imo': this.props.currentShip.currentShip['value']}

        axios({
            method: 'get',
            url: baseline_actual_foc_speed_url,
            params: param
        })
        .then(response => {
            this.props.setBaselineActualFocSpeed(response.data)
        })
        .catch(error => {
            console.log(error)
        })
    }

    performanceDeviation = () => {
        let param = {'ship_imo': this.props.currentShip.currentShip['value']}

        axios({
            method: 'get',
            url: performance_deviation,
            params: param
        })
        .then(response => {
            this.props.setPerformanceDeviation(response.data)
        })
        .catch(error => {
            console.log(error)
        })
    }

    performanceTable = () => {
        let param = {'ship_imo': this.props.currentShip.currentShip['value']}

        axios({
            method: 'get',
            url: performance_table,
            params: param
        })
        .then(response => {
            this.props.setPerformanceTable(response.data)
        })
        .catch(error => {
            console.log(error)
        })
    }

    plotlyGraphForBaselineActualFoc_Loaded = () => {

        var trace = {
            x: this.props.performance.baseline_actual_foc['Loaded']['X axis'],
            y: this.props.performance.baseline_actual_foc['Loaded']['Baseline'],
            type:"scatter",
            mode: 'lines+markers',
            line: {
                color: 'red'
            },
            marker: {
                color: 'red'
            },
            name: "Baseline Values"
        };
        var trace1 = {
            x: this.props.performance.baseline_actual_foc['Loaded']['X axis'],
            y: this.props.performance.baseline_actual_foc['Loaded']['Fuel Cons Values'],
            type:"scatter",
            mode: 'lines+markers',
            line: {
                color: 'blue'
            },
            marker: {
                color: 'blue'
            },
            name: "Actual Values"
        };
        var data = [trace,trace1];
        var layout = {
            title : "DYNAMIC BASELINE & ACTUAL FOC - LADEN CONDITION",
            font: {
                size: 10
            },
            xaxis: {
                title: "Days"
            },
            yaxis: {
                title: "Fuel Cons"
            }
        };

        Plotly.newPlot(
        'myDiv1',
        data,
        layout)
    }

    plotlyGraphForBaselineActualFoc_Ballast = () => {

        var trace = {
            x: this.props.performance.baseline_actual_foc['Ballast']['X axis'],
            y: this.props.performance.baseline_actual_foc['Ballast']['Baseline'],
            type:"scatter",
            mode: 'lines+markers',
            line: {
                color: 'red'
            },
            marker: {
                color: 'red'
            },
            name: "Baseline Values"
        };
        var trace1 = {
            x: this.props.performance.baseline_actual_foc['Ballast']['X axis'],
            y: this.props.performance.baseline_actual_foc['Ballast']['Fuel Cons Values'],
            type:"scatter",
            mode: 'lines+markers',
            line: {
                color: 'blue'
            },
            marker: {
                color: 'blue'
            },
            name: "Actual Values"
        };
        var data = [trace,trace1];
        var layout = {
            title : "DYNAMIC BASELINE & ACTUAL FOC - BALLAST CONDITION",
            font: {
                size: 10
            },
            xaxis: {
                title: "Days"
            },
            yaxis: {
                title: "Fuel Cons"
            }
        };

        Plotly.newPlot(
        'myDiv2',
        data,
        layout)
    }

    plotlyGraphForBaselineActualFocSpeed_Loaded = () => {

        var trace = {
            x: this.props.performance.baseline_actual_foc_speed['Loaded']['Speed Values'],
            y: this.props.performance.baseline_actual_foc_speed['Loaded']['Baseline'],
            type:"scatter",
            mode: 'markers',
            marker: {
                color: 'red'
            },
            name: "Baseline Values"
        };
        var trace1 = {
            x: this.props.performance.baseline_actual_foc_speed['Loaded']['Speed Values'],
            y: this.props.performance.baseline_actual_foc_speed['Loaded']['Fuel Cons Values'],
            type:"scatter",
            mode: 'markers',
            marker: {
                color: 'blue'
            },
            name: "Fuel Cons Values"
        };
        var data = [trace,trace1];
        var layout = {
            title : "SPEED VS FOC - BASELINE AND OBSERVED VALUES (LADEN CONDITION)",
            font: {
                size: 8
            },
            xaxis: {
                title: 'Speed'
            },
            yaxis: {
                title: "Fuel Cons"
            }
        };

        Plotly.newPlot(
        'myDiv3',
        data,
        layout)
    }

    plotlyGraphForBaselineActualFocSpeed_Ballast = () => {

        var trace = {
            x: this.props.performance.baseline_actual_foc_speed['Ballast']['Speed Values'],
            y: this.props.performance.baseline_actual_foc_speed['Ballast']['Baseline'],
            type:"scatter",
            mode: 'markers',
            marker: {
                color: 'red'
            },
            name: "Baseline Values"
        };
        var trace1 = {
            x: this.props.performance.baseline_actual_foc_speed['Ballast']['Speed Values'],
            y: this.props.performance.baseline_actual_foc_speed['Ballast']['Fuel Cons Values'],
            type:"scatter",
            mode: 'markers',
            marker: {
                color: 'blue'
            },
            name: "Fuel Cons Values"
        };
        var data = [trace,trace1];
        var layout = {
            title : "SPEED VS FOC - BASELINE AND OBSERVED VALUES (BALLAST CONDITION)",
            font: {
                size: 8
            },
            xaxis: {
                title: 'Speed'
            },
            yaxis: {
                title: "Fuel Cons"
            }
        };

        Plotly.newPlot(
        'myDiv4',
        data,
        layout)
    }

    plotlyGraphForDeviation_Loaded = () => {

        var trace = {
            x: this.props.performance.performance_deviation['Loaded']['Date'],
            y: this.props.performance.performance_deviation['Loaded']['Percentage Values'],
            type:"scatter",
            mode: 'lines',
            line: {
                color: 'red'
            },
            showlegend: false
        };
        // var trace1 = {
        //     x: this.props.performance.performance_deviation['Loaded']['Date'],
        //     y: this.props.performance.performance_deviation['Loaded']['Lower'],
        //     type:"scatter",
        //     mode: 'lines',
        //     fill: 'tozeroy',
        //     fillcolor: 'rgba(0, 255, 0, 0.2)',
        //     visible: true,
        //     showlegend: false,
        //     hoverinfo: 'skip'
        // };
        // var trace2 = {
        //     x: this.props.performance.performance_deviation['Loaded']['Date'],
        //     y: this.props.performance.performance_deviation['Loaded']['Upper'],
        //     type:"scatter",
        //     mode: 'lines',
        //     fill: 'tonextx',
        //     fillcolor: 'rgba(255, 0, 0, 0.2)',
        //     visible: true,
        //     showlegend: false,
        //     hoverinfo: 'skip'
        // };
        var data = [trace];
        var layout = {
            title : "DIFFERENCE IN FOC (%) BET BASELINE FOC & ACTUAL - LADEN CONDITION",
            font: {
                size: 10
            },
            xaxis: {
                title: "Date"
            },
            yaxis: {
                title: "Percentage Difference"
            },
            shapes: this.props.performance.performance_deviation['Loaded']['Shape']
        };

        Plotly.newPlot(
        'myDiv5',
        data,
        layout)
    }

    plotlyGraphForDeviation_Ballast = () => {

        var trace = {
            x: this.props.performance.performance_deviation['Ballast']['Date'],
            y: this.props.performance.performance_deviation['Ballast']['Percentage Values'],
            type:"scatter",
            mode: 'lines',
            line: {
                color: 'red'
            }
        };
        // var trace1 = {
        //     x: this.props.performance.performance_deviation['Ballast']['Date'],
        //     y: this.props.performance.performance_deviation['Ballast']['Lower'],
        //     type:"scatter",
        //     mode: 'lines',
        //     fill: 'tozeroy',
        //     fillcolor: 'rgba(0, 255, 0, 0.2)',
        //     visible: true,
        //     showlegend: false,
        //     hoverinfo: 'skip'
        // };
        // var trace2 = {
        //     x: this.props.performance.performance_deviation['Ballast']['Date'],
        //     y: this.props.performance.performance_deviation['Ballast']['Upper'],
        //     type:"scatter",
        //     mode: 'lines',
        //     fill: 'tonextx',
        //     fillcolor: 'rgba(255, 0, 0, 0.2)',
        //     visible: true,
        //     showlegend: false,
        //     hoverinfo: 'skip'
        // };
        var data = [trace];
        var layout = {
            title : "DIFFERENCE IN FOC (%) BET BASELINE FOC & ACTUAL - BALLAST CONDITION",
            font: {
                size: 10
            },
            xaxis: {
                title: "Date"
            },
            yaxis: {
                title: "Percentage Difference"
            },
            shapes: this.props.performance.performance_deviation['Ballast']['Shape']
        };

        Plotly.newPlot(
        'myDiv6',
        data,
        layout)
    }

    render() {
        return (
            <>
                <HeaderComponent isOverview={false} />
                <div className='main-container-performance'>
                    <Form>
                        <Row className="row-height-performance">
                            <Col className='sub-container-performance'>
                                {
                                    this.props.performance.baseline_actual_foc_speed !== null ?
                                    <div id="myDiv3" style={{width: "100%"}}></div> : <Loading />
                                }
                            </Col>
                            <Col><Map /></Col>
                            <Col className='sub-container-performance'>
                                {
                                    this.props.performance.baseline_actual_foc_speed !== null ?
                                    <div id="myDiv4" style={{width: "100%"}}></div> : <Loading />
                                }
                            </Col>
                        </Row>
                        <hr />
                        <Row className="row-height-performance">
                            <Col className='sub-container-performance'>
                                {
                                    this.props.performance.baseline_actual_foc !== null ?
                                    <div id="myDiv1" style={{width: "100%"}}></div> : <Loading />
                                }
                            </Col>
                            <Col className='sub-container-performance'>
                                {
                                    this.props.performance.baseline_actual_foc !== null ?
                                    <div id="myDiv2" style={{width: "100%"}}></div> : <Loading />
                                }
                            </Col>
                        </Row>
                        <hr />
                        <Row className="row-height-performance">
                            <Col className='sub-container-performance'>
                                {
                                    this.props.performance.performance_deviation !== null ?
                                    <div id="myDiv5" style={{width: "100%"}}></div> : <Loading />
                                }
                            </Col>
                            <Col className='sub-container-performance'>
                                {
                                    this.props.performance.performance_deviation !== null ?
                                    <div id="myDiv6" style={{width: "100%"}}></div> : <Loading />
                                }
                            </Col>
                        </Row>
                        <hr />
                        <Row className="row-height-performance">
                            <Col className='sub-container-performance'>
                                {
                                    this.props.performance.performance_table !== null ?
                                    <PerformancePageTable
                                        data={this.props.performance.performance_table['Loaded']}
                                        headers={this.props.performance.performance_table['Headers']}
                                    /> : <Loading />
                                }
                            </Col>
                            <Col className='sub-container-performance'>
                                {
                                    this.props.performance.performance_table !== null ?
                                    <PerformancePageTable
                                        data={this.props.performance.performance_table['Ballast']}
                                        headers={this.props.performance.performance_table['Headers']}
                                    /> : <Loading />
                                }
                            </Col>
                        </Row>
                    </Form>
                </div>
            </>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PerformancePage);