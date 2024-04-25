import React from 'react';
import Plotly from 'plotly.js/dist/plotly';
// import Plot from 'react-plotly.js';
import axios from 'axios';
import { baseUrl } from '../../shared/baseUrl';
import moment from 'moment';
import { connect } from 'react-redux';
import { Loading } from '../LoadingComponent';
import { setHover, setHoverForFuelCons, setOutlierHover, setTrends,
    setMLHover, getNamesOfOutlierHover, trendsFailed, trendsLoading,
    setMessagesHover, setOutlierMessagesHover, setWeatherHover,
    setDryDockHover } from '../../redux/ActionCreators';

const urls = baseUrl + process.env.REACT_APP_TRENDS
const dry_dock_url = baseUrl + process.env.REACT_APP_INTERVENTION_ANALYSIS

let cancelToken;

// This is the Component that renders the charts in the Trends page.

const mapStateToProps = state => {
    return {
        trends: state.trends,
        hover: state.hover,
        fuelConsHover: state.fuelConsHover,
        options: state.options
    }
}

const mapDispatchToProps = (dispatch) => ({
    setHover: (input) => { dispatch(setHover(input)) },
    trendsLoading: (input) => { dispatch(trendsLoading(input)) },
    trendsFailed: (input) => { dispatch(trendsFailed(input)) },
    setOutlierHover: (input) => { dispatch(setOutlierHover(input)) },
    setMLHover: (input) => { dispatch(setMLHover(input)) },
    setMessagesHover: (input) => { dispatch(setMessagesHover(input)) },
    setOutlierMessagesHover: (input) => { dispatch(setOutlierMessagesHover(input)) },
    setHoverForFuelCons: (input) => { dispatch(setHoverForFuelCons(input)) },
    getNamesOfOutlierHover: (input) => { dispatch(getNamesOfOutlierHover(input)) },
    setTrends: (input) => { dispatch(setTrends(input)) },
    setWeatherHover: (input) => { dispatch(setWeatherHover(input)) },
    setDryDockHover: (input) => { dispatch(setDryDockHover(input)) },
});

// let cancelToken = axios.CancelToken.source();

// Options for the Range Selector in Logs part of the Trends page.
var selectorOptions = {
    buttons: [
        {
            step: 'day',
            stepmode: 'backward',
            count: 1,
            label: '1 day'
        },
        {
            step: 'day',
            stepmode: 'backward',
            count: 7,
            label: '1 week'
        },
        {
            step: 'month',
            stepmode: 'backward',
            count: 1,
            label: '1 month'
        },
        {
            step: 'month',
            stepmode: 'backward',
            count: 3,
            label: '3 months'
        },
        {
            step: 'month',
            stepmode: 'backward',
            count: 6,
            label: '6 months'
        },
        {
            step: 'year',
            stepmode: 'backward',
            count: 1,
            label: '1 year'
        },
        {
            step: 'all',
            // stepmode: 'backward',
            // count: 1,
            // label: '1 day'
        }
    ]
}

// The arrangement and format of ticks on the charts in Logs
var tickFormatStops = [
    // {
    //   "dtickrange": [null, 1000],
    //   "value": "%H:%M:%S.%L ms"
    // },
    // {
    //   "dtickrange": [1000, 60000],
    //   "value": "%H:%M:%S s"
    // },
    // {
    //   // "dtickrange": [60000, 3600000],
    //   "dtickrange": [null, 86400000],
    //   // "value": "%H:%M m"
    //   "value": "%e %b%H:%M"
    // },
    {
        "dtickrange": [null, 86400000],
        // "value": "%H:%M"
        "value": "%e %b \n%H:%M:%S"
    },
    {
        "dtickrange": [86400000, 604800000],
        "value": "%e %b \n%Y"
    },
    {
        "dtickrange": [604800000, "M1"],
        "value": "%e %b \n%Y"
    },
    {
        "dtickrange": ["M1", "M12"],
        "value": "%b '%y"
    },
    {
        "dtickrange": ["M12", null],
        "value": "%Y"
    }
]

class Chart extends React.Component {
    constructor(props) {
        super(props);

        // this.cancelToken;

        this.state ={
            data: null,
            dataList: null,
            layout: null,
            config: null,
            hover: {},
            curveList: []
        }

        this.getChartData = this.getChartData.bind(this);
        this.initChart = this.initChart.bind(this);
        this.makeTrace = this.makeTrace.bind(this);
        this.makeTraceForConfidenceInterval = this.makeTraceForConfidenceInterval.bind(this);
        this.makeDomain = this.makeDomain.bind(this);
        this.makeLayout = this.makeLayout.bind(this);
        this.handleHover = this.handleHover.bind(this);
        this.handleMessagesHover = this.handleMessagesHover.bind(this);
        this.handleOutlierMessagesHover = this.handleOutlierMessagesHover.bind(this);
        this.handleOutlierHover = this.handleOutlierHover.bind(this);
        this.handleMLHover = this.handleMLHover.bind(this);
        this.handleNamesOfOutlierHover = this.handleNamesOfOutlierHover.bind(this);
        this.handleHoverForFuelCons = this.handleHoverForFuelCons.bind(this);
        this.makeDataList = this.makeDataList.bind(this);
        this.makeHoverAxesList = this.makeHoverAxesList.bind(this);
        this.makeDomainForMultiAxis = this.makeDomainForMultiAxis.bind(this);
        this.makeLayoutForMultiAxis = this.makeLayoutForMultiAxis.bind(this);
        this.makeDataListForMultiAxis = this.makeDataListForMultiAxis.bind(this);
        this.makeDataForYAxisScaling = this.makeDataForYAxisScaling.bind(this);
        this.makeDictForScaling = this.makeDictForScaling.bind(this);
        this.makeTraceForBallastAndLoaded = this.makeTraceForBallastAndLoaded.bind(this);
        this.makeTraceForOutliers = this.makeTraceForOutliers.bind(this);
        this.makeTraceForSubplotColor = this.makeTraceForSubplotColor.bind(this);
        this.createPositionForMultiAxis = this.createPositionForMultiAxis.bind(this);
        this.makeDummyTraceForSubplotLegends = this.makeDummyTraceForSubplotLegends.bind(this);
        this.handleHoverForWeather = this.handleHoverForWeather.bind(this);
        this.getDryDockData = this.getDryDockData.bind(this);
        this.handleHoverForDryDock = this.handleHoverForDryDock.bind(this);
        // this.findClosestFutureDate = this.findClosestFutureDate.bind(this);
        // this.filterDuplicateValues = this.filterDuplicateValues.bind(this);
    }

    componentDidMount() {
        cancelToken = axios.CancelToken.source();
        // if(this.props.trends.group !== "") {
        //     this.getChartData();
        // }
        // this.handleHover(this.state.hover);
    }

    componentWillUnmount() {
        // if(cancelToken) {
            cancelToken.cancel("");
        // }
    }

    async componentDidUpdate(prevProps, prevState) {
        if(prevProps.trends.ship_imo !== this.props.trends.ship_imo && this.props.trends.group !== "") {
            Plotly.purge('chartdiv');
            this.props.trendsLoading(true);
            this.getChartData();
            // this.handleHover(this.state.hover);
        }
        // if(this.props.trends.group !== "") {
        //     Plotly.purge('chartdiv');
        //     this.getChartData();
        // }
        if(prevProps.trends.group !== this.props.trends.group) {
            Plotly.purge('chartdiv');
            this.props.trendsLoading(true);
            this.getChartData();
            // this.handleHover(this.state.hover);
        }
        if(prevProps.trends.duration !== this.props.trends.duration && this.props.trends.group !== "") {
            Plotly.purge('chartdiv');
            this.props.trendsLoading(true);
            this.getChartData();
            // this.handleHover(this.state.hover);
        }
        if(prevProps.trends.outliers !== this.props.trends.outliers && this.props.trends.group !== "") {
            Plotly.purge('chartdiv');
            this.props.trendsLoading(true);
            this.getChartData();
            // this.handleHover(this.state.hover);
        }
        if(prevProps.trends.compare !== this.props.trends.compare) {
            if(typeof this.props.trends.compare !== typeof {} && this.props.trends.group !== "") {
                console.log("INTERVENTION")
                Plotly.purge('chartdiv');
                this.props.trendsLoading(true);
                this.getChartData();
            }
            else {
                if(this.props.trends.dry_dock_period !== null && this.props.trends.evaluation_period !== null){
                    console.log("DID UPDATE")
                    Plotly.purge('chartdiv');
                    this.props.trendsLoading(true);
                    this.getDryDockData();
                }
            }
            // this.handleHover(this.state.hover);
        }
        if(prevProps.trends.anomalies !== this.props.trends.anomalies && this.props.trends.group !== "") {
            Plotly.purge('chartdiv');
            this.props.trendsLoading(true);
            this.getChartData();
            // this.handleHover(this.state.hover);
        }
        if(prevProps.trends.selectedOptions !== this.props.trends.selectedOptions && this.props.trends.group !== "") {
            Plotly.purge('chartdiv');
            this.props.trendsLoading(true);
            this.getChartData();
        }

        // ak code here
        if(prevProps.trends.indexOptions !== this.props.trends.indexOptions && this.props.trends.group !== "") {
            Plotly.purge('chartdiv');
            this.props.trendsLoading(true);
            this.getChartData();
        }
        // ak code end 

        if(prevProps.trends.noonorlogs !== this.props.trends.noonorlogs && this.props.trends.group !== "") {
            Plotly.purge('chartdiv');
            this.props.trendsLoading(true);
            this.getChartData();
        }
        // if(prevProps.trends.dry_dock_period !== this.props.trends.dry_dock_period && prevProps.trends.evaluation_period !== this.props.trends.evaluation_period){
        //     console.log("DID UPDATE")
        //     Plotly.purge('chartdiv');
        //     this.props.trendsLoading(true);
        //     this.getDryDockData();
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

    handleHover(data) {
        // Sets the hover data to redux.
        this.props.setHover(data);
    }

    handleOutlierHover(data) {
        // Sets the outlier hover data to redux.
        this.props.setOutlierHover(data);
    }

    handleMLHover(data) {
        // Sets the KPI & ML hover data to redux.
        this.props.setMLHover(data);
    }

    handleMessagesHover(data) {
        // Sets the messages data to redux.
        this.props.setMessagesHover(data);
    }

    handleOutlierMessagesHover(data) {
        // Sets the outlier messages data to redux.
        this.props.setOutlierMessagesHover(data);
    }

    handleNamesOfOutlierHover(data) {
        this.props.getNamesOfOutlierHover(data);
    }

    handleHoverForFuelCons(data) {
        this.props.setHoverForFuelCons(data);
    }

    handleHoverForWeather(data) {
        this.props.setWeatherHover(data);
    }

    handleHoverForDryDock(data) {
        this.props.setDryDockHover(data);
    }

    getChartData () {
        // Gets the data required to create the charts.
        let param;
        // let CancelToken = axios.CancelToken;
        // let chart_cancel;

        console.log("PARAMS SELECTED",this.props.trends.selectedOptions);
        console.log("INDICE SELECTED",this.props.trends.indexOptions);
        // if(this.props.trends.group === "" || this.props.trends.selectedOptions.length === 0) {
        //     alert("Select a group or an individual parameter!");
        // }
        if(this.props.trends.group === "" && this.props.trends.selectedOptions.length > 0 && this.props.trends.indexOptions.length === 0) {
            let individual_params = this.props.trends.selectedOptions.length > 0 ? this.props.trends.selectedOptions.toString() : ""
            let groupName = this.props.trends.group !== "" ? this.props.trends.group : ""
            param = {
                'ship_imo': this.props.trends.ship_imo,
                'group': groupName,
                'duration': this.props.trends.duration,
                'include_outliers': this.props.trends.outliers,
                'individual_params': individual_params,
                'compare': this.props.trends.compare,
                'anomalies': this.props.trends.anomalies,
                'noonorlogs': this.props.trends.noonorlogs
            };
        }
        if(this.props.trends.group !== "" && this.props.trends.selectedOptions.length === 0 && this.props.trends.indexOptions.length === 0) {
            let groupName = this.props.trends.group !== "" ? this.props.trends.group : ""
            param = {
                'ship_imo': this.props.trends.ship_imo,
                'group': groupName,
                'duration': this.props.trends.duration,
                'include_outliers': this.props.trends.outliers,
                'compare': this.props.trends.compare,
                'anomalies': this.props.trends.anomalies,
                'noonorlogs': this.props.trends.noonorlogs
                // 'individual_params': this.props.trends.selectedOptions.length > 0 ? this.props.trends.selectedOptions.toString() : []
            };
        }
        if(this.props.trends.group !== "" && this.props.trends.selectedOptions.length > 0 && this.props.trends.indexOptions.length === 0) {
            let groupName = this.props.trends.group !== "" ? this.props.trends.group : ""
            let individual_params = this.props.trends.selectedOptions.length > 0 ? this.props.trends.selectedOptions.toString() : ""
            param = {
                'ship_imo': this.props.trends.ship_imo,
                'group': groupName,
                'duration': this.props.trends.duration,
                'include_outliers': this.props.trends.outliers,
                'individual_params': individual_params,
                'compare': this.props.trends.compare,
                'anomalies': this.props.trends.anomalies,
                'noonorlogs': this.props.trends.noonorlogs
            };
        }

        // ak code here
        if(this.props.trends.group === "" && this.props.trends.selectedOptions.length === 0 && this.props.trends.indexOptions.length > 0) {
            let individual_params = this.props.trends.indexOptions.length > 0 ? this.props.trends.indexOptions.toString() : ""
            let groupName = this.props.trends.group !== "" ? this.props.trends.group : ""
            param = {
                'ship_imo': this.props.trends.ship_imo,
                'group': groupName,
                'duration': this.props.trends.duration,
                'include_outliers': this.props.trends.outliers,
                'individual_params': individual_params,
                'compare': this.props.trends.compare,
                'anomalies': this.props.trends.anomalies,
                'noonorlogs': this.props.trends.noonorlogs
            };
        }
        if(this.props.trends.group !== "" && this.props.trends.selectedOptions.length === 0 && this.props.trends.indexOptions.length > 0) {
            let groupName = this.props.trends.group !== "" ? this.props.trends.group : ""
            let individual_params = this.props.trends.indexOptions.length > 0 ? this.props.trends.indexOptions.toString() : ""
            param = {
                'ship_imo': this.props.trends.ship_imo,
                'group': groupName,
                'duration': this.props.trends.duration,
                'include_outliers': this.props.trends.outliers,
                'individual_params': individual_params,
                'compare': this.props.trends.compare,
                'anomalies': this.props.trends.anomalies,
                'noonorlogs': this.props.trends.noonorlogs
            };
        }

        if(this.props.trends.group === "" && this.props.trends.selectedOptions.length > 0 && this.props.trends.indexOptions.length > 0) {
            let indices_params = this.props.trends.indexOptions 
            let individual_params = this.props.trends.selectedOptions
            let combined_params = [...indices_params,...individual_params].toString() 
            console.log("COMBINED SELECTED",combined_params);
            let groupName = this.props.trends.group !== "" ? this.props.trends.group : ""
            param = {
                'ship_imo': this.props.trends.ship_imo,
                'group': groupName,
                'duration': this.props.trends.duration,
                'include_outliers': this.props.trends.outliers,
                'individual_params': combined_params,
                'compare': this.props.trends.compare,
                'anomalies': this.props.trends.anomalies,
                'noonorlogs': this.props.trends.noonorlogs
            };
        }
        if(this.props.trends.group !== "" && this.props.trends.selectedOptions.length > 0 && this.props.trends.indexOptions.length > 0) {
            let groupName = this.props.trends.group !== "" ? this.props.trends.group : ""
            let indices_params = this.props.trends.indexOptions 
            let individual_params = this.props.trends.selectedOptions
            let combined_params = [...indices_params,...individual_params].toString() 
            console.log("COMBINED SELECTED 2",combined_params);
            param = {
                'ship_imo': this.props.trends.ship_imo,
                'group': groupName,
                'duration': this.props.trends.duration,
                'include_outliers': this.props.trends.outliers,
                'individual_params': combined_params,
                'compare': this.props.trends.compare,
                'anomalies': this.props.trends.anomalies,
                'noonorlogs': this.props.trends.noonorlogs
            };
        }

        // ak code end


        if(typeof cancelToken !== typeof undefined) {
            // cancelToken.cancel("Operation cancelled due to new request.")
            this.props.trendsLoading(true);
        }

        // this.cancelToken = axios.CancelToken.source()

        try {
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
                this.props.setTrends(res.data)
                this.initChart(res.data);
                // console.log(res.data);
                // return res.data;
            })
            .catch((err) => {
                console.log("Error", err);
                this.props.trendsFailed(err);
            });
        }
        catch(error) {
            console.log("ERROR", error);
            this.props.trendsFailed(error);
        }
    }

    getDryDockData() {
        // Gets the data required to create charts for intervention analysis 
        let param;
        console.log("YES IN!!")
        if(this.props.trends.dry_dock_period !== null && this.props.trends.evaluation_period !== null) {
            console.log("DRY DOCK", this.props.trends.ship_imo)
            param = {
                ship_imo: this.props.trends.ship_imo,
                dry_dock_period: this.props.trends.dry_dock_period,
                evaluation_period: this.props.trends.evaluation_period,
                performance_type: this.props.trends.performance_type
            }
        }
        
        if(typeof cancelToken !== typeof undefined) {
            // cancelToken.cancel("Operation cancelled due to new request.")
            this.props.trendsLoading(true);
        }

        try {
            axios({
                method: "get",
                url: dry_dock_url,
                params: param,
                cancelToken: cancelToken.token
            })
            .then((res) => {
                // this.setState({
                //     data: res.data
                // });
                this.props.setTrends(res.data)
                this.initChart(res.data, true);
                console.log(res.data);
                // return res.data;
            })
            .catch((err) => {
                console.log("Error", err);
                this.props.trendsFailed(err);
            });
        }
        catch(error) {
            console.log("ERROR", error);
            this.props.trendsFailed(error);
        }
    }

    // filterDuplicateValues(arr, val) {
    //     return arr.filter(i => i !== val);
    // }

    
    makeTrace(x,y,name,hovertext,yaxis,showlegend,legendgroup,visible, customdata, color, fill='', fillcolor='') {
        // Function to create trace with arguments x-param(List), y-param(List), name(String), yaxis(String), showlegend(boolean), legendgroup(String)
        // legendgrouptitle_text(String), visible(boolean), customdata(String), color(either hex or color name)
        // let width = fill !== '' ? 0 : ''
        if(yaxis == '') {
            return {
                x: x,
                y: y,
                type: 'scatter',
                mode: 'lines',
                line: {
                    color: color,
                    // width: width
                },
                name: name,
                text: hovertext,
                hoverinfo: 'text+x+y',
                visible: visible,
                customdata: customdata,
                showlegend: showlegend,
                legendgroup: legendgroup,
                fill: fill,
                fillcolor: fillcolor,
                connectgaps: true
            }
        }
        else {
            return {
                x: x,
                y: y,
                type: 'scatter',
                mode: 'lines',
                line: {
                    color: color,
                    // width: width
                },
                name: name,
                text: hovertext,
                yaxis: yaxis,
                hoverinfo: 'text+x+y',
                visible: visible,
                customdata: customdata,
                showlegend: showlegend,
                legendgroup: legendgroup,
                fill: fill,
                fillcolor: fillcolor,
                connectgaps: true
            }
        }
    }

    makeTraceForDryDock(x,y,name,hovertext,yaxis,showlegend,legendgroup,visible, customdata, color, fill='', fillcolor='') {
        // Function to create trace with arguments x-param(List), y-param(List), name(String), yaxis(String), showlegend(boolean), legendgroup(String)
        // legendgrouptitle_text(String), visible(boolean), customdata(String), color(either hex or color name)
        if(yaxis === '') {
            return {
                x: x,
                y: y,
                type: 'scatter',
                mode: 'lines',
                name: name,
                text: hovertext,
                hoverinfo: 'hovertext+x+y',
                showlegend: showlegend,
                legendgroup: legendgroup,
                visible: visible,
                customdata: customdata,
                color: color
            }
        }
        else {
            return {
                x: x,
                y: y,
                type: 'scatter',
                mode: 'lines',
                name: name,
                text: hovertext,
                yaxis: yaxis,
                hoverinfo: 'hovertext+x+y',
                showlegend: showlegend,
                legendgroup: legendgroup,
                visible: visible,
                customdata: customdata,
                color: color
            }
        }
    }

    makeDummyTraceForSubplotLegends(x, yaxis,showlegend,legendgroup,legendgrouptitle_text, visible) {
        // This is a dummy trace maker that creates 0 opacity lines in a subgroup so that subgroup can be given a name.
        // let width = fill !== '' ? 0 : ''
        if(yaxis == '') {
            return {
                x: x,
                y: [null],
                type: 'scatter',
                mode: 'lines',
                // line: {
                //     // color: color,
                //     width: 0
                // },
                opacity: 0,
                name: legendgrouptitle_text,
                text: '',
                // hoverinfo: 'text+x+y',
                visible: visible,
                // customdata: customdata,
                showlegend: showlegend,
                legendgroup: legendgroup
                // legendgrouptitle: {
                //     text: legendgrouptitle_text
                // },
                // fill: fill,
                // fillcolor: fillcolor,
                // connectgaps: true
            }
        }
        else {
            return {
                x: x,
                y: [null],
                type: 'scatter',
                mode: 'lines',
                // line: {
                //     // color: color,
                //     width: 0
                // },
                opacity: 0,
                name: legendgrouptitle_text,
                text: '',
                yaxis: yaxis,
                // hoverinfo: 'text+x+y',
                visible: visible,
                // customdata: customdata,
                showlegend: showlegend,
                legendgroup: legendgroup
                // legendgrouptitle: {
                //     text: legendgrouptitle_text
                // },
                // fill: fill,
                // fillcolor: fillcolor,
                // connectgaps: true
            }
        }
    }

    makeTraceForSubplotColor(x,y,yaxis,showlegend,legendgroup,visible, color) {
        // let width = fill !== '' ? 0 : ''
        if(yaxis == '') {
            return {
                x: x,
                y: y,
                type: 'scatter',
                mode: 'lines',
                line: {
                    color: color,
                    width: 500
                },
                name: '',
                text: '',
                hoverinfo: 'skip',
                visible: visible,
                customdata: '',
                showlegend: showlegend,
                legendgroup: legendgroup,
                connectgaps: true
            }
        }
        else {
            return {
                x: x,
                y: y,
                type: 'scatter',
                mode: 'lines',
                line: {
                    color: color,
                    width: 500
                },
                name: '',
                text: '',
                yaxis: yaxis,
                hoverinfo: 'skip',
                visible: visible,
                customdata: '',
                showlegend: showlegend,
                legendgroup: legendgroup,
                connectgaps: true
            }
        }
    }

    makeTraceForOutliers(x,y,name,yaxis,showlegend,legendgroup,visible, customdata, color, opacity) {
        // let width = fill !== '' ? 0 : ''
        if(yaxis == '') {
            return {
                x: x,
                y: y,
                type: 'scatter',
                mode: 'markers',
                marker: {
                    color: color,
                    opacity: opacity
                    // width: width
                },
                name: name,
                text: name,
                hoverinfo: 'text+x+y',
                visible: visible,
                customdata: customdata,
                showlegend: showlegend,
                legendgroup: legendgroup,
                connectgaps: true
            }
        }
        else {
            return {
                x: x,
                y: y,
                type: 'scatter',
                mode: 'markers',
                marker: {
                    color: color,
                    opacity: opacity
                    // width: width
                },
                name: name,
                text: name,
                yaxis: yaxis,
                hoverinfo: 'text+x+y',
                visible: visible,
                customdata: customdata,
                showlegend: showlegend,
                legendgroup: legendgroup,
                connectgaps: true
            }
        }
    }

    makeTraceForConfidenceInterval(x,y,name,yaxis,showlegend,legendgroup,visible, customdata, color, fill='', fillcolor='') {
        // let width = fill !== '' ? 0 : ''
        if(yaxis == '') {
            return {
                x: x,
                y: y,
                type: 'scatter',
                mode: 'lines',
                line: {
                    color: color,
                    width: 0
                },
                name: name,
                text: name,
                hoverinfo: 'skip',
                visible: visible,
                customdata: customdata,
                showlegend: showlegend,
                legendgroup: legendgroup,
                fill: fill,
                fillcolor: fillcolor,
                connectgaps: true
            }
        }
        else {
            return {
                x: x,
                y: y,
                type: 'scatter',
                mode: 'lines',
                line: {
                    color: color,
                    width: 0
                },
                name: name,
                text: name,
                yaxis: yaxis,
                hoverinfo: 'skip',
                visible: visible,
                customdata: customdata,
                showlegend: showlegend,
                legendgroup: legendgroup,
                fill: fill,
                fillcolor: fillcolor,
                connectgaps: true
            }
        }
    }

    makeTraceForBallastAndLoaded(x,y,name,yaxis,showlegend,legendgroup,visible, color, baseNum) {
        // let width = fill !== '' ? 0 : ''
        // let arr = this.filterDuplicateValues(y, 0);
        // let baseNum = Math.min(...arr);
        if(yaxis == '') {
            return {
                x: x,
                y: y,
                type: 'bar',
                marker: {
                    color: color,
                    // width: width
                },
                base: baseNum,
                name: name,
                text: name,
                hoverinfo: 'skip',
                visible: visible,
                showlegend: showlegend,
                legendgroup: legendgroup,
                connectgaps: true
            }
        }
        else {
            return {
                x: x,
                y: y,
                type: 'bar',
                marker: {
                    color: color,
                    // width: width
                },
                base: baseNum,
                name: name,
                text: name,
                yaxis: yaxis,
                hoverinfo: 'skip',
                visible: visible,
                showlegend: showlegend,
                legendgroup: legendgroup,
                connectgaps: true
            }
        }
    }

    
    makeDomain(max, responseData, dry_dock=false) {
        // Function to divide the graph into blocks corresponding to the maximum number in the blockList created in makeLayout()
        let step;
        let yaxis_domain = {};
        step = 1/max;
        let i=0;
        let temp = {};
        let yaxis='yaxis';
        let Num1 = 0;
        let Num2 = step;
        let colorList = ['#e5e500', '#0000e5'];
        let tickColor;
        let subgroupNamesKeys = dry_dock === false ? Object.keys(responseData['Subgroup Dictionary']) : responseData['Subgroup Names'];
        // console.log("SUBGROUP NAMES!!!!!!!!!!!!!", subgroupNamesKeys);
        // if(this.props.stateData.group !== 'Multi Axis') {
            while(i<max) {
                // console.log("NAMES OF SUBGROUPS!!!!!!!!!!!!!!!!!!!!!!!", subgroupNamesKeys[i]);
                if(i > 0) {
                    let subgroupName = subgroupNamesKeys !== null ? subgroupNamesKeys[i] : null;
                    console.log("subgroupppp",subgroupName);
                    if(i % 2 == 0) {
                        tickColor = colorList[0];
                    }
                    else {
                        tickColor = colorList[1];
                    }
                    yaxis = 'yaxis'.concat((i+1).toString());
                    temp[yaxis] = {
                        domain: [Num1, Num2],
                        // title: 'Sub-Group '+(i+1),
                        title:subgroupName,
                        // autorange: true,
                        fixedrange: false,
                        // automargin: true,
                        rangemode: dry_dock === true ? 'tozero' : "normal",
                        showspikes: true,
                        spikemode: 'across',
                        spikethickness: 1,
                        spikesnap: 'cursor',
                        showline: true,
                        showgrid: true,
                        tickfont: {
                            color: tickColor
                        }
                    }
                    Num1 = Num2;
                    Num2 = Num2 + step;
                    // console.log("N1 and N2", Num1, Num2);
                    i++;
                }
                else {
                    let subgroupName = subgroupNamesKeys !== null ? subgroupNamesKeys[i] : null;
                    temp[yaxis] = {
                        domain: [Num1, Num2],
                        // title: 'Sub-Group '+(i+1),
                        title:subgroupName,
                        // autorange: true,
                        fixedrange: false,
                        // automargin: true,
                        rangemode: dry_dock === true ? 'tozero' : "normal",
                        showspikes: true,
                        spikemode: 'across',
                        spikethickness: 1,
                        spikesnap: 'cursor',
                        showline: true,
                        showgrid: true,
                        tickfont: {
                            color: colorList[0]
                        }
                    }
                    Num1 = Num2;
                    Num2 = Num2 + step;
                    i++;
                }
                
            }
            yaxis_domain = {...temp}
        // }
        // else {
            
        // }
        return yaxis_domain;
    }

    createPositionForMultiAxis(arrLen) {
        let positionPatternArray = ['left', 'left', 'right', 'right']; // That's the order in which Y axes are created in Plotly. Skipping the
        // first Y axis which is by default on the left side. This pattern repeats throughout.
        let positionArray=[];
        if(arrLen === 4) {
            return positionArray.push(...positionPatternArray);
        }
        else if(arrLen < 4) {
            for(let i=0;i<arrLen;i++) {
                positionArray.push(positionPatternArray[i]);
            }

            return positionArray
        }
        else if(arrLen > 4 && arrLen % 4 === 0) {
            let number_of_times_to_push_pattern = parseInt(arrLen / 4);
            for(let i=0;i<number_of_times_to_push_pattern;i++) {
                positionArray.push(...positionPatternArray);
            }

            return positionArray
        }
        else if(arrLen > 4 && arrLen % 4 !== 0) {
            let maximum_number_of_times_to_push_pattern = parseInt(arrLen / 4);
            let remaining_number_of_times_to_push_pattern = arrLen % 4; // Will have to use the same logic again if this value 
            // is greater than 4.

            for(let i=0;i<maximum_number_of_times_to_push_pattern;i++) {
                positionArray.push(...positionPatternArray);
            }
            for(let i=0;i<remaining_number_of_times_to_push_pattern;i++) {
                positionArray.push(positionPatternArray[i]);
            }

            return positionArray
        }
    }

    makeDomainForMultiAxis(arrLen, unitList, shortNamesList) {
        // let arrLen = [];
        // responseData.map((item) => {
        //     if(item == 'Short Names') {
        //         responseData[item].map((i) => {
        //             arrLen.push(i);
        //         })
        //     }
        // });
        // console.log("ARRLEN", arrLen);
        let positionArray = this.createPositionForMultiAxis(arrLen);
        let yaxis_domain;
        let i=0;
        let temp = {};
        let yaxis = 'yaxis';
        while(i<arrLen) {
            if(i == 0) {
                temp[yaxis] = {
                    title: shortNamesList[i] + '('+unitList[i]+')',
                    showspikes: true,
                    spikemode: 'across',
                    spikethickness: 1,
                    spikesnap: 'cursor',
                    showline: true,
                    showgrid: true,
                }
                i++;
            }
            else {
                yaxis = 'yaxis'.concat((i+1).toString());
                if((i+1)%2 == 0) {
                    temp[yaxis] = {
                        title: shortNamesList[i] + '('+unitList[i]+')',
                        anchor: 'free',
                        overlaying: 'y',
                        // side: 'left',
                        side: positionArray[i],
                        position: 0.0001,
                        showspikes: true,
                        spikemode: 'across',
                        spikethickness: 1,
                        spikesnap: 'cursor',
                        showline: true,
                        showgrid: true,
                    }
                    i++;
                }
                else if((i+1)%2 !== 0) {
                    temp[yaxis] = {
                        title: shortNamesList[i] + '('+unitList[i]+')',
                        anchor: 'x',
                        overlaying: 'y',
                        // side: 'right',
                        side: positionArray[i],
                        showspikes: true,
                        spikemode: 'across',
                        spikethickness: 1,
                        spikesnap: 'cursor',
                        showline: true,
                        showgrid: true,
                    }
                    i++;
                }
            }
        }
        // yaxis_domain = {
        //     'yaxis': {
        //         title: 'yaxis title',
        //         titlefont: {color: '#1f77b4'},
        //         tickfont: {color: '#1f77b4'},
        //         // domain: [0, 0.5]
        //     },
        //     'yaxis2': {
        //         title: 'yaxis2 title',
        //         titlefont: {color: '#ff7f0e'},
        //         tickfont: {color: '#ff7f0e'},
        //         anchor: 'free',
        //         overlaying: 'y',
        //         side: 'left',
        //         position: 0.03,
        //         // domain: [0, 0.5]
        //     },
        //     'yaxis3': {
        //         title: 'yaxis3 title',
        //         titlefont: {color: '#d62728'},
        //         tickfont: {color: '#d62728'},
        //         anchor: 'x',
        //         overlaying: 'y',
        //         side: 'right',
        //         // domain: [0, 0.5]
        //     }
        // }
        yaxis_domain = {...temp}
        // console.log("MULTI YAXIS DOMAIN", yaxis_domain);
        return yaxis_domain;
    }

    makeLayout(responseData, dry_dock=false) {
        // Function to create the layout of the entire plot
        let blockList = [];
        let max;
        let layout;
        if(dry_dock == false) {
            let height = responseData['Chart Height'];
            let noonOrLogs = this.props.trends.noonOrLogs;
            for(let i in responseData['group']) {
                if(blockList.includes(responseData['group'][i]['block_number']) === false) {
                    blockList.push(responseData['group'][i]['block_number']);
                }
            }
            // console.log("DATA", blockList);
            // if(this.props.stateData.group !== 'Multi Axis') {
            // max = Math.max(...blockList);
            max = blockList.length
            let yaxis_domain = this.makeDomain(max, responseData);
            if(noonOrLogs === 'logs') {
                layout = {
                    hovermode: 'compare',
                    dragmode: 'zoom',
                    spikedistance: -1,
                    grid: {
                        rows: max,
                        ygap: 0.9,
                        columns: 1,
                        pattern: 'independent'
                    },
                    height: height,
                    bargap: 0,
                    barmode: 'overlay',
                    bargroupgap: 0,
                    margin: {
                        r: 40
                    },
                    xaxis: {
                        title: 'Date',
                        type: 'date',
                        // range: ['2016-10-12', '2016-12-13'],
                        dtick: 14400000,
                        // nticks: 10,
                        tickmode: "linear",
                        tick0: responseData['mainres']['rep_dt'][0],
                        tickformatstops: tickFormatStops,
                        // range: [responseData['mainres']['rep_dt'][0], responseData['mainres']['rep_dt'][(responseData['mainres']['rep_dt']).length - 1]],
                        range: [responseData['mainres']['rep_dt'][(responseData['mainres']['rep_dt']).length - 7], responseData['mainres']['rep_dt'][(responseData['mainres']['rep_dt']).length - 1]],
                        rangeselector: selectorOptions,
                        // rangeslider: {
                        //     borderwidth: 1,
                        //     thickness: 0.01,
                        //     range: [responseData['mainres']['rep_dt'][0], responseData['mainres']['rep_dt'][(responseData['mainres']['rep_dt']).length - 1]],
                        // },
                        // rangeslider: rangeSlider,
                        showspikes: true,
                        spikemode: 'across',
                        spikethickness: 1,
                        spikesnap: 'cursor',
                        showline: true,
                        showgrid: true,
                        // mirror: 'allticks',
                    },
                    legend: {
                        tracegroupgap: 300,
                        traceorder: "reversed+grouped",
                        title: ''
                        // orientation: 'h',
                        // x: 0,
                        // y: responseData['Y position'] //-0.05 for FO CONS, -0.08 for COMBUSTION
                    },
                    autosize: true,
                    ...yaxis_domain,
                    shapes: responseData['Ballast or Loaded']
                }
            }
            else {
                layout = {
                    hovermode: 'compare',
                    dragmode: 'zoom',
                    spikedistance: -1,
                    grid: {
                        rows: max,
                        ygap: 0.9,
                        columns: 1,
                        pattern: 'independent'
                    },
                    height: height,
                    bargap: 0,
                    barmode: 'overlay',
                    bargroupgap: 0,
                    margin: {
                        r: 40
                    },
                    xaxis: {
                        title: 'Date',
                        type: 'date',
                        // range: ['2016-10-12', '2016-12-13'],
                        // dtick: 14400000,
                        // nticks: 10,
                        // tickmode: "auto",
                        // tickformatstops: tickformat,
                        // range: [responseData['mainres']['rep_dt'][(responseData['mainres']['rep_dt']).length - 61], responseData['mainres']['rep_dt'][(responseData['mainres']['rep_dt']).length - 1]],
                        range: [responseData['mainres']['rep_dt'][(responseData['mainres']['rep_dt']).length - 150], responseData['mainres']['rep_dt'][(responseData['mainres']['rep_dt']).length - 1]],
                        // rangeselector: selector,
                        rangeslider: {
                            borderwidth: 1,
                            thickness: 0.01,
                            range: [responseData['mainres']['rep_dt'][0], responseData['mainres']['rep_dt'][(responseData['mainres']['rep_dt']).length - 1]],
                        },
                        showspikes: true,
                        spikemode: 'across',
                        spikethickness: 1,
                        spikesnap: 'cursor',
                        showline: true,
                        showgrid: true,
                        // mirror: 'allticks',
                    },
                    legend: {
                        tracegroupgap: 300,
                        traceorder: "reversed+grouped",
                        title: ''
                        // orientation: 'h',
                        // x: 0,
                        // y: responseData['Y position'] //-0.05 for FO CONS, -0.08 for COMBUSTION
                    },
                    autosize: true,
                    ...yaxis_domain,
                    shapes: responseData['Ballast or Loaded']
                }
            }
        }
        else {
            max = 6
            let yaxis_domain = this.makeDomain(max, responseData, dry_dock);
            let height = responseData['Height']
            layout = {
                hovermode: 'compare',
                dragmode: 'zoom',
                spikedistance: -1,
                grid: {
                    rows: max,
                    ygap: 0.9,
                    columns: 1,
                    pattern: 'independent'
                },
                height: height,
                bargap: 0,
                barmode: 'overlay',
                bargroupgap: 0,
                margin: {
                    r: 40
                },
                xaxis: {
                    title: 'Date',
                    type: 'date',
                    // range: ['2016-10-12', '2016-12-13'],
                    // dtick: 14400000,
                    // nticks: 10,
                    // tickmode: "auto",
                    // tickformatstops: tickformat,
                    // range: [responseData['mainres']['rep_dt'][(responseData['mainres']['rep_dt']).length - 61], responseData['mainres']['rep_dt'][(responseData['mainres']['rep_dt']).length - 1]],
                    // range: [responseData['Evaluation Data']['rep_dt'][(responseData['Evaluation Data']['rep_dt']).length - 15], responseData['Evaluation Data']['rep_dt'][(responseData['Evaluation Data']['rep_dt']).length - 1]],
                    // rangeselector: selector,
                    rangeslider: {
                        borderwidth: 1,
                        thickness: 0.01,
                        range: [responseData['Evaluation Data']['rep_dt'][0], responseData['Evaluation Data']['rep_dt'][(responseData['Evaluation Data']['rep_dt']).length - 1]],
                    },
                    showspikes: true,
                    spikemode: 'across',
                    spikethickness: 1,
                    spikesnap: 'cursor',
                    showline: true,
                    showgrid: true,
                    // mirror: 'allticks',
                },
                legend: {
                    tracegroupgap: 300,
                    traceorder: "reversed+grouped",
                    title: ''
                    // orientation: 'h',
                    // x: 0,
                    // y: responseData['Y position'] //-0.05 for FO CONS, -0.08 for COMBUSTION
                },
                autosize: true,
                ...yaxis_domain,
                shapes: responseData['Shapes']
            }
        }
            
        // }
        // else {
            
        // }
        

        return layout;
    }

    makeLayoutForMultiAxis(responseData) {
        let layout;
        let arrLen;
        let unitList=[];
        let shortNamesList=[];
        shortNamesList = responseData['Short Names'];
        responseData['group'].map((item) => {
            // if(arrLen[i] == item['short_names']) {
            unitList.push(item['unit']);
            // }
        });
        arrLen = shortNamesList.length;
        let yaxis_domain = this.makeDomainForMultiAxis(arrLen, unitList, shortNamesList);
        // REPLACE BELOW title WITH responseData['group'][0]['groupname'].replace('Multi Axis - ', '') LATER
        let title = this.props.trends.group.replace('Multi Axis - ', '');

        layout = {
            title: title,
            height: responseData['Chart Height'],
            // width: 1000,
            xaxis: {
                domain: [0.1, 0.9],
                title: 'Date',
                type: 'date',
                range: ['2016-10-12', '2016-12-13'],
                rangeslider: {
                    borderwidth: 1,
                    thickness: 0.01,
                    range: [responseData['mainres']['rep_dt'][0], responseData['mainres']['rep_dt'][(responseData['mainres']['rep_dt']).length - 1]]
                },
                showspikes: true,
                spikemode: 'across',
                spikethickness: 1,
                spikesnap: 'cursor',
                showline: true,
                showgrid: true,
            },
            legend: {
                orientation: 'h',
                x: 0,
                y: -0.3
            },
            ...yaxis_domain,
            showlegend: true
        }
        // console.log("MULTI AXIS LAYOUT", layout);
        return layout;
    }

    makeDataList(responseData) {
        // Function to create a list of traces by looping through the data and calling the `makeTrace` function.
        let dataList=[];
        let blockList=[];
        let date = responseData['mainres']['rep_dt'];
        // let legendNames = ['ME Scavange Press & Combst - Compr Press', 'SPE ME Scavange Press', 'Combst -Peak Press', 'ME Exh Temp', 'SPE ME Exh Temp', 'Air Temp B4 Cooler & ME Scavange Temp', 'SPE Air Temp B4 Cooler & SPE ME Scavange Temp', 'Air Cooler Pres Drop', 'SPE Air Cooler Pres Drop', 'Air Cooler SW Inlet/Outlet Temp & Air Cooler Water Separation', 'SPE Air Cooler SW Inlet/Outlet Temp & SPE Air Cooler Water Separation']
        for(let i in responseData['group']) {
            if(!blockList.includes(responseData['group'][i]['block_number'])) {
                blockList.push(responseData['group'][i]['block_number']);
            }
        }
        console.log("BLOCK LIST", blockList);
        // let max = Math.max(...blockList);
        let subgroupValuesList = Object.values(responseData['Subgroup Dictionary'])
        responseData['Variables List'].map((variable) => {
            Object.keys(responseData['mainres']).map((key) => {
                if(variable === key) {
                    for(let i in responseData['group']) {
                        if(responseData['group'][i]['name'] == variable) {
                            let y_axis;
                            let show = false;
                            let visible = true;
                            let customdata;
                            let color = responseData['group'][i]['name'].includes('index') ? 'red' : ''
                            let short_name = responseData['group'][i]['short_names'];
                            let hovertext = responseData['group'][i]['short_names'];
                            
                            // let legendgrouptitle_text = subgroupValuesList[parseInt(responseData['group'][i]['block_number']) - 1]
                            // console.log("LEGEND GROUP TITLE TEXT", legendgrouptitle_text);
                            // let short_name;
                            // for(let nam in legendNames) {
                            //     if(legendNames[nam].includes(responseData['group'][i]['short_names'])) {
                            //         short_name = legendNames[nam]
                            //     }
                            // }
                            let legend = responseData['group'][i]['block_number'];

                            // if(parseInt(responseData['group'][i]['block_number']) % 10 === 1) {
                            //     y_axis = '';
                            // }
                            // else {
                            y_axis = parseInt(responseData['group'][i]['block_number']) > 1 ? 'y'.concat((parseInt(responseData['group'][i]['block_number'])).toString()) : 'y';
                            // }
                            // if(parseInt(responseData['group'][i]['group_availability_code']) % 10 !== 0) {
                            //     show = 'legendonly';
                            //     visible = true;
                            // }
                            // else {
                            //     show = 'legendonly';
                            //     visible = 'legendonly';
                            // }
                            customdata = parseInt(responseData['group'][i]['group_availability_code']);
                            let temp = this.makeTrace(date, responseData['mainres'][key], short_name, hovertext, y_axis, show, legend, visible, customdata, color);
                            dataList.push(temp);
                        }
                    }
                }
            });
        

            if(this.props.trends.outliers === true) {
                Object.keys(responseData['Outlier']).map((key) => {
                    if(variable === key) {
                        for(let i in responseData['group']) {
                            if(responseData['group'][i]['name'] == variable) {
                                let y_axis;
                                let show = true;
                                let visible = true;
                                let customdata;
                                // let color = responseData['Outlier Color'][variable]
                                let color = variable.includes('spe_', '') ? "black" : "red"
                                // let opacity = responseData['Opacity'][variable]
                                let short_name = 'Outlier ' + responseData['group'][i]['short_names'];
                                let legend = responseData['group'][i]['block_number'];

                                // if(parseInt(responseData['group'][i]['block_number']) % 10 === 1) {
                                //     y_axis = '';
                                // }
                                // else {
                                y_axis = parseInt(responseData['group'][i]['block_number']) > 1 ? 'y'.concat((parseInt(responseData['group'][i]['block_number'])).toString()) : 'y';
                                // }
                                if(parseInt(responseData['group'][i]['group_availability_code']) % 10 !== 0) {
                                    show = 'legendonly';
                                    visible = true;
                                }
                                else {
                                    show = 'legendonly';
                                    visible = 'legendonly';
                                }
                                customdata = parseInt(responseData['group'][i]['group_availability_code']);
                                let temp = this.makeTraceForOutliers(date, responseData['Outlier'][key], short_name, y_axis, false, legend, visible, customdata, color, '');
                                dataList.push(temp);
                            }
                        }
                    }
                });
            }
            
            // responseData['Variables List'].map((variable) => {
                Object.keys(responseData['Lower']).map((key) => {
                    if(variable === key) {
                        for(let i in responseData['group']) {
                            if(responseData['group'][i]['name'] == variable) {
                                let y_axis;
                                let show = false;
                                let visible=true;
                                let customdata;
                                let color = '#000000';
                                let short_name = 'Lower ' + responseData['group'][i]['short_names'];
                                let legend = responseData['group'][i]['block_number'];
                                // let fill = 'tonext';
                                // let fillcolor = 'rgba(68, 68, 68, 0.7)';
                                // if(parseInt(responseData['group'][i]['block_number']) % 10 === 1) {
                                //     y_axis = '';
                                // }
                                // else {
                                y_axis = parseInt(responseData['group'][i]['block_number']) > 1 ? 'y'.concat((parseInt(responseData['group'][i]['block_number'])).toString()) : 'y';
                                // }
                                if(parseInt(responseData['group'][i]['group_availability_code']) % 10 !== 0) {
                                    visible = true;
                                    customdata = 'p'.concat((parseInt(responseData['group'][i]['block_number'])).toString());
                                }
                                else {
                                    visible = false;
                                    customdata='';
                                }
                                
                                let temp = this.makeTraceForConfidenceInterval(date, responseData['Lower'][key], short_name, y_axis, show, legend, visible, customdata, '');
                                dataList.push(temp);
                            }
                        }
                    }
                });
            // })

            if(this.props.trends.duration.includes('Lastyear')) {
                // responseData['Variables List'].map((variable) => {
                    Object.keys(responseData['LY_Lower']).map((key) => {
                        if(variable === key) {
                            for(let i in responseData['group']) {
                                if(responseData['group'][i]['name'] == variable) {
                                    let y_axis;
                                    let show = false;
                                    let visible=true;
                                    let customdata;
                                    let color = '#000000';
                                    let short_name = 'LY Lower ' + responseData['group'][i]['short_names'];
                                    let legend = responseData['group'][i]['block_number'];
                                    // if(parseInt(responseData['group'][i]['block_number']) % 10 === 1) {
                                    //     y_axis = '';
                                    // }
                                    // else {
                                    y_axis = parseInt(responseData['group'][i]['block_number']) > 1 ? 'y'.concat((parseInt(responseData['group'][i]['block_number'])).toString()) : 'y';
                                    // }
                                    if(parseInt(responseData['group'][i]['group_availability_code']) % 10 !== 0) {
                                        visible = true;
                                        customdata = 'p'.concat((parseInt(responseData['group'][i]['block_number'])).toString());
                                    }
                                    else {
                                        visible = false;
                                        customdata='';
                                    }
                                    let temp = this.makeTraceForConfidenceInterval(date, responseData['LY_Lower'][key], short_name, y_axis, show, legend, visible, customdata, '');
                                    dataList.push(temp);
                                }
                            }
                        }
                    });
                // })
            }

            // responseData['Variables List'].map((variable) => {
                Object.keys(responseData['Expected']).map((key) => {
                    if(variable === key.replace('expected_', '')) {
                        for(let i in responseData['group']) {
                            if(responseData['group'][i]['name'] == variable) {
                                let y_axis;
                                let show = false;
                                let visible=true;
                                let customdata;
                                let color = '#000000';
                                let short_name = 'Expected ' + responseData['group'][i]['short_names'];
                                let legend = responseData['group'][i]['block_number'];
                                let fill = this.props.trends.duration.includes('Lastyear') === false && Object.keys(responseData['SisterOrSimilarExpected']).length === 0 ? 'tonexty' : '';
                                let fillcolor = this.props.trends.duration.includes('Lastyear') === false && typeof Object.keys(responseData['SisterOrSimilarExpected']).length === 0 ? 'rgba(68, 68, 68, 0.4)' : '';
                                let hovertext = 'Expected ' + responseData['group'][i]['short_names'];
                                // if(parseInt(responseData['group'][i]['block_number']) % 10 === 1) {
                                //     y_axis = '';
                                // }
                                // else {
                                y_axis = parseInt(responseData['group'][i]['block_number']) > 1 ? 'y'.concat((parseInt(responseData['group'][i]['block_number'])).toString()) : 'y';
                                // }
                                if(parseInt(responseData['group'][i]['group_availability_code']) % 10 !== 0) {
                                    visible = true;
                                    customdata = 'p'.concat((parseInt(responseData['group'][i]['block_number'])).toString());
                                }
                                else {
                                    visible = false;
                                    customdata='';
                                }
                                let temp = this.makeTrace(date, responseData['Expected'][key], short_name, hovertext, y_axis, show, legend, visible, customdata, color, fill, fillcolor);
                                dataList.push(temp);
                            }
                        }
                    }
                });
            // })
            // Sister or Similar vessels predictions data list.
            if('SisterOrSimilarExpected' in responseData) {
                Object.keys(responseData['SisterOrSimilarExpected']).map((key) => {
                    if(variable === key) {
                        for(let i in responseData['group']) {
                            if(responseData['group'][i]['name'] == variable) {
                                let y_axis;
                                let show = false;
                                let visible=true;
                                let customdata;
                                let color = 'darkbrown';
                                let hovertext=responseData['SisterOrSimilarName']
                                let short_name = this.props.trends.compare.toString() + ' ' + responseData['group'][i]['short_names'];
                                let legend = responseData['group'][i]['block_number'];
                                // let fill = 'tonexty';
                                // let fillcolor = 'rgba(68, 68, 68, 0.4)';
                                // let hovertext = this.props.trends.compare.toString() + ' ' + responseData['group'][i]['short_names'];
                                // if(parseInt(responseData['group'][i]['block_number']) % 10 === 1) {
                                //     y_axis = '';
                                // }
                                // else {
                                y_axis = parseInt(responseData['group'][i]['block_number']) > 1 ? 'y'.concat((parseInt(responseData['group'][i]['block_number'])).toString()) : 'y';
                                // }
                                if(parseInt(responseData['group'][i]['group_availability_code']) % 10 !== 0) {
                                    visible = true;
                                    customdata = 'p'.concat((parseInt(responseData['group'][i]['block_number'])).toString());
                                }
                                else {
                                    visible = false;
                                    customdata='';
                                }
                                let temp = this.makeTrace(date, responseData['SisterOrSimilarExpected'][key], short_name, hovertext, y_axis, show, legend, visible, customdata, color);
                                dataList.push(temp);
                            }
                        }
                    }
                });
            }

            if(this.props.trends.duration.includes('Lastyear')) {
                // responseData['Variables List'].map((variable) => {
                    Object.keys(responseData['LY_Expected']).map((key) => {
                        if(variable === key.replace('lyexpected_', '')) {
                            for(let i in responseData['group']) {
                                if(responseData['group'][i]['name'] == variable) {
                                    let y_axis;
                                    let show = false;
                                    let visible=true;
                                    let customdata;
                                    let color = 'brown';
                                    let short_name = 'LY Expected ' + responseData['group'][i]['short_names'];
                                    let legend = responseData['group'][i]['block_number'];
                                    let fill = '';
                                    let fillcolor = '';
                                    let hovertext = 'LY Expected ' + responseData['group'][i]['short_names'];
                                    // if(parseInt(responseData['group'][i]['block_number']) % 10 === 1) {
                                    //     y_axis = '';
                                    // }
                                    // else {
                                    y_axis = parseInt(responseData['group'][i]['block_number']) > 1 ? 'y'.concat((parseInt(responseData['group'][i]['block_number'])).toString()) : 'y';
                                    // }
                                    if(parseInt(responseData['group'][i]['group_availability_code']) % 10 !== 0) {
                                        visible = true;
                                        customdata = 'p'.concat((parseInt(responseData['group'][i]['block_number'])).toString());
                                    }
                                    else {
                                        visible = false;
                                        customdata='';
                                    }
                                    let temp = this.makeTrace(date, responseData['LY_Expected'][key], short_name, hovertext, y_axis, show, legend, visible, customdata, color, fill, fillcolor);
                                    dataList.push(temp);
                                }
                            }
                        }
                    });
                // })
            }

            // responseData['Variables List'].map((variable) => {
                Object.keys(responseData['Upper']).map((key) => {
                    if(variable === key) {
                        for(let i in responseData['group']) {
                            if(responseData['group'][i]['name'] == variable) {
                                let y_axis;
                                let show = false;
                                let visible=true;
                                let customdata;
                                let color = '#000000';
                                let short_name = 'Upper ' + responseData['group'][i]['short_names'];
                                let legend = responseData['group'][i]['block_number'];
                                let fill = this.props.trends.duration.includes('Lastyear') === false && Object.keys(responseData['SisterOrSimilarExpected']).length === 0 ? 'tonexty' : '';
                                let fillcolor = this.props.trends.duration.includes('Lastyear') === false && Object.keys(responseData['SisterOrSimilarExpected']).length === 0 ? 'rgba(68, 68, 68, 0.4)' : '';
                                // if(parseInt(responseData['group'][i]['block_number']) % 10 === 1) {
                                //     y_axis = '';
                                // }
                                // else {
                                y_axis = parseInt(responseData['group'][i]['block_number']) > 1 ? 'y'.concat((parseInt(responseData['group'][i]['block_number'])).toString()) : 'y';
                                // }
                                if(parseInt(responseData['group'][i]['group_availability_code']) % 10 !== 0) {
                                    visible = true;
                                    customdata = 'p'.concat((parseInt(responseData['group'][i]['block_number'])).toString());
                                }
                                else {
                                    visible = false;
                                    customdata='';
                                }
                                
                                let temp = this.makeTraceForConfidenceInterval(date, responseData['Upper'][key], short_name, y_axis, show, legend, visible, customdata, '', fill, fillcolor);
                                dataList.push(temp);
                            }
                        }
                    }
                });
            // })

            if(this.props.trends.duration.includes('Lastyear')) {
                // responseData['Variables List'].map((variable) => {
                    Object.keys(responseData['LY_Upper']).map((key) => {
                        if(variable === key) {
                            for(let i in responseData['group']) {
                                if(responseData['group'][i]['name'] == variable) {
                                    let y_axis;
                                    let show = false;
                                    let visible=true;
                                    let customdata;
                                    let color = '#000000';
                                    let short_name = 'LY Upper ' + responseData['group'][i]['short_names'];
                                    let legend = responseData['group'][i]['block_number'];
                                    let fill = '';
                                    let fillcolor = '';
                                    // if(parseInt(responseData['group'][i]['block_number']) % 10 === 1) {
                                    //     y_axis = '';
                                    // }
                                    // else {
                                    y_axis = parseInt(responseData['group'][i]['block_number']) > 1 ? 'y'.concat((parseInt(responseData['group'][i]['block_number'])).toString()) : 'y';
                                    // }
                                    if(parseInt(responseData['group'][i]['group_availability_code']) % 10 !== 0) {
                                        visible = true;
                                        customdata = 'p'.concat((parseInt(responseData['group'][i]['block_number'])).toString());
                                    }
                                    else {
                                        visible = false;
                                        customdata='';
                                    }
                                    let temp = this.makeTraceForConfidenceInterval(date, responseData['LY_Upper'][key], short_name, y_axis, show, legend, visible, customdata, '', fill, fillcolor);
                                    dataList.push(temp);
                                }
                            }
                        }
                    });
                // })
            }
            let maxValue=null;
            // responseData['Variables List'].map((variable) => {
                Object.keys(responseData['SPE']).map((key) => {
                    if(variable === key) {
                        for(let i in responseData['group']) {
                            if(responseData['group'][i]['name'] === variable) {
                                let y_axis;
                                let show = false;
                                let visible = true;
                                let customdata;
                                let color = 'red'
                                let short_name = responseData['group'][i]['short_names'];
                                let hovertext = this.props.trends.duration.includes('Lastyear') ? 'Expected Differences' : responseData['group'][i]['short_names'];
                                // let legendgrouptitle_text = subgroupValuesList[parseInt(responseData['group'][i]['block_number']) - 1]
                                // let short_name;
                                // for(let nam in legendNames) {
                                //     if(legendNames[nam].includes(responseData['group'][i]['short_names'])) {
                                //         short_name = legendNames[nam]
                                //     }
                                // }
                                let legend = responseData['group'][i]['block_number'];

                                // if(parseInt(responseData['group'][i]['block_number']) % 10 === 1) {
                                //     y_axis = '';
                                // }
                                // else {
                                y_axis = parseInt(responseData['group'][i]['block_number']) > 1 ? 'y'.concat((parseInt(responseData['group'][i]['block_number'])).toString()) : 'y';
                                // }
                                // if(parseInt(responseData['group'][i]['group_availability_code']) % 10 !== 0) {
                                //     show = 'legendonly';
                                //     visible = true;
                                // }
                                // else {
                                //     show = 'legendonly';
                                //     visible = 'legendonly';
                                // }
                                customdata = parseInt(responseData['group'][i]['group_availability_code']);
                                let temp = this.makeTrace(date, responseData['SPE'][key], short_name, hovertext, y_axis, show, legend, visible, customdata, color);
                                dataList.push(temp);

                                if(this.props.trends.duration.includes('Lastyear')) {
                                    // let sum=0;
                                    let avg=0;
                                    let newlist=[]
                                    maxValue = maxValue === null ? Math.max(...responseData['SPE'][key]) : Math.max(...responseData['SPE'][key]) > maxValue ? Math.max(...responseData['SPE'][key]) : maxValue
                                    for(let i=0;i<responseData['SPE'][key].length;i++) {
                                        newlist.push(maxValue);
                                    }

                                    let temp1 = this.makeTraceForSubplotColor(date, newlist, y_axis, false, legend, visible, 'rgba(219, 64, 82,0.1)');
                                    dataList.push(temp1);
                                }
                                
                            }
                        }
                    }
                });
            // });

            // responseData['Variables List'].map((variable) => {
                Object.keys(responseData['SPE Limit']).map((key) => {
                    // if(variable.includes('spe_') && variable.replace('spe_', '') === key.replace('spe_limit_', '')) {
                    if(variable === key) {
                        for(let i in responseData['group']) {
                            if(responseData['group'][i]['name'] === variable.replace('spe_limit_', 'spe_')) {
                                let y_axis;
                                let show = false;
                                let visible = true;
                                let customdata;
                                let color = 'rgb(255,127,127)'
                                let short_name = responseData['group'][i]['short_names'].includes('index') ? 'SPE Limit ' + responseData['group'][i]['short_names'] : responseData['group'][i]['short_names'].replace('SPE ', 'SPE Limit ')
                                let hovertext = responseData['group'][i]['short_names'].includes('index') ? 'SPE Limit ' + responseData['group'][i]['short_names'] : responseData['group'][i]['short_names'].replace('SPE ', 'SPE Limit ');
                                // let short_name;
                                // for(let nam in legendNames) {
                                //     if(legendNames[nam].includes(responseData['group'][i]['short_names'])) {
                                //         short_name = legendNames[nam]
                                //     }
                                // }
                                let legend = responseData['group'][i]['block_number'];

                                // if(parseInt(responseData['group'][i]['block_number']) % 10 === 1) {
                                //     y_axis = '';
                                // }
                                // else {
                                y_axis = parseInt(responseData['group'][i]['block_number']) > 1 ? 'y'.concat((parseInt(responseData['group'][i]['block_number'])).toString()) : 'y';
                                // }
                                // if(parseInt(responseData['group'][i]['group_availability_code']) % 10 !== 0) {
                                //     show = 'legendonly';
                                //     visible = true;
                                // }
                                // else {
                                //     show = 'legendonly';
                                //     visible = 'legendonly';
                                // }
                                customdata = parseInt(responseData['group'][i]['group_availability_code']);
                                let temp = this.makeTrace(date, responseData['SPE Limit'][key], short_name, hovertext, y_axis, show, legend, visible, customdata, color);
                                dataList.push(temp);

                                // let sum=0;
                                let avg=0;
                                let newlist=[]
                                maxValue = maxValue === null ? Math.max(...responseData['SPE Limit'][key]) : Math.max(...responseData['SPE Limit'][key]) > maxValue ? Math.max(...responseData['SPE Limit'][key]) : maxValue
                                // for(let i=0;i<responseData['SPE Limit'][key].length;i++) {
                                //     if(responseData['SPE Limit'][key][i] !== null) {
                                //         sum += responseData['SPE Limit'][key][i]
                                //     }
                                // }
                                // avg = sum/responseData['SPE Limit'][key].length
                                for(let i=0;i<responseData['SPE Limit'][key].length;i++) {
                                    newlist.push(maxValue);
                                }

                                let temp1 = this.makeTraceForSubplotColor(date, newlist, y_axis, false, legend, visible, 'rgba(219, 64, 82,0.1)');
                                dataList.push(temp1);
                            }
                        }
                    }
                });

            // responseData['Variables List'].map((variable) => {
                Object.keys(responseData['T2']).map((key) => {
                    // if(variable.includes('spe_') && key.replace('t2_', '') === variable.replace('spe_', '')) {
                    if(variable === key) {
                        for(let i in responseData['group']) {
                            if(responseData['group'][i]['name'] === variable.replace('t2_', 'spe_')) {
                                let y_axis;
                                let show = false;
                                let visible = true;
                                let customdata;
                                let color = 'blue'
                                let short_name = responseData['group'][i]['short_names'].includes('index') ? 'T2 ' + responseData['group'][i]['short_names'] : responseData['group'][i]['short_names'].replace('SPE ', 'T2 ');
                                let hovertext = this.props.trends.duration.includes('Lastyear') ? 'Observed Differences' : responseData['group'][i]['short_names'].includes('index') ? 'T2 ' + responseData['group'][i]['short_names'] : responseData['group'][i]['short_names'].replace('SPE ', 'T2 ');
                                // let short_name;
                                // for(let nam in legendNames) {
                                //     if(legendNames[nam].includes(responseData['group'][i]['short_names'])) {
                                //         short_name = legendNames[nam]
                                //     }
                                // }
                                let legend = responseData['group'][i]['block_number'];

                                // if(parseInt(responseData['group'][i]['block_number']) % 10 === 1) {
                                //     y_axis = '';
                                // }
                                // else {
                                y_axis = parseInt(responseData['group'][i]['block_number']) > 1 ? 'y'.concat((parseInt(responseData['group'][i]['block_number'])).toString()) : 'y';
                                // }
                                // if(parseInt(responseData['group'][i]['group_availability_code']) % 10 !== 0) {
                                //     show = 'legendonly';
                                //     visible = true;
                                // }
                                // else {
                                //     show = 'legendonly';
                                //     visible = 'legendonly';
                                // }
                                customdata = parseInt(responseData['group'][i]['group_availability_code']);
                                let temp = this.makeTrace(date, responseData['T2'][key], short_name, hovertext, y_axis, show, legend, visible, customdata, color);
                                dataList.push(temp);

                                // let sum=0;
                                if(this.props.trends.duration.includes('Lastyear')) {
                                    let avg=0;
                                    let newlist=[]
                                    maxValue = maxValue === null ? Math.max(...responseData['T2'][key]) : Math.max(...responseData['T2'][key]) > maxValue ? Math.max(...responseData['T2'][key]) : maxValue
                                    for(let i=0;i<responseData['T2'][key].length;i++) {
                                        newlist.push(maxValue);
                                    }

                                    let temp1 = this.makeTraceForSubplotColor(date, newlist, y_axis, false, legend, visible, 'rgba(219, 64, 82,0.1)');
                                    dataList.push(temp1);
                                }
                            }
                        }
                    }
                });

            // responseData['Variables List'].map((variable) => {
                Object.keys(responseData['T2 Limit']).map((key) => {
                    // if(variable.includes('spe_') && key.replace('t2_limit_', '') === variable.replace('spe_', '')) {
                    if(variable === key) {
                        for(let i in responseData['group']) {
                            if(responseData['group'][i]['name'] === variable.replace('t2_limit_', 'spe_')) {
                                let y_axis;
                                let show = false;
                                let visible = true;
                                let customdata;
                                let color = 'rgb(152,152,255)'
                                let short_name = responseData['group'][i]['short_names'].includes('index') ? 'T2 Limit ' + responseData['group'][i]['short_names'] : responseData['group'][i]['short_names'].replace('SPE ', 'T2 Limit ');
                                let hovertext = responseData['group'][i]['short_names'].includes('index') ? 'T2 Limit ' + responseData['group'][i]['short_names'] : responseData['group'][i]['short_names'].replace('SPE ', 'T2 Limit ');
                                // let short_name;
                                // for(let nam in legendNames) {
                                //     if(legendNames[nam].includes(responseData['group'][i]['short_names'])) {
                                //         short_name = legendNames[nam]
                                //     }
                                // }
                                let legend = responseData['group'][i]['block_number'];

                                // if(parseInt(responseData['group'][i]['block_number']) % 10 === 1) {
                                //     y_axis = '';
                                // }
                                // else {
                                y_axis = parseInt(responseData['group'][i]['block_number']) > 1 ? 'y'.concat((parseInt(responseData['group'][i]['block_number'])).toString()) : 'y';
                                // }
                                // if(parseInt(responseData['group'][i]['group_availability_code']) % 10 !== 0) {
                                //     show = 'legendonly';
                                //     visible = true;
                                // }
                                // else {
                                //     show = 'legendonly';
                                //     visible = 'legendonly';
                                // }
                                customdata = parseInt(responseData['group'][i]['group_availability_code']);
                                let temp = this.makeTrace(date, responseData['T2 Limit'][key], short_name, hovertext, y_axis, show, legend, visible, customdata, color);
                                dataList.push(temp);

                                // let sum=0;
                                let avg=0;
                                let newlist=[]
                                maxValue = maxValue === null ? Math.max(...responseData['T2 Limit'][key]) : Math.max(...responseData['T2 Limit'][key]) > maxValue ? Math.max(...responseData['T2 Limit'][key]) : maxValue
                                // for(let i=0;i<responseData['T2 Limit'][key].length;i++) {
                                //     if(responseData['T2 Limit'][key][i] !== null) {
                                //         sum += responseData['T2 Limit'][key][i]
                                //     }
                                // }
                                // avg = sum/responseData['T2 Limit'][key].length
                                for(let i=0;i<responseData['T2 Limit'][key].length;i++) {
                                    newlist.push(maxValue);
                                }

                                let temp1 = this.makeTraceForSubplotColor(date, newlist, y_axis, false, legend, visible, 'rgba(219, 64, 82,0.1)');
                                dataList.push(temp1);
                            }
                        }
                    }
                });
                
                Object.keys(responseData['EWMA']).map((key) => {
                    if(variable === key) {
                        for(let i in responseData['group']) {
                            if(responseData['group'][i]['name'] === variable.replace('ewma_', 'spe_')) {
                                let y_axis;
                                let show = false;
                                let visible = true;
                                let customdata;
                                let color = '#006400'
                                let short_name = 'EWMA ' + responseData['group'][i]['short_names'].replace('SPE ','');
                                let hovertext = 'EWMA ' + responseData['group'][i]['short_names'].replace('SPE ','');
                                // let short_name;
                                // for(let nam in legendNames) {
                                //     if(legendNames[nam].includes(responseData['group'][i]['short_names'])) {
                                //         short_name = legendNames[nam]
                                //     }
                                // }
                                let legend = parseInt(responseData['group'][i]['block_number']);
    
                                // if(parseInt(responseData['group'][i]['block_number']) % 10 === 1) {
                                //     y_axis = '';
                                // }
                                // else {
                                y_axis = parseInt(responseData['group'][i]['block_number']) > 1 ? 'y'.concat((parseInt(responseData['group'][i]['block_number'])).toString()) : 'y';
                                // }
                                // if(parseInt(responseData['group'][i]['group_availability_code']) % 10 !== 0) {
                                //     show = 'legendonly';
                                //     visible = true;
                                // }
                                // else {
                                //     show = 'legendonly';
                                //     visible = 'legendonly';
                                // }
                                customdata = parseInt(responseData['group'][i]['group_availability_code']);
                                let temp = this.makeTrace(date, responseData['EWMA'][key], short_name, hovertext, y_axis, show, legend, visible, customdata, color);
                                dataList.push(temp);
    
                                // let sum=0;
                                let avg=0;
                                let newlist=[]
                                maxValue = maxValue === null ? Math.max(...responseData['EWMA'][key]) : Math.max(...responseData['EWMA'][key]) > maxValue ? Math.max(...responseData['EWMA'][key]) : maxValue
                            }
                        }
                    }
                });
            // });
    
            // responseData['Variables List'].map((variable) => {
                Object.keys(responseData['EWMA Limit']).map((key) => {
                    // if(variable.includes('spe_') && variable.replace('spe_', '') === key.replace('spe_limit_', '')) {
                    if(variable === key) {
                        for(let i in responseData['group']) {
                            if(responseData['group'][i]['name'] === variable.replace('ewma_limit_', 'spe_')) {
                                let y_axis;
                                let show = false;
                                let visible = true;
                                let customdata;
                                let color = '#66A266'
                                let short_name = responseData['group'][i]['short_names'].includes('index') ? 'EWMA Limit ' + responseData['group'][i]['short_names'] : 'EWMA Limit ' + responseData['group'][i]['short_names'].replace('SPE ','');
                                let hovertext = responseData['group'][i]['short_names'].includes('index') ? 'EWMA Limit ' + responseData['group'][i]['short_names'] : 'EWMA Limit ' + responseData['group'][i]['short_names'].replace('SPE ','');
                                // let short_name;
                                // for(let nam in legendNames) {
                                //     console.log("LEGEND NAMES!!!!!", nam)
                                //     if(legendNames[nam].includes(responseData['group'][i]['short_names'])) {
                                //         console.log("INSIDE IF", nam);
                                //         short_name = legendNames[nam]
                                //     }
                                // }
                                let legend = parseInt(responseData['group'][i]['block_number']);
    
                                // if(parseInt(responseData['group'][i]['block_number']) % 10 === 1) {
                                //     y_axis = '';
                                // }
                                // else {
                                y_axis = parseInt(responseData['group'][i]['block_number']) > 1 ? 'y'.concat((parseInt(responseData['group'][i]['block_number'])).toString()) : 'y';
                                // }
                                // if(parseInt(responseData['group'][i]['group_availability_code']) % 10 !== 0) {
                                //     show = 'legendonly';
                                //     visible = true;
                                // }
                                // else {
                                //     show = 'legendonly';
                                //     visible = 'legendonly';
                                // }
                                customdata = parseInt(responseData['group'][i]['group_availability_code']);
                                let temp = this.makeTrace(date, responseData['EWMA Limit'][key], short_name, hovertext, y_axis, show, legend, visible, customdata, color);
                                dataList.push(temp);
    
                                // let sum=0;
                                let avg=0;
                                let newlist=[]
                                maxValue = maxValue === null ? Math.max(...responseData['EWMA Limit'][key]) : Math.max(...responseData['EWMA Limit'][key]) > maxValue ? Math.max(...responseData['EWMA Limit'][key]) : maxValue
                                // for(let i=0;i<responseData['SPE Limit'][key].length;i++) {
                                //     if(responseData['SPE Limit'][key][i] !== null) {
                                //         sum += responseData['SPE Limit'][key][i]
                                //     }
                                // }
                                // avg = sum/responseData['SPE Limit'][key].length
                                for(let i=0;i<responseData['EWMA Limit'][key].length;i++) {
                                    newlist.push(maxValue);
                                }
    
                                let temp1 = this.makeTraceForSubplotColor(date, newlist, y_axis, false, legend, visible, 'rgba(219, 64, 82,0.1)');
                                dataList.push(temp1);
                            }
                        }
                    }
                });
        });

        for(let i=0;i<blockList.length;i++) {
            let index = (blockList.length - 1) - i
            let name = subgroupValuesList[index];
            console.log("LEGEND GROUP TITLE TEXT", name, i);
            let show = 'legendonly';
            let visible = true;
            let yaxis = i > 0 ? 'y'.concat((parseInt(i)+1).toString()) : 'y';
            let legend = blockList[index]
            console.log("LEGEND NUMBER!!!!!!!!!!!", legend);
            let temp = this.makeDummyTraceForSubplotLegends(date, yaxis, show, legend, name, visible);
            dataList.push(temp);
        }
        
        return dataList;
    }

    makeDataListForMultiAxis(responseData) {
        let dataList=[];
        let date = responseData['mainres']['rep_dt'];
        let y_axis = '';
        Object.keys(responseData['mainres']).map((key) => {
            for(let i=0;i<responseData['group'].length;i++) {
                if(responseData['group'][i]['name'] == key) {
                    if(i > 0) {
                        y_axis = 'y'+(i+1);
                    }
                    let show = true;
                    let visible = true;
                    let customdata;
                    let color = ''
                    let short_name = responseData['group'][i]['short_names'];
                    customdata = parseInt(responseData['group'][i]['group_availability_code']);
                    let temp = this.makeTrace(date, responseData['mainres'][key], short_name, y_axis, show, '', visible, customdata, color);
                    dataList.push(temp);
                }
            }
        });

        Object.keys(responseData['Lower']).map((key) => {
            for(let i in responseData['group']) {
                if(responseData['group'][i]['name'] == key) {
                    let y_axis='';
                    let show = false;
                    let visible = true;
                    let customdata;
                    let color = '#000000'
                    let short_name = responseData['group'][i]['short_names'];

                    if(parseInt(responseData['group'][i]['group_availability_code']) % 10 !== 0) {
                        visible = true;
                        customdata = 'p'.concat((parseInt(responseData['group'][i]['block_number'])).toString());
                    }
                    else {
                        visible = false;
                        customdata='';
                    }
                    let temp = this.makeTraceForConfidenceInterval(date, responseData['Expected'][key], short_name, y_axis, show, '', visible, customdata, color);
                    dataList.push(temp);
                }
            }
        });
        Object.keys(responseData['Expected']).map((key) => {
            for(let i in responseData['group']) {
                if(responseData['group'][i]['name'] == key.replace('expected_', '')) {
                    let y_axis='';
                    let show = false;
                    let visible = true;
                    let customdata;
                    let color = '#000000'
                    let short_name = responseData['group'][i]['short_names'];
                    let fill = 'tonexty';
                    let fillcolor = 'rgba(68, 68, 68, 0.3)';
                    customdata = parseInt(responseData['group'][i]['group_availability_code']);
                    let temp = this.makeTrace(date, responseData['Expected'][key], short_name, y_axis, show, '', visible, customdata, color, fill, fillcolor);
                    dataList.push(temp);
                }
            }
        });

        Object.keys(responseData['Upper']).map((key) => {
            for(let i in responseData['group']) {
                if(responseData['group'][i]['name'] == key) {
                    let y_axis='';
                    let show = false;
                    let visible = true;
                    let customdata;
                    let color = '#000000'
                    let short_name = responseData['group'][i]['short_names'];
                    let fill = 'tonexty';
                    let fillcolor = 'rgba(68, 68, 68, 0.3)';

                    if(parseInt(responseData['group'][i]['group_availability_code']) % 10 !== 0) {
                        visible = true;
                        customdata = 'p'.concat((parseInt(responseData['group'][i]['block_number'])).toString());
                    }
                    else {
                        visible = false;
                        customdata='';
                    }
                    let temp = this.makeTraceForConfidenceInterval(date, responseData['Expected'][key], short_name, y_axis, show, '', visible, customdata, color, fill, fillcolor);
                    dataList.push(temp);
                }
            }
        });
        // console.log("MULTI AXIS DATALIST", dataList);
        return dataList;
    }

    makeDataListForDryDock(responseData) {
        // Function to create the list of traces for intervention analysis by looping
        // through the data and calling the `makeTrace` function.
        let dataList = [];
        let date = responseData['Evaluation Data']['rep_dt'];
        let yaxis = '';
        let show = false;
        let visible = true;
        let temp;
        Object.keys(responseData['Evaluation Data']).map(key => {
            if(key !== 'rep_dt') {
                for(let i=0;i<responseData['Group'].length;i++) {
                    if(responseData['Group'][i]['identifier'] === key) {
                        let short_name = responseData['Group'][i]['short_name'];
                        let legendgroup = responseData['Group'][i]['block_number']
                        let color;
                        if(responseData['Group'][i]['block_number'] === 1) {
                            yaxis = 'y'
                        }
                        else {
                            yaxis = 'y'+responseData['Group'][i]['block_number'].toString()
                        }
                        // if(key === 'main_fuel_per_dst_pred' || key === 'main_fuel_per_dst_loss') {
                        //     color = '#8E9EB2'
                        // }
                        // else if(key === 'main_fuel_per_dst_loss_avg') {
                        //     color = 'black'
                        // }
                        // else if(key === 'pwr_pred' || key === 'pwr_loss') {
                        //     color = '#4974A5'
                        // }
                        // else if(key === 'pwr_loss_avg') {
                        //     color = 'black'
                        // }
                        // else if(key === 'speed_stw_calc_pred' || key === 'speed_stw_calc_loss') {
                        //     color = '#7A49A5'
                        // }
                        // else if(key === 'speed_stw_calc_loss_avg') {
                        //     color = 'black'
                        // }
                        // else if(key === 'pwr_pred') {
                        //     color = 'brown'
                        // }
                        // else if(key === 'main_fuel_per_dst_pred') {
                        //     color = 'brown'
                        // }
                        // else if(key === 'speed_stw_calc_pred') {
                        //     color = 'brown'
                        // }
                        // else if(key === 'pwr_second_pred') {
                        //     color = '#2AA5A5'
                        // }
                        // else if(key === 'speed_stw_calc_third_pred') {
                        //     color = '#2AA5A5'
                        // }
                        // else if(key === 'main_fuel_per_dst_third_pred') {
                        //     color = '#2AA5A5'
                        // }
                        /* New Dry Dock Process */
                        if(key === 'main_fuel_per_dst_rise') {
                            console.log("COLOR!!!!!!")
                            color = '#8E9EB2'
                        }
                        else if(key === 'main_fuel_per_dst_rise_avg') {
                            color = 'black'
                        }
                        else if(key === 'pwr_loss') {
                            color = '#4974A5'
                        }
                        else if(key === 'pwr_loss_avg') {
                            color = 'black'
                        }
                        else if(key === 'speed_stw_calc_loss') {
                            color = '#7A49A5'
                        }
                        else if(key === 'speed_stw_calc_loss_avg') {
                            color = 'black'
                        }
                        else if(key === 'pwr_pred_eval_data') {
                            color = 'brown'
                        }
                        else if(key === 'main_fuel_per_dst_pred_eval_data') {
                            color = 'brown'
                        }
                        else if(key === 'speed_stw_calc_fourth_pred_eval_data') {
                            color = 'brown'
                        }
                        else if(key === 'pwr_second_pred_ref_data') {
                            color = '#2AA5A5'
                        }
                        else if(key === 'speed_stw_calc_third_pred_ref_data') {
                            color = '#2AA5A5'
                        }
                        else if(key === 'main_fuel_per_dst_second_pred_ref_data') {
                            color = '#2AA5A5'
                        }
                        // else if(key === 'main_fuel_per_dst_third_pred_ref_data') {
                        //     color = '#2AA5A5'
                        // }
                        

                        temp = this.makeTrace(
                            date, responseData['Evaluation Data'][key], short_name,
                            short_name, yaxis, show, legendgroup,
                            visible, '', color
                        )
                        dataList.push(temp);
                        // if(key.includes('loss')) {
                        //     // yaxis = 'y2'
                        //     // let short_name = responseData['Short Names'][key.replace('_loss', '')] + ' Loss';
                        //     temp = this.makeTrace(
                        //         date, responseData['Evaluation Data'][key], short_name,
                        //         short_name, yaxis, show, '',
                        //         visible
                        //     )
                        //     dataList.push(temp);
                        // }
                        // else if(key.includes('pred') && key.includes('second')) {
                        //     // yaxis='y';
                        //     // let short_name = responseData['Short Names'][key.replace('_pred', '')] + ' based on evaluation data';
                        //     temp = this.makeTrace(
                        //         date, responseData['Evaluation Data'][key], short_name,
                        //         short_name, yaxis, show, '',
                        //         visible
                        //     )
                        //     dataList.push(temp);
                        // }
                        // else if(key.includes('avg')) {
                        //     // yaxis='y';
                        //     // let short_name = responseData['Short Names'][key.replace('_pred', '')] + ' based on evaluation data';
                        //     temp = this.makeTrace(
                        //         date, responseData['Evaluation Data'][key], short_name,
                        //         short_name, yaxis, show, '',
                        //         visible
                        //     )
                        //     dataList.push(temp);
                        // }
                        // else {
                        //     // yaxis='y';
                        //     // let short_name = responseData['Short Names'][key.replace('_second_pred', '')] + ' based on reference data';
                        //     temp = this.makeTrace(
                        //         date, responseData['Evaluation Data'][key], short_name,
                        //         short_name, yaxis, show, '',
                        //         visible
                        //     )
                        //     dataList.push(temp);
                        // }
                    }
                }
                // if(key.includes('loss')) {
                //     yaxis = 'y2'
                //     let short_name = responseData['Short Names'][key.replace('_loss', '')] + ' Loss';
                //     temp = this.makeTrace(
                //         date, responseData['Evaluation Data'][key], short_name,
                //         short_name, yaxis, show, 'loss',
                //         visible
                //     )
                //     dataList.push(temp);
                // }
                // else if(key.includes('pred') && !key.includes('second')) {
                //     yaxis='y';
                //     let short_name = responseData['Short Names'][key.replace('_pred', '')] + ' based on evaluation data';
                //     temp = this.makeTrace(
                //         date, responseData['Evaluation Data'][key], short_name,
                //         short_name, yaxis, show, 'pred',
                //         visible
                //     )
                //     dataList.push(temp);
                // }
                // else {
                //     yaxis='y';
                //     let short_name = responseData['Short Names'][key.replace('_second_pred', '')] + ' based on reference data';
                //     temp = this.makeTrace(
                //         date, responseData['Evaluation Data'][key], short_name,
                //         short_name, yaxis, show, 'spred',
                //         visible
                //     )
                //     dataList.push(temp);
                // }
            }
        })

        return dataList;
    }

    makeHoverAxesList(responseData) {
        let axesList = [];
        Object.keys(responseData['Generic']).map((key) => {
            if(key == this.props.trends.group) {
                Object.keys(responseData['Generic'][key]).map((k) => {
                    if(k.includes('1')) {
                        let temp = 'xy';
                        axesList.push(temp);
                    }
                    else {
                        let temp = 'xy'.concat(k.replace('Sub-Group ', ''));
                        axesList.push(temp);
                    }
                })
            }
        });
        return axesList
    }

    makeDictForScaling(inputData) {
        let blockList=[];
        let dataDict={};
        for(let i in inputData['group']) {
            blockList.push(inputData['group'][i]['block_number']);
        }
        let max = Math.max(...blockList);
        for(let i=1;i<=max;i++) {
            dataDict[i] = {}
        }

        return dataDict
    }

    makeDataForYAxisScaling(startDate, endDate, data, dataDict) {
        let dataList = [];
        let startIndex;
        let endIndex;
        for(let i=0;i<data.length;i++) {
            let y_var=[];
            let yList = data[i]['y'];
            for(let j=0;j<data[i]['x'].length;j++) {
                if(data[i]['x'][j] === startDate) {
                    startIndex = j;
                }
                if(data[i]['x'][j] === endDate) {
                    endIndex = j
                }
            }
            for(let k=0;k<data[i]['y'].length;k++) {
                if(k < startIndex || k > endIndex) {
                    try {
                        yList.splice(k, 1);
                    }
                    catch(err) {
                        break;
                    }
                }
            }
            dataDict[data[i]['legendgroup']].push(yList);
        }
        return dataDict;
    }

    // findClosestFutureDate = (arr, target) => {
    //     let targetDate = new Date(target);
    //     // Filter only those dates that come after target date
    //     let previousDates = arr.filter(e => ( targetDate  - new Date(e)) < 0)
    //     console.log(previousDates)
    //     let sortedPreviousDates =  previousDates.filter((a,b) => new Date(a) - new Date(b))
    //     return sortedPreviousDates[0] || null
    // }


    initChart(inputData, dry_dock=false) {
        // Chart initialization function. Calls the functions:
        // `makeLayout`, `makeDataList`. Also plots the chart to the specific div element
        console.log(inputData);
        let minDate;
        let maxDate;
        let layout;
        let config;
        let dList
        var traceText=[];
        var newList=[];
        let customData;
        let noonOrLogs = this.props.trends.noonorlogs;
        let subgroupNamesKeys = dry_dock === false ? Object.keys(inputData['Subgroup Dictionary']) : inputData['Subgroup Names']
        let myPlot = document.getElementById('chartdiv');
        let selector = noonOrLogs === 'logs' ? selectorOptions : undefined
        let tickformat = noonOrLogs === 'logs' ? tickFormatStops : undefined

        console.log("input", inputData);
        // mindate = date.reduce(function (a, b) { return a < b ? a : b; });
        // maxDate = date.reduce(function (a, b) { return a > b ? a : b; });
        // console.log("Min & Max"+ minDate + " & " + maxDate);

        if(dry_dock === false) {
            if(this.props.trends.group.includes('Multi Axis')) {
                dList = this.makeDataListForMultiAxis(inputData);
    
                layout = this.makeLayoutForMultiAxis(inputData);
            }
            else {
                dList = this.makeDataList(inputData);
    
                layout = this.makeLayout(inputData);
            }
        }
        else {
            dList = this.makeDataListForDryDock(inputData);
    
            layout = this.makeLayout(inputData, dry_dock);
        }
        
        console.log("DATA LIST", dList);

        config = {
            responsive: true,
            showSendToCloud: true,
            // useResizeHandler: true
        }

        let x_start;
        let x_end;
        
        let blockList=[];
        if(dry_dock === false) {
            for(let i in inputData['group']) {
                if(blockList.includes(inputData['group'][i]['block_number']) == false) {
                    blockList.push(inputData['group'][i]['block_number']);
                }
            }
        }
        else {
            for(let i in inputData['Group']) {
                if(blockList.includes(inputData['Group'][i]['block_number']) == false) {
                    blockList.push(inputData['Group'][i]['block_number']);
                }
            }
        }
        
        let maxBlock = Math.max(...blockList);
        // let dataDict = this.makeDictForScaling(inputData);
        let domainDict={};
        let step = 1/maxBlock
        let Num1=0;
        let Num2 = step;
        let i = 0
        while(i < maxBlock) {
            if(i == 0) {
                domainDict[i+1] = [Num1, Num2]
                Num1 = Num2;
                Num2 = Num2 + step
                i = i + 1
            }
            else {
                domainDict[i+1] = [Num1, Num2]
                Num1 = Num2;
                Num2 = Num2 + step;
                i = i + 1
            }
        }
        Plotly.newPlot(myPlot, dList, layout, config).then(() => {
            // Code to resize the Y-axis range to set the Y-axis min and
            // max according to the range selection.
            // ['2016-10-12', '2016-12-13']
            // x_start = '2016-10-12'
            // x_start = '2021-09-05 00:00:00'
            // x_end = '2016-12-13'
            // x_end = '2021-12-03 12:00:00'
            if(noonOrLogs !== 'logs') {
                // x_start and x_end shows last 150 days of data intitally range slider
                x_start = 'mainres' in inputData ? inputData['mainres']['rep_dt'][(inputData['mainres']['rep_dt']).length - 150] : inputData['Evaluation Data']['rep_dt'][0]
                x_end = 'mainres' in inputData ? inputData['mainres']['rep_dt'][(inputData['mainres']['rep_dt']).length - 1] : inputData['Evaluation Data']['rep_dt'][(inputData['Evaluation Data']['rep_dt']).length - 1]

                x_start = noonOrLogs === 'logs' ? moment(x_start).format('YYYY-MM-DD HH:mm:ss') : moment(x_start).format('YYYY-MM-DD');
                x_end = noonOrLogs === 'logs' ? moment(x_end).format('YYYY-MM-DD HH:mm:ss') : moment(x_end).format('YYYY-MM-DD');

                let startIndex;
                let endIndex;
                // let dataDictionary = dataDict
                let rangeDict={}
                let layout_update={};
                console.log("DATA", myPlot.data);
                for(let j=0;j<blockList.length;j++) {
                    let y_var=[];
                    let min = null;
                    let max = null;


                    // let yaxis = 'yaxis';
                    // console.log("START DATE", x_start)
                    for(let i=0;i<myPlot.data.length;i++) {
                        if(myPlot.data[i]['legendgroup'] == blockList[j]) {
                            for(let num=0;num<myPlot.data[i].x.length;num++) {
                                if(myPlot.data[i].x[num] == x_start) {
                                    console.log("DATE", myPlot.data[i].x[num])
                                    startIndex = num
                                }
                                if(myPlot.data[i].x[num] == x_end) {
                                    console.log("DATE", myPlot.data[i].x[num])
                                    endIndex = num
                                }
                            }
                            console.log("INDEX", startIndex, endIndex)
                            if(startIndex < 0) {
                                startIndex = 0
                            }

                            let tempList = myPlot.data[i].y.slice(startIndex, endIndex+1)
                            console.log("TEMP", tempList)
                            let actualList = tempList.filter(num => num !== null)
                            console.log("ACTUAL", actualList)

                            if(min === null) {
                                min = Math.min(...actualList)
                            }
                            else {
                                let temp = min;
                                min = Math.min(...actualList) < min ? Math.min(...actualList) : temp
                            }
                            if(max === null) {
                                max = Math.max(...actualList)
                            }
                            else {
                                let temp = max;
                                max = Math.max(...actualList) > max ? Math.max(...actualList) : temp
                            }
                            console.log("MIN AND MAX", min, max, "SUB GROUP", myPlot.data[i]['legendgroup'])
                            rangeDict[blockList[j]] = dry_dock === false ? [min,max] : blockList[j] > 3 ? [0, max] : [min, max]
                            
                        }
                        
                        
                    }
                    // break
                    
                }
                console.log("RANGE DICT", rangeDict)
                Object.keys(rangeDict).map(key => {
                    let strKey = key.toString();
                    let yaxis = 'yaxis';
                    let colorList = ['#b7b700', '#0000e5'];
                    let tickColor;
                    let subgroupName = dry_dock === false ? subgroupNamesKeys[key-1] : subgroupNamesKeys[key-1];
                    if(key % 2 == 0) {
                        tickColor = colorList[0];
                    }
                    else {
                        tickColor = colorList[1];
                    }
                    if(key > 1) {
                        yaxis = 'yaxis'.concat(strKey);
                        layout_update[yaxis] = {
                            range: rangeDict[key],
                            // domain: [Num1, Num2],
                            domain: domainDict[key],
                            // title: 'Sub-Group '+strKey,
                            title:subgroupName,
                            // range: [min, max],
                            // autorange: true,
                            // fixedrange: false,
                            // automargin: true,
                            rangemode: dry_dock === true ? 'tozero' : "normal",
                            showspikes: true,
                            spikemode: 'across',
                            spikethickness: 1,
                            spikesnap: 'cursor',
                            showline: true,
                            showgrid: true,
                            tickfont: {
                                color: tickColor
                            }
                        }
                    }
                    else {
                        layout_update[yaxis] = {
                            range: rangeDict[key],
                            // domain: [Num1, Num2],
                            domain: domainDict[key],
                            // title: 'Sub-Group '+strKey,
                            title:subgroupName,
                            // range: [min, max],
                            // autorange: true,
                            // fixedrange: false,
                            // automargin: true,
                            rangemode: dry_dock === true ? 'tozero' : "normal",
                            showspikes: true,
                            spikemode: 'across',
                            spikethickness: 1,
                            spikesnap: 'cursor',
                            showline: true,
                            showgrid: true,
                            tickfont: {
                                color: colorList[1]
                            }
                        }
                    }
                })
                // Plotly.relayout('chartdiv', layout_update);
                Plotly.update('chartdiv', {}, layout_update)
                myPlot.on('plotly_relayout', function(eventdata) {
                    // if(isUnderRelayout != true) {
                        // isUnderRelayout = true;
                    console.log("DRY DOCK EVENTDATA", eventdata)
                    let temp_layout = myPlot.layout;
                    // console.log("temp_layoutt",temp_layout);
                    // console.log("temp_layoutt range",typeof new Date(moment(temp_layout['xaxis']['range'][0]).format('YYYY-MM-DD')));
                    // console.log("temp_layoutt range",temp_layout['xaxis']['range'][1]);
                    x_start = temp_layout['xaxis']['range'][0]
                    x_end = temp_layout['xaxis']['range'][1]

                    x_start = noonOrLogs === 'logs' ? moment(x_start).format('YYYY-MM-DD HH:mm:ss') : moment(x_start).format('YYYY-MM-DD');
                    x_end = noonOrLogs === 'logs' ? moment(x_end).format('YYYY-MM-DD HH:mm:ss') : moment(x_end).format('YYYY-MM-DD');

                    // console.log("START DATE AND END DATE!!!!!!!!!!", x_start, x_end)
                    let startIndex;
                    let endIndex;
                    // let dataDictionary = dataDict
                    let rangeDict={}
                    let layout_update={};
                    const findClosestFutureDate = (arr, target) => {
                        let targetDate = new Date(target);
                        // Filter only those dates that come after target date
                        let previousDates = arr.filter(e => ( targetDate  - new Date(e)) < 0)
                        // console.log(previousDates)
                        let sortedPreviousDates =  previousDates.filter((a,b) => new Date(a) - new Date(b))
                        return sortedPreviousDates[0] || null
                    }

                    for(let j=0;j<blockList.length;j++) {
                        let y_var=[];
                        let min = null;
                        let max = null;

                        // let yaxis = 'yaxis';
                        // console.log("START DATE", x_start)
                        for(let i=0;i<myPlot.data.length;i++) {
                            if(myPlot.data[i]['legendgroup'] == blockList[j]) {
                                let closestStartDate = findClosestFutureDate(myPlot.data[i].x, x_start);
                                let closestEndDate = findClosestFutureDate(myPlot.data[i].x, x_end);
                                for(let num=0;num<myPlot.data[i].x.length;num++) {
                                    if(myPlot.data[i].x[num] == closestStartDate) {
                                        console.log("START DATE", myPlot.data[i].x[num])
                                        startIndex = num
                                    }
                                    if(myPlot.data[i].x[num] == closestEndDate) {
                                        console.log("END DATE", myPlot.data[i].x[num])
                                        endIndex = num
                                    }
                                }
                                console.log("INDEX", startIndex, endIndex)
                                if(startIndex < 0 || startIndex === null) {
                                    startIndex = 0
                                }
                                if(endIndex === null || endIndex === undefined) {
                                    endIndex = myPlot.data[i].x.length - 1
                                }

                                let tempList = myPlot.data[i].y.slice(startIndex, endIndex+1)
                                console.log("TEMP", tempList)
                                let actualList = tempList.filter(num => num !== null)
                                console.log("ACTUAL", actualList)

                                if(min === null) {
                                    min = Math.min(...actualList)
                                }
                                else {
                                    let temp = min;
                                    min = Math.min(...actualList) < min ? Math.min(...actualList) : temp
                                }
                                if(max === null) {
                                    max = Math.max(...actualList)
                                }
                                else {
                                    let temp = max;
                                    max = Math.max(...actualList) > max ? Math.max(...actualList) : temp
                                }
                                console.log("MIN AND MAX", min, max, "SUB GROUP", myPlot.data[i]['legendgroup'])
                                rangeDict[blockList[j]] = dry_dock === false ? [min,max] : blockList[j] > 3 ? [0, max] : [min, max]
                                
                            }
                            
                            
                        }
                        // break
                        
                    }
                    console.log("RANGE DICT", rangeDict)
                    Object.keys(rangeDict).map(key => {
                        let strKey = key.toString();
                        let yaxis = 'yaxis';
                        let colorList = ['#b7b700', '#0000e5'];
                        let subgroupName = dry_dock === false ? subgroupNamesKeys[key-1] : subgroupNamesKeys[key-1];
                        let tickColor;
                        if(key % 2 == 0) {
                            tickColor = colorList[0];
                        }
                        else {
                            tickColor = colorList[1];
                        }
                        if(key > 1) {
                            yaxis = 'yaxis'.concat(strKey);
                            layout_update[yaxis] = {
                                range: rangeDict[key],
                                // domain: [Num1, Num2],
                                domain: domainDict[key],
                                // title: 'Sub-Group '+strKey,
                                title:subgroupName,
                                // range: [min, max],
                                // autorange: true,
                                // fixedrange: false,
                                // automargin: true,
                                rangemode: dry_dock === true ? 'tozero' : "normal",
                                showspikes: true,
                                spikemode: 'across',
                                spikethickness: 1,
                                spikesnap: 'cursor',
                                showline: true,
                                showgrid: true,
                                tickfont: {
                                    color: tickColor
                                }
                            }
                        }
                        else {
                            layout_update[yaxis] = {
                                range: rangeDict[key],
                                // domain: [Num1, Num2],
                                domain: domainDict[key],
                                // title: 'Sub-Group '+strKey,
                                title:subgroupName,
                                // range: [min, max],
                                // autorange: true,
                                // fixedrange: false,
                                // automargin: true,
                                rangemode: dry_dock === true ? 'tozero' : "normal",
                                showspikes: true,
                                spikemode: 'across',
                                spikethickness: 1,
                                spikesnap: 'cursor',
                                showline: true,
                                showgrid: true,
                                tickfont: {
                                    color: colorList[1]
                                }
                            }
                        }
                    })
                    // Plotly.relayout('chartdiv', layout_update);
                    Plotly.update('chartdiv', {}, layout_update)
                    // }
                    // else {
                    //     isUnderRelayout = false;
                    // }
                })
            }
            else {
                let index_of_end_date;

                for(let i=inputData['mainres']['rep_dt'].length-1;i>-1;i--) {
                    for(let j=i-1;j>-1;j--) {
                        let startDate = inputData['mainres']['rep_dt'][i].split('-');
                        let endDate = inputData['mainres']['rep_dt'][j].split('-');

                        let day_with_timestamp_1 = startDate[2].split(" ")
                        let day_with_timestamp_2 = endDate[2].split(" ")
                        startDate.pop()
                        endDate.pop()
                        startDate.push(day_with_timestamp_1[0]);
                        endDate.push(day_with_timestamp_2[0]);

                        let newDateNumberList1 = startDate.map(Number)
                        let newDateNumberList2 = endDate.map(Number)

                        let momentDate1 = moment(newDateNumberList1, 'YYYY-MM-DD');
                        let momentDate2 = moment(newDateNumberList2, 'YYYY-MM-DD');
                        console.log(Math.abs(momentDate1.diff(momentDate2, 'days')))
                        if(Math.abs(momentDate1.diff(momentDate2, 'days')) === 1 && inputData['mainres']['rep_dt'][j].includes('12:')) {
                            index_of_end_date = j
                            break;
                        }
                    }
                    break;
                }
                console.log(index_of_end_date, inputData['mainres']['rep_dt'][index_of_end_date])

                let layout_update = {
                    'xaxis': {
                        title: 'Date',
                        type: 'date',
                        tickmode: 'linear',
                        tick0: inputData['mainres']['rep_dt'][index_of_end_date],
                        dtick: 14400000,
                        tickformatstops: tickFormatStops,
                        range: [inputData['mainres']['rep_dt'][index_of_end_date], inputData['mainres']['rep_dt'][inputData['mainres']['rep_dt'].length - 1]],
                        rangeselector: selectorOptions,
                        // rangeslider: {},
                        showspikes: true,
                        spikemode: 'across',
                        spikethickness: 1,
                        spikesnap: 'cursor',
                        showline: true,
                        showgrid: true,
                    }
                }

                Plotly.update('chartdiv', {}, layout_update)
            }
            // x_start = inputData['mainres']['rep_dt'][(inputData['mainres']['rep_dt']).length - 61]
            // x_end = inputData['mainres']['rep_dt'][(inputData['mainres']['rep_dt']).length - 1]

            // x_start = noonOrLogs === 'logs' ? moment(x_start).format('YYYY-MM-DD HH:mm:ss') : moment(x_start).format('YYYY-MM-DD');
            // x_end = noonOrLogs === 'logs' ? moment(x_end).format('YYYY-MM-DD HH:mm:ss') : moment(x_end).format('YYYY-MM-DD');

            // let startIndex;
            // let endIndex;
            // // let dataDictionary = dataDict
            // let rangeDict={}
            // let layout_update={};
            // console.log("DATA", myPlot.data);
            // for(let j=0;j<blockList.length;j++) {
            //     let y_var=[];
            //     let min = null;
            //     let max = null;


            //     // let yaxis = 'yaxis';
            //     // console.log("START DATE", x_start)
            //     for(let i=0;i<myPlot.data.length;i++) {
            //         if(myPlot.data[i]['legendgroup'] == blockList[j]) {
            //             for(let num=0;num<myPlot.data[i].x.length;num++) {
            //                 if(myPlot.data[i].x[num] == x_start) {
            //                     console.log("DATE", myPlot.data[i].x[num])
            //                     startIndex = num
            //                 }
            //                 if(myPlot.data[i].x[num] == x_end) {
            //                     console.log("DATE", myPlot.data[i].x[num])
            //                     endIndex = num
            //                 }
            //             }
            //             console.log("INDEX", startIndex, endIndex)
            //             if(startIndex < 0) {
            //                 startIndex = 0
            //             }

            //             let tempList = myPlot.data[i].y.slice(startIndex, endIndex+1)
            //             console.log("TEMP", tempList)
            //             let actualList = tempList.filter(num => num !== null)
            //             console.log("ACTUAL", actualList)

            //             if(min === null) {
            //                 min = Math.min(...actualList)
            //             }
            //             else {
            //                 let temp = min;
            //                 min = Math.min(...actualList) < min ? Math.min(...actualList) : temp
            //             }
            //             if(max === null) {
            //                 max = Math.max(...actualList)
            //             }
            //             else {
            //                 let temp = max;
            //                 max = Math.max(...actualList) > max ? Math.max(...actualList) : temp
            //             }
            //             console.log("MIN AND MAX", min, max, "SUB GROUP", myPlot.data[i]['legendgroup'])
            //             rangeDict[blockList[j]] = [min,max]
                        
            //         }
                    
                    
            //     }
            //     // break
                
            // }
            // console.log("RANGE DICT", rangeDict)
            // Object.keys(rangeDict).map(key => {
            //     let strKey = key.toString();
            //     let yaxis = 'yaxis';
            //     let colorList = ['#b7b700', '#0000e5'];
            //     let tickColor;
            //     let subgroupName = subgroupNamesKeys[key-1];
            //     if(key % 2 == 0) {
            //         tickColor = colorList[0];
            //     }
            //     else {
            //         tickColor = colorList[1];
            //     }
            //     if(key > 1) {
            //         yaxis = 'yaxis'.concat(strKey);
            //         layout_update[yaxis] = {
            //             range: rangeDict[key],
            //             // domain: [Num1, Num2],
            //             domain: domainDict[key],
            //             // title: 'Sub-Group '+strKey,
            //             title: subgroupName,
            //             // range: [min, max],
            //             // autorange: true,
            //             // fixedrange: false,
            //             // automargin: true,
            //             // rangemode: 'tozero',
            //             showspikes: true,
            //             spikemode: 'across',
            //             spikethickness: 1,
            //             spikesnap: 'cursor',
            //             showline: true,
            //             showgrid: true,
            //             tickfont: {
            //                 color: tickColor
            //             }
            //         }
            //     }
            //     else {
            //         layout_update[yaxis] = {
            //             range: rangeDict[key],
            //             // domain: [Num1, Num2],
            //             domain: domainDict[key],
            //             // title: 'Sub-Group '+strKey,
            //             title: subgroupName,
            //             // range: [min, max],
            //             // autorange: true,
            //             // fixedrange: false,
            //             // automargin: true,
            //             // rangemode: 'tozero',
            //             showspikes: true,
            //             spikemode: 'across',
            //             spikethickness: 1,
            //             spikesnap: 'cursor',
            //             showline: true,
            //             showgrid: true,
            //             tickfont: {
            //                 color: colorList[1]
            //             }
            //         }
            //     }
            // })
            // Plotly.relayout('chartdiv', layout_update);
            // myPlot.on('plotly_relayout', function(eventdata) {
            //     // if(isUnderRelayout != true) {
            //         // isUnderRelayout = true;
    
            //     x_start = eventdata['xaxis.range'][0]
            //     x_end = eventdata['xaxis.range'][1]

            //     x_start = noonOrLogs === 'logs' ? moment(x_start).format('YYYY-MM-DD HH:mm:ss') : moment(x_start).format('YYYY-MM-DD');
            //     x_end = noonOrLogs === 'logs' ? moment(x_end).format('YYYY-MM-DD HH:mm:ss') : moment(x_end).format('YYYY-MM-DD');

            //     // console.log("START DATE AND END DATE!!!!!!!!!!", x_start, x_end)
            //     let startIndex;
            //     let endIndex;
            //     // let dataDictionary = dataDict
            //     let rangeDict={}
            //     let layout_update={};
            //     const findClosestFutureDate = (arr, target) => {
            //         let targetDate = new Date(target);
            //         // Filter only those dates that come after target date
            //         let previousDates = arr.filter(e => ( targetDate  - new Date(e)) < 0)
            //         // console.log(previousDates)
            //         let sortedPreviousDates =  previousDates.filter((a,b) => new Date(a) - new Date(b))
            //         return sortedPreviousDates[0] || null
            //     }
            //     console.log("DATA", myPlot.data);
            //     for(let j=0;j<blockList.length;j++) {
            //         let y_var=[];
            //         let min = null;
            //         let max = null;

            //         // let yaxis = 'yaxis';
            //         // console.log("START DATE", x_start)
            //         for(let i=0;i<myPlot.data.length;i++) {
            //             if(myPlot.data[i]['legendgroup'] == blockList[j]) {
            //                 let closestStartDate = findClosestFutureDate(myPlot.data[i].x, x_start);
            //                 let closestEndDate = findClosestFutureDate(myPlot.data[i].x, x_end);
            //                 for(let num=0;num<myPlot.data[i].x.length;num++) {
            //                     if(myPlot.data[i].x[num] == closestStartDate) {
            //                         console.log("START DATE", myPlot.data[i].x[num])
            //                         startIndex = num
            //                     }
            //                     if(myPlot.data[i].x[num] == closestEndDate) {
            //                         console.log("END DATE", myPlot.data[i].x[num])
            //                         endIndex = num
            //                     }
            //                 }
            //                 console.log("INDEX", startIndex, endIndex)
            //                 if(startIndex < 0 || startIndex === null) {
            //                     startIndex = 0
            //                 }
            //                 if(endIndex === null || endIndex === undefined) {
            //                     endIndex = myPlot.data[i].x.length - 1
            //                 }

            //                 let tempList = myPlot.data[i].y.slice(startIndex, endIndex+1)
            //                 console.log("TEMP", tempList)
            //                 let actualList = tempList.filter(num => num !== null)
            //                 console.log("ACTUAL", actualList)

            //                 if(min === null) {
            //                     min = Math.min(...actualList)
            //                 }
            //                 else {
            //                     let temp = min;
            //                     min = Math.min(...actualList) < min ? Math.min(...actualList) : temp
            //                 }
            //                 if(max === null) {
            //                     max = Math.max(...actualList)
            //                 }
            //                 else {
            //                     let temp = max;
            //                     max = Math.max(...actualList) > max ? Math.max(...actualList) : temp
            //                 }
            //                 console.log("MIN AND MAX", min, max, "SUB GROUP", myPlot.data[i]['legendgroup'])
            //                 rangeDict[blockList[j]] = [min,max]
                            
            //             }
                        
                        
            //         }
            //         // break
                    
            //     }
            //     console.log("RANGE DICT", rangeDict)
            //     Object.keys(rangeDict).map(key => {
            //         let strKey = key.toString();
            //         let yaxis = 'yaxis';
            //         let colorList = ['#b7b700', '#0000e5'];
            //         let subgroupName = subgroupNamesKeys[key-1];
            //         let tickColor;
            //         if(key % 2 == 0) {
            //             tickColor = colorList[0];
            //         }
            //         else {
            //             tickColor = colorList[1];
            //         }
            //         if(key > 1) {
            //             yaxis = 'yaxis'.concat(strKey);
            //             layout_update[yaxis] = {
            //                 range: rangeDict[key],
            //                 // domain: [Num1, Num2],
            //                 domain: domainDict[key],
            //                 // title: 'Sub-Group '+strKey,
            //                 title: subgroupName,
            //                 // range: [min, max],
            //                 // autorange: true,
            //                 // fixedrange: false,
            //                 // automargin: true,
            //                 // rangemode: 'tozero',
            //                 showspikes: true,
            //                 spikemode: 'across',
            //                 spikethickness: 1,
            //                 spikesnap: 'cursor',
            //                 showline: true,
            //                 showgrid: true,
            //                 tickfont: {
            //                     color: tickColor
            //                 }
            //             }
            //         }
            //         else {
            //             layout_update[yaxis] = {
            //                 range: rangeDict[key],
            //                 // domain: [Num1, Num2],
            //                 domain: domainDict[key],
            //                 // title: 'Sub-Group '+strKey,
            //                 title: subgroupName,
            //                 // range: [min, max],
            //                 // autorange: true,
            //                 // fixedrange: false,
            //                 // automargin: true,
            //                 // rangemode: 'tozero',
            //                 showspikes: true,
            //                 spikemode: 'across',
            //                 spikethickness: 1,
            //                 spikesnap: 'cursor',
            //                 showline: true,
            //                 showgrid: true,
            //                 tickfont: {
            //                     color: colorList[1]
            //                 }
            //             }
            //         }
            //     })
            //     Plotly.relayout('chartdiv', layout_update);
            //     // }
            //     // else {
            //     //     isUnderRelayout = false;
            //     // }
            // })
        })
        if(noonOrLogs === 'logs') {
            let layout_update_for_ticks = {};
            myPlot.on('plotly_relayout', function(data) {
                console.log("DATA!!!!!!!!!!!!!!", data);
                let newDate1 = data['xaxis.range[0]'].split('-');
                let newDate2 = data['xaxis.range[1]'].split('-');

                // // Last element of the above arrays has the day component of the dates
                // // along with the timestamp component, which gives an Invalid date when
                // // passed through the moment constructor
                let day_with_timestamp_1 = newDate1[2].split(" ")
                let day_with_timestamp_2 = newDate2[2].split(" ")
                newDate1.pop()
                newDate2.pop()
                newDate1.push(day_with_timestamp_1[0]);
                newDate2.push(day_with_timestamp_2[0]);

                let newDateNumberList1 = newDate1.map(Number)
                let newDateNumberList2 = newDate2.map(Number)

                let momentDate1 = moment(newDateNumberList1, 'YYYY-MM-DD');
                let momentDate2 = moment(newDateNumberList2, 'YYYY-MM-DD');
                
                // console.log("datennumberlist1", newDateNumberList1);
                // console.log("datenumberlist2", newDateNumberList2);
                // console.log("2!!!!!!!!!!!!!!!!!!!!!!!", momentDate2);
                // console.log("1!!!!!!!!!!!!!!!!!!!!!!!", momentDate1);
                let newDtick;
                // 1 Day selected in selectorOptions
                // if(parseInt(newDateNumberList2[2]) - parseInt(newDateNumberList1[2]) === 1) {
                if(Math.abs(momentDate2.diff(momentDate1, 'days')) === 1) {
                    console.log("YES IT IS!!!!!!");
                    newDtick = 14400000;

                    layout_update_for_ticks['xaxis'] = {
                        title: 'Date',
                        type: 'date',
                        tickmode: 'linear',
                        tick0: data['xaxis.range[0]'],
                        dtick: newDtick,
                        tickformatstops: tickFormatStops,
                        range: [data['xaxis.range[0]'], data['xaxis.range[1]']],
                        rangeselector: selectorOptions,
                        // rangeslider: {},
                        showspikes: true,
                        spikemode: 'across',
                        spikethickness: 1,
                        spikesnap: 'cursor',
                        showline: true,
                        showgrid: true,
                    }
                    Plotly.relayout('chartdiv', layout_update_for_ticks);
                }
                // 1 Week selected in selectorOptions
                // else if(parseInt(newDateNumberList2[2]) - parseInt(newDateNumberList1[2]) === 7) {
                else if(Math.abs(momentDate2.diff(momentDate1, 'days')) === 7) {
                    console.log("YES IT IS!!!!!!");
                    newDtick = 86400000;

                    layout_update_for_ticks['xaxis'] = {
                        title: 'Date',
                        type: 'date',
                        tickmode: 'linear',
                        tick0: data['xaxis.range[0]'],
                        dtick: newDtick,
                        tickformatstops: tickFormatStops,
                        range: [data['xaxis.range[0]'], data['xaxis.range[1]']],
                        rangeselector: selectorOptions,
                        // rangeslider: {},
                        showspikes: true,
                        spikemode: 'across',
                        spikethickness: 1,
                        spikesnap: 'cursor',
                        showline: true,
                        showgrid: true,
                    }
                    Plotly.relayout('chartdiv', layout_update_for_ticks);
                }
                // 1 Month selected in selectorOptions
                // else if(parseInt(newDateNumberList2[1]) - parseInt(newDateNumberList1[1]) === 1) {
                else if(Math.abs(momentDate2.diff(momentDate1, 'months')) === 1) {
                    console.log("YES IT IS!!!!!!");
                    newDtick = 604800000;

                    layout_update_for_ticks['xaxis'] = {
                        title: 'Date',
                        type: 'date',
                        tickmode: 'linear',
                        tick0: data['xaxis.range[0]'],
                        dtick: newDtick,
                        tickformatstops: tickFormatStops,
                        range: [data['xaxis.range[0]'], data['xaxis.range[1]']],
                        rangeselector: selectorOptions,
                        // rangeslider: {},
                        showspikes: true,
                        spikemode: 'across',
                        spikethickness: 1,
                        spikesnap: 'cursor',
                        showline: true,
                        showgrid: true,
                    }
                    Plotly.relayout('chartdiv', layout_update_for_ticks);
                }
                // Either 3 Months or 6 Months selected in selectorOptions
                // else if((parseInt(newDateNumberList2[1]) - parseInt(newDateNumberList1[1]) === 3) || (parseInt(newDateNumberList2[1]) - parseInt(newDateNumberList1[1]) === 6)) {
                else if(Math.abs((momentDate2.diff(momentDate1, 'months')) === 3) || (Math.abs(momentDate2.diff(momentDate1, 'months')) === 6)) {
                    console.log("YES IT IS!!!!!!");
                    newDtick = 'M1';

                    layout_update_for_ticks['xaxis'] = {
                        title: 'Date',
                        type: 'date',
                        tickmode: 'linear',
                        tick0: data['xaxis.range[0]'],
                        dtick: newDtick,
                        tickformatstops: tickFormatStops,
                        range: [data['xaxis.range[0]'], data['xaxis.range[1]']],
                        rangeselector: selectorOptions,
                        // rangeslider: {},
                        showspikes: true,
                        spikemode: 'across',
                        spikethickness: 1,
                        spikesnap: 'cursor',
                        showline: true,
                        showgrid: true,
                    }
                    Plotly.relayout('chartdiv', layout_update_for_ticks);
                }
                // 1 Year selected in selectorOptions
                // else if(parseInt(newDateNumberList2[0]) - parseInt(newDateNumberList1[0]) === 1) {
                else if(Math.abs(momentDate2.diff(momentDate1, 'years')) === 1) {
                    console.log("YES IT IS!!!!!!");
                    newDtick = 'M1';

                    layout_update_for_ticks['xaxis'] = {
                        title: 'Date',
                        type: 'date',
                        tickmode: 'linear',
                        tick0: data['xaxis.range[0]'],
                        dtick: newDtick,
                        tickformatstops: tickFormatStops,
                        range: [data['xaxis.range[0]'], data['xaxis.range[1]']],
                        rangeselector: selectorOptions,
                        // rangeslider: {},
                        showspikes: true,
                        spikemode: 'across',
                        spikethickness: 1,
                        spikesnap: 'cursor',
                        showline: true,
                        showgrid: true,
                    }
                    Plotly.relayout('chartdiv', layout_update_for_ticks);
                }
                // 1 Year selected in selectorOptions
                // else if(parseInt(newDate2[0]) - parseInt(newDate1[0]) === 1) {
                //     console.log("YES IT IS!!!!!!");
                //     newDtick = 'M1';

                //     layout_update_for_ticks['xaxis'] = {
                //         title: 'Date',
                //         type: 'date',
                //         tickmode: 'linear',
                //         tick0: data['xaxis.range[0]'],
                //         dtick: newDtick,
                //         tickformatstops: tickFormatStops,
                //         range: [data['xaxis.range[0]'], data['xaxis.range[1]']],
                //         rangeselector: selectorOptions,
                //         // rangeslider: {},
                //         showspikes: true,
                //         spikemode: 'across',
                //         spikethickness: 1,
                //         spikesnap: 'cursor',
                //         showline: true,
                //         showgrid: true,
                //     }
                //     Plotly.relayout('chartdiv', layout_update_for_ticks);
                // }
                else {
                    console.log("YES IT IS!!!!!!");
                    newDtick = 'M12';

                    layout_update_for_ticks['xaxis'] = {
                        title: 'Date',
                        type: 'date',
                        tickmode: 'linear',
                        tick0: data['xaxis.range[0]'],
                        dtick: newDtick,
                        tickformatstops: tickFormatStops,
                        range: [data['xaxis.range[0]'], data['xaxis.range[1]']],
                        rangeselector: selectorOptions,
                        // rangeslider: {},
                        showspikes: true,
                        spikemode: 'across',
                        spikethickness: 1,
                        spikesnap: 'cursor',
                        showline: true,
                        showgrid: true,
                    }
                    Plotly.relayout('chartdiv', layout_update_for_ticks);
                }
            })
        }
        

        // let hoverAxesList = this.makeHoverAxesList(inputData);
        
        let temp = {};
        let tempFuelCons = {};
        let outliertemp = {};
        let mltemp = {};
        let messagetemp = {};
        let outliermessagestemp = {};
        let outliernames=[];
        let weathertemp={}
        let dry_dock_temp = {};
        // SIMULTANEOUS HOVER
        // myPlot.on('plotly_hover', function(eventdata) {
        //     let tempList=[];
        //     for(let i=0;i<dList.length;i++) {
        //         tempList.push({ curveNumber: i, pointNumber: eventdata.points[0].pointNumber });
        //     }
        //     Plotly.Fx.hover('chartdiv', tempList, hoverAxesList);
        // });

        // SETTING THE HOVERDATA TO THE TABLE
        if(dry_dock === false) {
            myPlot.on('plotly_hover', function(eventdata) {
                let x_var;
                let keys_main = Object.keys(inputData['mainres']);
                let keys_exp = Object.keys(inputData['Expected']);
                let keys_weather = Object.keys(inputData['Weather']);
                let keys_spe;
                let keys_spe_limit;
                let keys_t2;
                let keys_t2_limit;
                let keys_ewma;
                let keys_ewma_limit;
                let keys_messages;
                let keys_outlier_messages;
                if('SPE' in inputData && 'SPE Limit' in inputData && 'T2' in inputData && 'T2 Limit' in inputData && 'EWMA' in inputData && 'EWMA Limit' in inputData && 'SPE Messages' in inputData) {
                    keys_spe = Object.keys(inputData['SPE']);
                    keys_spe_limit = Object.keys(inputData['SPE Limit']);
                    keys_t2 = Object.keys(inputData['T2']);
                    keys_t2_limit = Object.keys(inputData['T2 Limit']);
                    keys_ewma = Object.keys(inputData['EWMA']);
                    keys_ewma_limit = Object.keys(inputData['EWMA Limit']);
                    keys_messages = Object.keys(inputData['SPE Messages']);
                }
                
                let keys_outlier;
                if('Outlier' in inputData) {
                    keys_outlier = Object.keys(inputData['Outlier']);
                    keys_outlier_messages = Object.keys(inputData['Outlier Messages']);
                }
    
                eventdata.points.map(d => {
                    if(noonOrLogs === 'logs') {
                        x_var = d.x + ":00"
                    }
                    else {
                        x_var = d.x
                    }
                });
                console.log("X VAR DATE!!!!!!!!!!!!!!!!", x_var);
                for(let i=0;i<inputData['mainres']['rep_dt'].length;i++) {
                    if(inputData['mainres']['rep_dt'][i] == x_var) {
    
                        // FOR THE PARAMETERS TABLE(PARAMETERS COLLPASIBLE)
                        for(let j=0;j<keys_main.length;j++) {
                            temp[keys_main[j]] = (inputData['mainres'][keys_main[j]][i] === undefined) ? '' : (inputData['mainres'][keys_main[j]][i])
                        }
    
                        // FOR THE MESSAGES TABLE(OUTLIERS AND ANOMALIES COLLAPSIBLE)
                        for(let j=0;j<keys_messages.length;j++) {
                            messagetemp[keys_messages[j]] = inputData['SPE Messages'][keys_messages[j]][i]
                        }
                        
                        // FOR THE EXPECTED COLUMN IN PARAMETERS TABLE(PARAMETERS COLLAPSIBLE)
                        for(let j=0;j<keys_exp.length;j++) {
                            temp[keys_exp[j]] = (inputData['Expected'][keys_exp[j]][i] === undefined) ? '' : (inputData['Expected'][keys_exp[j]][i])
                        }
    
                        // FOR THE OUTLIERS AND OUTLIER MESSAGES(PARAMETERS COLLAPSIBLE & OUTLIERS AND ANOMALIES COLLAPSIBLE)
                        if('Outlier' in inputData) {
                            for(let j=0;j<keys_outlier.length;j++) {
                                outliertemp[keys_outlier[j]] = (inputData['Outlier'][keys_outlier[j]][i] === undefined) ? '' : (inputData['Outlier'][keys_outlier[j]][i])
                            }
                            for(let j=0;j<keys_outlier_messages.length;j++) {
                                outliermessagestemp[keys_outlier_messages[j]] = inputData['Outlier Messages'][keys_outlier_messages[j]][i]
                            }
                        }
    
                        // FOR THE SPE MESSAGES AND ML VALUES(OUTLIERS AND ANOMALIES COLLAPSIBLE & KPI AND ML INDICATORS COLLAPSIBLE)
                        if('SPE' in inputData && 'SPE Limit' in inputData && 'T2' in inputData && 'T2 Limit' in inputData && 'EWMA' in inputData && 'EWMA Limit' in inputData) {
                            Object.keys(inputData['SPE Messages']).map(key => {
                                if(inputData['SPE Messages'][key][i] !== null) {
                                    outliertemp['spe_'+key] = inputData['SPE Messages'][key][i]
                                }
                            });
    
                            for(let j=0;j<keys_spe.length;j++) {
                                mltemp[keys_spe[j]] = (inputData['SPE'][keys_spe[j]][i] === undefined) ? '' : (inputData['SPE'][keys_spe[j]][i])
                            }
                            for(let j=0;j<keys_spe_limit.length;j++) {
                                mltemp[keys_spe_limit[j]] = (inputData['SPE Limit'][keys_spe_limit[j]][i] === undefined) ? '' : (inputData['SPE Limit'][keys_spe_limit[j]][i])
                            }
                            for(let j=0;j<keys_t2.length;j++) {
                                mltemp[keys_t2[j]] = (inputData['T2'][keys_t2[j]][i] === undefined) ? '' : (inputData['T2'][keys_t2[j]][i])
                            }
                            for(let j=0;j<keys_t2_limit.length;j++) {
                                mltemp[keys_t2_limit[j]] = (inputData['T2 Limit'][keys_t2_limit[j]][i] === undefined) ? '' : (inputData['T2 Limit'][keys_t2_limit[j]][i])
                            }
                            for(let j=0;j<keys_ewma.length;j++) {
                                mltemp[keys_ewma[j]] = (inputData['EWMA'][keys_ewma[j]][i] === undefined) ? '' : (inputData['EWMA'][keys_ewma[j]][i])
                            }
                            for(let j=0;j<keys_ewma_limit.length;j++) {
                                mltemp[keys_ewma_limit[j]] = (inputData['EWMA Limit'][keys_ewma_limit[j]][i] === undefined) ? '' : (inputData['EWMA Limit'][keys_ewma_limit[j]][i])
                            }
                        }
    
                        // FOR THE FUEL CONSUMPTION VALUES(ENGINE, GENERATOR, AND BOILER COLLAPSIBLES)
                        for(let f=0;f<inputData['Fuel Consumption'].length;f++) {
                            Object.keys(inputData['Fuel Consumption'][f]).map((item) => {
                                if(inputData['Fuel Consumption'][f][item] === x_var) {
                                    tempFuelCons = inputData['Fuel Consumption'][f]
                                }
                                // this.props.setHoverForFuelCons(tempFuelCons);
                            })
                        }
    
                        // FOR THE WEATHER VALUES(WEATHER COLLAPSIBLE)
                        for(let j=0;j<keys_weather.length;j++) {
                            weathertemp[keys_weather[j]] = inputData['Weather'][keys_weather[j]][i]
                        }
                    }
                }
                
            });
            myPlot.on('plotly_hover', () => {
                this.handleHover(temp);
            });
    
            myPlot.on('plotly_hover', () => {
                this.handleMessagesHover(messagetemp);
            });
    
            myPlot.on('plotly_hover', () => {
                this.handleOutlierMessagesHover(outliermessagestemp);
            });
    
            myPlot.on('plotly_hover', () => {
                this.handleOutlierHover(outliertemp);
            });
    
            myPlot.on('plotly_hover', () => {
                this.handleMLHover(mltemp);
            });
            
            myPlot.on('plotly_hover', () => {
                Object.keys(outliertemp).map(item => {
                    if(outliernames.includes(item)) {
                        console.log("OUTLIER NAMES!!!!!!");
                        // outliernames.push(item)
                    }
                    else {
                        outliernames.push(item);
                    }
                });
                this.handleNamesOfOutlierHover(outliernames);
            });
    
            // For Handling the hover data of Fuel Consumption
            // myPlot.on('plotly_hover', function(eventdata) {
            //     let x_var;
            //     eventdata.points.map(d => {
            //         x_var = d.x;
            //     });
    
            //     for(let i=0;i<inputData['Fuel Consumption'].length;i++) {
            //         Object.keys(inputData['Fuel Consumption'][i]).map((item) => {
            //             if(inputData['Fuel Consumption'][i][item] === x_var) {
            //                 tempFuelCons = inputData['Fuel Consumption'][i]
            //             }
            //             // this.props.setHoverForFuelCons(tempFuelCons);
            //         })
            //     }
            // });
            myPlot.on('plotly_hover', () => {
                this.handleHoverForFuelCons(tempFuelCons);
            });
    
            myPlot.on('plotly_hover', () => {
                this.handleHoverForWeather(weathertemp)
            })
        }
        else {

            myPlot.on('plotly_hover', function(eventdata) {
                let keys_evaluation = Object.keys(inputData['Evaluation Data']);
                let x_var;

                eventdata.points.map(d => {
                    if(noonOrLogs === 'logs') {
                        x_var = d.x + ":00"
                    }
                    else {
                        x_var = d.x
                    }
                });
                console.log(x_var)
                for(let i=0;i<inputData['Evaluation Data']['rep_dt'].length;i++) {
                    if(inputData['Evaluation Data']['rep_dt'][i] == x_var) {
                        for(let j=0;j<keys_evaluation.length;j++) {
                            dry_dock_temp[keys_evaluation[j]] = (inputData['Evaluation Data'][keys_evaluation[j]][i] === undefined) ? '' : (inputData['Evaluation Data'][keys_evaluation[j]][i])
                        }
                    }
                }

            });

            myPlot.on('plotly_hover', () => {
                console.log("HOVERING")
                this.handleHoverForDryDock(dry_dock_temp)
            });
        }

        // let curveList = [];
        // console.log("DLIST FOR CURVE", dList);
        // for(let i=0;i<dList.length;i++) {
        //     if(!dList[i]['name'].includes('Expected')) {
        //         if(dList[i]['customdata'] % 10 == 0) {
        //             curveList.push(i);
        //         }
        //     }
        // }
        // console.log("CURVE LIST", curveList);
        // this.setState({
        //     curveList: curveList
        // });

        // if(inputData['group'][0]['groupnumber'] == "3") {
        //     let new_height = inputData['Chart Height'] * 2.5
        //     myPlot.on('plotly_click', function(data) {
        //         let layout_update = {
        //             height: new_height
        //         }

        //         let data_update = {};
        //         Plotly.update('chartdiv', data_update, layout_update);
        //     })
        // }

        // myPlot.on('plotly_click', function(data) {
        //     let clicked_y = [];
        //     let curveNumber;
        //     data.points.map((d) => {
        //         clicked_y.push(d.fullData.name);
        //     });

        //     for(let i=0;i<dList.length;i++) {
        //         if(!dList[i]['name'].includes('Expected')) {
        //             for(let j=0;j<clicked_y.length;j++) {
        //                 if(dList[i]['name'] === clicked_y[j]) {
        //                     curveNumber = i
        //                 }
        //             }
        //         }
        //     }

        //     let update = {
        //         showlegend: 'legendonly',
        //         visible: 'legendonly'
        //     }

        //     Plotly.restyle('chartdiv', update, curveNumber);
        // });

        // myPlot.on('plotly_doubleclick', function(data) {
        //     let update = {
        //         visible: true
        //     }
        //     // console.log("TRACE", newList);
        //     Plotly.restyle('chartdiv', update, curveList);

        //     let new_height = inputData['Chart Height after Double Click'];
        //     let layout_update = {
        //         height: new_height,
        //         // legend: {
        //         //     'orientation': 'h',
        //         //     x: 0,
        //         //     y: parseFloat(inputData['Y position after double click']).toFixed(2) // -0.03 for COMBUSTION, -0.02 for FO CONS
        //         // }
        //     }

        //     let data_update = {};
        //     Plotly.update('chartdiv', data_update, layout_update);
        // });

    }

    render() {
        if(this.props.trends.isLoading === true) {
            return (
                <Loading />
            )
        }
        else if(this.props.trends.errMess !== null) {
            return(
                <div>{this.props.trends.errMess.message}</div>
            )
        }
        else {
            return (
                <div>
                    <div id="chartdiv" style={{width: '100%'}}></div>
                </div>
                // <Plot
                //     data={this.state.dataList}
                //     layout={this.state.layout}
                //     config={this.state.config}
                // />
            );
        }
        
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(Chart);