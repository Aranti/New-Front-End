import React from 'react';
import '../../../public/CommonCss/interactive.css';
import { Row, Col } from 'react-bootstrap';
import Select from 'react-select';
import "rc-slider/assets/index.css";
import Slider from "rc-slider";
import sliderRange from '../../shared/sliderRange.json';
import { connect } from 'react-redux';
import axios from 'axios';
import { baseUrl } from '../../shared/baseUrl';
import { setFeature1, setFeature2, setFeature3, setFeature4, setFeature5, setFeature6, setFeatureInput1, setFeatureInput2,setFeatureInput3, setFeatureInput4, setFeatureInput5, setFeatureInput6, setWindDirection, setSwellDirection, setBallastOrLoaded, setSlider1, setSlider2, setSlider3, setSlider4, setSlider5, setSlider6 } from '../../redux/ActionCreators';

const urls = baseUrl + process.env.REACT_APP_INTERACTIVE;
const urlIndependent = baseUrl + process.env.REACT_APP_GET_INDEPENDENT_PARAMETERS;

let cancelToken;

const mapStateToProps = state => {
    return {
        trends: state.trends,
        interactive: state.interactive,
        options: state.options,
        currentShip: state.currentShip
    }
}

const mapDispatchToProps = dispatch => ({
    setFeature1: (input) => { dispatch(setFeature1(input)) },
    setFeature2: (input) => { dispatch(setFeature2(input)) },
    setFeature3: (input) => { dispatch(setFeature3(input)) },
    setFeature4: (input) => { dispatch(setFeature4(input)) },
    setFeature5: (input) => { dispatch(setFeature5(input)) },
    setFeature6: (input) => { dispatch(setFeature6(input)) },
    setFeatureInput1: (input) => { dispatch(setFeatureInput1(input)) },
    setFeatureInput2: (input) => { dispatch(setFeatureInput2(input)) },
    setFeatureInput3: (input) => { dispatch(setFeatureInput3(input)) },
    setFeatureInput4: (input) => { dispatch(setFeatureInput4(input)) },
    setFeatureInput5: (input) => { dispatch(setFeatureInput5(input)) },
    setFeatureInput6: (input) => { dispatch(setFeatureInput6(input)) },
    setWindDirection: (input) => { dispatch(setWindDirection(input)) },
    setSwellDirection: (input) => { dispatch(setSwellDirection(input)) },
    setBallastOrLoaded: (input) => { dispatch(setBallastOrLoaded(input)) },
    setSlider1: (input) => { dispatch(setSlider1(input))},
    setSlider2: (input) => { dispatch(setSlider2(input))},
    setSlider3: (input) => { dispatch(setSlider3(input))},
    setSlider4: (input) => { dispatch(setSlider4(input))},
    setSlider5: (input) => { dispatch(setSlider5(input))},
    setSlider6: (input) => { dispatch(setSlider6(input))},
})

class InteractiveSlider extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            windOptions: [
                {
                    id: "wind",
                    value: "None",
                    label: (
                        <span>None</span>
                    )
                },
                {
                    id: "wind",
                    value: "0",
                    label: (
                        <span>0 &#176;</span>
                    )
                },
                {
                    id: "wind",
                    value: "90",
                    label: (
                        <span>90 &#176;</span>
                    )
                },
                {
                    id: "wind",
                    value: "180",
                    label: (
                        <span>180 &#176;</span>
                    )
                },
            ],
            swellOptions: [
                {
                    id: "swell",
                    value: "None",
                    label: (
                        <span>None</span>
                    )
                },
                {
                    id: "swell",
                    value: "0",
                    label: (
                        <span>0 &#176;</span>
                    )
                },
                {
                    id: "swell",
                    value: "90",
                    label: (
                        <span>90 &#176;</span>
                    )
                },
                {
                    id: "swell",
                    value: "180",
                    label: (
                        <span>180 &#176;</span>
                    )
                },
            ],
            loadOptions: [
                {
                    id: "load",
                    value: "loaded",
                    label: "Loaded"
                },
                {
                    id: "load",
                    value: "ballast",
                    label: "Ballast"
                },
                {
                    id: "load",
                    value: "any",
                    label: "Any"
                },
            ],
            defaultDrop: {
                // param: this.props.interactive.feature_1 === 'None' ? {id: "param",value: "None",label: "None"} : {id: "param",value: "rpm",label: "RPM"},
                // feat_2: this.props.interactive.feature_2 === 'None' ? {id: "2",value: "None",label: "None"} : {id: "2",value: "draft_mean",label: "Draft Mean"},
                // feat_3: this.props.interactive.feature_3 === 'None' ? {id: "3",value: "None",label: "None"} : {id: "3",value: "trim",label: "Trim"},
                // feat_4: this.props.interactive.feature_4 === 'None' ? {id: "4",value: "None",label: "None"} : {id: "4",value: "w_force",label: "Beaufort"},
                // feat_5: this.props.interactive.feature_5 === 'None' ? {id: "5",value: "None",label: "None"} : {id: "5",value: "sea_st",label: "Sea State"},
                // feat_6: this.props.interactive.feature_6 === 'None' ? {id: "6",value: "None",label: "None"} : {id: "6",value: "None",label: "None"},
                param: {id: "param",value: "rpm",label: "RPM"},
                feat_2: {id: "2",value: "draft_mean",label: "Draft Mean"},
                feat_3: {id: "3",value: "trim",label: "Trim"},
                feat_4: {id: "4",value: "w_force",label: "Beaufort"},
                feat_5: {id: "5",value: "sea_st",label: "Sea State"},
                feat_6: {id: "6",value: "None",label: "None"},
                wind: {id: "wind",value: "None",label: (<span>None</span>)},
                swell: {id: "swell",value: "None",label: (<span>None</span>)},
                load: {id: "load",value: "any",label: "Any"}
            },
            param: "",
            feat_2: "",
            feat_3: "",
            feat_4: "",
            feat_5: "",
            feat_6: "",
            wind: "",
            swell: "",
            load: "ballast",
            defaultValue: {
                rpm: 50,
                beaufort: 1,
                sea_state: 1,
                draft: 5,
                trim: -2
            },
            paramValue: 0,
            rpm: 0,
            beaufort: 0,
            sea_state: 3,
            draft: 2,
            trim: 0,
            paramInputValue: 0,
            rpmInput: 0,
            beaufortInput: 0,
            sea_stateInput: 0,
            draftInput: 0,
            trimInput: 0,
            sliderRange: {
                drop1: {
                    min: 0,
                    max: 0,
                    step: 0
                },
                drop2: {
                    min: 0,
                    max: 0,
                    step: 0
                },
                drop3: {
                    min: 0,
                    max: 0,
                    step: 0
                },
                drop4: {
                    min: 0,
                    max: 0,
                    step: 0
                },
                drop5: {
                    min: 0,
                    max: 0,
                    step: 0
                },
                drop6: {
                    min: 0,
                    max: 0,
                    step: 0
                }
            }
        }

        this.onDropChange = this.onDropChange.bind(this);
        this.onParamValueChange = this.onParamValueChange.bind(this);
        this.onRpmChange = this.onRpmChange.bind(this);
        this.onBeaufortChange = this.onBeaufortChange.bind(this);
        this.onSeaStateChange = this.onSeaStateChange.bind(this);
        this.onDraftChange = this.onDraftChange.bind(this);
        this.onTrimChange = this.onTrimChange.bind(this);
        this.onParamInputValueChange = this.onParamInputValueChange.bind(this);
        this.onRpmInputChange = this.onRpmInputChange.bind(this);
        this.onBeaufortInputChange = this.onBeaufortInputChange.bind(this);
        this.onSeaStateInputChange = this.onSeaStateInputChange.bind(this);
        this.onDraftInputChange = this.onDraftInputChange.bind(this);
        this.onTrimInputChange = this.onTrimInputChange.bind(this);
        this.getIndependentParameters = this.getIndependentParameters.bind(this);
        this.takingCareOfCorrelatedParameters = this.takingCareOfCorrelatedParameters.bind(this);
        this.disableOptionsConditionally = this.disableOptionsConditionally.bind(this);
        // this.checkIfDisabled = this.checkIfDisabled.bind(this);
    }

    componentDidMount() {
        cancelToken = axios.CancelToken.source();
        if(this.props.options.slider1.length === 0) {
            this.getIndependentParameters('param', '1');
            this.getIndependentParameters('2', '2');
            this.getIndependentParameters('3', '3');
            this.getIndependentParameters('4', '4');
            this.getIndependentParameters('5', '5');
            this.getIndependentParameters('6', '6');
        }
        
    }

    // componentWillUnmount() {
    //     cancelToken.cancel("");
    // }

    componentDidUpdate(prevProps, prevState) {
        if(prevProps.interactive.x_axis !== this.props.interactive.x_axis || prevProps.interactive.z_axis !== this.props.interactive.z_axis) {
            console.log("FIRST IF")
            if(prevProps.interactive.x_axis === this.props.interactive.x_axis || prevProps.interactive.z_axis === this.props.interactive.z_axis) {
                console.log("SECOND IF")
                this.takingCareOfCorrelatedParameters();
                this.disableOptionsConditionally();
            }
        }
        if(prevProps.currentShip.currentShip !== this.props.currentShip.currentShip) {
            this.getIndependentParameters('param', '1');
            this.getIndependentParameters('2', '2');
            this.getIndependentParameters('3', '3');
            this.getIndependentParameters('4', '4');
            this.getIndependentParameters('5', '5');
            this.getIndependentParameters('6', '6');
        }
        // if(prevProps.options.slider1 !== this.props.options.slider1) {
        //     this.getIndependentParameters('param', '1');
        //     this.getIndependentParameters('2', '2');
        //     this.getIndependentParameters('3', '3');
        //     this.getIndependentParameters('4', '4');
        //     this.getIndependentParameters('5', '5');
        //     this.getIndependentParameters('6', '6');
        // }
    }

    shouldComponentUpdate(nextProps, nextState) {
        if(this.props !== nextProps || this.state !== nextState) {
            return true;
        }
        else {
            return false;
        }
    }

    getIndependentParameters = async (id, no_of_slider) => {
        let param = {'ship_imo': this.props.currentShip.currentShip['value'], 'id': id}
        await axios({
            method: "get",
            url: urlIndependent,
            params: param,
            cancelToken: cancelToken.token
        })
        .then(res => {
            if(no_of_slider === '1') {
                this.props.setSlider1(res.data);
            }
            if(no_of_slider === '2') {
                this.props.setSlider2(res.data);
            }
            if(no_of_slider === '3') {
                this.props.setSlider3(res.data);
            }
            if(no_of_slider === '4') {
                this.props.setSlider4(res.data);
            }
            if(no_of_slider === '5') {
                this.props.setSlider5(res.data);
            }
            if(no_of_slider === '6') {
                this.props.setSlider6(res.data);
            }
        })
        .catch(error => console.log(error));
    }

    takingCareOfCorrelatedParameters = () => {
        // Currently concerns with RPM, Speed SOG, and Speed STW
        if(
            this.props.interactive.x_axis === 'rpm' || this.props.interactive.x_axis === 'speed_sog_calc' ||
            this.props.interactive.x_axis === 'speed_stw_calc' || this.props.interactive.z_axis === 'rpm' ||
            this.props.interactive.z_axis === 'speed_sog_calc' || this.props.interactive.z_axis === 'speed_stw_calc'
        ) {
            if(
                this.props.interactive.feature_1 === 'rpm' || this.props.interactive.feature_1 === 'speed_sog_calc' ||
                this.props.interactive.feature_1 === 'speed_stw_calc'
            ) {
                this.props.setFeature1('None');
            }
            if(
                this.props.interactive.feature_2 === 'rpm' || this.props.interactive.feature_2 === 'speed_sog_calc' ||
                this.props.interactive.feature_2 === 'speed_stw_calc'
            ) {
                this.props.setFeature2('None');
            }
            if(
                this.props.interactive.feature_3 === 'rpm' || this.props.interactive.feature_3 === 'speed_sog_calc' ||
                this.props.interactive.feature_3 === 'speed_stw_calc'
            ) {
                this.props.setFeature3('None');
            }
            if(
                this.props.interactive.feature_4 === 'rpm' || this.props.interactive.feature_4 === 'speed_sog_calc' ||
                this.props.interactive.feature_4 === 'speed_stw_calc'
            ) {
                this.props.setFeature4('None');
            }
            if(
                this.props.interactive.feature_5 === 'rpm' || this.props.interactive.feature_5 === 'speed_sog_calc' ||
                this.props.interactive.feature_5 === 'speed_stw_calc'
            ) {
                this.props.setFeature5('None');
            }
            if(
                this.props.interactive.feature_6 === 'rpm' || this.props.interactive.feature_6 === 'speed_sog_calc' ||
                this.props.interactive.feature_6 === 'speed_stw_calc'
            ) {
                this.props.setFeature6('None');
            }
        }
    }

    disableOptionsConditionally = () => {
        // Disables the options from the RHS dropdowns(constant X)
        // If they match with either X param or Z param on LHS
        for(let i in this.props.options.slider1['Result']) {
            if(
                this.props.interactive.x_axis === 'rpm' || this.props.interactive.x_axis === 'speed_sog_calc' || this.props.interactive.x_axis === 'speed_stw_calc' ||
                this.props.interactive.z_axis === 'rpm' || this.props.interactive.z_axis === 'speed_sog_calc' || this.props.interactive.z_axis === 'speed_stw_calc'
            ) {
                if(
                    this.props.options.slider1['Result'][i]['value'] === 'rpm' || this.props.options.slider1['Result'][i]['value'] === 'speed_sog_calc' ||
                    this.props.options.slider1['Result'][i]['value'] === 'speed_stw_calc'
                ) {
                    this.props.options.slider1['Result'][i]['disabled'] = true
                }
                else {
                    this.props.options.slider1['Result'][i]['disabled'] = false
                }
            }
            else if(this.props.options.slider1['Result'][i]['value'] === this.props.interactive.x_axis || this.props.options.slider1['Result'][i]['value'] === this.props.interactive.z_axis) {
                this.props.options.slider1['Result'][i]['disabled'] = true
            }
            else {
                this.props.options.slider1['Result'][i]['disabled'] = false
            }
        }
        for(let i in this.props.options.slider2['Result']) {
            if(
                this.props.interactive.x_axis === 'rpm' || this.props.interactive.x_axis === 'speed_sog_calc' || this.props.interactive.x_axis === 'speed_stw_calc' ||
                this.props.interactive.z_axis === 'rpm' || this.props.interactive.z_axis === 'speed_sog_calc' || this.props.interactive.z_axis === 'speed_stw_calc'
            ) {
                if(
                    this.props.options.slider2['Result'][i]['value'] === 'rpm' || this.props.options.slider2['Result'][i]['value'] === 'speed_sog_calc' ||
                    this.props.options.slider2['Result'][i]['value'] === 'speed_stw_calc'
                ) {
                    this.props.options.slider2['Result'][i]['disabled'] = true
                }
                else {
                    this.props.options.slider2['Result'][i]['disabled'] = false
                }
            }
            else if(this.props.options.slider2['Result'][i]['value'] === this.props.interactive.x_axis || this.props.options.slider2['Result'][i]['value'] === this.props.interactive.z_axis) {
                this.props.options.slider2['Result'][i]['disabled'] = true
            }
            else {
                this.props.options.slider2['Result'][i]['disabled'] = false
            }
        }
        for(let i in this.props.options.slider3['Result']) {
            if(
                this.props.interactive.x_axis === 'rpm' || this.props.interactive.x_axis === 'speed_sog_calc' || this.props.interactive.x_axis === 'speed_stw_calc' ||
                this.props.interactive.z_axis === 'rpm' || this.props.interactive.z_axis === 'speed_sog_calc' || this.props.interactive.z_axis === 'speed_stw_calc'
            ) {
                if(
                    this.props.options.slider3['Result'][i]['value'] === 'rpm' || this.props.options.slider3['Result'][i]['value'] === 'speed_sog_calc' ||
                    this.props.options.slider3['Result'][i]['value'] === 'speed_stw_calc'
                ) {
                    this.props.options.slider3['Result'][i]['disabled'] = true
                }
                else {
                    this.props.options.slider3['Result'][i]['disabled'] = false
                }
            }
            else if(this.props.options.slider3['Result'][i]['value'] === this.props.interactive.x_axis || this.props.options.slider3['Result'][i]['value'] === this.props.interactive.z_axis) {
                this.props.options.slider3['Result'][i]['disabled'] = true
            }
            else {
                this.props.options.slider3['Result'][i]['disabled'] = false
            }
        }
        for(let i in this.props.options.slider4['Result']) {
            if(
                this.props.interactive.x_axis === 'rpm' || this.props.interactive.x_axis === 'speed_sog_calc' || this.props.interactive.x_axis === 'speed_stw_calc' ||
                this.props.interactive.z_axis === 'rpm' || this.props.interactive.z_axis === 'speed_sog_calc' || this.props.interactive.z_axis === 'speed_stw_calc'
            ) {
                if(
                    this.props.options.slider4['Result'][i]['value'] === 'rpm' || this.props.options.slider4['Result'][i]['value'] === 'speed_sog_calc' ||
                    this.props.options.slider4['Result'][i]['value'] === 'speed_stw_calc'
                ) {
                    this.props.options.slider4['Result'][i]['disabled'] = true
                }
                else {
                    this.props.options.slider4['Result'][i]['disabled'] = false
                }
            }
            else if(this.props.options.slider4['Result'][i]['value'] === this.props.interactive.x_axis || this.props.options.slider4['Result'][i]['value'] === this.props.interactive.z_axis) {
                this.props.options.slider4['Result'][i]['disabled'] = true
            }
            else {
                this.props.options.slider4['Result'][i]['disabled'] = false
            }
        }
        for(let i in this.props.options.slider5['Result']) {
            if(
                this.props.interactive.x_axis === 'rpm' || this.props.interactive.x_axis === 'speed_sog_calc' || this.props.interactive.x_axis === 'speed_stw_calc' ||
                this.props.interactive.z_axis === 'rpm' || this.props.interactive.z_axis === 'speed_sog_calc' || this.props.interactive.z_axis === 'speed_stw_calc'
            ) {
                if(
                    this.props.options.slider5['Result'][i]['value'] === 'rpm' || this.props.options.slider5['Result'][i]['value'] === 'speed_sog_calc' ||
                    this.props.options.slider5['Result'][i]['value'] === 'speed_stw_calc'
                ) {
                    this.props.options.slider5['Result'][i]['disabled'] = true
                }
                else {
                    this.props.options.slider5['Result'][i]['disabled'] = false
                }
            }
            else if(this.props.options.slider5['Result'][i]['value'] === this.props.interactive.x_axis || this.props.options.slider5['Result'][i]['value'] === this.props.interactive.z_axis) {
                this.props.options.slider5['Result'][i]['disabled'] = true
            }
            else {
                this.props.options.slider5['Result'][i]['disabled'] = false
            }
        }
        for(let i in this.props.options.slider6['Result']) {
            if(
                this.props.interactive.x_axis === 'rpm' || this.props.interactive.x_axis === 'speed_sog_calc' || this.props.interactive.x_axis === 'speed_stw_calc' ||
                this.props.interactive.z_axis === 'rpm' || this.props.interactive.z_axis === 'speed_sog_calc' || this.props.interactive.z_axis === 'speed_stw_calc'
            ) {
                if(
                    this.props.options.slider6['Result'][i]['value'] === 'rpm' || this.props.options.slider6['Result'][i]['value'] === 'speed_sog_calc' ||
                    this.props.options.slider6['Result'][i]['value'] === 'speed_stw_calc'
                ) {
                    this.props.options.slider6['Result'][i]['disabled'] = true
                }
                else {
                    this.props.options.slider6['Result'][i]['disabled'] = false
                }
            }
            else if(this.props.options.slider6['Result'][i]['value'] === this.props.interactive.x_axis || this.props.options.slider6['Result'][i]['value'] === this.props.interactive.z_axis) {
                this.props.options.slider6['Result'][i]['disabled'] = true
            }
            else {
                this.props.options.slider6['Result'][i]['disabled'] = false
            }
        }
    }

    onDropChange = (selectedOption) => {
        console.log(selectedOption.id);
        if(selectedOption.id == "param") {
            if(this.props.interactive.x_axis === selectedOption.value || this.props.interactive.z_axis === selectedOption.value) {
                this.setState({
                    defaultDrop: {
                        param: {id: 'param', value: 'None', label: 'None'}
                    },
                    param: 'None',
                    sliderRange: {
                        drop1: {
                            min: selectedOption.value == 'None' ? undefined : this.props.interactive.statsData.Stats[selectedOption.value]['Min'],
                            max: selectedOption.value == 'None' ? undefined : this.props.interactive.statsData.Stats[selectedOption.value]['Max'],
                            step: selectedOption.value == 'None' ? undefined : this.props.interactive.statsData.Stats[selectedOption.value]['Step']
                        }
                    }
                });
                this.props.setFeature1('None');
            }
            else {
                this.setState({
                    defaultDrop: {
                        param: selectedOption
                    },
                    param: selectedOption.value,
                    sliderRange: {
                        drop1: {
                            min: selectedOption.value == 'None' ? undefined : this.props.interactive.statsData.Stats[selectedOption.value]['Min'],
                            max: selectedOption.value == 'None' ? undefined : this.props.interactive.statsData.Stats[selectedOption.value]['Max'],
                            step: selectedOption.value == 'None' ? undefined : this.props.interactive.statsData.Stats[selectedOption.value]['Step']
                        }
                    }
                });
                this.props.setFeature1(selectedOption.value);
            }
            
        }
        else if(selectedOption.id == "2") {
            if(this.props.interactive.x_axis === selectedOption.value || this.props.interactive.z_axis === selectedOption.value) {
                this.setState({
                    defaultDrop: {
                        feat_2: {id: '2', value: 'None', label: 'None'}
                    },
                    feat_2: 'None',
                    sliderRange: {
                        drop2: {
                            min: selectedOption.value == 'None' ? undefined : this.props.interactive.statsData.Stats[selectedOption.value]['Min'],
                            max: selectedOption.value == 'None' ? undefined : this.props.interactive.statsData.Stats[selectedOption.value]['Max'],
                            step: selectedOption.value == 'None' ? undefined : this.props.interactive.statsData.Stats[selectedOption.value]['Step']
                        }
                    }
                });
                this.props.setFeature2('None');
            }
            else {
                this.setState({
                    defaultDrop: {
                        feat_2: selectedOption
                    },
                    feat_2: selectedOption.value,
                    sliderRange: {
                        drop2: {
                            min: selectedOption.value == 'None' ? undefined : this.props.interactive.statsData.Stats[selectedOption.value]['Min'],
                            max: selectedOption.value == 'None' ? undefined : this.props.interactive.statsData.Stats[selectedOption.value]['Max'],
                            step: selectedOption.value == 'None' ? undefined : this.props.interactive.statsData.Stats[selectedOption.value]['Step']
                        }
                    }
                });
                this.props.setFeature2(selectedOption.value);
            }
            // this.setState({
            //     defaultDrop: {
            //         feat_2: this.props.interactive.x_axis == selectedOption.value ? {id: '2', value: 'None', label: 'None'} : selectedOption
            //     },
            //     feat_2: this.props.interactive.x_axis == selectedOption.value ? 'None' : selectedOption.value,
            //     sliderRange: {
            //         drop2: {
            //             min: selectedOption.value == 'None' ? undefined : this.props.interactive.statsData.Stats[selectedOption.value]['Min'],
            //             max: selectedOption.value == 'None' ? undefined : this.props.interactive.statsData.Stats[selectedOption.value]['Max'],
            //             step: selectedOption.value == 'None' ? undefined : this.props.interactive.statsData.Stats[selectedOption.value]['Step']
            //         }
            //     }
            // });
            // // console.log(this.props.interactive.statsData.Stats[selectedOption.value]['Min'],this.props.interactive.statsData.Stats[selectedOption.value]['Max'],this.props.interactive.statsData.Stats[selectedOption.value]['Step']);
            // this.props.interactive.x_axis == selectedOption.value ? this.props.setFeature2('None') : this.props.setFeature2(selectedOption.value);
            // this.checkIfDisabled(selectedOption);
        }
        else if(selectedOption.id == "3") {
            if(this.props.interactive.x_axis === selectedOption.value || this.props.interactive.z_axis === selectedOption.value) {
                this.setState({
                    defaultDrop: {
                        feat_3: {id: '3', value: 'None', label: 'None'}
                    },
                    feat_3: 'None',
                    sliderRange: {
                        drop3: {
                            min: selectedOption.value == 'None' ? undefined : this.props.interactive.statsData.Stats[selectedOption.value]['Min'],
                            max: selectedOption.value == 'None' ? undefined : this.props.interactive.statsData.Stats[selectedOption.value]['Max'],
                            step: selectedOption.value == 'None' ? undefined : this.props.interactive.statsData.Stats[selectedOption.value]['Step']
                        }
                    }
                });
                this.props.setFeature3('None');
            }
            else {
                this.setState({
                    defaultDrop: {
                        feat_3: selectedOption
                    },
                    feat_3: selectedOption.value,
                    sliderRange: {
                        drop3: {
                            min: selectedOption.value == 'None' ? undefined : this.props.interactive.statsData.Stats[selectedOption.value]['Min'],
                            max: selectedOption.value == 'None' ? undefined : this.props.interactive.statsData.Stats[selectedOption.value]['Max'],
                            step: selectedOption.value == 'None' ? undefined : this.props.interactive.statsData.Stats[selectedOption.value]['Step']
                        }
                    }
                });
                this.props.setFeature3(selectedOption.value);
            }
            // this.setState({
            //     defaultDrop: {
            //         feat_3: this.props.interactive.x_axis == selectedOption.value ? {id: '3', value: 'None', label: 'None'} : selectedOption
            //     },
            //     feat_3: this.props.interactive.x_axis == selectedOption.value ? 'None' : selectedOption.value,
            //     sliderRange: {
            //         drop3: {
            //             min: selectedOption.value == 'None' ? undefined : this.props.interactive.statsData.Stats[selectedOption.value]['Min'],
            //             max: selectedOption.value == 'None' ? undefined : this.props.interactive.statsData.Stats[selectedOption.value]['Max'],
            //             step: selectedOption.value == 'None' ? undefined : this.props.interactive.statsData.Stats[selectedOption.value]['Step']
            //         }
            //     }
            // });
            // // console.log(this.props.interactive.statsData.Stats[selectedOption.value]['Min'],this.props.interactive.statsData.Stats[selectedOption.value]['Max'],this.props.interactive.statsData.Stats[selectedOption.value]['Step']);
            // this.props.interactive.x_axis == selectedOption.value ? this.props.setFeature3('None') : this.props.setFeature3(selectedOption.value);
        }
        else if(selectedOption.id == "4") {
            if(this.props.interactive.x_axis === selectedOption.value || this.props.interactive.z_axis === selectedOption.value) {
                this.setState({
                    defaultDrop: {
                        feat_4: {id: '4', value: 'None', label: 'None'}
                    },
                    feat_4: 'None',
                    sliderRange: {
                        drop4: {
                            min: selectedOption.value == 'None' ? undefined : this.props.interactive.statsData.Stats[selectedOption.value]['Min'],
                            max: selectedOption.value == 'None' ? undefined : this.props.interactive.statsData.Stats[selectedOption.value]['Max'],
                            step: selectedOption.value == 'None' ? undefined : this.props.interactive.statsData.Stats[selectedOption.value]['Step']
                        }
                    }
                });
                this.props.setFeature4('None');
            }
            else {
                this.setState({
                    defaultDrop: {
                        feat_4: selectedOption
                    },
                    feat_4: selectedOption.value,
                    sliderRange: {
                        drop4: {
                            min: selectedOption.value == 'None' ? undefined : this.props.interactive.statsData.Stats[selectedOption.value]['Min'],
                            max: selectedOption.value == 'None' ? undefined : this.props.interactive.statsData.Stats[selectedOption.value]['Max'],
                            step: selectedOption.value == 'None' ? undefined : this.props.interactive.statsData.Stats[selectedOption.value]['Step']
                        }
                    }
                });
                this.props.setFeature4(selectedOption.value);
            }
            // this.setState({
            //     defaultDrop: {
            //         feat_4: this.props.interactive.x_axis == selectedOption.value ? {id: '4', value: 'None', label: 'None'} : selectedOption
            //     },
            //     feat_4: this.props.interactive.x_axis == selectedOption.value ? 'None' : selectedOption.value,
            //     sliderRange: {
            //         drop4: {
            //             min: selectedOption.value == 'None' ? undefined : this.props.interactive.statsData.Stats[selectedOption.value]['Min'],
            //             max: selectedOption.value == 'None' ? undefined : this.props.interactive.statsData.Stats[selectedOption.value]['Max'],
            //             step: selectedOption.value == 'None' ? undefined : this.props.interactive.statsData.Stats[selectedOption.value]['Step']
            //         }
            //     }
            // });
            // // console.log(this.props.interactive.statsData.Stats[selectedOption.value]['Min'],this.props.interactive.statsData.Stats[selectedOption.value]['Max'],this.props.interactive.statsData.Stats[selectedOption.value]['Step']);
            // this.props.interactive.x_axis == selectedOption.value ? this.props.setFeature4('None') : this.props.setFeature4(selectedOption.value);
        }
        else if(selectedOption.id == "5") {
            if(this.props.interactive.x_axis === selectedOption.value || this.props.interactive.z_axis === selectedOption.value) {
                this.setState({
                    defaultDrop: {
                        feat_5: {id: '5', value: 'None', label: 'None'}
                    },
                    feat_5: 'None',
                    sliderRange: {
                        drop5: {
                            min: selectedOption.value == 'None' ? undefined : this.props.interactive.statsData.Stats[selectedOption.value]['Min'],
                            max: selectedOption.value == 'None' ? undefined : this.props.interactive.statsData.Stats[selectedOption.value]['Max'],
                            step: selectedOption.value == 'None' ? undefined : this.props.interactive.statsData.Stats[selectedOption.value]['Step']
                        }
                    }
                });
                this.props.setFeature5('None');
            }
            else {
                this.setState({
                    defaultDrop: {
                        feat_5: selectedOption
                    },
                    feat_5: selectedOption.value,
                    sliderRange: {
                        drop5: {
                            min: selectedOption.value == 'None' ? undefined : this.props.interactive.statsData.Stats[selectedOption.value]['Min'],
                            max: selectedOption.value == 'None' ? undefined : this.props.interactive.statsData.Stats[selectedOption.value]['Max'],
                            step: selectedOption.value == 'None' ? undefined : this.props.interactive.statsData.Stats[selectedOption.value]['Step']
                        }
                    }
                });
                this.props.setFeature5(selectedOption.value);
            }
            // this.setState({
            //     defaultDrop: {
            //         feat_5: this.props.interactive.x_axis == selectedOption.value ? {id: '5', value: 'None', label: 'None'} : selectedOption
            //     },
            //     feat_5: this.props.interactive.x_axis == selectedOption.value ? 'None' : selectedOption.value,
            //     sliderRange: {
            //         drop5: {
            //             min: selectedOption.value == 'None' ? undefined : this.props.interactive.statsData.Stats[selectedOption.value]['Min'],
            //             max: selectedOption.value == 'None' ? undefined : this.props.interactive.statsData.Stats[selectedOption.value]['Max'],
            //             step: selectedOption.value == 'None' ? undefined : this.props.interactive.statsData.Stats[selectedOption.value]['Step']
            //         }
            //     }
            // });
            // // console.log(this.props.interactive.statsData.Stats[selectedOption.value]['Min'],this.props.interactive.statsData.Stats[selectedOption.value]['Max'],this.props.interactive.statsData.Stats[selectedOption.value]['Step']);
            // this.props.interactive.x_axis == selectedOption.value ? this.props.setFeature5('None') : this.props.setFeature5(selectedOption.value);
        }
        else if(selectedOption.id == "6") {
            if(this.props.interactive.x_axis === selectedOption.value || this.props.interactive.z_axis === selectedOption.value) {
                this.setState({
                    defaultDrop: {
                        feat_6: {id: '6', value: 'None', label: 'None'}
                    },
                    feat_6: 'None',
                    sliderRange: {
                        drop6: {
                            min: selectedOption.value == 'None' ? undefined : this.props.interactive.statsData.Stats[selectedOption.value]['Min'],
                            max: selectedOption.value == 'None' ? undefined : this.props.interactive.statsData.Stats[selectedOption.value]['Max'],
                            step: selectedOption.value == 'None' ? undefined : this.props.interactive.statsData.Stats[selectedOption.value]['Step']
                        }
                    }
                });
                this.props.setFeature6('None');
            }
            else {
                this.setState({
                    defaultDrop: {
                        feat_6: selectedOption
                    },
                    feat_6: selectedOption.value,
                    sliderRange: {
                        drop6: {
                            min: selectedOption.value == 'None' ? undefined : this.props.interactive.statsData.Stats[selectedOption.value]['Min'],
                            max: selectedOption.value == 'None' ? undefined : this.props.interactive.statsData.Stats[selectedOption.value]['Max'],
                            step: selectedOption.value == 'None' ? undefined : this.props.interactive.statsData.Stats[selectedOption.value]['Step']
                        }
                    }
                });
                this.props.setFeature6(selectedOption.value);
            }
            // this.setState({
            //     defaultDrop: {
            //         feat_6: this.props.interactive.x_axis == selectedOption.value ? {id: '6', value: 'None', label: 'None'} : selectedOption
            //     },
            //     feat_6: this.props.interactive.x_axis == selectedOption.value ? 'None' : selectedOption.value,
            //     sliderRange: {
            //         drop6: {
            //             min: selectedOption.value == 'None' ? undefined : this.props.interactive.statsData.Stats[selectedOption.value]['Min'],
            //             max: selectedOption.value == 'None' ? undefined : this.props.interactive.statsData.Stats[selectedOption.value]['Max'],
            //             step: selectedOption.value == 'None' ? undefined : this.props.interactive.statsData.Stats[selectedOption.value]['Step']
            //         }
            //     }
            // });
            // // console.log(this.props.interactive.statsData.Stats[selectedOption.value]['Min'],this.props.interactive.statsData.Stats[selectedOption.value]['Max'],this.props.interactive.statsData.Stats[selectedOption.value]['Step']);
            // this.props.interactive.x_axis == selectedOption.value ? this.props.setFeature6('None') : this.props.setFeature6(selectedOption.value);
        }
        else if(selectedOption.id == "wind") {
            this.setState({
                defaultDrop: {
                    wind: selectedOption
                },
                wind: selectedOption.value
            });
            this.props.setWindDirection(selectedOption.value);
        }
        else if(selectedOption.id == "swell") {
            this.setState({
                defaultDrop: {
                    swell: selectedOption
                },
                swell: selectedOption.value
            });
            this.props.setSwellDirection(selectedOption.value);
        }
        else if(selectedOption.id == "load") {
            this.setState({
                defaultDrop: {
                    load: selectedOption
                },
                load: selectedOption.value
            });
            this.props.setBallastOrLoaded(selectedOption.value);
        }
    }

    onParamValueChange = (value) => {
        this.setState({
            paramValue: parseInt(value),
            paramInputValue: parseInt(value)
        });
        this.props.setFeatureInput1(parseInt(value));
    }

    onRpmChange = (value) => {
        this.setState({
            rpm: parseInt(value),
            rpmInput: parseInt(value)
        });
        this.props.setFeatureInput2(parseInt(value));
    }

    onBeaufortChange = (value) => {
        this.setState({
            beaufort: parseFloat(value),
            beaufortInput: parseFloat(value)
        });
        this.props.setFeatureInput3(parseFloat(value));
    }

    onSeaStateChange = (value) => {
        this.setState({
            sea_state: parseInt(value),
            sea_stateInput: parseInt(value)
        });
        this.props.setFeatureInput4(parseInt(value));
    }

    onDraftChange = (value) => {
        this.setState({
            draft: parseInt(value),
            draftInput: parseInt(value)
        });
        this.props.setFeatureInput5(parseInt(value));
    }

    onTrimChange = (value) => {
        this.setState({
            trim: parseInt(value),
            trimInput: parseInt(value)
        });
        this.props.setFeatureInput6(parseInt(value));
    }

    onParamInputValueChange = (event) => {
        this.setState({
            paramInputValue: parseInt(event.target.value),
            paramInputValue: parseInt(event.target.value)
        });
        this.props.setFeatureInput1(parseInt(event.target.value));
    }

    onRpmInputChange = (event) => {
        this.setState({
            rpm: parseInt(event.target.value),
            rpmInput: parseInt(event.target.value)
        });
        this.props.setFeatureInput2(parseInt(event.target.value));
    }

    onBeaufortInputChange = (event) => {
        this.setState({
            beaufort: parseFloat(event.target.value),
            beaufortInput: parseFloat(event.target.value)
        });
        this.props.setFeatureInput3(parseFloat(event.target.value));
    }

    onSeaStateInputChange = (event) => {
        this.setState({
            sea_state: parseInt(event.target.value),
            sea_stateInput: parseInt(event.target.value)
        });
        this.props.setFeatureInput4(parseInt(event.target.value));
    }

    onDraftInputChange = (event) => {
        this.setState({
            draft: parseInt(event.target.value),
            draftInput: parseInt(event.target.value)
        });
        this.props.setFeatureInput5(parseInt(event.target.value));
    }

    onTrimInputChange = (event) => {
        this.setState({
            trim: parseInt(event.target.value),
            trimInput: parseInt(event.target.value)
        });
        this.props.setFeatureInput6(parseInt(event.target.value));
    }

    checkIfDisabled(selectedOption) {
        if(this.props.interactive.x_axis === selectedOption.label) {
            let keyName = "Feature"+selectedOption.id+"Options";
            this.setState({
                [keyName]: {
                    isDisabled: true
                }
            });
            console.log(this.state.Feature2Options.isDisabled);
        }
    }

    render() {
        return(
            <React.Fragment>
                <form>
                    {/* <div> */}
                    <Row style={{marginLeft: "0"}}>
                        <Col style={{marginLeft: "0"}} className="col-5">
                            {/* <DropdownButton id="param" title="Param" size="sm">
                                <Dropdown.Item href="#"></Dropdown.Item>
                            </DropdownButton> */}
                            {/* <select name="param" onChange={this.onDropChange}>
                                <option selected disabled>Param</option>
                                <option>Param</option>
                                <option>Param</option>
                                <option>Param</option>
                            </select> */}
                            { this.props.options.independentParameters && <Select options={this.props.options.slider1['Result']} name="param" placeholder="Parameters" value={this.state.defaultDrop.param&&this.state.defaultDrop.param} onChange={this.onDropChange} isOptionDisabled={(option) => option.disabled !== false} />}
                        </Col>
                        <Col className="col-4">
                            {this.props.interactive.statsData && <Slider
                                id="slider"
                                step={this.props.interactive.feature_1 !== 'None' && this.props.interactive.feature_1 in this.props.interactive.statsData.Stats ? this.props.interactive.statsData.Stats[this.props.interactive.feature_1]['Step'] : undefined}
                                min={this.props.interactive.feature_1 !== 'None' && this.props.interactive.feature_1 in this.props.interactive.statsData.Stats ? this.props.interactive.statsData.Stats[this.props.interactive.feature_1]['Min'] : undefined}
                                max={this.props.interactive.feature_1 !== 'None' && this.props.interactive.feature_1 in this.props.interactive.statsData.Stats ? this.props.interactive.statsData.Stats[this.props.interactive.feature_1]['Max'] : undefined}
                                // step={this.state.sliderRange.drop1['step']}
                                // min={this.state.sliderRange.drop1['min']}
                                // max={this.state.sliderRange.drop1['max']}
                                // defaultValue={5}
                                // style={{fontSize: "10px"}}
                                dotStyle={{borderColor: 'aquamarine'}}
                                activeDotStyle={{borderColor: 'aqua'}}
                                className="rc-slider-mark"
                                disabled={this.props.interactive.feature_1 === 'None' ? true : false}
                                value={this.state.paramValue && this.state.paramValue}
                                onChange={this.onParamValueChange}
                                marks={this.props.interactive.feature_1 !== 'None' && this.props.interactive.feature_1 in this.props.interactive.statsData.Stats ? this.props.interactive.statsData.Stats[this.props.interactive.feature_1]['Marks'] : undefined}
                            />}
                        </Col>
                        <Col className="col-3">
                            {this.props.interactive.statsData && <input
                                type="number"
                                style={{
                                    width: "50px",
                                    // height: "20px",
                                    // textAlign: "left",
                                    // border: "1px solid black",
                                    // marginRight:"5px"
                                }}
                                step={this.props.interactive.feature_1 !== 'None' && this.props.interactive.feature_1 in this.props.interactive.statsData.Stats ? this.props.interactive.statsData.Stats[this.props.interactive.feature_1]['Step'] : undefined}
                                min={this.props.interactive.feature_1 !== 'None' && this.props.interactive.feature_1 in this.props.interactive.statsData.Stats ? this.props.interactive.statsData.Stats[this.props.interactive.feature_1]['Min'] : undefined}
                                max={this.props.interactive.feature_1 !== 'None' && this.props.interactive.feature_1 in this.props.interactive.statsData.Stats ? this.props.interactive.statsData.Stats[this.props.interactive.feature_1]['Max'] : undefined}
                                // step={this.state.sliderRange.drop1['step']}
                                // min={this.state.sliderRange.drop1['min']}
                                // max={this.state.sliderRange.drop1['max']}
                                // defaultValue={5}
                                value={this.state.paramInputValue && this.state.paramInputValue}
                                onChange={this.onParamInputValueChange}
                                className="interactiveinput"
                            />}
                        </Col>
                    </Row><br />
                    
                    {/* </div> */}
                    {/* <hr /> */}
                    {/* <div> */}
                    <Row style={{marginLeft: "0"}}>
                        <Col style={{marginLeft: "0"}} className="col-5">
                            {/* <label>RPM</label> */}
                            { this.props.options.independentParameters && <Select options={this.props.options.slider2['Result']} name="2" placeholder="Feature 2" value={this.state.defaultDrop.feat_2&&this.state.defaultDrop.feat_2} onChange={this.onDropChange} isOptionDisabled={(option) => option.disabled !== false} />}
                        </Col>
                        <Col className="col-4">
                            {this.props.interactive.statsData && <Slider
                                id="slider1"
                                step={this.props.interactive.feature_2 !== 'None' && this.props.interactive.feature_2 in this.props.interactive.statsData.Stats ? this.props.interactive.statsData.Stats[this.props.interactive.feature_2]['Step'] : undefined}
                                min={this.props.interactive.feature_2 !== 'None' && this.props.interactive.feature_2 in this.props.interactive.statsData.Stats ? this.props.interactive.statsData.Stats[this.props.interactive.feature_2]['Min'] : undefined}
                                max={this.props.interactive.feature_2 !== 'None' && this.props.interactive.feature_2 in this.props.interactive.statsData.Stats ? this.props.interactive.statsData.Stats[this.props.interactive.feature_2]['Max'] : undefined}
                                // step={this.state.sliderRange.drop2['step'] && this.state.sliderRange.drop2['step']}
                                // min={this.state.sliderRange.drop2['min'] && this.state.sliderRange.drop2['min']}
                                // max={this.state.sliderRange.drop2['max'] && this.state.sliderRange.drop2['max']}
                                // defaultValue={this.state.defaultValue.rpm && this.state.defaultValue.rpm}
                                // style={{fontSize: "10px"}}
                                dotStyle={{borderColor: 'aquamarine'}}
                                activeDotStyle={{borderColor: 'aqua'}}
                                className="rc-slider-mark"
                                disabled={this.props.interactive.feature_2 === 'None' ? true : false}
                                value={this.state.rpm && this.state.rpm}
                                marks={this.props.interactive.feature_2 !== 'None' && this.props.interactive.feature_2 in this.props.interactive.statsData.Stats ? this.props.interactive.statsData.Stats[this.props.interactive.feature_2]['Marks'] : undefined}
                                onChange={this.onRpmChange}
                            />}
                        </Col>
                        <Col className="col-3">
                            {this.props.interactive.statsData && <input
                                type="number"
                                style={{
                                    width: "50px",
                                    // height: "20px",
                                    // textAlign: "left",
                                    // border: "1px solid black",
                                    // marginRight:"5px"
                                }}
                                step={this.props.interactive.feature_2 !== 'None' && this.props.interactive.feature_2 in this.props.interactive.statsData.Stats ? this.props.interactive.statsData.Stats[this.props.interactive.feature_2]['Step'] : undefined}
                                min={this.props.interactive.feature_2 !== 'None' && this.props.interactive.feature_2 in this.props.interactive.statsData.Stats ? this.props.interactive.statsData.Stats[this.props.interactive.feature_2]['Min'] : undefined}
                                max={this.props.interactive.feature_2 !== 'None' && this.props.interactive.feature_2 in this.props.interactive.statsData.Stats ? this.props.interactive.statsData.Stats[this.props.interactive.feature_2]['Max'] : undefined}
                                // step={this.state.sliderRange.drop2['step']}
                                // min={this.state.sliderRange.drop2['min']}
                                // max={this.state.sliderRange.drop2['max']}
                                onChange={this.onRpmInputChange}
                                className="interactiveinput"
                                // defaultValue={this.state.defaultValue.rpm && this.state.defaultValue.rpm}
                                value={this.state.rpm && this.state.rpm}
                            />}
                        </Col>
                    </Row><br />

                    {/* </div> */}
                    {/* <hr /> */}
                    {/* <div> */}
                    <Row style={{marginLeft: "0"}}>
                        <Col style={{marginLeft: "0"}} className="col-5">
                            {/* <label>Beaufort</label> */}
                            { this.props.options.independentParameters && <Select options={this.props.options.slider3['Result']} name="3" placeholder="Feature 3" value={this.state.defaultDrop.feat_3&&this.state.defaultDrop.feat_3} onChange={this.onDropChange} isOptionDisabled={(option) => option.disabled !== false} />}
                        </Col>
                        <Col className="col-4">
                            {this.props.interactive.statsData && <Slider
                                id="slider2"
                                step={this.props.interactive.feature_3 !== 'None' && this.props.interactive.feature_3 in this.props.interactive.statsData.Stats ? this.props.interactive.statsData.Stats[this.props.interactive.feature_3]['Step'] : undefined}
                                min={this.props.interactive.feature_3 !== 'None' && this.props.interactive.feature_3 in this.props.interactive.statsData.Stats ? this.props.interactive.statsData.Stats[this.props.interactive.feature_3]['Min'] : undefined}
                                max={this.props.interactive.feature_3 !== 'None' && this.props.interactive.feature_3 in this.props.interactive.statsData.Stats ? this.props.interactive.statsData.Stats[this.props.interactive.feature_3]['Max'] : undefined}
                                // step={this.state.sliderRange.drop3['step']}
                                // min={this.state.sliderRange.drop3['min']}
                                // max={this.state.sliderRange.drop3['max']}
                                // defaultValue={this.state.defaultValue.beaufort && this.state.defaultValue.beaufort}
                                // style={{fontSize: "10px"}}
                                dotStyle={{borderColor: 'aquamarine'}}
                                activeDotStyle={{borderColor: 'aqua'}}
                                className="rc-slider-mark"
                                disabled={this.props.interactive.feature_3 === 'None' ? true : false}
                                value={this.state.beaufort && this.state.beaufort}
                                marks={this.props.interactive.feature_3 !== 'None' && this.props.interactive.feature_3 in this.props.interactive.statsData.Stats ? this.props.interactive.statsData.Stats[this.props.interactive.feature_3]['Marks'] : undefined}
                                onChange={this.onBeaufortChange}
                            />}
                        </Col>
                        <Col className="col-3">
                            {this.props.interactive.statsData && <input
                                type="number"
                                style={{
                                    width: "50px",
                                    // height: "20px",
                                    // textAlign: "left",
                                    // border: "1px solid black",
                                    // marginRight:"5px"
                                }}
                                step={this.props.interactive.feature_3 !== 'None' && this.props.interactive.feature_3 in this.props.interactive.statsData.Stats ? this.props.interactive.statsData.Stats[this.props.interactive.feature_3]['Step'] : undefined}
                                min={this.props.interactive.feature_3 !== 'None' && this.props.interactive.feature_3 in this.props.interactive.statsData.Stats ? this.props.interactive.statsData.Stats[this.props.interactive.feature_3]['Min'] : undefined}
                                max={this.props.interactive.feature_3 !== 'None' && this.props.interactive.feature_3 in this.props.interactive.statsData.Stats ? this.props.interactive.statsData.Stats[this.props.interactive.feature_3]['Max'] : undefined}
                                // step={this.state.sliderRange.drop3['step']}
                                // min={this.state.sliderRange.drop3['min']}
                                // max={this.state.sliderRange.drop3['max']}
                                onChange={this.onBeaufortInputChange}
                                className="interactiveinput"
                                // defaultValue={this.state.defaultValue.beaufort && this.state.defaultValue.beaufort}
                                value={this.state.beaufort && this.state.beaufort}
                            />}
                        </Col>
                    </Row><br />
                    
                    {/* </div> */}
                    {/* <hr /> */}
                    {/* <div> */}
                    <Row style={{marginLeft: "0"}}>
                        <Col style={{marginLeft: "0"}} className="col-5">
                            {/* <label>Sea State</label> */}
                            { this.props.options.independentParameters && <Select options={this.props.options.slider4['Result']} name="4" placeholder="Feature 4" value={this.state.defaultDrop.feat_4&&this.state.defaultDrop.feat_4} onChange={this.onDropChange} isOptionDisabled={(option) => option.disabled !== false} />}
                        </Col>
                        <Col className="col-4">
                            {this.props.interactive.statsData && <Slider
                                id="slider3"
                                step={this.props.interactive.feature_4 !== 'None' && this.props.interactive.feature_4 in this.props.interactive.statsData.Stats ? this.props.interactive.statsData.Stats[this.props.interactive.feature_4]['Step'] : undefined}
                                min={this.props.interactive.feature_4 !== 'None' && this.props.interactive.feature_4 in this.props.interactive.statsData.Stats ? this.props.interactive.statsData.Stats[this.props.interactive.feature_4]['Min'] : undefined}
                                max={this.props.interactive.feature_4 !== 'None' && this.props.interactive.feature_4 in this.props.interactive.statsData.Stats ? this.props.interactive.statsData.Stats[this.props.interactive.feature_4]['Max'] : undefined}
                                // step={this.state.sliderRange.drop4['step']}
                                // min={this.state.sliderRange.drop4['min']}
                                // max={this.state.sliderRange.drop4['max']}
                                // defaultValue={this.state.defaultValue.sea_state && this.state.defaultValue.sea_state}
                                // style={{fontSize: "10px"}}
                                dotStyle={{borderColor: 'aquamarine'}}
                                activeDotStyle={{borderColor: 'aqua'}}
                                className="rc-slider-mark"
                                disabled={this.props.interactive.feature_4 === 'None' ? true : false}
                                value={this.state.sea_state && this.state.sea_state}
                                marks={this.props.interactive.feature_4 !== 'None' && this.props.interactive.feature_4 in this.props.interactive.statsData.Stats ? this.props.interactive.statsData.Stats[this.props.interactive.feature_4]['Marks'] : undefined}
                                onChange={this.onSeaStateChange}
                            />}
                        </Col>
                        <Col className="col-3">
                            {this.props.interactive.statsData && <input
                                type="number"
                                style={{
                                    width: "50px",
                                    // height: "20px",
                                    // textAlign: "left",
                                    // border: "1px solid black",
                                    // marginRight:"5px"
                                }}
                                step={this.props.interactive.feature_4 !== 'None' && this.props.interactive.feature_4 in this.props.interactive.statsData.Stats ? this.props.interactive.statsData.Stats[this.props.interactive.feature_4]['Step'] : undefined}
                                min={this.props.interactive.feature_4 !== 'None' && this.props.interactive.feature_4 in this.props.interactive.statsData.Stats ? this.props.interactive.statsData.Stats[this.props.interactive.feature_4]['Min'] : undefined}
                                max={this.props.interactive.feature_4 !== 'None' && this.props.interactive.feature_4 in this.props.interactive.statsData.Stats ? this.props.interactive.statsData.Stats[this.props.interactive.feature_4]['Max'] : undefined}
                                // step={this.state.sliderRange.drop4['step']}
                                // min={this.state.sliderRange.drop4['min']}
                                // max={this.state.sliderRange.drop4['max']}
                                onChange={this.onSeaStateInputChange}
                                className="interactiveinput"
                                // defaultValue={this.state.defaultValue.sea_state && this.state.defaultValue.sea_state}
                                value={this.state.sea_state && this.state.sea_state}
                            />}
                        </Col>
                    </Row><br />
                    
                    {/* </div> */}
                    {/* <hr /> */}
                    {/* <div> */}
                    <Row style={{marginLeft: "0"}}>
                        <Col style={{marginLeft: "0"}} className="col-5">
                            {/* <label>Draft</label> */}
                            { this.props.options.independentParameters && <Select options={this.props.options.slider5['Result']} name="5" placeholder="Feature 5" value={this.state.defaultDrop.feat_5&&this.state.defaultDrop.feat_5} onChange={this.onDropChange} isOptionDisabled={(option) => option.disabled !== false} />}
                        </Col>
                        <Col className="col-4">
                            {this.props.interactive.statsData && <Slider
                                id="slider4"
                                step={this.props.interactive.feature_5 !== 'None' && this.props.interactive.feature_5 in this.props.interactive.statsData.Stats ? this.props.interactive.statsData.Stats[this.props.interactive.feature_5]['Step'] : undefined}
                                min={this.props.interactive.feature_5 !== 'None' && this.props.interactive.feature_5 in this.props.interactive.statsData.Stats ? this.props.interactive.statsData.Stats[this.props.interactive.feature_5]['Min'] : undefined}
                                max={this.props.interactive.feature_5 !== 'None' && this.props.interactive.feature_5 in this.props.interactive.statsData.Stats ? this.props.interactive.statsData.Stats[this.props.interactive.feature_5]['Max'] : undefined}
                                // step={this.state.sliderRange.drop5['step']}
                                // min={this.state.sliderRange.drop5['min']}
                                // max={this.state.sliderRange.drop5['max']}
                                // defaultValue={this.state.defaultValue.draft && this.state.defaultValue.draft}
                                // style={{fontSize: "10px"}}
                                dotStyle={{borderColor: 'aquamarine'}}
                                activeDotStyle={{borderColor: 'aqua'}}
                                className="rc-slider-mark"
                                disabled={this.props.interactive.feature_5 === 'None' ? true : false}
                                value={this.state.draft && this.state.draft}
                                marks={this.props.interactive.feature_5 !== 'None' && this.props.interactive.feature_5 in this.props.interactive.statsData.Stats ? this.props.interactive.statsData.Stats[this.props.interactive.feature_5]['Marks'] : undefined}
                                onChange={this.onDraftChange}
                            />}
                        </Col>
                        <Col className="col-3">
                            {this.props.interactive.statsData && <input
                                type="number"
                                style={{
                                    width: "50px",
                                    // height: "20px",
                                    // textAlign: "left",
                                    // border: "1px solid black",
                                    // marginRight:"5px"
                                }}
                                step={this.props.interactive.feature_5 !== 'None' && this.props.interactive.feature_5 in this.props.interactive.statsData.Stats ? this.props.interactive.statsData.Stats[this.props.interactive.feature_5]['Step'] : undefined}
                                min={this.props.interactive.feature_5 !== 'None' && this.props.interactive.feature_5 in this.props.interactive.statsData.Stats ? this.props.interactive.statsData.Stats[this.props.interactive.feature_5]['Min'] : undefined}
                                max={this.props.interactive.feature_5 !== 'None' && this.props.interactive.feature_5 in this.props.interactive.statsData.Stats ? this.props.interactive.statsData.Stats[this.props.interactive.feature_5]['Max'] : undefined}
                                // step={this.state.sliderRange.drop5['step']}
                                // min={this.state.sliderRange.drop5['min']}
                                // max={this.state.sliderRange.drop5['max']}
                                onChange={this.onDraftInputChange}
                                className="interactiveinput"
                                // defaultValue={this.state.defaultValue.draft && this.state.defaultValue.draft}
                                value={this.state.draft && this.state.draft}
                            />}
                        </Col>
                    </Row><br />
                    
                    {/* </div> */}
                    {/* <hr /> */}
                    {/* <div> */}
                    <Row style={{marginLeft: "0"}}>
                        <Col style={{marginLeft: "0"}} className="col-5">
                            {/* <label>Trim</label> */}
                            { this.props.options.independentParameters && <Select options={this.props.options.slider6['Result']} name="6" placeholder="Feature 6" value={this.state.defaultDrop.feat_6&&this.state.defaultDrop.feat_6} onChange={this.onDropChange} isOptionDisabled={(option) => option.disabled !== false} />}
                        </Col>
                        <Col className="col-4">
                            {this.props.interactive.statsData && <Slider
                                id="slider5"
                                step={this.props.interactive.feature_6 !== 'None' && this.props.interactive.feature_6 in this.props.interactive.statsData.Stats ? this.props.interactive.statsData.Stats[this.props.interactive.feature_6]['Step'] : undefined}
                                min={this.props.interactive.feature_6 !== 'None' && this.props.interactive.feature_6 in this.props.interactive.statsData.Stats ? this.props.interactive.statsData.Stats[this.props.interactive.feature_6]['Min'] : undefined}
                                max={this.props.interactive.feature_6 !== 'None' && this.props.interactive.feature_6 in this.props.interactive.statsData.Stats ? this.props.interactive.statsData.Stats[this.props.interactive.feature_6]['Max'] : undefined}
                                // step={this.state.sliderRange.drop6['step']}
                                // min={this.state.sliderRange.drop6['min']}
                                // max={this.state.sliderRange.drop6['max']}
                                // defaultValue={this.state.defaultValue.trim && this.state.defaultValue.trim}
                                // style={{fontSize: "10px"}}
                                dotStyle={{borderColor: 'aquamarine'}}
                                activeDotStyle={{borderColor: 'aqua'}}
                                className="rc-slider-mark"
                                disabled={this.props.interactive.feature_6 === 'None' ? true : false}
                                value={this.state.trim && this.state.trim}
                                marks={this.props.interactive.feature_6 !== 'None' && this.props.interactive.feature_6 in this.props.interactive.statsData.Stats ? this.props.interactive.statsData.Stats[this.props.interactive.feature_6]['Marks'] : undefined}
                                onChange={this.onTrimChange}
                            />}
                        </Col>
                        <Col className="col-3">
                            {this.props.interactive.statsData && <input
                                type="number"
                                style={{
                                    width: "50px",
                                    // height: "20px",
                                    // textAlign: "left",
                                    // border: "1px solid black",
                                    // marginRight:"5px"
                                }}
                                step={this.props.interactive.feature_6 !== 'None' && this.props.interactive.feature_6 in this.props.interactive.statsData.Stats ? this.props.interactive.statsData.Stats[this.props.interactive.feature_6]['Step'] : undefined}
                                min={this.props.interactive.feature_6 !== 'None' && this.props.interactive.feature_6 in this.props.interactive.statsData.Stats ? this.props.interactive.statsData.Stats[this.props.interactive.feature_6]['Min'] : undefined}
                                max={this.props.interactive.feature_6 !== 'None' && this.props.interactive.feature_6 in this.props.interactive.statsData.Stats ? this.props.interactive.statsData.Stats[this.props.interactive.feature_6]['Max'] : undefined}
                                // step={this.state.sliderRange.drop6['step']}
                                // min={this.state.sliderRange.drop6['min']}
                                // max={this.state.sliderRange.drop6['max']}
                                onChange={this.onTrimInputChange}
                                className="interactiveinput"
                                // defaultValue={this.state.defaultValue.trim && this.state.defaultValue.trim}
                                value={this.state.trim && this.state.trim}
                            />}
                        </Col>
                    </Row><br />
                    {/* <hr /> */}
                    {/* </div> */}
                    <Row style={{marginLeft: "0"}}>
                        <Col style={{marginLeft: "0", fontSize: "14px"}} className="col-6">
                            <label>Wind Direction</label>
                        </Col>
                        <Col className="col-6">
                            {/* <DropdownButton id="param" title="" size="sm">
                                <Dropdown.Item href="#">0 <span>&#176;</span></Dropdown.Item>
                                <Dropdown.Item href="#">90 <span>&#176;</span></Dropdown.Item>
                                <Dropdown.Item href="#">180 <span>&#176;</span></Dropdown.Item>
                            </DropdownButton> */}
                            {/* <select name="wind" onChange={this.onDropChange}>
                                <option>0 &#176;</option>
                                <option>90 &#176;</option>
                                <option>180 &#176;</option>
                            </select> */}
                            <Select options={this.state.windOptions} name="wind" placeholder="Wind Direction" value={this.state.defaultDrop.wind} onChange={this.onDropChange} />
                        </Col>
                    </Row>
                    <Row style={{marginLeft: "0"}}>
                        <Col style={{marginLeft: "0", fontSize: "14px"}} className="col-6">
                            <label>Swell Direction</label>
                        </Col>
                        <Col className="col-6">
                            {/* <DropdownButton id="param" title="" size="sm">
                                <Dropdown.Item href="#">0 <span>&#176;</span></Dropdown.Item>
                                <Dropdown.Item href="#">90 <span>&#176;</span></Dropdown.Item>
                                <Dropdown.Item href="#">180 <span>&#176;</span></Dropdown.Item>
                            </DropdownButton> */}
                            {/* <select name="swell" onChange={this.onDropChange}>
                                <option>0 &#176;</option>
                                <option>90 &#176;</option>
                                <option>180 &#176;</option>
                            </select> */}
                            <Select options={this.state.swellOptions} name="swell" placeholder="Swell Direction" value={this.state.defaultDrop.swell} onChange={this.onDropChange} />
                        </Col>
                    </Row>
                    <Row style={{marginLeft: "0"}}>
                        <Col style={{marginLeft: "0", fontSize: "14px"}} className="col-6">
                            <label>Ballast/Loaded</label>
                        </Col>
                        <Col className="col-6">
                            {/* <DropdownButton id="param" title="Ballast" size="sm">
                                <Dropdown.Item href="#">Loaded</Dropdown.Item>
                                <Dropdown.Item href="#">Ballast</Dropdown.Item>
                            </DropdownButton> */}
                            {/* <select name="load" onChange={this.onDropChange}>
                                <option>Loaded</option>
                                <option>Ballast</option>
                            </select> */}
                            <Select options={this.state.loadOptions} name="load" placeholder="Vessel Load" value={this.state.defaultDrop.load} onChange={this.onDropChange} />
                        </Col>
                    </Row>
                </form>
            </React.Fragment>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(InteractiveSlider);