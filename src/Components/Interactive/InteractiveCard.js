import React from 'react';
import { Col, Row, Button, Card, Container, Table } from 'react-bootstrap';
import Select from 'react-select';
// import 'bootstrap/dist/css/bootstrap.min.css';
import InteractiveSlider from './InteractiveSlider';
import Collapsible from './CollapsibleInteractive';
import "../../../public/CommonCss/interactive.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFile, faPrint, faCheck } from "@fortawesome/free-solid-svg-icons";
// import { Card } from 'react-bootstrap';
import { connect } from 'react-redux';
import axios from 'axios';
import { baseUrl } from '../../shared/baseUrl';
import { setFeature1, setFeature2, setFeature3, setFeature4, setFeature5, setFeature6, setXAxis, setYAxis, setZAxis,
    setColor, setBasic, setSize, setShape, setDimensions, setCombo, setMultiParametric, setInteractiveCompare, setInteractiveDuration, 
    setInteractive, setInteractiveStatsData, setTypeOfInput, setSisterVessel, setSimilarVessel, setIndependentParameters, 
    setDependentParameters, setSlider1, setSlider2, setSlider3, setSlider4, setSlider5, setSlider6, setDependentParametersForZaxis, 
    interactiveLoading, interactiveFailed } from '../../redux/ActionCreators';
import Chart from './InteractiveChart';
import InteractiveTable from './InteractiveTable';
import { Loading } from '../LoadingComponent';

// let cancelToken = axios.CancelToken.source();
let cancelToken;

const urls = baseUrl + process.env.REACT_APP_INTERACTIVE;
const statsurl = baseUrl + process.env.REACT_APP_INTERACTIVE_STATS;
const urlSister = baseUrl + process.env.REACT_APP_GET_SISTER_VESSELS;
const urlSimilar = baseUrl + process.env.REACT_APP_GET_SIMILAR_VESSELS;
const urlIndependent = baseUrl + process.env.REACT_APP_GET_INDEPENDENT_PARAMETERS;
const urlDependent = baseUrl + process.env.REACT_APP_GET_DEPENDENT_PARAMETERS;

const mapStateToProps = state => {
    return {
        trends: state.trends,
        interactive: state.interactive,
        options: state.options,
        currentShip: state.currentShip
    }
}

const mapDispatchToProps = dispatch => ({
    interactiveLoading: (input) => { dispatch(interactiveLoading(input))},
    interactiveFailed: (input) => { dispatch(interactiveFailed(input))},
    setXAxis: (input) => { dispatch(setXAxis(input)) },
    setYAxis: (input) => { dispatch(setYAxis(input)) },
    setZAxis: (input) => { dispatch(setZAxis(input)) },
    setColor: (input) => { dispatch(setColor(input)) },
    setBasic: (input) => { dispatch(setBasic(input)) },
    setSize: (input) => { dispatch(setSize(input)) },
    setShape: (input) => { dispatch(setShape(input)) },
    setDimensions: (input) => { dispatch(setDimensions(input)) },
    setCombo: (input) => { dispatch(setCombo(input)) },
    setMultiParametric: (input) => { dispatch(setMultiParametric(input)) },
    setInteractiveCompare: (input) => { dispatch(setInteractiveCompare(input)) },
    setInteractiveDuration: (input) => { dispatch(setInteractiveDuration(input)) },
    setInteractive: (input) => { dispatch(setInteractive(input)) },
    setInteractiveStatsData: (input) => { dispatch(setInteractiveStatsData(input)) },
    setFeature1: (input) => { dispatch(setFeature1(input)) },
    setFeature2: (input) => { dispatch(setFeature2(input)) },
    setFeature3: (input) => { dispatch(setFeature3(input)) },
    setFeature4: (input) => { dispatch(setFeature4(input)) },
    setFeature5: (input) => { dispatch(setFeature5(input)) },
    setFeature6: (input) => { dispatch(setFeature6(input)) },
    setTypeOfInput: (input) => { dispatch(setTypeOfInput(input)) },
    setSisterVessel: (input) => { dispatch(setSisterVessel(input))},
    setSimilarVessel: (input) => { dispatch(setSimilarVessel(input))},
    setIndependentParameters: (input) => { dispatch(setIndependentParameters(input))},
    setDependentParameters: (input) => { dispatch(setDependentParameters(input))},
    setSlider1: (input) => { dispatch(setSlider1(input))},
    setSlider2: (input) => { dispatch(setSlider2(input))},
    setSlider3: (input) => { dispatch(setSlider3(input))},
    setSlider4: (input) => { dispatch(setSlider4(input))},
    setSlider5: (input) => { dispatch(setSlider5(input))},
    setSlider6: (input) => { dispatch(setSlider6(input))},
    setDependentParametersForZaxis: (input) => { dispatch(setDependentParametersForZaxis(input))},
})


class InteractiveCard extends React.Component {
    // zAxisSelect = null;
    // colorSelect = null;
    // sizeSelect = null;
    constructor(props) {
        super(props);

        this.state = {
            groupOptions: [
                {
                    id: "dropdown-combo",
                    value: "Combo1",
                    label: "Combo 1"
                },
                {
                    id: "dropdown-combo",
                    value: "Combo2",
                    label: "Combo 2"
                },
                {
                    id: "dropdown-combo",
                    value: "Combo3",
                    label: "Combo 3"
                }
            ],
            XOptions: [
                {
                    id: "Xaxis",
                    value: "rpm",
                    label: "RPM"
                },
                {
                    id: "Xaxis",
                    value: "speeds_stw",
                    label: "Speed STW (Log)"
                },
                {
                    id: "Xaxis",
                    value: "speed_ship_sog",
                    label: "Speed SOG (Ship)"
                },
                {
                    id: "Xaxis",
                    value: "draft_mean",
                    label: "Draft Mean"
                },
                // {
                //     id: "Xaxis",
                //     value: "Trim",
                //     label: "Trim"
                // },
                {
                    id: "Xaxis",
                    value: "w_force",
                    label: "Beaufort"
                },
                {
                    id: "Xaxis",
                    value: "sea_st",
                    label: "Sea State"
                },
                // {
                //     id: "Xaxis",
                //     value: "Speed SOG (Calc)",
                //     label: "Speed SOG (Calc)"
                // },
                // {
                //     id: "Xaxis",
                //     value: "Speed SOG (Calc)",
                //     label: "Speed SOG (Calc)"
                // },
            ],
            YOptions: [
                {
                    id: "Yaxis",
                    value: "main_fuel_per_dst",
                    label: "ME Fuel Per Dist(HFO)"
                },
                {
                    id: "Yaxis",
                    value: "real_slip",
                    label: "Real Slip (N)"
                },
                {
                    id: "Yaxis",
                    value: "pwr",
                    label: "SHP"
                },
                {
                    id: "Yaxis",
                    value: "draft_mean",
                    label: "Draft Mean"
                },
                {
                    id: "Yaxis",
                    value: "edist",
                    label: "Eng Dist"
                },
                {
                    id: "Yaxis",
                    value: "sa_pres",
                    label: "ME Scavange Press"
                },
                {
                    id: "Yaxis",
                    value: "sa_temp",
                    label: "ME Scavange Temp"
                },
                {
                    id: "Yaxis",
                    value: "ext_tempavg",
                    label: "ME Exh Temp  Avg"
                },
                {
                    id: "Yaxis",
                    value: "tc1_rpm",
                    label: "T/Ch RPM Number #1"
                },
                {
                    id: "Yaxis",
                    value: "tc1_extin_temp",
                    label: "T/Ch Exh Temp Inlet #1"
                },
                {
                    id: "Yaxis",
                    value: "tc1_extout_temp",
                    label: "T/Ch Exh Temp Outlet #1"
                },
                {
                    id: "Yaxis",
                    value: "speed_stw",
                    label: "Speed STW (Log)"
                },
                {
                    id: "Yaxis",
                    value: "speed_ship_sog",
                    label: "Speed SOG (Ship)"
                },
                {
                    id: "Yaxis",
                    value: "sfoc",
                    label: "SFOC"
                },
            ],
            ZOptions: [
                {
                    id: "Zaxis",
                    value: "main_fuel_per_dst",
                    label: "ME Fuel Per Dist(HFO)"
                },
                {
                    id: "Zaxis",
                    value: "real_slip",
                    label: "Real Slip (N)"
                },
                {
                    id: "Zaxis",
                    value: "pwr",
                    label: "SHP"
                },
                {
                    id: "Zaxis",
                    value: "edist",
                    label: "Eng Dist"
                },
                {
                    id: "Zaxis",
                    value: "sa_pres",
                    label: "ME Scavange Press"
                },
                {
                    id: "Zaxis",
                    value: "sa_temp",
                    label: "ME Scavange Temp"
                },
                {
                    id: "Zaxis",
                    value: "ext_tempavg",
                    label: "ME Exh Temp  Avg"
                },
                {
                    id: "Zaxis",
                    value: "tc1_rpm",
                    label: "T/Ch RPM Number #1"
                },
                {
                    id: "Zaxis",
                    value: "tc1_extin_temp",
                    label: "T/Ch Exh Temp Inlet #1"
                },
                {
                    id: "Zaxis",
                    value: "tc1_extout_temp",
                    label: "T/Ch Exh Temp Outlet #1"
                },
                {
                    id: "Zaxis",
                    value: "speed_stw",
                    label: "Speed STW (Log)"
                },
                {
                    id: "Zaxis",
                    value: "speed_ship_sog",
                    label: "Speed SOG (Ship)"
                },
            ],
            colorOptions: [
                {
                    id: "Color",
                    value: "Blue",
                    label: "Blue"
                },
                {
                    id: "Color",
                    value: "Orange",
                    label: "Orange"
                },
                {
                    id: "Color",
                    value: "Red",
                    label: "Red"
                },
            ],
            sizeOptions: [
                {
                    id: "Size",
                    value: "1",
                    label: "1"
                },
                {
                    id: "Size",
                    value: "2",
                    label: "2"
                },
                {
                    id: "Size",
                    value: "3",
                    label: "3"
                },
            ],
            basicOptions: [
                {
                    id: "dropdown-basic",
                    value: "Engine",
                    label: "Engine"
                },
                {
                    id: "dropdown-basic",
                    value: "Nautical",
                    label: "Nautical"
                },
            ],
            dropList: {
                dropBasic: "",
                dropCombo: "",
                dropX: "",
                dropY: "",
                dropZ: "",
                dropColor: "",
                dropSize: ""
            },
            dimensions: "2D",
            multiparam: "ParameterAnalysis",
            compare: "None",
            duration: "30Days",
            shape: "ballast",
            typeofinput: "input",
            // x_param_option: {id: 'Xaxis'},
            // y_param_option: {id: 'Yaxis'},
            // z_param_option: {id: 'Zaxis'},

        }

        this.handleDimensionChange = this.handleDimensionChange.bind(this);
        this.onDropChange = this.onDropChange.bind(this);
        this.onRadioChange = this.onRadioChange.bind(this);
        this.getChartData = this.getChartData.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.getStatsData = this.getStatsData.bind(this);
        this.handleVesselDrop = this.handleVesselDrop.bind(this);
        this.getSimilarVessel = this.getSimilarVessel.bind(this);
        this.getSisterVessel = this.getSisterVessel.bind(this);
        this.getIndependentParameters = this.getIndependentParameters.bind(this);
        this.getDependentParameters = this.getDependentParameters.bind(this);
        this.getDependentParametersForZaxis = this.getDependentParametersForZaxis.bind(this);
        this.getIndependentParametersForZaxis = this.getIndependentParametersForZaxis.bind(this);
        this.createConstantNamesForStatsData = this.createConstantNamesForStatsData.bind(this);
        // this.clearValue = this.clearValue.bind(this);
    }

    onRadioChange = (e) => {
        if(e.target.value.includes("Analysis")) {
            this.setState({
                multiparam: e.target.value
            });
            this.props.setMultiParametric(e.target.value);
        }
        else if(e.target.value.includes("Com")) {
            let str = e.target.value.replace("Com", "");
            let specific = document.getElementById("specificsister");
            let similar = document.getElementById("similarsister");
            if(str === "SpecificSister") {
                specific.style.display = "contents";
                specific.style.visibility = "visible";
                similar.style.display = "none";
                similar.style.visibility = "hidden";
                
                this.getSisterVessel();
            }
            else if(str === "SimilarShips") {
                specific.style.display = "none";
                specific.style.visibility = "hidden";
                similar.style.display = "contents";
                similar.style.visibility = "visible";
                // this.setState({
                //     compare: str
                // });
                // this.props.setInteractiveCompare(str);
                this.getSimilarVessel()
            }
            else {
                this.setState({
                    compare: str
                });
                this.props.setInteractiveCompare(str);
                specific.style.display = "none";
                specific.style.visibility = "hidden";
                similar.style.display = "none";
                similar.style.visibility = "hidden";
            }
            // this.setState({
            //     compare: str
            // });
            // this.props.setInteractiveCompare(str);
        }
        else if(e.target.value.includes("Duration")) {
            let str = e.target.value.replace("Duration", "");
            this.setState({
                duration: str
            });
            this.props.setInteractiveDuration(str);
        }
        else if(e.target.value.includes("shape")) {
            let str = e.target.value.replace("shape", "");
            this.setState({
                shape: str
            });
            this.props.setShape(str);
        }
        else if(e.target.value === 'input') {
            this.setState({
                typeofinput: e.target.value
            });
            this.props.setTypeOfInput(e.target.value);
        }
        else if(e.target.value === 'target') {
            this.setState({
                typeofinput: e.target.value
            });
            this.props.setTypeOfInput(e.target.value);
        }
    }

    handleDimensionChange = (e) => {
        let Dim3 = document.getElementById("Z");
        let typeofinput = document.getElementById("typeofinput");
        let clr = document.getElementById("Clr");
        let siz = document.getElementById("siz");
        let shp = document.getElementById("shp");
        let disp = document.getElementById("disp");
        let displ = document.getElementById("displ");
        let shipcon = document.getElementById("shipcon");
        let in6D = document.getElementById("in6D");
        if(e.target.value == "3D") {
            disp.style.display = "contents";
            Dim3.style.visibility = "visible";
            typeofinput.style.visibility = "visible";
            shipcon.style.display = "contents";
            in6D.style.display = "none";
            displ.style.display = "none";
            clr.style.visibility = "hidden";
            siz.style.visibility = "hidden";
            shp.style.visibility = "hidden";
            this.setState({
                dimensions: e.target.value
            });
            this.props.setDimensions(e.target.value);
            // this.props.setColor(null);
            // this.props.setSize(null);
            // this.props.setZAxis(null);
            // this.colorSelect.select.clearValue();
            // this.sizeSelect.select.clearValue();
        }
        else if(e.target.value == "6D") {
            displ.style.display = "contents";
            disp.style.display = "contents";
            Dim3.style.visibility = "visible";
            typeofinput.style.visibility = "visible";
            clr.style.visibility = "visible";
            siz.style.visibility = "visible";
            shp.style.visibility = "visible";
            shipcon.style.display = "none";
            in6D.style.display = "contents";
            this.setState({
                dimensions: e.target.value
            });
            this.props.setDimensions(e.target.value);
        }
        else {
            disp.style.display = "none";
            displ.style.display = "none";
            Dim3.style.visibility = "hidden";
            typeofinput.style.visibility = "hidden";
            clr.style.visibility = "hidden";
            siz.style.visibility = "hidden";
            shp.style.visibility = "hidden";
            shipcon.style.display = "contents";
            in6D.style.display = "none";
            this.setState({
                dimensions: e.target.value
            });
            this.props.setDimensions(e.target.value);
            // this.props.setColor(null);
            // this.props.setSize(null);
            // this.props.setZAxis(null);
            // this.zAxisSelect.select.clearValue();
            // this.colorSelect.select.clearValue();
            // this.sizeSelect.select.clearValue();
            // this.clearValue();
        }
    }

    // clearValue = () => {
    //     this.zAxisSelect.select.clearValue();
    //     this.colorSelect.select.clearValue();
    //     this.sizeSelect.select.clearValue();
    // }

    onDropChange = (e) => {
        console.log("e", e.id);
        if(e.id == "dropdown-basic") {
            this.setState({
                dropList: {
                    dropBasic: e.value
                }
            });
            this.props.setBasic(e.value);
        }
        else if(e.id == "dropdown-combo") {
            this.setState({
                dropList: {
                    dropCombo: e.value
                }
            });
            this.props.setCombo(e.value);
        }
        else if(e.id == "Xaxis") {
            this.setState({
                dropList: {
                    dropX: e.label
                },
                x_param_option: e
            });
            this.props.setXAxis(e.value);
            if(this.props.interactive.feature_1 == e.value) {
                this.props.setFeature1('None');
            }
            else if(this.props.interactive.feature_2 == e.value) {
                this.props.setFeature2('None');
            }
            else if(this.props.interactive.feature_3 == e.value) {
                this.props.setFeature3('None');
            }
            else if(this.props.interactive.feature_4 == e.value) {
                this.props.setFeature4('None');
            }
            else if(this.props.interactive.feature_5 == e.value) {
                this.props.setFeature5('None');
            }
            else if(this.props.interactive.feature_6 == e.value) {
                this.props.setFeature6('None');
            }
        }
        else if(e.id == "Yaxis") {
            this.setState({
                dropList: {
                    dropY: e.label
                },
                y_param_option: e
            });
            this.props.setYAxis(e.value);
        }
        else if(e.id == "Zaxis") {
            this.setState({
                dropList: {
                    dropZ: e.label
                },
                z_param_option: e
            });
            this.props.setZAxis(e.value);
            if(this.props.interactive.feature_1 == e.value) {
                this.props.setFeature1('None');
            }
            else if(this.props.interactive.feature_2 == e.value) {
                this.props.setFeature2('None');
            }
            else if(this.props.interactive.feature_3 == e.value) {
                this.props.setFeature3('None');
            }
            else if(this.props.interactive.feature_4 == e.value) {
                this.props.setFeature4('None');
            }
            else if(this.props.interactive.feature_5 == e.value) {
                this.props.setFeature5('None');
            }
            else if(this.props.interactive.feature_6 == e.value) {
                this.props.setFeature6('None');
            }
        }
        else if(e.id == "Color") {
            this.setState({
                dropList: {
                    dropColor: e.value
                }
            });
            this.props.setColor(e.value);
        }
        else if(e.id == "Size") {
            this.setState({
                dropList: {
                    dropSize: e.value
                }
            });
            this.props.setSize(e.value);
        }
    }

    componentDidMount() {
        cancelToken = axios.CancelToken.source();
        if(this.props.currentShip.currentShip) {
            this.getIndependentParameters('Xaxis');
            this.getDependentParameters('Yaxis');
        }
        // this.getIndependentParameters('Xaxis');
        // if(this.props.options.independentParameters !== null || this.props.options.independentParameters !== undefined) {
        //     this.getStatsData();
        // }
        // this.getDependentParameters('Yaxis');
        // if(this.props.interactive.dimensions === '3D' || this.props.interactive.dimensions === '6D') {
        // this.getDependentParametersForZaxis('Zaxis');
        // }
    }

    // componentWillUnmount() {
    //     // if(cancelToken) {
    //         cancelToken.cancel("")
    //     // }
    // }

    componentDidUpdate(prevProps, prevState) {
        if(prevProps.interactive.typeofinput !== this.props.interactive.typeofinput || prevProps.interactive.dimensions !== this.props.interactive.dimensions) {
            if(this.props.interactive.typeofinput === 'target' && (this.props.interactive.dimensions === '3D' || this.props.interactive.dimensions === '6D')) {
                this.getDependentParametersForZaxis('Zaxis');
            }
            if(this.props.interactive.typeofinput === 'input' && (this.props.interactive.dimensions === '3D' || this.props.interactive.dimensions === '6D')) {
                this.getIndependentParametersForZaxis('Zaxis');
            }
        }
        // if(prevProps.options.independentParameters !== this.props.options.independentParameters && this.props.options.independentParameters>0) {
        //     this.getStatsData();
        // }
        // if(prevProps.currentShip.currentShip !== this.props.currentShip.currentShip) {
        //     this.getStatsData();
        // }
        if(prevProps.currentShip.currentShip !== this.props.currentShip.currentShip) {
            this.getIndependentParameters('Xaxis');
            this.getDependentParameters('Yaxis');
            if(this.props.interactive.typeofinput === 'target' && (this.props.interactive.dimensions === '3D' || this.props.interactive.dimensions === '6D')) {
                this.getDependentParametersForZaxis('Zaxis');
            }
            if(this.props.interactive.typeofinput === 'input' && (this.props.interactive.dimensions === '3D' || this.props.interactive.dimensions === '6D')) {
                this.getIndependentParametersForZaxis('Zaxis');
            }
        }
        if(prevProps.options.independentParameters !== this.props.options.independentParameters ) {
            this.getStatsData();
        }
        if(prevProps.interactive.duration !== this.props.interactive.duration) {
            this.getStatsData();
            if(this.props.interactive.duration === '180Days' && this.props.interactive.compare === 'None') {
                this.props.setInteractiveDuration('180Days')
            }
            else if(this.props.interactive.duration === '1Year' && this.props.interactive.compare === 'None') {
                this.props.setInteractiveDuration('1Year')
            }
            else if(this.props.interactive.duration === '180Days' && this.props.interactive.compare === 'LastYear') {
                this.props.setInteractiveDuration('Lastyear180')
            }
            else if(this.props.interactive.duration === '1Year' && this.props.interactive.compare === 'LastYear') {
                this.props.setInteractiveDuration('Lastyear')
            }
        }
        if(prevProps.interactive.compare !== this.props.interactive.compare) {
            if(this.props.interactive.compare === 'None' && this.props.interactive.duration === 'Lastyear180') {
                this.props.setInteractiveDuration('180Days')
            }
            else if(this.props.interactive.compare === 'None' && this.props.interactive.duration === 'Lastyear') {
                this.props.setInteractiveDuration('1Year')
            }
            else if(this.props.interactive.compare === 'LastYear' && this.props.interactive.duration === '180Days') {
                this.props.setInteractiveDuration('Lastyear180')
            }
            else if(this.props.interactive.compare === 'LastYear' && this.props.interactive.duration === '1Year') {
                this.props.setInteractiveDuration('Lastyear')
            }
        }
        // if(prevProps.interactive.multiparam !== this.props.interactive.multiparam) {
        //     this.props.options.dependentParametersForZaxis && this.setState({
        //         x_param_option: {id: "Xaxis", label: "None", value: "None"},
        //         y_param_option: {id: "Yaxis", label: "None", value: "None"},
        //         z_param_option: {id: "Zaxis", label: "None", value: "None"}
        //     })
        // }
        // if(prevProps.interactive.typeofinput !== this.props.interactive.typeofinput) {
        //     this.props.options.dependentParametersForZaxis && this.setState({
        //         x_param_option: {id: "Xaxis", label: "None", value: "None"},
        //         y_param_option: {id: "Yaxis", label: "None", value: "None"},
        //         z_param_option: {id: "Zaxis", label: "None", value: "None"}
        //     })
        // }
        // if(prevProps.interactive !== this.props.interactive) {
        //     this.setState({
        //         dropList: {
        //             dropX: this.props.interactive.x_axis,
        //             dropY: this.props.interactive.y_axis,
        //             dropZ: this.props.interactive.z_axis
        //         }
        //     })
        // }
        // if(prevProps.interactive.statsData !== this.props.interactive.statsData) {
        //     alert("Features on the right panel are ready to use!");
        // }
        // if(prevProps.trends.duration !== this.props.trends.duration) {
        //     this.getStatsData();
        // }
        // if(prevProps.trends.ship_imo !== this.props.trends.ship_imo) {
        //     this.getStatsData();
        // }
    }

    createConstantNamesForStatsData = () => {
        let constantNames=[];
        // console.log("interactive card independent parameters",this.props.options);
        for(let i=0;i<this.props.options.independentParameters['Result'].length;i++) {
            // if(this.props.options.independentParameters['Result'][i]['value'] !== 'rep_dt' || this.props.options.independentParameters['Result'][i]['value'] !== 'rep_time' || this.props.options.independentParameters['Result'][i]['value'] !== 'vsl_load_bal') {
            constantNames.push(this.props.options.independentParameters['Result'][i]['value']);
            // }
        }
        let stringOfConstantNames = constantNames.join(",");
        return stringOfConstantNames;
    }

    getChartData = (param) => {
        axios({
            method: "get",
            url: urls,
            params: param,
            cancelToken: cancelToken.token
        })
        .then((res) => {
            // this.setState({
            //     data: res.data
            // });
            // this.initChart(res.data);
            this.props.setInteractive(res.data);
            console.log(res.data);
            // return res.data;
        })
        .catch((err) => {
            // console.log("Error", err);
            this.props.interactiveFailed(err);
        });
    }

    getStatsData = async () => {
        let constantNames = this.createConstantNamesForStatsData();
        let param = {
            'ship_imo': this.props.currentShip.currentShip['value'],
            'duration': this.props.interactive.duration,
            // 'constantNames': 'rpm,speed_stw,speed_sog,draft_mean,trim,w_force,sea_st'
            'constantNames': constantNames
        }
        await axios({
            method: "get",
            url: statsurl,
            params: param,
            cancelToken: cancelToken.token
        })
        .then((res) => {
            // console.log(res.data);
            this.props.setInteractiveStatsData(res.data);
        })
    }

    handleSubmit = () => {
        let defaultConstantList=[]
        let nameList=[this.props.interactive.feature_1, this.props.interactive.feature_2, this.props.interactive.feature_3, this.props.interactive.feature_4, this.props.interactive.feature_5, this.props.interactive.feature_6];
        let param;
        if(nameList.every((val, i, arr) => val === arr[0])) {
            alert("Select at least one feature!");
        }
        else {
            let valuesList = [this.props.interactive.feature_input1, this.props.interactive.feature_input2, this.props.interactive.feature_input3, this.props.interactive.feature_input4, this.props.interactive.feature_input5, this.props.interactive.feature_input6];
            if(this.props.interactive.dimensions == '2D') {
                this.props.interactive.x_axis == '' || this.props.interactive.y_axis == '' ? alert("Select Parameters from the left panel!") : param = {
                    'ship_imo': this.props.currentShip.currentShip['value'],
                    'X': this.props.interactive.x_axis,
                    'Y': this.props.interactive.y_axis,
                    'Z': this.props.interactive.z_axis ? this.props.interactive.z_axis : null,
                    'constantNames': nameList.toString(),
                    'constantValues': valuesList.toString(),
                    'duration': this.props.interactive.duration,
                    // 'compare': this.props.interactive.compare,
                    'load': this.props.interactive.load
                }
                this.props.interactiveLoading(true);
                this.getChartData(param);
            }
            if(this.props.interactive.dimensions == '3D') {
                this.props.interactive.x_axis == '' || this.props.interactive.y_axis == '' || this.props.interactive.z_axis == '' ? alert("Select Parameters from the left panel!") : param = {
                    'ship_imo': this.props.currentShip.currentShip['value'],
                    'X': this.props.interactive.x_axis,
                    'Y': this.props.interactive.y_axis,
                    'Z': this.props.interactive.z_axis ? this.props.interactive.z_axis : null,
                    'constantNames': nameList.toString(),
                    'constantValues': valuesList.toString(),
                    'duration': this.props.interactive.duration,
                    // 'compare': this.props.interactive.compare,
                    'typeofinput': this.props.interactive.typeofinput,
                    'load': this.props.interactive.load
                }
                this.props.interactiveLoading(true);
                this.getChartData(param);
            }
            if(this.props.interactive.dimensions == '6D') {
                this.props.interactive.x_axis == '' || this.props.interactive.y_axis == '' || this.props.interactive.z_axis == '' || this.props.interactive.color == '' || this.props.interactive.size == '' ? alert("Select Parameters from the left panel!") : param = {
                    'ship_imo': this.props.currentShip.currentShip['value'],
                    'X': this.props.interactive.x_axis,
                    'Y': this.props.interactive.y_axis,
                    'Z': this.props.interactive.z_axis ? this.props.interactive.z_axis : null,
                    'constantNames': nameList.toString(),
                    'constantValues': valuesList.toString(),
                    'duration': this.props.interactive.duration,
                    // 'compare': this.props.interactive.compare,
                    'load': this.props.interactive.load
                }
                this.props.interactiveLoading(true);
                this.getChartData(param);
            }
            
        }
        
    }

    handleVesselDrop = (e) => {
        this.setState({
            compare: e.value
        });
        this.props.setInteractiveCompare(e.value);
    }

    getSisterVessel = async () => {
        let param = {'ship_imo': this.props.trends.ship_imo}
        await axios({
            method: "get",
            url: urlSister,
            params: param,
            cancelToken: cancelToken.token
        })
        .then(res => {
            this.props.setSisterVessel(res.data);
        })
        .catch(error => console.log(error));
    }

    getSimilarVessel = async () => {
        let param = {'ship_imo': this.props.trends.ship_imo}
        await axios({
            method: "get",
            url: urlSimilar,
            params: param,
            cancelToken: cancelToken.token
        })
        .then(res => {
            this.props.setSimilarVessel(res.data);
        })
        .catch(error => console.log(error));
    }

    getIndependentParameters = async (id) => {
        let param = {'ship_imo': this.props.currentShip.currentShip['value'], 'id': id}
        await axios({
            method: "get",
            url: urlIndependent,
            params: param,
            cancelToken: cancelToken.token
        })
        .then(res => {
            this.props.setIndependentParameters(res.data);
        })
        .catch(error => console.log(error));
    }

    getDependentParameters = async (id) => {
        let param = {'ship_imo': this.props.currentShip.currentShip['value'], 'id': id}
        await axios({
            method: "get",
            url: urlDependent,
            params: param,
            cancelToken: cancelToken.token
        })
        .then(res => {
            this.props.setDependentParameters(res.data);
        })
        .catch(error => console.log(error));
    }

    getDependentParametersForZaxis = async (id) => {
        let param = {'ship_imo': this.props.currentShip.currentShip['value'], 'id': id}
        await axios({
            method: "get",
            url: urlDependent,
            params: param,
            cancelToken: cancelToken.token
        })
        .then(res => {
            this.props.setDependentParametersForZaxis(res.data);
        })
        .catch(error => console.log(error));
    }

    getIndependentParametersForZaxis = async (id) => {
        let param = {'ship_imo': this.props.currentShip.currentShip['value'], 'id': id}
        await axios({
            method: "get",
            url: urlIndependent,
            params: param,
            cancelToken: cancelToken.token
        })
        .then(res => {
            this.props.setDependentParametersForZaxis(res.data);
        })
        .catch(error => console.log(error));
    }

    render() {
        return(
            <Container fluid>
                <Row>
                    <Col md={2}>
                        <Collapsible title="Combos & Dimensions" className="interactivecard" style={{height: "fit-content"}} default={true}>
                            <form>
                                <Row className="align-items-center">
                                    <Col style={{ fontSize: "15px" }}>
                                        <div className="flex-radio">
                                            <input style={{transform:"scale(0.75)"}} type="radio" id="param" name="param" value="paramAnalysis" onChange={this.onRadioChange} defaultChecked /> <label htmlFor="param">Parameters</label>
                                            {'   '}
                                            <input style={{transform:"scale(0.75)"}} type="radio" id="indices" disabled={true} name="param" value="indicesAnalysis" onChange={this.onRadioChange} /> <label htmlFor="indices">Indices</label>
                                        </div>
                                    </Col>
                                </Row>
                                <Row className="align-items-center">
                                    <Col style={{ fontSize: "15px" }}>
                                        <div className="flex-radio">
                                            <input style={{transform:"scale(0.5)"}} type="radio" id="2d" name="dim" value="2D" onChange={this.handleDimensionChange} defaultChecked /> <label htmlFor="2d">2D</label>
                                            {'   '}
                                            <input style={{transform:"scale(0.5)"}} type="radio" id="3d" name="dim" value="3D" onChange={this.handleDimensionChange} /> <label htmlFor="3d"> 3D</label>
                                            {'   '}
                                            <input style={{transform:"scale(0.5)"}} type="radio" id="6d" disabled={true} name="dim" value="6D" onChange={this.handleDimensionChange} /> <label htmlFor="6d">6D</label>
                                            {'   '}
                                        </div>
                                    </Col>
                                </Row>
                                <Row className="align-items-center">
                                    <Col style={{ fontSize: "15px" }}>
                                        <Select options={this.state.groupOptions} isDisabled={true} name="dropdown-combo" placeholder="Popular Combos" onChange={this.onDropChange} />
                                    </Col>
                                </Row>
                                <Row className="align-items-center">
                                    <Col style={{ fontSize: "15px" }}>
                                        <div id="X" className="flex-dropdwn">
                                            <label htmlFor="Xaxis" className="col-3">X Axis</label>
                                            { this.props.options.independentParameters && <Select options={this.props.options.independentParameters['Result']} name="Xaxis" placeholder="X Axis" onChange={this.onDropChange} className="col-9" />}
                                        </div>
                                        <div id="Y" className="flex-dropdwn">
                                            <label htmlFor="Yaxis" className="col-3">Y Axis</label>
                                            { this.props.options.dependentParameters && <Select options={this.props.options.dependentParameters['Result']} name="Yaxis" placeholder="Y Axis" onChange={this.onDropChange} className="col-9" />}
                                        </div>
                                        <div id="disp" style={{display: "none"}}>
                                            
                                            <div id="Z" className="flex-dropdwn" style={{visibility: "hidden"}}>
                                                <label htmlFor="Zaxis" className="col-3">Z Axis</label>
                                                { this.props.interactive.typeofinput === 'input' ? this.props.options.dependentParametersForZaxis && <Select ref={ref => {this.zAxisSelect = ref}} options={this.props.options.dependentParametersForZaxis['Result']} name="Zaxis" placeholder="Z Axis" onChange={this.onDropChange} className="col-9" /> : this.props.options.dependentParametersForZaxis && <Select ref={ref => {this.zAxisSelect = ref}} options={this.props.options.dependentParametersForZaxis['Result']} name="Zaxis" placeholder="Z Axis" onChange={this.onDropChange} className="col-9" />}
                                            </div>
                                            <div id="typeofinput" className="flex-radio" style={{visibility: 'hidden'}}>
                                                <label>Z as: </label>
                                                <label htmlFor="input"><input type="radio" id="input" name="typeofinput" value="input" onChange={this.onRadioChange} defaultChecked/> Indpndnt</label>
                                                <label htmlFor="target"><input type="radio" id="target" name="typeofinput" value="target" onChange={this.onRadioChange} /> Depndnt</label>
                                            </div>
                                        </div>
                                        <div id="displ" style={{display: "none"}}>
                                            
                                            <div id="Clr" className="flex-dropdwn" style={{visibility: "hidden"}}>
                                                <label htmlFor="Color" className="col-3">Color</label>
                                                <Select ref={ref => {this.colorSelect = ref}} options={this.state.colorOptions} name="Color" placeholder="Color" onChange={this.onDropChange} className="col-9" />
                                            </div>
                                            <div id="siz" className="flex-dropdwn" style={{visibility: "hidden"}}>
                                                <label htmlFor="Size" className="col-3">Size</label>
                                                <Select ref={ref => {this.sizeSelect = ref}} options={this.state.sizeOptions} name="Size" placeholder="Size" onChange={this.onDropChange} className="col-9" />
                                            </div>
                                            <div id="shp" className="flex-radio" style={{visibility: "hidden"}}>
                                                <label>Shape</label>{'  '}
                                                <label htmlFor="Ballast"><input id="Ballast" name="Shape" value="shapeballast" type="radio" onChange={this.onRadioChange} defaultChecked /> Ballast</label>{'  '}
                                                <label htmlFor="Loaded"><input id="Loaded" name="Shape" value="shapeloaded" type="radio" onChange={this.onRadioChange} /> Loaded</label>{'  '}
                                                <label htmlFor="Both"><input id="Both" name="Shape" value="shapeboth" type="radio" onChange={this.onRadioChange} /> Both</label>{'  '}
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                            </form>
                        </Collapsible>
                        {/* <Collapsible title="MultiParametric Analysis" className="interactivecard">
                            <form>
                                <Row className="align-items-center">
                                    <Col className="col-12" style={{ fontSize: "15px" }}>
                                        <label htmlFor="Parameter"><input type="radio" id="Parameter" name="Analysis" value="ParameterAnalysis" onChange={this.onRadioChange} defaultChecked /> Parameter</label>
                                        <label htmlFor="Intervention"><input type="radio" id="Intervention" name="Analysis" value="InterventionAnalysis" onChange={this.onRadioChange} /> Intervention</label>
                                        <label htmlFor="Trial"><input type="radio" id="Trial" name="Analysis" value="TrialReportAnalysis" onChange={this.onRadioChange} /> Trial Report</label><br />
                                        <Select options={this.state.basicOptions} name="dropdown-basic" placeholder="Choose Type" onChange={this.onDropChange} />
                                    </Col>
                                </Row>
                            </form>
                        </Collapsible> */}
                        <Collapsible title="Compare Mode" className="interactivecard">
                            <form>
                                <Row className="align-items-center">
                                    <Col style={{ fontSize: "15px" }}>
                                        <div style={{display:"flex",alignItems:"center"}}>
                                        <input style={{marginLeft:"-90px"}} type="radio" id="None" name="Compare" value="ComNone" onChange={this.onRadioChange} defaultChecked/><label style={{marginLeft:"-90px"}} htmlFor="None"> None</label>
                                        </div>
                                        <div style={{display:"flex",alignItems:"center"}}>
                                        <input style={{marginLeft:"-90px"}} type="radio" id="LastYear" name="Compare" value="ComLastYear" onChange={this.onRadioChange} /><label style={{marginLeft:"-90px"}} htmlFor="LastYear"> Last Year</label>
                                        </div>
                                        <div style={{display:"flex",alignItems:"center"}}>
                                        <input style={{marginLeft:"-90px"}} type="radio" id="DryDock" name="Compare" value="ComDryDock" onChange={this.onRadioChange} /><label style={{marginLeft:"-90px"}} htmlFor="DryDock"> Dry Dock</label>
                                        </div>
                                        <div>
                                        <input style={{marginLeft:"-90px"}} type="radio" id="Specific" name="Compare" value="ComSpecificSister" onChange={this.onRadioChange} /><label style={{marginLeft:"-90px"}} htmlFor="Specific"> Specific Sister</label>
                                        </div>
                                        <div style={{display: "none", visibility: "hidden"}} id="specificsister">
                                            <label htmlFor="spsis">Select Specific Sister:</label>
                                            { this.props.options.sisterVessels && <Select className="select-color select-dimensions" name="dropdown-specific" id="spsis" options={this.props.options.sisterVessels['Result']} onChange={this.handleVesselDrop} />}
                                        <br/>
                                        </div>
                                        <div style={{display:"flex",alignItems:"center"}}>
                                        <input style={{marginLeft:"-90px"}} type="radio" id="All" name="Compare" value="ComAllSisters" onChange={this.onRadioChange} /><label style={{marginLeft:"-90px"}} htmlFor="All"> All Sisters</label>
                                        <br/>
                                        </div>
                                        <div>
                                        <input style={{marginLeft:"-90px"}} type="radio" id="Similar" name="Compare" value="ComSimilarShips" onChange={this.onRadioChange} /><label style={{marginLeft:"-90px"}} htmlFor="Similar"> Similar Ships</label>
                                        </div>
                                        <div style={{display: "none", visibility: "hidden"}} id="similarsister">
                                            <label htmlFor="simsis">Select Similar Vessel:</label>
                                            { this.props.options.similarVessels && <Select className="select-color select-dimensions" name="dropdown-similar" id="simsis" options={this.props.options.similarVessels['Result']}  onChange={this.handleVesselDrop} />}
                                        <br/>
                                        </div>
                                    </Col>
                                </Row>
                            </form>
                        </Collapsible>
                        <Collapsible title="Duration" className="interactivecard">
                            <form>
                                <Row className="align-items-center">
                                    <Col style={{ fontSize: "15px" }}>
                                        {/* <label htmlFor="30"><input type="radio" id="30" name="Duration" value="Duration30Days" onChange={this.onRadioChange} /> 30 Days</label> */}
                                        {/* <br/> */}
                                        <div style={{display:"flex",alignItems:"center"}}>
                                        <input style={{marginLeft:"-90px"}} type="radio" id="90" name="Duration" value="Duration180Days" onChange={this.onRadioChange} /> <label style={{marginLeft:"-90px"}} htmlFor="90">180 Days</label>
                                        </div>
                                        <div style={{display:"flex",alignItems:"center"}}>
                                        <input style={{marginLeft:"-90px"}} type="radio" id="1" name="Duration" value="Duration1Year" onChange={this.onRadioChange} defaultChecked/> <label style={{marginLeft:"-90px"}} htmlFor="1">1 Year</label>
                                        </div>
                                        <div style={{display:"flex",alignItems:"center"}}>
                                        <input style={{marginLeft:"-90px"}} type="radio" id="Since" name="Duration" value="DurationSinceDryDock" onChange={this.onRadioChange} /> <label style={{marginLeft:"-90px"}} htmlFor="Since">Since Dry Dock</label>
                                        </div>
                                    </Col>
                                </Row>
                            </form>
                        </Collapsible>
                    </Col>
                    <Col md={7}>
                        {
                            // this.props.interactive.isLoading === true ? <Loading/> :
                            //     this.props.interactive.errMess !== null ? this.props.interactive.errMess :
                            // <Card className="interactivecard" style={{padding: 0}}>
                                // <div style={{height: "650px", overflowY: "auto", overflowX: "inherit"}}>
                                //     <Chart />
                                // </div>
                            // </Card>
                        }
                        <Card className="interactivecard" style={{background: "#8A9090", padding: 0}}>
                            <div style={{height: "650px", overflowY: "auto", overflowX: "inherit"}}>
                                <Chart />
                            </div>
                        </Card>
                    </Col>
                    <Col md={3}>
                        <Button style={{marginTop: "5px"}} variant="outline-success" size="lg" onClick={this.handleSubmit} block><FontAwesomeIcon icon={faCheck} />Generate</Button>
                        <InteractiveTable />
                        {/* <Collapsible title="Table" className="interactiveheader interactivecard">
                            <form>
                                <Table responsive>
                                    <thead>
                                        <tr>
                                            <th>Feature</th>
                                            <th>Actual</th>
                                            <th>Expected</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>asda</td>
                                            <td>asda</td>
                                        </tr>
                                        <tr>
                                            <td>asda</td>
                                            <td>asda</td>
                                        </tr>
                                        <tr>
                                            <td>asda</td>
                                            <td>asda</td>
                                        </tr>
                                        <tr>
                                            <td>asda</td>
                                            <td>asda</td>
                                        </tr>
                                    </tbody>
                                </Table>
                            </form>
                        </Collapsible> */}
                        <div id="shipcon">
                            <Collapsible title="Select Ship Condition" className="interactivecard" default={true}>
                                <InteractiveSlider selected_X={this.props.interactive.x_axis} />
                            </Collapsible>
                        </div>
                        <div id="in6D" style={{display: "none"}}>
                            <Collapsible title="6D Mode" className="interactiveheader interactivecard">
                                <form>
                                    <Table responsive>
                                        <thead>
                                            <tr>
                                                <th></th>
                                                <th>Selected Point</th>
                                                <th>%SD</th>
                                                <th>Mean</th>
                                                <th>SD</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <th>X Axis</th>
                                            </tr>
                                            <tr>
                                                <th>Y Axis</th>
                                            </tr>
                                            <tr>
                                                <th>Z Axis</th>
                                            </tr>
                                            <tr>
                                                <th>Color</th>
                                            </tr>
                                            <tr>
                                                <th>Size</th>
                                            </tr>
                                        </tbody>
                                    </Table>
                                </form>
                            </Collapsible>
                        </div>
                    </Col>
                </Row>
            </Container>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(InteractiveCard);