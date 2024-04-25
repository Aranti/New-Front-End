import React from 'react';
import Plotly from 'plotly.js/dist/plotly';
// import Plot from 'react-plotly.js';
import axios from 'axios';
import { baseUrl } from '../../shared/baseUrl';
import moment from 'moment';
import { connect } from 'react-redux';
import { setInteractiveHover } from '../../redux/ActionCreators';
import { Loading } from '../LoadingComponent';

const mapStateToProps = state => {
    return {
        interactive: state.interactive
    }
}

const mapDispatchToProps = (dispatch) => ({
    setInteractiveHover: (input) => { dispatch(setInteractiveHover(input)) }
});

class Chart extends React.Component {
    constructor(props) {
        super(props);

        this.state = {

        }

        this.initChart = this.initChart.bind(this);
        this.makeTrace = this.makeTrace.bind(this);
        this.makeLayout = this.makeLayout.bind(this);
        this.makeDataList = this.makeDataList.bind(this);
        this.make3DTrace = this.make3DTrace.bind(this);
        this.make3DLayout = this.make3DLayout.bind(this);
        this.make3DDataList = this.make3DDataList.bind(this);
        this.setInteractiveHoverData = this.setInteractiveHoverData.bind(this);
    }

    shouldComponentUpdate(nextProps, nextState) {
        if(this.props !== nextProps || this.state !== nextState) {
            return true;
        }
        else {
            return false;
        }
    }

    async componentDidUpdate(prevProps, prevState) {
        // console.log("pprev props",prevProps);
        // console.log("thuis props",this.props.interactive);
        if(prevProps.interactiveData !== this.props.interactive.interactiveData && typeof this.props.interactive.interactiveData === 'object' && !Array.isArray(this.props.interactive.interactiveData)) {
            // Plotly.purge('chartdiv');
            // console.log("inaide ifff");
            this.initChart(this.props.interactive.interactiveData);
            console.log("INTERACTIVE", this.props.interactive.interactiveData);
        }
    }

    componentDidMount() {
        // if(this.props.interactive.interactiveData) {
            // this.initChart(this.props.interactive.interactiveData);
        // }
        // this.initChart(this.props.interactive.interactiveData);
        console.log(this.props.interactive.interactiveData);
    }

    makeTrace(x, y, z='', name, mode) {

        let other_string = '';
        let strings_to_concat = [];

        Object.keys(this.props.interactive.interactiveData['Other Dict']).map(key => {
            strings_to_concat.push('<b>');
            strings_to_concat.push(key);
            strings_to_concat.push('</b>');
            strings_to_concat.push(' ');
            strings_to_concat.push(this.props.interactive.interactiveData['Other Dict'][key].toString());
            strings_to_concat.push('<br>')
        });

        other_string = other_string.concat(...strings_to_concat);

        if(z === '') {
            if(mode === 'lines') {
                return {
                    x: x,
                    y: y,
                    type: 'scatter',
                    mode: mode,
                    name: name,
                    text: name,
                    // hoverinfo: 'text+x+y',
                    hovertemplate: '<b>' + this.props.interactive.interactiveData.X_name + '</b>' + ' %{x: .2f}<br>' +
                        '<b>' + this.props.interactive.interactiveData.Y_name + '</b>' + ' %{y: .2f}<br>' + other_string
                }
            }
            else {
                return {
                    x: x,
                    y: y,
                    type: 'scatter',
                    mode: mode,
                    name: name,
                    text: name,
                    // hoverinfo: 'text+x+y',
                    hovertemplate: '<b>' + this.props.interactive.interactiveData.X_name + '</b>' + ' %{x: .2f}<br>' +
                        '<b>' + this.props.interactive.interactiveData.Y_name + '</b>' + ' %{y: .2f}<br>' + other_string
                }
            }
        }
        else {
            if(this.props.interactive.typeofinput === 'input') {
                return {
                    x: x,
                    y: z,
                    z: y,
                    type: 'surface',
                    name: name,
                    // mode: mode,
                    opacity: 0.5,
                    // line: {
                    //     width: 7,
                    // },
                    // name: name,
                    text: name,
                    // hoverinfo: 'text+x+y+z',
                    hovertemplate: '<b>' + this.props.interactive.interactiveData.X_name + '</b>' + ' %{x: .2f}<br>' +
                        '<b>' + this.props.interactive.interactiveData.Y_name + '</b>' + ' %{z: .2f}<br>' +
                        '<b>' + this.props.interactive.interactiveData.Z_name + '</b>' + ' %{y: .2f}<br>' + other_string
                }
            }
            if(this.props.interactive.typeofinput === 'target') {
                if(mode === 'lines') {
                    return {
                        x: x,
                        y: y,
                        z: z,
                        type: 'scatter3d',
                        mode: 'lines',
                        opacity: 0.5,
                        line: {
                            width: 7,
                        },
                        name: name,
                        text: name,
                        // hoverinfo: 'text+x+y+z',
                        hovertemplate: '<b>' + this.props.interactive.interactiveData.X_name + '</b>' + ' %{x: .2f}<br>' +
                        '<b>' + this.props.interactive.interactiveData.Y_name + '</b>' + ' %{z: .2f}<br>' +
                        '<b>' + this.props.interactive.interactiveData.Z_name + '</b>' + ' %{y: .2f}<br>' + other_string
                    }
                }
                else {
                    return {
                        x: x,
                        y: y,
                        z: z,
                        type: 'scatter3d',
                        opacity: 0.5,
                        mode: 'markers',
                        marker: {
                            size: 7,
                            opacity: 0.8
                        },
                        name: name,
                        text: name,
                        // hoverinfo: 'text+x+y+z',
                        hovertemplate: '<b>' + this.props.interactive.interactiveData.X_name + '</b>' + ' %{x: .2f}<br>' +
                        '<b>' + this.props.interactive.interactiveData.Y_name + '</b>' + ' %{z: .2f}<br>' +
                        '<b>' + this.props.interactive.interactiveData.Z_name + '</b>' + ' %{y: .2f}<br>' + other_string
                    }
                }
            }
        }
    }

    make3DTrace(x, y, z, name) {
        if(name === '') {
            return {
                x: x,
                y: y,
                z: z,
                type: 'scatter3d',
                mode: 'markers',
                marker: {
                    size: 7,
                    opacity: 0.8
                },
                // name: name,
                // text: name,
                hoverinfo: 'x+y+z',
            }
        }
        else {
            return {
                x: x,
                y: y,
                z: z,
                type: 'scatter3d',
                mode: 'markers',
                marker: {
                    size: 7,
                    opacity: 0.8
                },
                name: name,
                text: name,
                hoverinfo: 'text+x+y+z',
            }
        }
    }

    makeLayout(inputData, threeD) {
        if(threeD === true) {
            let layout;
            if(this.props.interactive.typeofinput === 'input') {
                layout = {
                    hovermode: 'compare',
                    spikedistance: -1,
                    height: 650,
                    scene: {
                        xaxis: {
                            title: this.props.interactive.interactiveData.X_name,
                            // range: [Math.min(...inputData['Result']['Actual Values']['x']), Math.max(...inputData['Result']['Actual Values']['x'])]
                            // showspikes: true,
                            // spikemode: 'across',
                            // spikethickness: 1,
                            // spikesnap: 'cursor',
                            // showline: true,
                            // showgrid: true,
                        },
                        yaxis: {
                            title: this.props.interactive.interactiveData.Z_name,
                            // range: [Math.min(...inputData['Result']['Actual Values']['z']), Math.max(...inputData['Result']['Actual Values']['z'])]
                            // showspikes: true,
                            // spikemode: 'across',
                            // spikethickness: 1,
                            // spikesnap: 'cursor',
                            // showline: true,
                            // showgrid: true,
                        },
                        zaxis: {
                            title: this.props.interactive.interactiveData.Y_name,
                            // range: [Math.min(...inputData['Result']['Actual Values']['y']), Math.max(...inputData['Result']['Actual Values']['y'])]
                        },
                    },
                    // legend: {
                    //     'orientation': 'h',
                    //     // x: 0,
                    //     // y: 1 
                    // },
                    autosize: true
                }
            }
            else {
                layout = {
                    hovermode: 'compare',
                    spikedistance: -1,
                    height: 650,
                    scene: {
                        xaxis: {
                            title: this.props.interactive.interactiveData.X_name,
                            // showspikes: true,
                            // spikemode: 'across',
                            // spikethickness: 1,
                            // spikesnap: 'cursor',
                            // showline: true,
                            // showgrid: true,
                        },
                        yaxis: {
                            title: this.props.interactive.interactiveData.Z_name,
                            // showspikes: true,
                            // spikemode: 'across',
                            // spikethickness: 1,
                            // spikesnap: 'cursor',
                            // showline: true,
                            // showgrid: true,
                        },
                        zaxis: {
                            title: this.props.interactive.interactiveData.Y_name
                        },
                    },
                    // legend: {
                    //     'orientation': 'h',
                    //     // x: 0,
                    //     // y: 1 
                    // },
                    autosize: true
                }
            }
            
    
            return layout
        }
        else {
            let layout = {
                hovermode: 'compare',
                spikedistance: -1,
                height: 650,
                xaxis: {
                    title: this.props.interactive.interactiveData.X_name,
                    showspikes: true,
                    spikemode: 'across',
                    spikethickness: 1,
                    spikesnap: 'cursor',
                    showline: true,
                    showgrid: true,
                },
                yaxis: {
                    title: this.props.interactive.interactiveData.Y_name,
                    showspikes: true,
                    spikemode: 'across',
                    spikethickness: 1,
                    spikesnap: 'cursor',
                    showline: true,
                    showgrid: true,
                },
                // legend: {
                //     'orientation': 'h',
                //     // x: 0,
                //     // y: 1 
                // },
                autosize: true
            }
    
            return layout
        }
    }

    make3DLayout() {
        let layout = {
            hovermode: 'compare',
            spikedistance: -1,
            height: 650,
            scene: {
                xaxis: {
                    title: this.props.interactive.interactiveData.X_name,
                    // showspikes: true,
                    // spikemode: 'across',
                    // spikethickness: 1,
                    // spikesnap: 'cursor',
                    // showline: true,
                    // showgrid: true,
                },
                yaxis: {
                    title: this.props.interactive.interactiveData.Y_name,
                    // showspikes: true,
                    // spikemode: 'across',
                    // spikethickness: 1,
                    // spikesnap: 'cursor',
                    // showline: true,
                    // showgrid: true,
                },
                zaxis: {
                    title: this.props.interactive.interactiveData.Z_name,
                    // showspikes: true,
                    // spikemode: 'across',
                    // spikethickness: 1,
                    // spikesnap: 'cursor',
                    // showline: true,
                    // showgrid: true,
                },
            },
            legend: {
                'orientation': 'h',
                x: 0,
                y: 1 
            },
            autosize: true
        }

        return layout
    }

    setInteractiveHoverData(input) {
        this.props.setInteractiveHover(input);
    }

    makeDataList(responseData, threeD) {
        let datalist = [];
        // let X = responseData['X'];
        // let Y = responseData['Y'];
        // console.log(responseData['X'], responseData['Y']);

        if(threeD === true) {
            if(this.props.interactive.typeofinput === 'input') {
                let X = responseData['Result']['Prediction']['x'];
                let Y = responseData['Result']['Prediction']['y'];
                let Z = responseData['Result']['Prediction']['z'];
                let trace = this.makeTrace(X, Y, Z, [responseData['X_name'], responseData['Z_name'], responseData['Y_name']], '');
                let trace2 = {
                    x: responseData['Result']['Actual Values']['x'],
                    y: responseData['Result']['Actual Values']['z'],
                    z: responseData['Result']['Actual Values']['y'],
                    type: 'scatter3d',
                    mode: 'markers',
                    marker: {
                        opacity: 0.4
                    },
                    text: [responseData['X_name'], responseData['Z_name'], responseData['Y_name']],
                    // hoverinfo: "text+x+y+z",
                    hovertemplate: '<b>' + this.props.interactive.interactiveData.X_name + '</b>' + ' %{x: .2f}<br>' +
                        '<b>' + this.props.interactive.interactiveData.Y_name + '</b>' + ' %{z: .2f}<br>' +
                        '<b>' + this.props.interactive.interactiveData.Z_name + '</b>' + ' %{y: .2f}<br>'
                }
                datalist.push(trace);
                datalist.push(trace2);
                return datalist;
            }
            if(this.props.interactive.typeofinput === 'target') {
                Object.keys(responseData['Result']).map(key => {
                    let X = responseData['Result'][key]['x'];
                    let Y = responseData['Result'][key]['z'];
                    let Z = responseData['Result'][key]['y'];
                    let mode;
    
                    if(key.includes('Actual')) {
                        mode = 'markers';
                    }
                    else {
                        mode = 'lines';
                    }
        
                    let trace = this.makeTrace(X, Y, Z, key, mode);
                    datalist.push(trace);
                });
                return datalist;
            }
        }
        else {
            // console.log("Interactive Chart Responsedata",responseData);
            Object.keys(responseData['Result']).map(key => {
                let X = responseData['Result'][key]['x'];
                let Y = responseData['Result'][key]['y'];
                let mode;

                if(key.includes('Actual')) {
                    mode = 'markers';
                }
                else {
                    mode = 'lines'
                }
    
                let trace = this.makeTrace(X, Y, '', key, mode);
                datalist.push(trace);
            });
            return datalist;
        }
    }

    make3DDataList(responseData) {
        let datalist = [];
        let X = responseData['X'];
        let Y = responseData['Y'];
        let Z = responseData['Z'];
        console.log(responseData['X'], responseData['Y']);

        let trace = this.make3DTrace(X, Y, Z);
        datalist.push(trace);
        return datalist;
    }

    initChart(inputData) {
        let dataList;
        let layout;
        let interactivehover={}
        let myPlot = document.getElementById('chartdiv');
        if(this.props.interactive.z_axis === '') {
            dataList = this.makeDataList(inputData, false);
            layout = this.makeLayout(false);
        }
        else {
            dataList = this.makeDataList(inputData, true);
            layout = this.makeLayout(inputData, true);
        }
        
        Plotly.newPlot(myPlot, dataList, layout);

        if(this.props.interactive.dimensions === '2D') {
            myPlot.on('plotly_hover', function (eventdata) {
                eventdata.points.map(d => {
                    // console.log("POINTS!!!!!!!!!!!!!!!!!!", d.x,d.y,d.z);
                    interactivehover[inputData['X_name']] = d.x.toFixed(2);
                    interactivehover[inputData['Y_name']] = d.y.toFixed(2);
                });
            });
        }
        else {
            myPlot.on('plotly_hover', function (eventdata) {
                eventdata.points.map(d => {
                    // console.log("POINTS!!!!!!!!!!!!!!!!!!", d.x,d.y,d.z);
                    interactivehover[inputData['X_name']] = d.x.toFixed(2);
                    interactivehover[inputData['Y_name']] = d.z.toFixed(2);
                    'Z_name' in inputData ? interactivehover[inputData['Z_name']] = d.y.toFixed(2):"";
                });
            });
        }

        myPlot.on('plotly_hover', () => {
            this.setInteractiveHoverData(interactivehover);
        });
    }

    render() {
        if(this.props.interactive.isLoading === true) {
            // Plotly.purge('chartdiv');
            return (
                <Loading />
            )
        }
        else if(this.props.interactive.errMess !== null) {
            // Plotly.purge('chartdiv');
            return (
                <div>{this.props.interactive.errMess.response ? this.props.interactive.errMess.response['data'] : this.props.interactive.errMess.message}</div>
            )
        }
        else {
            return (
                <div>
                    <div id="chartdiv" style={{width: '100%'}}></div>
                </div>
            )
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Chart);