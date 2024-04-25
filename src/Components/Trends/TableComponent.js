import React, { useState } from 'react';
import Collapsible from './CollapsibleTrends';
import axios from 'axios';
import { baseUrl } from '../../shared/baseUrl';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { Table } from 'react-bootstrap';
import { connect } from 'react-redux';

/*
    May
    The Table Component renders all the tables within the Collapsible
    Component on the RHS of the Trends page.
*/


const urls = baseUrl + process.env.REACT_APP_TRENDS_TABLE

const mapStateToProps = state => {
    return {
        trends: state.trends,
        hover: state.hover,
        outlierhover: state.outlierhover,
        mlhover: state.mlhover,
        fuelConsHover: state.fuelConsHover
    }
}

const MakeTable = (props) => {
    // Returns the Parameters table. Colors the parameters that are outliers
    if((props.names !== undefined && props.names !== null) && (props.hover !== undefined && props.hover !== null) && (props.outlierhover !== undefined && props.outlierhover !== null) && (props.spe_messages !== undefined && props.spe_messages !== null) && (props.nameObj !== undefined && props.nameObj !== null)) {
        let listOfSPEKeys = Object.keys(props.spe_messages);
        if(props.outlier_messages !== undefined && props.outlier_messages !== null) {
            let listOfOutlierMessages = Object.keys(props.outlier_messages);
            return(
                props.names.map((name) => {
                    if(listOfOutlierMessages.includes(name) && listOfSPEKeys.includes(name) && props.spe_messages[name] !== null && props.outlier_messages[name] !== null) {
                        return(
                            props.hover[name] !== null ? <tr key={name}>
                                <td style={{border: '1px solid', color: "violet"}}>{props.nameObj[name] && props.nameObj[name]}</td>
                                <td style={{border: '1px solid', color: "violet"}}>
                                    {
                                        props.hover && props.hover[name] === '' ? '' : props.hover[name]
                                    }
                                </td>
                                <td style={{border: '1px solid', color: "violet"}}>
                                    {
                                        props.hover && props.hover['expected_'.concat(name)] === '' ? '' : props.hover['expected_'.concat(name)]
                                    }
                                </td>
                            </tr> : ""
                        )
                    }
                    else if(listOfSPEKeys.includes(name) && props.spe_messages[name] !== null) {
                        return(
                            props.hover[name] !== null ? <tr key={name}>
                                <td style={{border: '1px solid', color: "orange"}}>{props.nameObj[name] && props.nameObj[name]}</td>
                                <td style={{border: '1px solid', color: "orange"}}>
                                    {
                                        props.hover && props.hover[name] === '' ? '' : props.hover[name]
                                    }
                                </td>
                                <td style={{border: '1px solid', color: "orange"}}>
                                    {
                                        props.hover && props.hover['expected_'.concat(name)] === '' ? '' : props.hover['expected_'.concat(name)]
                                    }
                                </td>
                            </tr> : ""
                        )
                        
                    }
                    else if(listOfOutlierMessages.includes(name) && props.outlier_messages[name] !== null) {
                        return(
                            props.outlierhover[name] !== null ? <tr key={name}>
                                <td style={{border: '1px solid', color: "red"}}>{props.nameObj[name] && props.nameObj[name]}</td>
                                <td style={{border: '1px solid', color: "red"}}>
                                    {
                                        props.outlierhover && props.outlierhover[name] === '' ? '' : props.outlierhover[name]
                                    }
                                </td>
                                <td style={{border: '1px solid', color: "red"}}>
                                    {
                                        props.hover && props.hover['expected_'.concat(name)] === '' ? '' : props.hover['expected_'.concat(name)]
                                    }
                                </td>
                            </tr> : ""
                        )
                        
                    }
                    else {
                        return(
                            props.hover[name] !== null ? <tr key={name}>
                                <td style={{border: '1px solid'}}>{props.nameObj[name] && props.nameObj[name]}</td>
                                <td style={{border: '1px solid'}}>
                                    {
                                        props.hover && props.hover[name] === '' ? '' : props.hover[name]
                                    }
                                </td>
                                <td style={{border: '1px solid'}}>
                                    {
                                        props.hover && props.hover['expected_'.concat(name)] === '' ? '' : props.hover['expected_'.concat(name)]
                                    }
                                </td>
                            </tr> : ""
                        )
                    }
                })
            )
        }
        else {
            return(
                props.names.map((name) => {
                    if(listOfSPEKeys.includes(name) && props.spe_messages[name] !== null) {
                        return(
                            props.hover[name] !== null ? <tr key={name}>
                                <td style={{border: '1px solid', color: "orange"}}>{props.nameObj[name] && props.nameObj[name]}</td>
                                <td style={{border: '1px solid', color: "orange"}}>
                                    {
                                        props.hover && props.hover[name] === '' ? '' : props.hover[name]
                                    }
                                </td>
                                <td style={{border: '1px solid', color: "orange"}}>
                                    {
                                        props.hover && props.hover['expected_'.concat(name)] === '' ? '' : props.hover['expected_'.concat(name)]
                                    }
                                </td>
                            </tr> : ""
                        )
                        
                    }
                    else {
                        return(
                            props.hover[name] !== null ? <tr key={name}>
                                <td style={{border: '1px solid'}}>{props.nameObj[name] && props.nameObj[name]}</td>
                                <td style={{border: '1px solid'}}>
                                    {
                                        props.hover && props.hover[name] === '' ? '' : props.hover[name]
                                    }
                                </td>
                                <td style={{border: '1px solid'}}>
                                    {
                                        props.hover && props.hover['expected_'.concat(name)] === '' ? '' : props.hover['expected_'.concat(name)]
                                    }
                                </td>
                            </tr> : ""
                        )
                    }
                })
            )
        }
        
    }
    // else if((props.names !== undefined && props.names !== null) && (props.drydockhover !== undefined && props.drydockhover !== null) && (props.nameObj !== undefined && props.nameObj !== null)) {
    //     return (
    //         props.names.map(key => {
    //             if(key !== 'rep_dt') {
    //                 console.log("")
    //                 return (
    //                     <tr key={key}>
    //                         {/* <td>{key.includes('loss') && !key.includes('avg') ? props.nameObj[key] + ' Loss' : key.includes('pred') && !key.includes('second') ? props.nameObj[key] + ' based on evaluation data' : key.includes('avg') ? props.nameObj[key] + ' Average' : props.nameObj[key] + ' based on reference data'}</td> */}
    //                         <td>{props.nameObj[key]}</td>
    //                         <td>{props.drydockhover[key]}</td>
    //                         <td></td>
    //                     </tr>
    //                 )
    //             }
    //         })
    //     )
    // }
    else {
        return (
            <tr>
                <td></td>
                <td></td>
                <td></td>
            </tr>
        )
    }
}

const MakeDryDockTable = (props) => {
    // Returns the table for Intervention Data
    if((props.names !== undefined && props.names !== null) && (props.drydockhover !== undefined && props.drydockhover !== null) && (props.nameObj !== undefined && props.nameObj !== null)) {
        return (
            props.names.map(key => {
                return (
                    <tr key={key}>
                        {/* <td>{key.includes('loss') && !key.includes('avg') ? props.nameObj[key] + ' Loss' : key.includes('pred') && !key.includes('second') ? props.nameObj[key] + ' based on evaluation data' : key.includes('avg') ? props.nameObj[key] + ' Average' : props.nameObj[key] + ' based on reference data'}</td> */}
                        <td>{props.nameObj[key]}</td>
                        <td>{props.drydockhover[key]}</td>
                        <td></td>
                    </tr>
                )
                // if(key !== 'rep_dt') {
                //     return (
                //         <tr key={key}>
                //             {/* <td>{key.includes('loss') && !key.includes('avg') ? props.nameObj[key] + ' Loss' : key.includes('pred') && !key.includes('second') ? props.nameObj[key] + ' based on evaluation data' : key.includes('avg') ? props.nameObj[key] + ' Average' : props.nameObj[key] + ' based on reference data'}</td> */}
                //             <td>{props.nameObj[key]}</td>
                //             <td>{props.drydockhover[key]}</td>
                //             <td></td>
                //         </tr>
                //     )
                // }
            })
        )
    }
    else {
        return (
            <tr>
                <td></td>
                <td></td>
                <td></td>
            </tr>
        )
    }
}

const MakeDryDockMLTable = (props) => {
    // Returns the table for KPI & ML indicators of Intervention data
    if((props.names !== undefined && props.names !== null) && (props.drydockhover !== undefined && props.drydockhover !== null) && (props.nameObj !== undefined && props.nameObj !== null) && (props.order !== undefined && props.order !== null)) {
        return (
            props.order.map(key => {
                return (
                    props.names.map(name => {
                        if(key === name) {
                            return (
                                <tr key={key}>
                                    {/* <td>{key.includes('loss') && !key.includes('avg') ? props.nameObj[key] + ' Loss' : key.includes('pred') && !key.includes('second') ? props.nameObj[key] + ' based on evaluation data' : key.includes('avg') ? props.nameObj[key] + ' Average' : props.nameObj[key] + ' based on reference data'}</td> */}
                                    <td>{props.nameObj[key]}</td>
                                    <td>{props.drydockhover[key]}</td>
                                    <td></td>
                                </tr>
                            )
                        }
                    })
                )
                // if(key !== 'rep_dt') {
                //     return (
                //         <tr key={key}>
                //             {/* <td>{key.includes('loss') && !key.includes('avg') ? props.nameObj[key] + ' Loss' : key.includes('pred') && !key.includes('second') ? props.nameObj[key] + ' based on evaluation data' : key.includes('avg') ? props.nameObj[key] + ' Average' : props.nameObj[key] + ' based on reference data'}</td> */}
                //             <td>{props.nameObj[key]}</td>
                //             <td>{props.drydockhover[key]}</td>
                //             <td></td>
                //         </tr>
                //     )
                // }
            })
        )
    }
    else {
        return (
            <tr>
                <td></td>
                <td></td>
                <td></td>
            </tr>
        )
    }
}

const MakeMLTable = (props) => {
    // Returns the table for KPI & ML indicators of Regular data
    if((props.names !== undefined && props.names !== null) && (props.hover !== undefined && props.hover !== null) && (props.nameObj !== undefined && props.nameObj !== null)) {
        return(
            props.names.map((name) => {
                // let num1 = makeDecimal(parseFloat(props.hover[name]));
                // let num2 = makeDecimal(parseFloat(props.hover['expected_'.concat(name)]));
                if(props.hover[name] > props.hover[name.replace('spe_', 'spe_limit_')] || props.hover[name] > props.hover[name.replace('t2_', 't2_limit_')] || props.hover[name] > props.hover[name.replace('ewma_', 'ewma_limit_')]) {
                    return(
                        props.hover[name] !== null ? <tr key={name}>
                            <td style={{border: '1px solid', color: "orange"}}>{props.nameObj[name] && props.nameObj[name]}</td>
                            <td style={{border: '1px solid', color: "orange"}}>
                                {
                                    props.hover && props.hover[name] === '' ? '' : props.hover[name]
                                }
                            </td>
                            <td style={{border: '1px solid', color: "orange"}}>
                                {
                                    props.hover && name.includes('spe_') ? props.hover[name.replace('spe_', 'spe_limit_')] : name.includes('t2_') ? props.hover[name.replace('t2_', 't2_limit_')] : name.includes('ewma_') ? props.hover[name.replace('ewma_', 'ewma_limit_')] : ''
                                }
                            </td>
                        </tr> : ""
                    )
                }
                else {
                    return(
                        props.hover[name] !== null ? <tr key={name}>
                            <td style={{border: '1px solid'}}>{props.nameObj[name] && props.nameObj[name]}</td>
                            <td style={{border: '1px solid'}}>
                                {
                                    props.hover && props.hover[name] === '' ? '' : props.hover[name]
                                }
                            </td>
                            <td style={{border: '1px solid'}}>
                                {
                                    props.hover && name.includes('spe_') ? props.hover[name.replace('spe_', 'spe_limit_')] : name.includes('t2_') ? props.hover[name.replace('t2_', 't2_limit_')] : name.includes('ewma_') ? props.hover[name.replace('ewma_', 'ewma_limit_')] : ''
                                }
                            </td>
                        </tr> : ""
                    )
                }
                
            })
        )
    }
    // else if((props.names !== undefined && props.names !== null) && (props.drydockhover !== undefined && props.drydockhover !== null) && (props.nameObj !== undefined && props.nameObj !== null)) {
    //     return (
    //         props.names.map(key => {
    //             if(key !== 'rep_dt') {
    //                 console.log(".")
    //                 return (
    //                     <tr key={key}>
    //                         {/* <td>{key.includes('loss') && !key.includes('avg') ? props.nameObj[key] + ' Loss' : key.includes('pred') && !key.includes('second') ? props.nameObj[key] + ' based on evaluation data' : key.includes('avg') ? props.nameObj[key] + ' Average' : props.nameObj[key] + ' based on reference data'}</td> */}
    //                         <td>{props.nameObj[key]}</td>
    //                         <td>{props.drydockhover[key]}</td>
    //                         <td></td>
    //                     </tr>
    //                 )
    //             }
    //         })
    //     )
    // }
    else {
        return (
            <tr>
                <td></td>
                <td></td>
                <td></td>
            </tr>
        )
    }
}

const MakeOutlierTable = (props) => {
    // Returns the table for the Outliers
    // console.log("PROPS OUTLIER!!!!!!!!!!!!!", props.names, props.nameObj)
    if((props.names !== undefined && props.names !== null) && (props.nameObj !== undefined && props.nameObj !== null) && (props.spe_messages !== undefined && props.spe_messages !== null)) {
        return(
            props.names.map((name) => {
                if(name in props.spe_messages) {
                    return(
                        <tr key={name}>
                            {props.spe_messages[name] === null ? "" : <td style={{border: '1px solid', color: "orange"}}>{props.nameObj[name]}-{props.spe_messages[name]}</td>}
                        </tr>
                    )
                }
                if(props.outlier_messages !== null && props.outlier_messages !== undefined && name in props.outlier_messages) {
                    return(
                        <tr key={name}>
                            {props.outlier_messages[name] === null ? "" : <td style={{border: '1px solid', color: "red"}}>{props.nameObj[name]}-{props.outlier_messages[name]}</td>}
                        </tr>
                    )
                }
            })
        )
    }
    else {
        return (
            <tr>
                <td></td>
            </tr>
        )
    }
}

const MakeEngineTable = (props) => {
    // Returns the table for the Engine data
    if((props.engineNames !== undefined && props.engineNames !== null) && (props.engineObject !== undefined && props.engineObject !== null) && (props.nameObj !== undefined && props.nameObj !== null)) {
        return (
            props.engineNames.map(engname => {
                return(
                    Object.keys(props.engineObject).map((item) => {
                        if(item === engname) {
                            // let num1 = makeDecimal(parseFloat(props.engineObject[item]));
                            // let num2='';
                            // let id_name = Object.keys(props.nameObj).map(key => {
                            //     if(props.nameObj[key] === item) {
                            //         return key
                            //     }
                            // })
                            // if(item.includes('HFO Cons')) {
                            //     num2 = makeDecimal(parseFloat(props.hover['expected_'.concat(id_name)]))
                            // }
                            // if(props.issues[props.ship_imo].includes(props.nameObj[engname])) {
                            //     return(
                            //         props.engineObject[item][0] !== null ? <tr key={item}>
                            //             <td style={{border: '1px solid', color: "darkred"}}>{item}</td>
                            //             <td style={{border: '1px solid', color: "darkred"}}>{props.engineObject[item][0]}</td>
                            //             <td style={{border: '1px solid', color: "darkred"}}>{props.engineObject[item][1]}</td>
                            //         </tr> : ""
                            //     )
                            // }
                            // else {
                            return(
                                props.engineObject[item][0] !== null ? <tr key={item}>
                                    <td style={{border: '1px solid'}}>{item}</td>
                                    <td style={{border: '1px solid'}}>{props.engineObject[item][0]}</td>
                                    <td style={{border: '1px solid'}}>{props.engineObject[item][1]}</td>
                                </tr> : ""
                            )
                            // }
                            
                        }
                    })
                )
            })
        )
    }
    else {
        return (
            <tr>
                <td></td>
                <td></td>
                <td></td>
            </tr>
        )
    }
}

const MakeGeneratorTable = (props) => {
    // Returns the table for the Generator data
    if(props.generatorObject !== undefined && props.generatorObject !== null) {
        return(
            Object.keys(props.generatorObject).map((item) => {
                // if(props.issues[props.ship_imo].includes(item)) {
                //     return(
                //         props.generatorObject[item][0] !== null ? <tr key={item}>
                //             <td style={{border: '1px solid', color: "darkred"}}>{item}</td>
                //             <td style={{border: '1px solid', color: "darkred"}}>{props.generatorObject[item][0]}</td>
                //             <td style={{border: '1px solid', color: "darkred"}}>{props.generatorObject[item][1]}</td>
                //         </tr> : ""
                //     )
                // }
                // else {
                return(
                    props.generatorObject[item][0] !== null ? <tr key={item}>
                        <td style={{border: '1px solid'}}>{item}</td>
                        <td style={{border: '1px solid'}}>{props.generatorObject[item][0]}</td>
                        <td style={{border: '1px solid'}}>{props.generatorObject[item][1]}</td>
                    </tr> : ""
                )
                // }
                
            })
        )
    }
    else {
        return (
            <tr>
                <td></td>
                <td></td>
                <td></td>
            </tr>
        )
    }
}

const MakeBoilerTable = (props) => {
    // Returns the table for Boiler data
    if(props.boilerObject !== undefined && props.boilerObject !== null) {
        return(
            Object.keys(props.boilerObject).map((item) => {
                // if(props.issues[props.ship_imo].includes(item)) {
                //     return(
                //         props.boilerObject[item][0] !== null ? <tr key={item}>
                //             <td style={{border: '1px solid', color: "darkred"}}>{item}</td>
                //             <td style={{border: '1px solid', color: "darkred"}}>{props.boilerObject[item][0]}</td>
                //             <td style={{border: '1px solid', color: "darkred"}}>{props.boilerObject[item][1]}</td>
                //         </tr> : ""
                //     )
                // }
                // else {
                return(
                    props.boilerObject[item][0] !== null ? <tr key={item}>
                        <td style={{border: '1px solid'}}>{item}</td>
                        <td style={{border: '1px solid'}}>{props.boilerObject[item][0]}</td>
                        <td style={{border: '1px solid'}}>{props.boilerObject[item][1]}</td>
                    </tr> : ""
                )
                // }
                
            })
        )
    }
    else {
        return (
            <tr>
                <td></td>
                <td></td>
                <td></td>
            </tr>
        )
    }
}

const MakeWeatherTable = (props) => {
    // Returns the table for Weather data
    if(props.short_names && props.weatherhover) {
        return (
            Object.keys(props.weatherhover).map(key => {
                return (
                    <tr key={key}>
                        <td style={{border: '1px solid'}}>{props.short_names[key]}</td>
                        <td style={{border: '1px solid'}}>{props.weatherhover[key]}</td>
                    </tr>
                )
            })
        )
    }
    else {
        return (
            <tr>
                <td></td>
                <td></td>
            </tr>
        )
    }
}

class TrendsTable extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            rowOpen: false,
            data: null,
            hover: null,
            key: 0,
            names: [],
            nameObj: {},
            engineObject: {},
            engineNamesList: [],
            generatorObject: {},
            boilerObject: {},
            mlnames: [],
            mlobject: {},
            outliernames: [],
            outlierobject: {}
        }

        this.handleRowOpen = this.handleRowOpen.bind(this);
        this.getChartData = this.getChartData.bind(this);
        this.createNamesList = this.createNamesList.bind(this);
        this.createMLList = this.createMLList.bind(this);
        this.createEngineobject = this.createEngineobject.bind(this);
        this.createGeneratorObject = this.createGeneratorObject.bind(this);
        this.createBoilerObject = this.createBoilerObject.bind(this);
        this.createKeyListForML = this.createKeyListForML.bind(this);
        this.createNamesListForOutlier = this.createNamesListForOutlier.bind(this);
    }

    componentDidMount() {
        // this.createMLList(this.props.trends.trendsData)
        // if(this.props.trends.trendsData !== null) {
        //     this.createNamesList(this.props.trends.trendsData);
        // }
        // this.getChartData();
        // this.createEngineobject(this.props.fuelConsHover);
    }

    async componentDidUpdate(prevProps, prevState) {
        if(prevProps.trends.group !== this.props.trends.group) {
            // this.getChartData();
            // if(this.props.trends.trendsData !== null) {
            //     this.createNamesList(this.props.trends.trendsData);
            // }
        }
        // if(prevProps.mlhover.mlhover !== this.props.mlhover.mlhover) {
        //     this.createMLList(this.props.trends.trendsData)
        //     // this.getChartData();
        //     // if(this.props.trends.trendsData !== null) {
        //     //     this.createNamesList(this.props.trends.trendsData);
        //     // }
        // }
        if(prevProps.trends.trendsData !== this.props.trends.trendsData) {
            this.createNamesList(this.props.trends.trendsData);
            if('group' in this.props.trends.trendsData || 'Group' in this.props.trends.trendsData) {
                this.createMLList(this.props.trends.trendsData);
            }
            if('group' in this.props.trends.trendsData) {
                this.createNamesListForOutlier(this.props.trends.trendsData, this.props.outlierhover.outlierhover);
            }
            
        }
        if(prevProps.outlierhover.outlierhover !== this.props.outlierhover.outlierhover) {
            this.createNamesListForOutlier(this.props.trends.trendsData, this.props.outlierhover.outlierhover);
            console.log("OUTLIER STATE!!!!!!!!", this.state.outliernames, this.state.outlierobject)
        }
        if(prevProps.hoverData.hover !== this.props.hover.hover) {
            this.setState({
                hover: this.props.hover.hover
            });
        }
        if(prevProps.fuelConsHoverData.fuelConsHover !== this.props.fuelConsHover.fuelConsHover) {
            this.createEngineobject(this.props.fuelConsHover);
            this.createGeneratorObject(this.props.fuelConsHover);
            this.createBoilerObject(this.props.fuelConsHover);
        }
    }

    // shouldComponentUpdate(nextProps, nextState) {
    //     if(this.props !== nextProps || this.state !== nextState) {
    //         // this.setState({
    //         //     hover: nextProps.hoverData.hover
    //         // });
    //         return true;
    //     }
    //     else {
    //         false;
    //     }
    // }

    handleRowOpen = () => {
        this.setState({
            rowOpen: !this.state.rowOpen
        });
    }

    getChartData = () => {
        let param;

        if(this.props.trends.group === "" && this.props.trends.selectedOptions.length > 0) {
            let individual_params = this.props.trends.selectedOptions.length > 0 ? this.props.trends.selectedOptions.toString() : ""
            let groupName = this.props.trends.group !== "" ? this.props.trends.group : ""
            param = {
                'ship_imo': this.props.trends.ship_imo,
                'group': groupName,
                'duration': this.props.trends.duration,
                'include_outliers': this.props.trends.outliers,
                'individual_params': individual_params,
                'compare': this.props.trends.compare,
                'anomalies': this.props.trends.anomalies
            };
        }
        if(this.props.trends.group !== "" && this.props.trends.selectedOptions.length === 0) {
            let groupName = this.props.trends.group !== "" ? this.props.trends.group : ""
            param = {
                'ship_imo': this.props.trends.ship_imo,
                'group': groupName,
                'duration': this.props.trends.duration,
                'include_outliers': this.props.trends.outliers,
                'compare': this.props.trends.compare,
                'anomalies': this.props.trends.anomalies
                // 'individual_params': this.props.trends.selectedOptions.length > 0 ? this.props.trends.selectedOptions.toString() : []
            };
        }
        if(this.props.trends.group !== "" && this.props.trends.selectedOptions.length > 0) {
            let groupName = this.props.trends.group !== "" ? this.props.trends.group : ""
            let individual_params = this.props.trends.selectedOptions.length > 0 ? this.props.trends.selectedOptions.toString() : ""
            param = {
                'ship_imo': this.props.trends.ship_imo,
                'group': groupName,
                'duration': this.props.trends.duration,
                'include_outliers': this.props.trends.outliers,
                'individual_params': individual_params,
                'compare': this.props.trends.compare,
                'anomalies': this.props.trends.anomalies
            };
        }

        axios({
            method: "get",
            url: urls,
            params: param
        })
        .then((res) => {
            // this.setState({
            //     data: res.data
            // });
            this.createNamesList(res.data);
            // this.createNamesListForOutlier(res.data);
            console.log("TRENDS TABLE", res.data)
        })
        .catch((err) => {
            console.log("Error", err);
        });
    }

    createNamesList = (responseData) => {
        // Creates a list of new identifiers and a dictionary mapping the identifiers
        // to their short names
        let names = [];
        let nameObj = {};
        if('group' in responseData) {
            for(let i=0;i<responseData['group'].length;i++) {
                if(!responseData['group'][i]['name'].includes('spe_')) {
                    names.push(responseData['group'][i]['name']);
                    let tempName = responseData['group'][i]['short_names'].replace('<br />', '');
                    nameObj[responseData['group'][i]['name']] = tempName;
                }
                
            }
        }
        else {
            Object.keys(responseData['Evaluation Data']).map(key => {
                /* OLD DRY DOCK PROCESS */
                // if(key.includes('second')) {
                //     names.push(key);
                //     for(let i=0;i<responseData['Group'].length;i++) {
                //         if(responseData['Group'][i]['identifier'] === key) {
                //             nameObj[key] = responseData['Group'][i]['short_name']
                //         }
                //     }
                // }
                // if(key.includes('pred') && !key.includes('second') && !key.includes('third')) {
                //     names.push(key);
                //     for(let i=0;i<responseData['Group'].length;i++) {
                //         if(responseData['Group'][i]['identifier'] === key) {
                //             nameObj[key] = responseData['Group'][i]['short_name']
                //         }
                //     }
                // }
                // else if(key.includes('third')) {
                //     names.push(key);
                //     for(let i=0;i<responseData['Group'].length;i++) {
                //         if(responseData['Group'][i]['identifier'] === key) {
                //             nameObj[key] = responseData['Group'][i]['short_name']
                //         }
                //     }
                // }

                /* NEW DRY DOCK PROCESS */
                if(key.includes('eval') || key.includes('ref')) {
                    names.push(key);
                    for(let i=0;i<responseData['Group'].length;i++) {
                        if(responseData['Group'][i]['identifier'] === key) {
                            nameObj[key] = responseData['Group'][i]['short_name']
                        }
                    }
                }
                // if(key.includes('pred') && !key.includes('second') && !key.includes('third')) {
                //     names.push(key);
                //     for(let i=0;i<responseData['Group'].length;i++) {
                //         if(responseData['Group'][i]['identifier'] === key) {
                //             nameObj[key] = responseData['Group'][i]['short_name']
                //         }
                //     }
                // }
                // else if(key.includes('third')) {
                //     names.push(key);
                //     for(let i=0;i<responseData['Group'].length;i++) {
                //         if(responseData['Group'][i]['identifier'] === key) {
                //             nameObj[key] = responseData['Group'][i]['short_name']
                //         }
                //     }
                // }
            })
        }
        this.setState({
            names: names,
            nameObj: nameObj
        });
        console.log("TABLE NAMES HEADERS!!!!!", nameObj);
    }

    createNamesListForOutlier = (responseData, outlierhover) => {
        // Creates a list of new identifiers and a dictionary mapping the identifiers
        // to their short names only for the outlier parameters
        let names=[];
        let nameObj={};
        if(outlierhover !== null) {
            Object.keys(outlierhover).map(item => {
                names.push(item);            
            });
        }
        else {
            console.log("OUTLIER HOVER IS NULL!!!!!!!!!!!!!!!!");
        }
        
        for(let i=0;i<responseData['group'].length;i++) {
            for(let name in names) {
                if(responseData['group'][i]['name'] === name) {
                    let tempName = responseData['group'][i]['short_names'].replace('<br />', '');
                    nameObj[name] = tempName
                }
            }
        }
        console.log("OUTLIER NAMES AND OUTLIER OBJECTS!!!!!!!!!", names, nameObj)
        this.setState({
            outliernames: names,
            outlierobject: nameObj
        });
    }

    createKeyListForML = (responseData) => {
        // Creates a list of new identifiers
        // only for the KPI & ML indicator parameters
        let keys = [];
        // let intervention_keys = [];
        if('group' in responseData) {
            for(let i=0;i<responseData['group'].length;i++) {
                if(responseData['group'][i]['name'].includes('spe_')) {
                    keys.push(responseData['group'][i]['name']);
                    // let tempName1 = responseData['group'][i]['name'].replace('spe_', 'spe_limit_')
                    let tempName2 = responseData['group'][i]['name'].replace('spe_', 't2_')
                    let tempName3 = responseData['group'][i]['name'].replace('spe_', 'ewma_')
                    // keys.push(tempName1)
                    keys.push(tempName2)
                    keys.push(tempName3)
                }
            }
        }
        else {
            Object.keys(responseData['Evaluation Data']).map(key => {
                /* OLD DRY DOCK PROCESS */
                // if(key.includes('loss') && !key.includes('avg')) {
                //     keys.push(key);
                // }
                // else if(key.includes('_loss_avg')){
                //     keys.push(key)
                // }

                /* NEW DRY DOCK PROCESS */
                if(key.includes('loss') || key.includes('rise')) {
                    keys.push(key);
                }
                // else if(key.includes('_loss_avg')){
                //     keys.push(key)
                // }
            })
        }
        console.log('KEYS', keys)
        return keys;
    }

    createMLList = (responseData) => {
        // Creates a dictionary mapping the identifiers
        // to their short names only for the KPI & ML indicators parameters
        // let names = [];
        let nameObj = {};
        let keys_list = this.createKeyListForML(responseData);
        if('group' in responseData) {
            for(let i=0;i<responseData['group'].length;i++) {
                for(let j=0;j<keys_list.length;j++) {
                    // names.push(key);
                    if(keys_list[j].includes('spe_')) {
                        if(keys_list[j] === responseData['group'][i]['name']) {
                            let tempName = responseData['group'][i]['short_names'].replace('<br />', '')
                            nameObj[keys_list[j]] = this.props.trends.duration.includes('Lastyear') ? 'Exp Diff ' + tempName.replace("SPE ", "") : tempName
                        }
                        else if(keys_list[j].replace('spe_limit_', 'spe_') === responseData['group'][i]['name']) {
                            let tempName = responseData['group'][i]['short_names'].replace('SPE ', 'SPE Limit ').replace('<br />', '')
                            nameObj[keys_list[j]] = tempName
                        }
                    }
                    if(keys_list[j].includes('t2_')) {
                        if(keys_list[j].replace('t2_', 'spe_') === responseData['group'][i]['name']) {
                            let tempName = responseData['group'][i]['short_names'].replace('SPE ', 'T2 ').replace('<br />', '')
                            nameObj[keys_list[j]] = this.props.trends.duration.includes('Lastyear') ? 'Obs Diff ' + tempName.replace("T2 ", "") : tempName
                        }
                        else if(keys_list[j].replace('t2_limit_', 'spe_') === responseData['group'][i]['name']) {
                            let tempName = responseData['group'][i]['short_names'].replace('SPE ', 'T2 Limit ').replace('<br />', '')
                            nameObj[keys_list[j]] = tempName
                        }
                    }
                    if(keys_list[j].includes('ewma_')) {
                        if(keys_list[j].replace('ewma_', 'spe_') === responseData['group'][i]['name']) {
                            let tempName = responseData['group'][i]['short_names'].replace('SPE ', 'EWMA ').replace('<br />', '')
                            nameObj[keys_list[j]] = tempName
                        }
                        else if(keys_list[j].replace('ewma_', 'spe_') === responseData['group'][i]['name']) {
                            let tempName = responseData['group'][i]['short_names'].replace('SPE ', 'EWMA Limit ').replace('<br />', '')
                            nameObj[keys_list[j].replace('ewma_', 'ewma_limit_')] = tempName
                        }
                    }
                }
            }
        }
        else {
            Object.keys(responseData['Evaluation Data']).map(key => {
                /* OLD DRY DOCK PROCESS */
                // if(key.includes('loss') && !key.includes('avg')) {
                //     for(let i=0;i<responseData['Group'].length;i++) {
                //         if(responseData['Group'][i]['identifier'] === key) {
                //             nameObj[key] = responseData['Group'][i]['short_name']
                //         }
                //     }
                    
                // }
                // else if(key.includes('_loss_avg')){
                //     for(let i=0;i<responseData['Group'].length;i++) {
                //         if(responseData['Group'][i]['identifier'] === key) {
                //             nameObj[key] = responseData['Group'][i]['short_name']
                //         }
                //     }
                // }

                /* NEW DRY DOCK PROCESS */
                if(key.includes('loss') || key.includes('rise')) {
                    for(let i=0;i<responseData['Group'].length;i++) {
                        if(responseData['Group'][i]['identifier'] === key) {
                            nameObj[key] = responseData['Group'][i]['short_name']
                        }
                    }
                    
                }
                // else if(key.includes('_loss_avg')){
                //     for(let i=0;i<responseData['Group'].length;i++) {
                //         if(responseData['Group'][i]['identifier'] === key) {
                //             nameObj[key] = responseData['Group'][i]['short_name']
                //         }
                //     }
                // }
            })
        }
        console.log("ML OBJECTS", nameObj)
        this.setState({
            mlnames: keys_list,
            mlobject: nameObj
        })
    }

    createEngineobject = (fuelData) => {
        // Creates a list of new identifiers and a dictionary mapping the identifiers
        // to their short names for Engine parameters
        let engineObject = {};
        let engineNamesList = [];
        Object.keys(fuelData.fuelConsHover).map((item) => {
            if(item.includes('ME')) {
                engineObject[item] = fuelData.fuelConsHover[item]
                if(item.includes('HFO Cons')) {
                    engineNamesList[0] = item
                }
                else {
                    engineNamesList.push(item)
                }
            }
        });
        this.setState({
            engineObject: engineObject,
            engineNamesList: engineNamesList
        });
        console.log("ENGINE OBJECT!!!!!!!", engineObject, engineNamesList)
    }

    createGeneratorObject = (fuelData) => {
        // Creates a list of new identifiers and a dictionary mapping the identifiers
        // to their short names for Generator parameters
        let generatorObject = {};
        Object.keys(fuelData.fuelConsHover).map((item) => {
            if(item.includes('Gen')) {
                generatorObject[item] = fuelData.fuelConsHover[item]
            }
        });
        this.setState({
            generatorObject: generatorObject
        });
        console.log("GENERATOR OBJECT!!!!!!!", generatorObject)
    }

    createBoilerObject = (fuelData) => {
        // Creates a list of new identifiers and a dictionary mapping the identifiers
        // to their short names for Boiler parameters
        let boilerObject = {};
        Object.keys(fuelData.fuelConsHover).map((item) => {
            if(item.includes('Blr')) {
                boilerObject[item] = fuelData.fuelConsHover[item]
            }
        });
        this.setState({
            boilerObject: boilerObject
        });
    }

    render() {
        return(
            <React.Fragment>
                <Collapsible title="Engine" default={true} className="trendsheader trendscard" contentStyle={{height: "166px", overflowY: "auto", overflowX: "auto"}}>
                    <form>
                        <Table bordered responsive size="sm">
                            <thead>
                                <tr>
                                    <th style={{border: '1px solid'}}>Fuel Type</th>
                                    <th style={{border: '1px solid'}}>Reported</th>
                                    <th style={{border: '1px solid'}}>CP</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* <tr onClick={this.handleRowOpen} className="trendstr">
                                    <td>asda<FontAwesomeIcon icon={faChevronDown} style={{width: "5px", cursor: "pointer"}} onClick={this.handleRowOpen} /></td>
                                    <td>asda</td>
                                </tr>
                                { this.state.rowOpen ? (<tr>
                                    <td>child</td>
                                    <td>child</td>
                                </tr>) : null}
                                <tr>
                                    <td>asda</td>
                                    <td>asda</td>
                                </tr> */}
                                <MakeEngineTable
                                    engineObject={this.state.engineObject}
                                    nameObj={this.state.nameObj}
                                    hover={this.props.hover.hover}
                                    engineNames={this.state.engineNamesList}
                                    ship_imo={this.props.trends.ship_imo}
                                    // issues={this.props.trends.trendsData['Issues']}
                                />
                            </tbody>
                        </Table>
                    </form>
                </Collapsible>
                <Collapsible title="Weather" className="trendsheader trendscard" contentStyle={{height: "166px", overflowY: "auto", overflowX: "auto"}}>
                    <form>
                        <Table bordered responsive size="sm">
                            <thead>
                                <tr>
                                    <th style={{border: '1px solid'}}>Feature</th>
                                    <th style={{border: '1px solid'}}>Reported</th>
                                    {/* <th style={{border: '1px solid'}}>CP</th> */}
                                </tr>
                            </thead>
                            <tbody>
                                {/* <tr onClick={this.handleRowOpen} className="trendstr">
                                    <td>asda<FontAwesomeIcon icon={faChevronDown} style={{width: "5px", cursor: "pointer"}} onClick={this.handleRowOpen} /></td>
                                    <td>asda</td>
                                </tr>
                                { this.state.rowOpen ? (<tr>
                                    <td>child</td>
                                    <td>child</td>
                                </tr>) : null}
                                <tr>
                                    <td>asda</td>
                                    <td>asda</td>
                                </tr> */}
                                <MakeWeatherTable
                                    short_names={this.props.short_names}
                                    weatherhover={this.props.hover.weather}
                                    // issues={this.props.trends.trendsData['Issues']}
                                />
                            </tbody>
                        </Table>
                    </form>
                </Collapsible>
                <Collapsible title="Generator" className="trendsheader trendscard" contentStyle={{height: "101px", overflowY: "auto", overflowX: "auto"}}>
                    <form>
                        <Table bordered responsive size="sm">
                            <thead>
                                <tr>
                                    <th>Fuel Type</th>
                                    <th>Reported</th>
                                    <th>Exptd</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* <tr>
                                    <td>asda</td>
                                    <td>asda</td>
                                </tr>
                                <tr>
                                    <td>asda</td>
                                    <td>asda</td>
                                </tr> */}
                                <MakeGeneratorTable
                                    generatorObject={this.state.generatorObject}
                                    ship_imo={this.props.trends.ship_imo}
                                    // issues={this.props.trends.trendsData['Issues']} 
                                />
                            </tbody>
                        </Table>
                    </form>
                </Collapsible>
                <Collapsible title="Boiler" className="trendsheader trendscard" contentStyle={{height: "101px", overflowY: "auto", overflowX: "auto"}}>
                    <form>
                        <Table bordered responsive size="sm">
                            <thead>
                                <tr>
                                    <th>Fuel Type</th>
                                    <th>Reported</th>
                                    <th>Exptd</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* <tr>
                                    <td>asda</td>
                                    <td>asda</td>
                                </tr>
                                <tr>
                                    <td>asda</td>
                                    <td>asda</td>
                                </tr> */}
                                <MakeBoilerTable
                                    boilerObject={this.state.boilerObject}
                                    ship_imo={this.props.trends.ship_imo}
                                    // issues={this.props.trends.trendsData['Issues']}
                                />
                            </tbody>
                        </Table>
                    </form>
                </Collapsible>
                <Collapsible title="Parameters" hover={this.props.hover.hover} default={true} className="trendsheader trendscard" contentStyle={{height: "300px", overflowY: "auto", overflowX: "auto"}}>
                    <form style={{}}>
                        <Table bordered responsive size="sm">
                            <thead>
                                <tr>
                                    <th style={{border: "1px solid"}}>Feature</th>
                                    <th style={{border: "1px solid"}}>Actual</th>
                                    <th style={{border: "1px solid"}}>Exptd</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    typeof this.props.trends.compare === typeof {} &&
                                    (this.props.trends.performance_type === 'maintainance_effect' ||
                                    this.props.trends.performance_type === 'maintainance_trigger') ?
                                    <MakeDryDockTable
                                        names={this.state.names}
                                        nameObj={this.state.nameObj}
                                        drydockhover={this.props.hover.drydockhover && this.props.hover.drydockhover}
                                    /> :
                                    <MakeTable
                                        names={this.state.names}
                                        nameObj={this.state.nameObj}
                                        hover={this.props.hover.hover && this.props.hover.hover}
                                        ship_imo={this.props.trends.ship_imo}
                                        // issues={this.props.trends.trendsData['Issues']}
                                        spe_messages={this.props.hover.messageshover}
                                        outlier_messages={this.props.hover.outliermessages}
                                        outlierhover={this.props.outlierhover.outlierhover && this.props.outlierhover.outlierhover}
                                    />
                                }
                                
                            </tbody>
                        </Table>
                    </form>
                </Collapsible>
                <Collapsible title="KPI and ML Indicators" className="trendsheader trendscard" contentStyle={{height: "166px", overflowY: "auto", overflowX: "auto"}}>
                    <form>
                        <Table bordered responsive size="sm">
                            <thead>
                                <tr>
                                    <th style={{border: "1px solid"}}>Feature</th>
                                    <th style={{border: "1px solid"}}>Actual</th>
                                    <th style={{border: "1px solid"}}>Limits</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    typeof this.props.trends.compare === typeof {} &&
                                    (this.props.trends.performance_type === 'maintainance_effect' ||
                                    this.props.trends.performance_type === 'maintainance_trigger') ?
                                    <MakeDryDockMLTable
                                        names={this.state.mlnames}
                                        nameObj={this.state.mlobject}
                                        drydockhover={this.props.hover.drydockhover}
                                        order={this.props.trends.trendsData && this.props.trends.trendsData['Loss Avg Order']}
                                    /> :
                                    <MakeMLTable
                                        names={this.state.mlnames}
                                        nameObj={this.state.mlobject}
                                        hover={this.props.mlhover.mlhover && this.props.mlhover.mlhover}
                                        ship_imo={this.props.trends.ship_imo}
                                        // issues={this.props.trends.trendsData['Issues']}
                                    />
                                }
                                
                            </tbody>
                        </Table>
                    </form>
                </Collapsible>
                <Collapsible title="Outliers and Anomalies" className="trendsheader trendscard" contentStyle={{height: "130px", overflowY: "auto", overflowX: "auto"}}>
                    <form>
                        <Table bordered responsive size="sm">
                            {/* <thead>
                                <tr>
                                    <th style={{border: "1px solid"}}>Feature</th>
                                    <th style={{border: "1px solid"}}>Actual</th>
                                    <th style={{border: "1px solid"}}>Exptd</th>
                                </tr>
                            </thead> */}
                            <tbody>
                                {/* <tr>
                                    <td>asda</td>
                                    <td>asda</td>
                                </tr>
                                <tr>
                                    <td>asda</td>
                                    <td>asda</td>
                                </tr> */}
                                <MakeOutlierTable
                                    names={this.state.names}
                                    nameObj={this.state.nameObj}
                                    spe_messages={this.props.hover.messageshover}
                                    outlier_messages={this.props.hover.outliermessages}
                                />
                            </tbody>
                        </Table>
                    </form>
                </Collapsible>
            </React.Fragment>
        );
    }
}

export default connect(mapStateToProps)(TrendsTable);