import React from 'react';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { Col, Row, Button, Card, Container, Table, Modal, ModalBody, ModalTitle, ModalFooter } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
// import "../../../public/CommonCss/style.scss";
import "../../../public/CommonCss/style.css";
// import vesselNew from "../../models/vesselLatest.json";
// import sisters from "../../models/sisters.json";
// import Dates from "../../models/getDates.json";
// import dateData from '../PredictiveFailureTrend/metadata1.json';
// import Collapsible from './Collapsible';
import MakeCollapsibleList from './MakeCollapsibleList';
import MakeTable from './MakeTable';
import Header from '../HeaderComponent';
import { Loading } from '../LoadingComponent';
import { baseUrl } from '../../shared/baseUrl';
import axios from 'axios';
import { connect } from 'react-redux';
import { setDailyData, setCollapsibleValue, setDailyLoading, setDailyError } from '../../redux/ActionCreators';
// import { DailyTable } from './DailyTable';
// import { MainPanel } from './MainPanel';
// import DailyChart from './DailyChart';
// import { getLevelColor, getStatusColor } from './dailyHelpers';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationTriangle, faExclamationCircle, faExternalLinkAlt, faFile, faPrint } from "@fortawesome/free-solid-svg-icons";
import { pdfCreator } from '../createPdf';
// import Pdf from 'react-to-pdf';
// import ReactToPdf from 'react-to-pdf';
import jsPDF from 'jspdf';
import PDFDocument from 'jspdf';

const urls = baseUrl + process.env.REACT_APP_DAILY_REPORT;
const historicalUrl = baseUrl + process.env.REACT_APP_DAILY_REPORT_HISTORICAL;

// let cancelToken = axios.CancelToken.source();
const ref = React.createRef();
let cancelToken

const mapStateToProps = state => {
    return {
        dailyData: state.dailyData,
        trends: state.trends,
        loginAuth: state.loginAuth,
        currentShip: state.currentShip,
        dailyCollapsible: state.dailyCollapsible,
    }
}

const mapDispatchToProps = (dispatch) => ({
    setDailyData: (input) => { dispatch(setDailyData(input)) },
    setDailyLoading: (input) => { dispatch(setDailyLoading(input)) },
    setDailyError: (input) => { dispatch(setDailyError(input)) },
    setCollapsibleValue: (input) => { dispatch(setCollapsibleValue(input)) }
})

// const MakeCollapsibleList = ({responseData, collapsibleClass, anchorClass}) => {
//     return(
//         Object.keys(responseData['Category Dictionary']).map((item) => {
//             let href = '#'+item;
//             if(responseData[item].length === 1) {
//                 return <a href={href} style={{textDecoration: "none"}}><Collapsible title={item} className={collapsibleClass} /></a>
//             }
//             else {
//                 return(
//                     <Collapsible title={item} className={collapsibleClass}>
//                         {
//                             item.map((i) => {
//                                 return (
//                                     <a href={href} className={anchorClass} key={i}>{i}</a>
//                                 )
//                             })
//                         }
//                     </Collapsible>
//                 )
//             }
//         })
//     )
// }

class DailyComponent extends React.Component {
    constructor(props) {
        super(props);

        // this.cancelToken;

        this.state = {
            // highlightWithRanges: [],
            // initialState: {
            //     expand: false,
            //     isOpen: false,
            //     expandProb: false,
            //     showChart: false,
            //     field: "",
            //     blockArray: [],
            //     initial: false
            // },
            // initialDate: "2016-01-30 12:00:00",
            // item: {},
            // prob: {},
            includeDates: [],
            includeTimes: [],
            selectedDate: "",
            // sistersData: sisters.data,
            // startDate: new Date("2016-01-30 12:00:00"),
            // vesselLive: null,
            mainData: {},
            responseData: {},
            categorySelection: "#MAIN ENGINE-All",
            // categorySelection: "",
            lastReported: "",
            isModalOpen: false
        }

        this.getDailyData = this.getDailyData.bind(this);
        this.getHistoricalDailyData = this.getHistoricalDailyData.bind(this);
        this.setDailyToState = this.setDailyToState.bind(this);
        this.setGottenDates = this.setGottenDates.bind(this);
        // this.setGottenTimes = this.setGottenTimes.bind(this);
        this.setSelectedDate = this.setSelectedDate.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.createReport = this.createReport.bind(this);
        this.modalShow = this.modalShow.bind(this);
        this.modalHide = this.modalHide.bind(this);
        this.toggleModal = this.toggleModal.bind(this);
        this.handlePdf = this.handlePdf.bind(this);
    }

    componentDidMount() {
        cancelToken = axios.CancelToken.source();
        this.props.setDailyLoading(true);
        this.getDailyData();
        // this.getHistoricalDailyData();
        // const gottenDates = Dates.map(item => new Date(item));
        // const gottenDates = this.props.dailyData.dailyData['Dates'];
        // this.setState({
        //     includeDates: gottenDates
        // });
    }

    // componentWillUnmount() {
    //     if(cancelToken) {
    //         cancelToken.cancel("")
    //     }
    // }

    async componentDidUpdate(prevProps, prevState) {
        if(prevState.selectedDate !== this.state.selectedDate) {
            let newDate = moment(this.state.selectedDate).format("YYYY-MM-DD, HH:mm:ss");
            this.props.setDailyLoading(true);
            this.getHistoricalDailyData(newDate);
        }
        if(prevProps.currentShip.currentShip !== this.props.currentShip.currentShip) {
            this.getDailyData();
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        if(this.props !== nextProps || this.state !== nextState) {
            return true;
        }
        else {
            return false;
        }
    }

    getDailyData () {
        const loggedInUserId = localStorage.getItem('userid')

        let param = {
            'ship_imo': this.props.currentShip.currentShip['value'],
            'id': this.props.loginAuth.user !== null ? this.props.loginAuth.user['id'] : loggedInUserId
        };

        if(typeof cancelToken !== typeof undefined) {
            this.props.setDailyLoading(true);
        }

        axios({
            method: "get",
            url: urls,
            params: param,
            cancelToken: cancelToken.token
        })
        .then((res) => {
            console.log("Daily RES DATA", res.data);
            let selectedDate = new Date(res.data['Dates'][res.data['Dates'].length - 1])
            this.setState({
                selectedDate: this.props.currentShip.currentShip['value'] === 9205926 || this.props.currentShip.currentShip['value'] === '9205926' ? new Date("2016-12-04, 12:00:00") : selectedDate
            })
            this.setDailyToState(res.data);
            this.setGottenDates(res.data);
            this.setSelectedDate(res.data);
            // console.log("dailyyyyyyyyyyyyyyyyyyyyyy",this.props.dailyData)
            // console.log("vtiiiiiiiii",this.props.dailyData.dailyData)
        })
        .catch((err) => {
            console.log("Error", err);
            this.props.setDailyError(err);
        });
    }

    setDailyToState(data) {
        this.props.setDailyData(data);
        this.setState({
            responseData: data
        });
    }

    getHistoricalDailyData(dateString) {
        const loggedInUserId = localStorage.getItem('userid')
        // let tempDate = dateString.split(',');
        // let tempDate2 = tempDate[1].includes('08') ? tempDate[1].replace('08', '12') : tempDate[1]
        // let newDateString = tempDate[0] + ',' + tempDate2

        let param = {
            'ship_imo': this.props.currentShip.currentShip['value'],
            'dateString': dateString,
            'id': this.props.loginAuth.user !== null ? this.props.loginAuth.user['id'] : loggedInUserId
        }

        if(typeof cancelToken !== typeof undefined) {
            this.props.setDailyLoading(true)
        }

        axios({
            method: "get",
            url: historicalUrl,
            params: param,
            cancelToken: cancelToken.token
        })
        .then((res) => {
            console.log("Historic RES DATA", res.data);
            this.setDailyToState(res.data);
            // this.setSelectedDate(res.data);
            // console.log("dailyyyyyyyyyyyyyyyyyyyyyy",this.props.dailyData)
            // console.log("vtiiiiiiiii",this.props.dailyData.dailyData.latest_vti)
        })
        .catch((err) => {
            console.log("Error", err);
            this.props.setDailyError(err);
        })
    }

    setGottenDates(data) {
        const gottenDates = []
        data['Dates'].map(item => {
            let temp = moment.utc(item, 'YYYY-MM-DD, HH:mm:ss').toDate()
            gottenDates.push(temp)
        })
        this.setState({
            includeDates: gottenDates
        });
        // console.log("DATES", gottenDates);
    }

    setSelectedDate(data) {
        // const selectedDate = new Date(data['Dates'][data['Dates'].length - 1])
        this.setState({
            // selectedDate: selectedDate,
            lastReported: data['Dates'][data['Dates'].length - 1]
        });
    }

    handleClick(e, href) {
        e.preventDefault();
        this.setState({
            categorySelection: href
        });
        // alert(href);
        this.props.setCollapsibleValue(href)
    }

    handleChange = date => {
        this.setState({
            selectedDate: date
        });
        console.log("DATE", moment(date).format("YYYY-MM-DD, HH:mm:ss"), date);
        // this.getHistoricalDailyData(moment.utc(date).format("YYYY-MM-DD, HH:mm:ss"));
    };

    createReport = () => {
        return (
            // pdfCreator(this.props.dailyCollapsible.collapsibleValue, this.props.dailyData)
            <>
                <pdfCreator
                    categorySelection={this.props.dailyCollapsible.collapsibleValue}
                    dailyData={this.props.dailyData}
                />
            </>
        )
    }

    modalShow = () => {
        this.setState({
            isModalOpen: true
        });
    }

    modalHide = () => {
        this.setState({
            isModalOpen: false
        })
    }

    toggleModal = () => {
        this.setState({
            isModalOpen: !this.state.isModalOpen
        })
    }

    async handlePdf() {
        let daily_table = document.getElementById("daily_table");
        let pdf = new jsPDF({unit: 'px', format: 'letter', userUnit: 'px'})
        // let pdf = html2pdf().from(daily_table).toPdf().get("pdf")
        // let pdf_array_buffer=[];
        
        // for(let i=0;i<this.props.dailyData.dailyData['Category List'].length;i++) {
        //     let category = "#"+this.props.dailyData.dailyData['Category List'][i]+" - All";
        //     this.setState({
        //         categorySelection: category
        //     });
        //     pdf.html(daily_table, {html2canvas: {scale: 0.12, margin: 5, scrollX: true, scrollY: true}})
        //         .then(() => {
        //             pdf_array_buffer.push(pdf.output("arraybuffer"))
        //         })
        // }


        // // MERGE PDFS
        // const mergedPdf = await PDFDocument.create();
        // const actions = pdf_array_buffer.map(async pdfBuffer => {
        //     const pdf = await PDFDocument.load(pdfBuffer);
        //     const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        //     copiedPages.forEach((page) => {
        //         mergedPdf.addPage(page);
        //     });
        // });

        // await Promise.all(actions);
        // await mergedPdf.save("copy-example.pdf");

        pdf.html(daily_table, {html2canvas: {scale: 0.12, margin: 5, scrollX: true, scrollY: true}})
            .then(() => {
                pdf.save("code-example.pdf")
            })
    }

    

    render() {
        return(
            <React.Fragment>
                <Header isOverview={false} />
                <Container fluid>
                    <Row>
                        <Col>
                            <Card style={{height: "135px",width:"300px"}} className="dailycard">
                                <Card.Header style={{height: "33px"}} className="dailycardHeaderBackground">Select Report</Card.Header>
                                <Card.Body className="dailycardBodyColor">
                                    <DatePicker
                                        className=""
                                        selected={this.state.selectedDate}
                                        onChange={this.handleChange}
                                        dateFormat="yyyy-MM-dd, HH:mm:ss"
                                        showTimeSelect          
                                        timeIntervals={240}                              
                                        // highlightDates={this.state.highlightWithRanges}
                                        includeDates={this.state.includeDates}   
                                        // includeTimes={this.state.includeTimes}                                     
                                    />
                                    <Card.Text style={{fontSize: 10}}>Last Reported: {this.state.lastReported}</Card.Text> 
                                    <Card.Text style={{fontSize: 15}}>Source: {this.props.dailyData.loading === true ? " " : this.props.dailyData.errMess !== null ? this.props.dailyData.errMess.message : this.props.dailyData.dailyData.source}</Card.Text>                                    
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col>
                            <Card style={{height: "135px",width:"300px"}} className="dailycard">
                                <Card.Header style={{height: "33px"}} className="dailycardHeaderBackground">Ship Issues</Card.Header>
                                <Card.Body className="dailycardBodyColor">
                                    <Row className="align-items-center">
                                        <Col md={1}>
                                            <FontAwesomeIcon icon={faExclamationCircle} style={{color: "red"}} />
                                            {/* <Row><Col md={1}><FontAwesomeIcon icon={faExclamationCircle} style={{color: "red"}} /></Col><Col md={11}>{this.props.dailyData.loading === true ? <Loading /> : this.props.dailyData.errMess !== null ? this.props.dailyData.errMess.message : " "+this.props.dailyData.dailyData['Issues Count'][this.props.currentShip.currentShip['value']]['outlier'] + " of Outlier"}</Col></Row>
                                            <Row><Col md={1}><FontAwesomeIcon icon={faExclamationCircle} style={{color: "orange"}} /></Col><Col md={11}>{this.props.dailyData.loading === true ? <Loading /> : this.props.dailyData.errMess !== null ? this.props.dailyData.errMess.message : " "+this.props.dailyData.dailyData['Issues Count'][this.props.currentShip.currentShip['value']]['operational'] + " of Operational"}</Col></Row> */}
                                        </Col>
                                        <Col>
                                            {this.props.dailyData.loading === true ? <Loading /> : this.props.dailyData.errMess !== null ? this.props.dailyData.errMess.message : " "+this.props.dailyData.dailyData['Issues Count'][this.props.currentShip.currentShip['value']]['outlier'] + " of Outlier"}
                                        </Col>
                                        <Col>
                                            <Link to={"/issues"}><Button variant="primary" size="sm"><FontAwesomeIcon icon={faExternalLinkAlt} />Issues</Button></Link>
                                        </Col>
                                    </Row>
                                    <Row className="align-items-center">
                                        <Col md={1}>
                                            <FontAwesomeIcon icon={faExclamationCircle} style={{color: "orange"}} />
                                        </Col>
                                        <Col md={7}>
                                            {this.props.dailyData.loading === true ? <Loading /> : this.props.dailyData.errMess !== null ? this.props.dailyData.errMess.message : " "+this.props.dailyData.dailyData['Issues Count'][this.props.currentShip.currentShip['value']]['operational'] + " of Operational"}
                                        </Col>
                                        <Col md={4}></Col>
                                    </Row>
                                </Card.Body>
                            </Card>
                        </Col>

                        {/* ak code here  and card style widht changed to 300px */}
                        <Col>
                            <Card style={{height: "135px",width:"300px"}} className="dailycard">
                                <Card.Header style={{height: "33px"}} className="dailycardHeaderBackground">VTI</Card.Header>
                                <Card.Body className="dailycardBodyColor">
                                    <Row>
                                        <Col>
                                            VTI_Laiden = {this.props.dailyData.loading === true ? " " : this.props.dailyData.errMess !== null ? this.props.dailyData.errMess.message : this.props.dailyData.dailyData.latest_vti}  <br />
                                            VTI_Laiden90  = {this.props.dailyData.loading === true ? " " : this.props.dailyData.errMess !== null ? this.props.dailyData.errMess.message : this.props.dailyData.dailyData.latest_avg_vti}
                                        </Col>
                                    </Row>  
                                </Card.Body>
                            </Card>
                        </Col> 
                        {/* ak code end */}

                        <Col>
                            <Card style={{height: "135px",width:"300px"}} className="dailycard">
                                <Card.Header style={{height: "33px"}} className="dailycardHeaderBackground">Weather and AIS/VDR Data</Card.Header>
                                <Card.Body className="dailycardBodyColor">
                                    <Row>
                                        <Col>
                                            <Button variant="primary" size="sm">Weather <FontAwesomeIcon icon={faExternalLinkAlt} /></Button>{' '}
                                            <Button variant="primary" size="sm">AIS <FontAwesomeIcon icon={faExternalLinkAlt} /></Button>{' '}
                                            <Button variant="primary" size="sm">VDR <FontAwesomeIcon icon={faExternalLinkAlt} /></Button>
                                        </Col>
                                    </Row>  
                                </Card.Body>
                            </Card>
                        </Col>    
                        <Col>
                            <Card style={{height: "135px",width:"300px"}} className="dailycard">
                                <Card.Body className="dailycardBodyColor">
                                    <Row className="align-items-center">
                                        <Col>
                                            {/* <ReactToPdf targetRef={ref} filename="code-example.pdf">{({ toPdf }) => <Button variant="outline-info" onClick={toPdf}><FontAwesomeIcon icon={faFile} /> Create Report</Button>}</ReactToPdf>{' '} */}
                                            <Button variant="info" onClick={this.handlePdf}><FontAwesomeIcon icon={faFile} /> Create Report</Button>{' '}
                                            <Button variant="secondary" disabled={true}><FontAwesomeIcon icon={faPrint} /> Print</Button>
                                        </Col>
                                    </Row><br/>
                                    <Row className="align-items-center"><Col><Button variant="danger" disabled={true}>Show Issues in Trends</Button></Col></Row>
                                </Card.Body>
                            </Card>
                        </Col>                  
                    </Row>
                    <hr />
                    {
                        this.props.dailyData.loading === true ? <Col>{<Loading />}</Col> :
                        this.props.dailyData.errMess !== null ? <Col>{this.props.dailyData.errMess.message}</Col> :
                        <Row>
                            <Col md={2}>
                                {
                                    this.props.dailyData.dailyData &&(<MakeCollapsibleList
                                        dailyData={this.props.dailyData.dailyData}
                                        selectedDate={this.state.selectedDate}
                                        collapsibleClass="dailyheader"
                                        anchorClass="a-link"
                                        handleClick={this.handleClick}
                                    />)
                                }
                            </Col>
                            <Col className="main-doc" md={10}>
                                {
                                    this.props.dailyData.dailyData && (<MakeTable
                                        dailyData={this.props.dailyData}
                                        categorySelection={this.state.categorySelection}
                                        // ref={ref}
                                    />)
                                }
                            </Col>
                        </Row>
                    }
                    {/* <Modal size="xl" show={this.state.isModalOpen} onHide={this.modalHide} onShow={this.modalShow} dialogClassName="modalClass">
                        <Modal.Header closeButton>
                            <ModalTitle>Create Report</ModalTitle>
                        </Modal.Header>
                        <ModalBody>
                            <div>
                                <PdfCreator
                                    categorySelection={this.props.dailyCollapsible.collapsibleValue}
                                    dailyData={this.props.dailyData}
                                />
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <Button size="sm" outline color="success" onClick={this.onLogsUpload}>Send To Server</Button>
                        </ModalFooter>
                    </Modal> */}
                </Container>
            </React.Fragment>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DailyComponent);