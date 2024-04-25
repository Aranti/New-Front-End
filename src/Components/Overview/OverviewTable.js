import React from 'react';
import { Table, Col, Row, Button, Modal, ModalBody, ModalTitle, ModalFooter } from 'react-bootstrap';
import '../../../public/CommonCss/overview.css';
import axios from 'axios';
import { baseUrl } from '../../shared/baseUrl';
import { connect } from 'react-redux';
import { setOverviewData, setShipImo, setDefaultShip, setCurrentShip, setOverviewLoading, setOverviewError, setShipOptions } from '../../redux/ActionCreators';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisV, faPlus, faCross, faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import DatePicker from 'react-datepicker';
import ProgressBarComponent from '../ProgressBar';
import { Loading } from '../LoadingComponent';

const urls = baseUrl + process.env.REACT_APP_OVERVIEW;
const urls_for_insertion = baseUrl + process.env.REACT_APP_SEND_TO_MAIN_DB;

let cancelToken;

const mapStateToProps = state => {
    return {
        defaultShip: state.defaultShip,
        overview: state.overview,
        loginAuth: state.loginAuth,
        options: state.options
    }
}

const mapDispatchToProps = dispatch => ({
    setDefaultShip: (input) => { dispatch(setDefaultShip(input)) },
    setCurrentShip: (input) => { dispatch(setCurrentShip(input)) },
    setOverviewData: (input) => { dispatch(setOverviewData(input)) },
    setOverviewLoading: (input) => { dispatch(setOverviewLoading(input)) },
    setOverviewError: (input) => { dispatch(setOverviewError(input)) },
    setShipImo: (input) => { dispatch(setShipImo(input)) },
    setShipOptions: (input) => { dispatch(setShipOptions(input)) },
});

// let cancelToken;

class OverviewTable extends React.Component {
    constructor(props) {
        super(props);

        // this.cancelToken;

        this.state = {
            overviewData: {},
            uploadImo: null,
            isModalOpen: false,
            selectedDate: "",
            modalRadioInput: "",
            inputFile1: null,
            inputFile2: null,
            inputFile3: null,
            percent: 0,
            status: '',
            res: ''
        }
        
        this.getChartData = this.getChartData.bind(this);
        this.handleTrendsClick = this.handleTrendsClick.bind(this);
        this.toggleModal = this.toggleModal.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.onRadioChange = this.onRadioChange.bind(this);
        this.onFileChange = this.onFileChange.bind(this);
        this.onFileUpload = this.onFileUpload.bind(this);
        this.changePercentage = this.changePercentage.bind(this);
        this.cancelRequest = this.cancelRequest.bind(this);
    }

    componentDidMount() {
        cancelToken = axios.CancelToken.source();
        this.props.setOverviewLoading(true);
        if(this.props.options.shipoptions !== null) {
            this.getChartData();
        }
        // console.log(this.state.overviewData);
    }

    componentWillUnmount() {
        // if(cancelToken) {
            cancelToken.cancel('')
        // }
    }

    toggleModal(e) {
        this.setState({
            isModalOpen: !this.state.isModalOpen,
            // uploadImo: e.target.name
        })
    }

    componentDidUpdate(prevProps, prevState) {
        // if(prevProps.options.shipoptions !== this.props.options.shipoptions) {
        //     this.getChartData();
        // }
    }

    getChartData() {

        const loggedInUserId = localStorage.getItem("userid");

        if(typeof cancelToken !== typeof undefined) {
            this.props.setOverviewLoading(true);
        }

        // this.cancelToken = axios.CancelToken.source();

        try {
            axios({
                method: 'get',
                url: urls,
                params: {
                    id: this.props.loginAuth.user !== null ? this.props.loginAuth.user['id'] : loggedInUserId
                },
                cancelToken: cancelToken.token
            })
            .then((res) => {
                this.setState({
                    overviewData: res.data
                })
                this.props.setOverviewData(res.data);
            })
            .catch((err) => {
                console.log(err);
                this.props.setOverviewError(err);
            })
        }
        catch(error) {
            console.log(error);
            this.props.setOverviewError(error);
        }
    }

    handleChange = date => {
        this.setState({
            selectedDate: date
        })
    }

    handleTrendsClick(e) {
        let dShip;
        Object.keys(this.props.overview.overview['Result']).map(item => {
            if(this.props.overview.overview['Result'][item]['imo_string'].includes(e.target.name)) {
                let value = this.props.overview.overview['Result'][item]['imo_string'].split('-')[0]
                let label = this.props.overview.overview['Result'][item]['imo_string'].split('-')[1]
                dShip = {value: parseInt(value), label: label}
            }
        });

        this.props.setShipImo(e.target.name);
        this.props.setDefaultShip(dShip);
        this.props.setCurrentShip(dShip);
        // LOCALHOST
        // window.location.href = process.env.REACT_APP_LOCALHOST;

        // TESTING
        window.location.href = process.env.REACT_APP_SHIP_INTEL_2;

        // ACTUAL
        // window.location.href = process.env.REACT_APP_SHIP_LINK_2;

        // BETA TEST
        // window.location.href = process.env.REACT_APP_BETA
    }

    onRadioChange(e) {
        this.setState({
            modalRadioInput: e.target.value
        });
    }

    onFileChange = event => {
        console.log(event.target.name)
        if(event.target.name.includes('1')) {
            this.setState({
                inputFile1: event.target.files[0]
            })
        }
        if(event.target.name.includes('2')) {
            this.setState({
                inputFile2: event.target.files[0]
            })
        }
        if(event.target.name.includes('3')) {
            this.setState({
                inputFile3: event.target.value
            })
        }
    }

    changePercentage = val => {
        this.setState({
            percent: val
        })
    }

    changeResult = val => {
        this.setState({
            res: val
        })
    }

    changeStatus = val => {
        this.setState({
            status: val
        })
    }

    cancelRequest = () => {
        cancel("Upload is canceled!")
    }

    onFileUpload = () => {
        const formData = new FormData();

        formData.append("file1", this.state.inputFile1, this.state.inputFile1.name);
        formData.append("file2", this.state.inputFile2, this.state.inputFile2.name);
        console.log("DAILY FILE NAME!!!!", this.state.inputFile1.name, this.state.inputFile2.name);
        axios.post(urls_for_insertion, formData, {
            params: {
                'ship_imo': this.state.inputFile3
            },
            onUploadProgress: progressEvent => {
                let percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                this.changePercentage(percentCompleted);
            },
            cancelToken: new CancelToken(c => {
                cancel = c
            })
        })
            .then(res => {
                if(res) {
                    this.changeResult(res.data);
                    this.changeStatus('Loaded');
                }
                else {
                    this.changeStatus('Canceled');
                }
            })
            .catch(error => {
                this.changeStatus('Error');
            })
    }

    render() {
        return (
            <div style={{padding: "10px"}}>
                {
                    this.props.overview.isLoading === true ? <Loading /> :
                    this.props.overview.errMess !== null ? this.props.overview.errMess.message :
                    <Table bordered hover size="sm" style={{wordWrap: "break-word", tableLayout: "fixed"}}>
                        <thead>
                            <tr style={{backgroundColor: "#256F82", color: "white"}}>
                                <th>Ship Imo</th>
                                <th>Ship Name</th>
                                <th>Issues</th>
                                <th>Health</th>
                                <th>Vessel Load</th>
                                <th>ETA Next Port</th>
                                <th>CP Compliance</th>
                                <th>Browse Trends</th>
                                {/* <th>Upload Data</th> */}
                            </tr>
                        </thead>
                        <tbody style={{backgroundColor: "#3194AE", color: "white"}}>
                            {
                                this.props.overview.overview && Object.keys(this.props.overview.overview['Result']).map(item => {
                                    let Imo = this.props.overview.overview['Result'][item]['imo_string'].split('-')[0]
                                    let name = this.props.overview.overview['Result'][item]['imo_string'].split('-')[1]
                                    return (
                                        <tr key={item}>
                                            <td style={{alignItems: 'center'}}>{Imo}</td>
                                            <td style={{alignItems: 'center'}}>{name}</td>
                                            <td style={{alignItems: 'center'}}>{this.props.overview.overview['Result'][item]['issuesCount'] === null ? "" : this.props.overview.overview['Result'][item]['issuesCount']}</td>
                                            <td></td>
                                            <td style={{alignItems: 'center'}}>{this.props.overview.overview['Result'][item]['vessel_load']}</td>
                                            <td style={{alignItems: 'center'}}>{this.props.overview.overview['Result'][item]['eta']}</td>
                                            <td style={{alignItems: 'center'}}>{this.props.overview.overview['Result'][item]['cp']}</td>
                                            <td style={{alignItems: 'center'}}>{
                                                this.props.overview.overview['Result'][item]['issuesCount'] === null &&
                                                this.props.overview.overview['Result'][item]['vessel_load'] === null &&
                                                this.props.overview.overview['Result'][item]['eta'] === null &&
                                                this.props.overview.overview['Result'][item]['cp'] === null
                                                ? "" :
                                                <Button size="sm" onClick={this.handleTrendsClick} name={Imo}><FontAwesomeIcon icon={faEllipsisV} />&nbsp;&nbsp; Browse</Button>}</td>
                                            {/* <td style={{alignItems: 'center'}}><Button size="sm" onClick={this.toggleModal} name={Imo}><FontAwesomeIcon icon={faPlus} />&nbsp;&nbsp; Upload</Button></td> */}
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </Table>
                }
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(OverviewTable);
