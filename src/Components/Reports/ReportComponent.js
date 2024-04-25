import React from 'react';
import Select, { components, PlaceholderProps} from 'react-select';
import { Container, Form, Row, Button, Col } from 'react-bootstrap';
import HeaderComponent from '../HeaderComponent';
import '../../../public/CommonCss/reports.css';
import { connect } from 'react-redux';
import { setReportType, setDryDockPeriodForReports, setEvalutionPeriodForReports,
    toggleOpenWindow, setVoyage, setVoyageOptions, setVoyagePerformanceReport,
    baselineActualFocUrlBallast, baselineActualFocSpeedUrlBallast,
    percentageDifferenceUrlBallast, baselineActualFocUrlLoaded, baselineActualFocSpeedUrlLoaded,
    percentageDifferenceUrlLoaded, setReportsLoading, setReportsError, setSelectedPeriodFromDate,
    setSelectedPeriodToDate, setSelectedPeriodData, setAvailableDates, setOutlierDates,
    setOperationalDates, setSpeDates
} from '../../redux/ActionCreators';
import PDFDocument from './PDFDocument';
import SelectedPeriod from './Selected Period/SelectedPeriodComponent';
import RenderInWindow from './NewPDFWindow';
import Plotly from 'plotly.js/dist/plotly';
import axios from 'axios';
import { baseUrl } from '../../shared/baseUrl';
import { Loading } from '../LoadingComponent';
import DatePicker from 'react-datepicker';
import moment from 'moment';

const report_url = baseUrl + process.env.REACT_APP_REPORTS;
const voyage_options_url = baseUrl + process.env.REACT_APP_VOYAGE_OPTIONS;
const voyage_performance_report_url = baseUrl + process.env.REACT_APP_REPORTS_VOYAGE_PERFORMANCE;
const selected_period_report_url = baseUrl + process.env.REACT_APP_REPORTS_SELECTED_PERIOD;
const available_dates_url = baseUrl + process.env.REACT_APP_REPORTS_SELECTED_PERIOD_GET_AVAILABLE_DATES;

const Placeholder = (props) => {
    return <components.Placeholder {...props} />
}

const mapStateToProps = state => {
    return {
        reports: state.reports,
        currentShip: state.currentShip,
        options: state.options,
        plotly_graph_urls: state.plotly_graph_urls
    }
}

const mapDispatchToProps = (dispatch) => ({
    setReportType: (input) => { dispatch(setReportType(input))},
    setDryDockPeriodForReports: (input) => { dispatch(setDryDockPeriodForReports(input))},
    setEvalutionPeriodForReports: (input) => { dispatch(setEvalutionPeriodForReports(input))},
    toggleOpenWindow: (bool) => { dispatch(toggleOpenWindow(bool)) },
    setVoyage: (input) => { dispatch(setVoyage(input)) },
    setVoyageOptions: (input) => { dispatch(setVoyageOptions(input)) },
    setVoyagePerformanceReport: (input) => { dispatch(setVoyagePerformanceReport(input)) },
    baselineActualFocUrlBallast: (input) => { dispatch(baselineActualFocUrlBallast(input))},
    baselineActualFocSpeedUrlBallast: (input) => { dispatch(baselineActualFocSpeedUrlBallast(input))},
    percentageDifferenceUrlBallast: (input) => { dispatch(percentageDifferenceUrlBallast(input))},
    baselineActualFocUrlLoaded: (input) => { dispatch(baselineActualFocUrlLoaded(input))},
    baselineActualFocSpeedUrlLoaded: (input) => { dispatch(baselineActualFocSpeedUrlLoaded(input))},
    percentageDifferenceUrlLoaded: (input) => { dispatch(percentageDifferenceUrlLoaded(input))},
    setReportsLoading: (bool) => { dispatch(setReportsLoading(bool))},
    setReportsError: (errMess) => { dispatch(setReportsError(errMess))},
    setSelectedPeriodFromDate: (errMess) => { dispatch(setSelectedPeriodFromDate(errMess))},
    setSelectedPeriodToDate: (errMess) => { dispatch(setSelectedPeriodToDate(errMess))},
    setSelectedPeriodData: (input) => { dispatch(setSelectedPeriodData(input))},
    setAvailableDates: (input) => { dispatch(setAvailableDates(input))},
    setOutlierDates: (input) => { dispatch(setOutlierDates(input))},
    setOperationalDates: (input) => { dispatch(setOperationalDates(input))},
    setSpeDates: (input) => { dispatch(setSpeDates(input))},
})

const report_type_options = [
    {"label": 'Intervention Analysis', "value": 'Intervention Analysis'},
    {"label": 'Selected Period Report', "value": 'Selected Period Report'},
    {"label": 'Daily Report', "value": 'Daily Report'},
    {"label": 'Voyage Performance Report', "value": 'Voyage Performance Report'}
]

// const voyage_options = [];

const SubContainer = (props) => {

    function handleToggle() {
        props.handleToggleWindow(false);
        props.handleToggleWindow(true);
    }

    

    switch(props.report_type) {
        case 'Intervention Analysis':
            return ''
        case 'Voyage Report':
            return ''
        case 'Selected Period Report':
            return (
                <Container className='sub-container'>
                    <Form>
                        <Row>
                            <Form.Group as={Col} controlId='label2'>
                                <Form.Label className="label">From:</Form.Label>
                            </Form.Group>
                            <Form.Group as={Col} controlId='label3'>
                                <DatePicker
                                    dateFormat="yyyy-MM-dd"
                                    placeholderText="Select a date..."
                                    onChange={(e) => {props.handleChangeFromDate(e)}}
                                    selected={props.fromDate}
                                    includeDates={props.include_dates}
                                />
                            </Form.Group>
                        </Row>
                        <Row>
                            <Form.Group as={Col} controlId='label4'>
                                <Form.Label className="label">To:</Form.Label>
                            </Form.Group>
                            <Form.Group as={Col} controlId='label5'>
                                <DatePicker
                                    dateFormat="yyyy-MM-dd"
                                    placeholderText="Select a date..."
                                    onChange={(e) => {props.handleChangeToDate(e)}}
                                    selected={props.toDate}
                                    includeDates={props.include_dates}
                                />
                            </Form.Group>
                        </Row>
                    </Form>
                    {
                        props.selected_period_data !== undefined && props.selected_period_data !== null ?
                        <div className="sub-container-div">
                            <Button
                                variant='info'
                                onClick={() => { handleToggle() }}
                                // disabled={props.voyage_options === undefined || props.voyage_options === null ? true : false}
                            >
                                Generate PDF
                            </Button>
                        </div> : ""
                    }
                </Container>
            )
        case 'Daily Report':
            return ''
        case 'Voyage Performance Report':
            return (
                <Container className='sub-container'>
                    <Form>
                        <Row>
                            <Form.Group as={Col} controlId="label2">
                                <Form.Label className="label">Select Voyage:</Form.Label>
                            </Form.Group>
                            <Form.Group as={Col} controlId="label3">
                                <Select
                                    options={props.voyage_options['Options']}
                                    onChange={(e) => { props.handleVoyageChange(e) }}
                                    components={{ Placeholder }}
                                    placeholder={"Select Voyage"}
                                    className="sub-container-select"
                                />
                            </Form.Group>
                        </Row>
                    </Form>
                    {
                        props.report_data !== undefined && props.report_data !== null ?
                        <div className="sub-container-div">
                            <Button
                                variant='info'
                                onClick={() => { handleToggle() }}
                                // disabled={props.voyage_options === undefined || props.voyage_options === null ? true : false}
                            >
                                Generate PDF
                            </Button>
                        </div> : ""
                    }
                    
                </Container>
            )
        default:
            return ''
    }
    
}

class ReportComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            report_type: "",
            voyage: "",
            fromDate: "",
            toDate: "",
            stringFrom: "",
            stringTo: "",
            outlier_dates: null,
            operational_dates: null,
            spe_dates: null
        }

        this.handleReportTypeChange = this.handleReportTypeChange.bind(this);
        this.handleToggleWindow = this.handleToggleWindow.bind(this);
        this.handleVoyageChange = this.handleVoyageChange.bind(this);
        this.createVoyageOptions = this.createVoyageOptions.bind(this);
        this.getVoyagePerformanceReportData = this.getVoyagePerformanceReportData.bind(this);
        this.plotlyGraphForVoyagePerformance_ActualBaselineFOC_Loaded = this.plotlyGraphForVoyagePerformance_ActualBaselineFOC_Loaded.bind(this);
        this.plotlyGraphForVoyagePerformance_ActualBaselineFOCSpeed_Loaded = this.plotlyGraphForVoyagePerformance_ActualBaselineFOCSpeed_Loaded.bind(this);
        this.plotlyGraphForVoyagePerformance_PercentageDifference_Loaded = this.plotlyGraphForVoyagePerformance_PercentageDifference_Loaded.bind(this);
        this.plotlyGraphForVoyagePerformance_ActualBaselineFOC_Ballast = this.plotlyGraphForVoyagePerformance_ActualBaselineFOC_Ballast.bind(this);
        this.plotlyGraphForVoyagePerformance_ActualBaselineFOCSpeed_Ballast = this.plotlyGraphForVoyagePerformance_ActualBaselineFOCSpeed_Ballast.bind(this);
        this.plotlyGraphForVoyagePerformance_PercentageDifference_Ballast = this.plotlyGraphForVoyagePerformance_PercentageDifference_Ballast.bind(this);
        this.handleActualBaselineFOC = this.handleActualBaselineFOC.bind(this);
        this.handleActualBaselineSpeedFOC = this.handleActualBaselineSpeedFOC.bind(this);
        this.handlePercentageDifference = this.handlePercentageDifference.bind(this);
        this.handleChangeFromDate = this.handleChangeFromDate.bind(this);
        this.handleChangeToDate = this.handleChangeToDate.bind(this);
        this.getSelectedPeriodReportData = this.getSelectedPeriodReportData.bind(this);
        this.getAvailableDates = this.getAvailableDates.bind(this);
        this.getDatesFromData = this.getDatesFromData.bind(this);
    }

    componentDidMount() {
        // this.plotlyGraph();
    }

    async componentDidUpdate(prevProps, prevState) {
        if(prevProps.reports.report_type !== this.props.reports.report_type) {
            if(this.props.reports.report_type === 'Voyage Performance Report') {
                this.createVoyageOptions()
            }
            else if(this.props.reports.report_type === 'Selected Period Report') {
                this.getAvailableDates();
            }
        }
        if(prevProps.currentShip.currentShip !== this.props.currentShip.currentShip) {
            if(this.props.reports.report_type === 'Voyage Performance Report') {
                this.createVoyageOptions();
            }
            else if(this.props.reports.report_type === 'Selected Period Report') {
                this.getAvailableDates()
            }
        }
        if(prevProps.reports.voyage !== this.props.reports.voyage) {
            this.props.setReportsLoading(true)
            this.getVoyagePerformanceReportData();
        }
        if(prevProps.reports.voyage_performance_report !== this.props.reports.voyage_performance_report) {
            if(this.props.reports.voyage_performance_report) {
                this.plotlyGraphForVoyagePerformance_ActualBaselineFOC_Loaded(this.props);
                this.plotlyGraphForVoyagePerformance_ActualBaselineFOCSpeed_Loaded(this.props);
                this.plotlyGraphForVoyagePerformance_PercentageDifference_Loaded(this.props);
                this.plotlyGraphForVoyagePerformance_ActualBaselineFOC_Ballast(this.props);
                this.plotlyGraphForVoyagePerformance_ActualBaselineFOCSpeed_Ballast(this.props);
                this.plotlyGraphForVoyagePerformance_PercentageDifference_Ballast(this.props);
            }
            
        }
        if(prevState.fromDate !== this.state.fromDate) {
            let stringDate = moment(this.state.fromDate).format('YYYY-MM-DD')
            this.setState({
                stringFrom: stringDate
            });
            // this.props.setSelectedPeriodFromDate(stringDate)
        }
        if(prevState.toDate !== this.state.toDate) {
            let stringDate = moment(this.state.toDate).format('YYYY-MM-DD')
            this.setState({
                stringTo: stringDate
            });
            // this.props.setSelectedPeriodToDate(stringDate)
        }
        // if(prevProps.reports.open !== this.props.reports.open) {
        //     if(this.props.reports.open === true) {
        //         window.onbeforeunload((event) => {
        //             const e = event || window.event;
            
        //             this.handleToggleWindow(false);
        //             e.preventDefault();
        //         })
        //     }
        // }
        if(prevProps.reports.selected_period_from_date !== this.props.reports.selected_period_from_date ||
            prevProps.reports.selected_period_to_date !== this.props.reports.selected_period_to_date) {
                if(this.props.reports.selected_period_from_date !== null && this.props.reports.selected_period_to_date !== null) {
                    this.props.setReportsLoading(true)
                    this.getSelectedPeriodReportData();
                }
            }
        if(prevProps.reports.selected_period_data !== this.props.reports.selected_period_data) {
            let outlier_dates = this.getDatesFromData(this.props.reports.selected_period_data['Outliers']);
            let operational_dates = this.getDatesFromData(this.props.reports.selected_period_data['Operational']);
            let spe_dates = this.getDatesFromData(this.props.reports.selected_period_data['SPE']);
            this.props.setOutlierDates(outlier_dates)
            this.props.setOperationalDates(operational_dates)
            this.props.setSpeDates(spe_dates)
        }
        if(prevProps.reports.voyage !== this.props.reports.voyage) {
            this.handleToggleWindow(false);
        }
    }

    handleReportTypeChange = (e) => {
        this.setState({
            report_type: e.value
        });
        this.props.setReportType(e.value);
    }

    handleToggleWindow = (toggle) => {
        // let toggle = !this.props.reports.open;
        this.props.toggleOpenWindow(toggle);
    }

    handleVoyageChange = (e) => {
        this.setState({
            voyage: e.value
        });
        this.props.setVoyage(e.value);
    }

    createVoyageOptions = () => {
        axios({
            method: 'get',
            url: voyage_options_url,
            params: {'ship_imo': this.props.currentShip.currentShip&&this.props.currentShip.currentShip['value']}
        })
        .then(res => {
            this.props.setVoyageOptions(res.data)
        })
    }

    getAvailableDates = () => {
        axios({
            method: 'get',
            url: available_dates_url,
            params: {'ship_imo': this.props.currentShip.currentShip&&this.props.currentShip.currentShip['value']}
        })
        .then(res => {
            const gottenDates = []
            res.data['Dates'].map(item => {
                let temp = moment.utc(item, 'YYYY-MM-DD, HH:mm:ss').toDate()
                gottenDates.push(temp)
            })
            this.props.setAvailableDates(gottenDates)
        })
    }

    getDatesFromData = (data) => {
        console.log(data)
        let dates_list = []
        for(let i=0;i<data.length;i++) {
            Object.keys(data[i]).map(key => {
                dates_list.push(key)
            })
        }
        return dates_list;
    }

    handleActualBaselineFOC = (url) => {
        this.props.baselineActualFocUrl(url)
    }

    handleActualBaselineSpeedFOC = (url) => {
        this.props.baselineActualFocSpeedUrl(url)
    }

    handlePercentageDifference = (url) => {
        this.props.percentageDifferenceUrl(url)
    }

    plotlyGraphForVoyagePerformance_ActualBaselineFOC_Loaded = (props) => {
        // let img = Plotly.d3.select('#myDiv');
        let graph_data = this.props.reports.voyage_performance_report && this.props.reports.voyage_performance_report['Result']['Loaded']['Graph Data'];
        

        // Actual Baseline FOC
        var trace={
            x: graph_data['Actual Baseline FOC']['X Axis'],
            y: graph_data['Actual Baseline FOC']['Baseline'],
            type: "scatter",
            mode: "lines+markers",
            line: {
                color: 'red'
            },
            marker: {
                color: 'red'
            },
            name: "Baseline Values"
        };
        var trace1={
            x: graph_data['Actual Baseline FOC']['X Axis'],
            y: graph_data['Actual Baseline FOC']['Fuel Cons'],
            type:"scatter",
            mode: "lines+markers",
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

        // // static image in jpg format

        .then(
            function(gd) {
                let url_string;
            Plotly.toImage(gd)
                .then(
                    function(url)
                {
                    // img.attr("src", url);
                    // this.handleActualBaselineFOC(url);
                    // url_string = url
                    props.baselineActualFocUrlLoaded(url)
                }
                )
        });
        // console.log("PLOTLY DATA URL", typeof url_string);
        // this.props.baselineActualFocUrl(url_string);
    }

    plotlyGraphForVoyagePerformance_ActualBaselineFOC_Ballast = (props) => {
        // let img = Plotly.d3.select('#myDiv');
        let graph_data = this.props.reports.voyage_performance_report && this.props.reports.voyage_performance_report['Result']['Ballast']['Graph Data'];
        

        // Actual Baseline FOC
        var trace={
            x: graph_data['Actual Baseline FOC']['X Axis'],
            y: graph_data['Actual Baseline FOC']['Baseline'],
            type: "scatter",
            mode: "lines+markers",
            line: {
                color: 'red'
            },
            marker: {
                color: 'red'
            },
            name: "Baseline Values"
        };
        var trace1={
            x: graph_data['Actual Baseline FOC']['X Axis'],
            y: graph_data['Actual Baseline FOC']['Fuel Cons'],
            type:"scatter",
            mode: "lines+markers",
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

        // // static image in jpg format

        .then(
            function(gd) {
                let url_string;
            Plotly.toImage(gd)
                .then(
                    function(url)
                {
                    // img.attr("src", url);
                    // this.handleActualBaselineFOC(url);
                    // url_string = url
                    props.baselineActualFocUrlBallast(url)
                }
                )
        });
        // console.log("PLOTLY DATA URL", typeof url_string);
        // this.props.baselineActualFocUrl(url_string);
    }

    plotlyGraphForVoyagePerformance_ActualBaselineFOCSpeed_Loaded = (props) => {
        // let img = Plotly.d3.select('#myDiv');
        let graph_data = this.props.reports.voyage_performance_report && this.props.reports.voyage_performance_report['Result']['Loaded']['Graph Data'];
        let url_string;

        // Actual Baseline FOC
        var trace={
            x: graph_data['Actual Baseline FOC Speed']['Speed'],
            y: graph_data['Actual Baseline FOC Speed']['Baseline'],
            type: "scatter",
            mode: "markers",
            // line: {
            //     color: 'red'
            // },
            marker: {
                color: 'red'
            },
            name: "Baseline Values"
        };
        var trace1={
            x: graph_data['Actual Baseline FOC Speed']['Speed'],
            y: graph_data['Actual Baseline FOC Speed']['Fuel Cons'],
            type:"scatter",
            mode: "markers",
            // line: {
            //     color: 'blue'
            // },
            marker: {
                color: 'blue'
            },
            name: "Actual Values"
        };
        var data = [trace,trace1];
        var layout = {
            title : "SPEED V/S FOC - BASELINE & OBSERVED VALUES (LADEN CONDITION)",
            xaxis: {
                title: "Speed"
            },
            yaxis: {
                title: "Fuel Cons"
            }
        };
        Plotly.newPlot(
        'myDiv3',
        data,
        layout)

        // // static image in jpg format

        .then(
            function(gd) {
            Plotly.toImage(gd)
                .then(
                    function(url)
                {
                    // img.attr("src", url);
                    // this.handleActualBaselineSpeedFOC(url);
                    // url_string = url
                    // console.log("PLOTLY DATA URL", url);
                    props.baselineActualFocSpeedUrlLoaded(url)
                }
                )
        });
        // this.handleActualBaselineSpeedFOC(url_string)
    }

    plotlyGraphForVoyagePerformance_ActualBaselineFOCSpeed_Ballast = (props) => {
        // let img = Plotly.d3.select('#myDiv');
        let graph_data = this.props.reports.voyage_performance_report && this.props.reports.voyage_performance_report['Result']['Ballast']['Graph Data'];
        let url_string;

        // Actual Baseline FOC
        var trace={
            x: graph_data['Actual Baseline FOC Speed']['Speed'],
            y: graph_data['Actual Baseline FOC Speed']['Baseline'],
            type: "scatter",
            mode: "markers",
            // line: {
            //     color: 'red'
            // },
            marker: {
                color: 'red'
            },
            name: "Baseline Values"
        };
        var trace1={
            x: graph_data['Actual Baseline FOC Speed']['Speed'],
            y: graph_data['Actual Baseline FOC Speed']['Fuel Cons'],
            type:"scatter",
            mode: "markers",
            // line: {
            //     color: 'blue'
            // },
            marker: {
                color: 'blue'
            },
            name: "Actual Values"
        };
        var data = [trace,trace1];
        var layout = {
            title : "SPEED V/S FOC - BASELINE & OBSERVED VALUES (BALLAST CONDITION)",
            xaxis: {
                title: "Speed"
            },
            yaxis: {
                title: "Fuel Cons"
            }
        };
        Plotly.newPlot(
        'myDiv4',
        data,
        layout)

        // // static image in jpg format

        .then(
            function(gd) {
            Plotly.toImage(gd)
                .then(
                    function(url)
                {
                    // img.attr("src", url);
                    // this.handleActualBaselineSpeedFOC(url);
                    // url_string = url
                    // console.log("PLOTLY DATA URL", url);
                    props.baselineActualFocSpeedUrlBallast(url)
                }
                )
        });
        // this.handleActualBaselineSpeedFOC(url_string)
    }

    plotlyGraphForVoyagePerformance_PercentageDifference_Loaded = (props) => {
        // let img = Plotly.d3.select('#myDiv');
        let graph_data = this.props.reports.voyage_performance_report && this.props.reports.voyage_performance_report['Result']['Loaded']['Graph Data'];
        let url_string;

        // Actual Baseline FOC
        var trace={
            x: graph_data['Percentage Difference']['Date'],
            y: graph_data['Percentage Difference']['Percentage'],
            type: "scatter",
            mode: "lines",
            line: {
                color: 'red'
            },
            // marker: {
            //     color: 'red'
            // },
            name: "Percentage Values"
        };
        // var trace1={
        //     x: graph_data['Actual Baseline FOC Speed']['Speed'],
        //     y: graph_data['Actual Baseline FOC Speed']['Fuel Cons'],
        //     type:"scatter",
        //     mode: "lines+markers",
        //     line: {
        //         color: 'blue'
        //     },
        //     marker: {
        //         color: 'blue'
        //     },
        //     name: "Actual Values"
        // };
        var data = [trace];
        var layout = {
            title : "DIFFERENCE IN FOC (%) B/W BASELINE FOC & ACTUAL - LADEN CONDITION",
            xaxis: {
                title: "Date"
            },
            yaxis: {
                title: "Percentage"
            },
            shapes: graph_data['Percentage Difference']['Shape']
        };
        Plotly.newPlot(
        'myDiv5',
        data,
        layout)

        // // static image in jpg format

        .then(
            function(gd) {
            Plotly.toImage(gd)
                .then(
                    function(url)
                {
                    // img.attr("src", url);
                    // this.handlePercentageDifference(url);
                    // url_string = url
                    // console.log("PLOTLY DATA URL", url);
                    props.percentageDifferenceUrlLoaded(url)
                }
                )
        });
        // this.handlePercentageDifference(url_string)
    }

    plotlyGraphForVoyagePerformance_PercentageDifference_Ballast = (props) => {
        let img = Plotly.d3.select('#myDiv');
        let graph_data = this.props.reports.voyage_performance_report && this.props.reports.voyage_performance_report['Result']['Ballast']['Graph Data'];
        let url_string;

        // Actual Baseline FOC
        var trace={
            x: graph_data['Percentage Difference']['Date'],
            y: graph_data['Percentage Difference']['Percentage'],
            type: "scatter",
            mode: "lines",
            line: {
                color: 'red'
            },
            // marker: {
            //     color: 'red'
            // },
            name: "Percentage Values"
        };
        // var trace1={
        //     x: graph_data['Actual Baseline FOC Speed']['Speed'],
        //     y: graph_data['Actual Baseline FOC Speed']['Fuel Cons'],
        //     type:"scatter",
        //     mode: "lines+markers",
        //     line: {
        //         color: 'blue'
        //     },
        //     marker: {
        //         color: 'blue'
        //     },
        //     name: "Actual Values"
        // };
        var data = [trace];
        var layout = {
            title : "DIFFERENCE IN FOC (%) B/W BASELINE FOC & ACTUAL - BALLAST CONDITION",
            xaxis: {
                title: "Date"
            },
            yaxis: {
                title: "Percentage"
            },
            shapes: graph_data['Percentage Difference']['Shape']
        };
        Plotly.newPlot(
        'myDiv6',
        data,
        layout)

        // // static image in jpg format

        .then(
            function(gd) {
            Plotly.toImage(gd)
                .then(
                    function(url)
                {
                    // img.attr("src", url);
                    // this.handlePercentageDifference(url);
                    // url_string = url
                    // console.log("PLOTLY DATA URL", url);
                    props.percentageDifferenceUrlBallast(url)
                }
                )
        });
        // this.handlePercentageDifference(url_string)
    }

    getData = () => {
        let report_type = this.props.reports.report_type;
        let voyage = this.props.reports.voyage;
        let ship_imo = this.props.currentShip.currentShip['value']

        let params = {
            report_type: report_type,
            voyage_number: voyage,
            ship_imo: ship_imo
        }

        try {
            axios({
                method: 'get',
                url: report_url,
                params: params
            })
            .then(res => {
                console.log(res);
            })
            .catch(err => {
                console.log(err);
            })
        }
        catch(e) {
            console.log(e)
        }
    }

    getVoyagePerformanceReportData = () => {
        // console.log("START!!!!!!!!", this.props.reports.voyage)
        let voyage = this.props.reports.voyage;
        let ship_imo = this.props.currentShip.currentShip['value'];

        let params = {
            voyage: voyage,
            ship_imo: ship_imo
        }

        try {
            axios({
                method: "get",
                url: voyage_performance_report_url,
                params: params
            })
            .then(res => {
                this.props.setVoyagePerformanceReport(res.data)
            })
            .catch(err => {
                this.props.setReportsError(err)
            })
        }
        catch(e) {
            this.props.setReportsError(e)
        }
    }

    getSelectedPeriodReportData = () => {
        let ship_imo = this.props.currentShip.currentShip['value'];
        let fromDate = this.props.reports.selected_period_from_date;
        let toDate = this.props.reports.selected_period_to_date;
        console.log(fromDate, toDate)

        let params = {
            'ship_imo': ship_imo,
            'fromDate': fromDate,
            'toDate': toDate
        }

        try {
            axios({
                method: "get",
                url: selected_period_report_url,
                params: params
            })
            .then(res => {
                this.props.setSelectedPeriodData(res.data)
            })
            .catch(err => {
                this.props.setReportsError(err)
            })
        }
        catch(e) {
            this.props.setReportsError(e)
        }
    }

    handleChangeFromDate = (date) => {
        this.setState({
            fromDate: date
        });
        let stringDate = moment(date).format('YYYY-MM-DD')
        this.props.setSelectedPeriodFromDate(stringDate)
    }

    handleChangeToDate = (date) => {
        this.setState({
            toDate: date
        });
        let stringDate = moment(date).format('YYYY-MM-DD')
        this.props.setSelectedPeriodToDate(stringDate)
    }

    render() {
        return (
            <>
                <HeaderComponent isOverview={false} />
                <Container className="main-container">
                    <Form>
                        <Row>
                            <Form.Group as={Col} controlId="label1">
                                <Form.Label className="label">Select Type of Report:</Form.Label>
                            </Form.Group>
                            <Form.Group as={Col} controlId="label1">
                                <Select
                                    options={report_type_options}
                                    onChange={this.handleReportTypeChange}
                                    components={{ Placeholder }}
                                    placeholder={"Select Report Type"}
                                    className="main-container-select"
                                />
                            </Form.Group>
                        </Row>
                    </Form>
                </Container>

                {
                    this.props.reports.report_type === 'Intervention Analysis' ?
                    '' :
                    this.props.reports.report_type === 'Voyage Report' ?
                    '' :
                    this.props.reports.report_type === 'Selected Period Report' ?
                    <SubContainer
                        report_type={this.props.reports && this.props.reports.report_type}
                        handleChangeFromDate={this.handleChangeFromDate}
                        handleChangeToDate={this.handleChangeToDate}
                        handleToggleWindow={this.handleToggleWindow}
                        fromDate={this.state.fromDate}
                        toDate={this.state.toDate}
                        selected_period_data={this.props.reports.selected_period_data&&this.props.reports.selected_period_data}
                        include_dates={this.props.reports.available_dates&&this.props.reports.available_dates}
                    /> :
                    this.props.reports.report_type === 'Daily Report' ?
                    '' :
                    this.props.reports.report_type === 'Voyage Performance Report' ?
                    <SubContainer
                        report_type={this.props.reports && this.props.reports.report_type}
                        handleVoyageChange={this.handleVoyageChange}
                        handleToggleWindow={this.handleToggleWindow}
                        ship_imo={this.props.currentShip.currentShip && this.props.currentShip.currentShip['value']}
                        voyage_options={this.props.options.voyage_options&&this.props.options.voyage_options}
                        report_data={this.props.reports.voyage_performance_report&&this.props.reports.voyage_performance_report}
                    /> : ''

                }
                {
                    (this.props.reports.open === true && this.props.reports.report_type === 'Voyage Performance Report' ?
                    <RenderInWindow handleToggleWindow={this.handleToggleWindow}>
                        <PDFDocument
                            data={this.props.reports.voyage_performance_report&&this.props.reports.voyage_performance_report['Result']}
                            baseline_actual_ballast={this.props.plotly_graph_urls.actual_baseline_foc_ballast&&this.props.plotly_graph_urls.actual_baseline_foc_ballast}
                            baseline_actual_speed_ballast={this.props.plotly_graph_urls.actual_baseline_foc_speed_ballast&&this.props.plotly_graph_urls.actual_baseline_foc_speed_ballast}
                            percentage_diff_ballast={this.props.plotly_graph_urls.percentage_difference_ballast&&this.props.plotly_graph_urls.percentage_difference_ballast}
                            baseline_actual_loaded={this.props.plotly_graph_urls.actual_baseline_foc_loaded&&this.props.plotly_graph_urls.actual_baseline_foc_loaded}
                            baseline_actual_speed_loaded={this.props.plotly_graph_urls.actual_baseline_foc_speed_loaded&&this.props.plotly_graph_urls.actual_baseline_foc_speed_loaded}
                            percentage_diff_loaded={this.props.plotly_graph_urls.percentage_difference_loaded&&this.props.plotly_graph_urls.percentage_difference_loaded}
                        />
                        </RenderInWindow> :
                    this.props.reports.open === true && this.props.reports.report_type === 'Selected Period Report' ?
                    <RenderInWindow handleToggleWindow={this.handleToggleWindow}>
                        <SelectedPeriod
                            data={this.props.reports.selected_period_data&&this.props.reports.selected_period_data}
                            fromDate={this.props.reports.selected_period_from_date&&this.props.reports.selected_period_from_date}
                            toDate={this.props.reports.selected_period_to_date&&this.props.reports.selected_period_to_date}
                            outlier_dates={this.props.reports.outlier_dates&&this.props.reports.outlier_dates}
                            operational_dates={this.props.reports.operational_dates&&this.props.reports.operational_dates}
                            spe_dates={this.props.reports.spe_dates&&this.props.reports.spe_dates}
                        />
                    </RenderInWindow> : "")
                }
                {
                    this.props.reports.loading === true ?
                    <Loading /> : 
                    this.props.reports.errMess !== null ?
                    <div>{this.props.reports.errMess.message}</div> : ""
                }
                <div id="myDiv1"></div>
                <div id="myDiv2"></div>
                <div id="myDiv3"></div>
                <div id="myDiv4"></div>
                <div id="myDiv5"></div>
                <div id="myDiv6"></div>
            </>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ReportComponent);