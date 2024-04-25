import React from 'react';
import { connect } from 'react-redux';
import { Table } from 'react-bootstrap';
import "../../../public/CommonCss/style.css";

const mapStateToProps = state => {
    return {
        dailyData: state.dailyData,
        trends: state.trends,
        dailyCollapsible: state.dailyCollapsible
    }
}

class MakeTable extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            daily: null,
            selected: [],
            columnHeaders: [],
            // durationActual: 'm3'
            durationActual: 'm6'
        }

        this.createSelected = this.createSelected.bind(this);
        this.createColumnHeaders = this.createColumnHeaders.bind(this);
    }

    componentDidMount() {
        this.setState({
            daily: this.props.dailyData.dailyData
        });
        this.createSelected(this.props.categorySelection);
        // this.createDuration();
        // this.createColumnHeaders(this.props.dailyData.dailyData);
        // console.log(this.state.columnHeaders);
    }

    createSelected(selection) {
        let selected = selection.replace('#', '').split('-');
        let selected_if_length_greater='';
        if(selected.length > 2) {
            for(let i=1;i<selected.length;i++) {
                if(i === selected.length-1) {
                    selected_if_length_greater = selected_if_length_greater.concat(selected[i])
                }
                else {
                    selected_if_length_greater = selected_if_length_greater.concat(selected[i],'-')
                }
                // selected_if_length_greater = selected_if_length_greater.concat(selected[i],'-')
            }
            // selected_if_length_greater = selection[1] + '-' + selection[2];
            selected.splice(1, 0, selected_if_length_greater)
            console.log("SELECTED CATEGORY", selected);
            this.setState({
                selected: selected
            })
        }
        else {
            this.setState({
                selected: selected
            });
        }
    }

    createColumnHeaders(data) {
        Object.keys(data['Daily Report Column Headers']).map(item => {
            if(item === this.state.selected[0]) {
                this.setState({
                    columnHeaders: data['Daily Report Column Headers'][item]
                })
            }
        })
    }

    createDuration() {
        if(this.props.trends.duration === '30Days') {
            this.setState({
                durationActual: 'm3'
            });
        }
        else if(this.props.trends.duration === '90Days') {
            this.setState({
                durationActual: 'm6'
            });
        }
        else {
            this.setState({
                durationActual: 'm12'
            });
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if(prevProps.dailyData.dailyData !== this.props.dailyData.dailyData) {
            this.setState({
                daily: this.props.dailyData.dailyData
            });
            // this.createColumnHeaders(this.props.dailyData)
        }
        if(prevProps.categorySelection !== this.props.categorySelection) {
            this.createSelected(this.props.categorySelection);
            this.createColumnHeaders(this.props.dailyData.dailyData);
        }
        if(prevProps.dailyCollapsible.collapsibleValue !== this.props.dailyCollapsible.collapsibleValue) {
            this.createSelected(this.props.dailyCollapsible.collapsibleValue)
        }
        if(prevProps.trends.duration !== this.props.trends.duration) {
            this.createDuration();
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

    render() {
        if(this.props.dailyCollapsible.collapsibleValue !== undefined || this.props.dailyCollapsible.collapsibleValue !== null) {
            if(this.props.dailyCollapsible.collapsibleValue.includes('All')) {
                return(
                    <div id="daily_table">
                        <h4>{this.state.selected[0]}-{this.state.selected[1]}</h4>
                        <div>
                            {
                                this.state.daily && Object.keys(this.state.daily['Latest Result'][this.state.selected[0]]).map(subcat => {
                                    return (
                                        <div>
                                            <h6>{Object.keys(this.state.daily['Latest Result'][this.state.selected[0]][subcat])[0]}</h6>
                                            <Table bordered hover style={{width: "100%", wordWrap: "break-word", tableLayout: "fixed"}} size="sm">
                                                {
                                                    Object.keys(this.state.daily['Latest Result']).map(category => {
                                                        if(category === this.state.selected[0]) {
                                                            return (
                                                                <>
                                                                <thead>
                                                                    <tr style={{backgroundColor: "#256F82", color: "white"}}>
                                                                        {
                                                                            Object.keys(this.state.daily['Daily Report Column Headers']).map(item => {
                                                                                if(item === this.state.selected[0]) {
                                                                                    return (
                                                                                        this.state.daily['Daily Report Column Headers'][item].map(val => {
                                                                                            if(item !== 'VESSEL POSITION') {
                                                                                                if(val === 'Reported' || val === 'Expected' || val === 'Unit' || val === 'API_DATA' || val === 'Charter Pty' || val === 'Calculated' || val === 'Threshold') {
                                                                                                    return (
                                                                                                        <th key={val} style={{width: "8%", textAlign: 'center'}}>{val}</th>
                                                                                                    )
                                                                                                }
                                                                                                if(val === 'P') {
                                                                                                    return (
                                                                                                        <th key={val} style={{width: "2%", textAlign: 'center'}}>{val}</th>
                                                                                                    )
                                                                                                }
                                                                                                else {
                                                                                                    return (
                                                                                                        <th key={val} style={{textAlign: "center"}}>{val}</th>
                                                                                                    )
                                                                                                }
                                                                                            }
                                                                                            else {
                                                                                                return (
                                                                                                    <th key={val} style={{textAlign: "center"}}>{val}</th>
                                                                                                )
                                                                                            }
                                                                                        })
                                                                                    )
                                                                                }
                                                                            })
                                                                        }
                                                                    </tr>
                                                                </thead>
                                                                <tbody style={{backgroundColor: "#E6F2F5", color: "black"}}>
                                                                    {
                                                                        this.state.daily['Latest Result'][category].map(subcategoryObj => {
                                                                            return (
                                                                                Object.keys(subcategoryObj).map(subcategory => {
                                                                                    let subcatname = Object.keys(this.state.daily['Latest Result'][this.state.selected[0]][subcat])[0]
                                                                                    // console.log("SUBCATNAME", subcategoryObj[subcategory].length)
                                                                                    // if(subcategory === this.state.selected[1] && subcategoryObj[subcategory].length !== 0) {
                                                                                    if(subcatname === subcategory && subcategoryObj[subcategory].length > 0) {
                                                                                        if(this.state.selected[0] === 'VESSEL PARTICULARS') {
                                                                                            return (
                                                                                                this.state.daily['List of Vessel Particulars'].map(i => {
                                                                                                    return (
                                                                                                        Object.keys(subcategoryObj[subcategory]).map(item => {
                                                                                                            if(item === i) {
                                                                                                                return (
                                                                                                                    <tr key={item} style={{textAlign: "center"}}>
                                                                                                                        <td>{subcategoryObj[subcategory][item]['name']}</td>
                                                                                                                        <td>{subcategoryObj[subcategory][item]['value']}</td>
                                                                                                                    </tr>
                                                                                                                )
                                                                                                            }
                                                                                                        })
                                                                                                    )
                                                                                                })
                                                                                                
                                                                                            )
                                                                                        }
                                                                                        else if(this.state.selected[0] === 'VESSEL POSITION') {
                                                                                            return (
                                                                                                subcategoryObj[subcategory].map(item => {
                                                                                                    if(item['equipment_type'] === 'E') {
                                                                                                        return (
                                                                                                            <tr key={item['identifier']} style={{textAlign: "center"}}>
                                                                                                                <td style={{color: '#006400'}}><i>{item['name']}</i></td>
                                                                                                                <td style={{color: '#006400'}}><i>{item['processed']}</i></td>
                                                                                                                {/* <td style={{color: '#006400'}}><i>{item['processed']}</i></td> */}
                                                                                                                <td style={{color: '#006400'}}><i></i></td>
                                                                                                                <td style={{color: '#006400'}}><i></i></td>
                                                                                                            </tr>
                                                                                                        )
                                                                                                    }
                                                                                                    if(typeof item['within_outlier_limits'] === typeof undefined) {
                                                                                                        return (
                                                                                                            <tr key={item['identifier']} style={{textAlign: "center"}}>
                                                                                                                <td>{item['name']}</td>
                                                                                                                <td>{item['processed']}</td>
                                                                                                                <td></td>
                                                                                                                <td></td>
                                                                                                            </tr>
                                                                                                        )
                                                                                                    }
                                                                                                    else if(item['within_outlier_limits'][this.state.durationActual] === false) {
                                                                                                        return (
                                                                                                            <tr key={item['identifier']} style={{textAlign: "center"}}>
                                                                                                                <td style={{color: 'red'}}>{item['name']}</td>
                                                                                                                <td style={{color: 'red'}}>{item['processed']}</td>
                                                                                                                <td style={{color: 'red'}}></td>
                                                                                                                <td style={{color: 'red'}}></td>
                                                                                                            </tr>
                                                                                                        )
                                                                                                    }
                                                                                                    else if(typeof item['wihtin_operational_limits'] === typeof undefined) {
                                                                                                        return (
                                                                                                            <tr key={item['identifier']} style={{textAlign: "center"}}>
                                                                                                                <td>{item['name']}</td>
                                                                                                                <td>{item['processed']}</td>
                                                                                                                <td></td>
                                                                                                                <td></td>
                                                                                                            </tr>
                                                                                                        )
                                                                                                    }
                                                                                                    else if(item['within_operational_limits'][this.state.durationActual] === false) {
                                                                                                        return (
                                                                                                            <tr key={item['identifier']} style={{textAlign: "center"}}>
                                                                                                                <td style={{color: 'orange'}}>{item['name']}</td>
                                                                                                                <td style={{color: 'orange'}}>{item['processed']}</td>
                                                                                                                <td style={{color: 'orange'}}></td>
                                                                                                                <td style={{color: 'orange'}}></td>
                                                                                                            </tr>
                                                                                                        )
                                                                                                    }
                                                                                                    
                                                                                                    else {
                                                                                                        return (
                                                                                                            <tr key={item['identifier']} style={{textAlign: "center"}}>
                                                                                                                <td>{item['name']}</td>
                                                                                                                <td>{item['processed']}</td>
                                                                                                                <td></td>
                                                                                                                <td></td>
                                                                                                            </tr>
                                                                                                        )
                                                                                                    }
                                                                                                })
                                                                                            )
                                                                                        }
                                                                                        else if(this.state.selected[0] === 'WEATHER PARAMETERS') {
                                                                                            return (
                                                                                                subcategoryObj[subcategory].map(item => {
                                                                                                    if(item['equipment_type'] === 'E') {
                                                                                                        return (
                                                                                                            <tr key={item['identifier']} style={{textAlign: "center"}}>
                                                                                                                <td style={{color: '#006400'}}><i>{item['name']}</i></td>
                                                                                                                <td style={{color: '#006400'}}><i>{item['unit']}</i></td>
                                                                                                                {/* <td style={{color: '#006400'}}><i>{item['processed']}</i></td> */}
                                                                                                                <td style={{color: '#006400'}}><i></i></td>
                                                                                                                <td style={{color: '#006400'}}><i></i></td>
                                                                                                                <td style={{color: '#006400'}}><i></i></td>
                                                                                                                <td style={{color: '#006400'}}><i></i></td>
                                                                                                            </tr>
                                                                                                        )
                                                                                                    }
                                                                                                    if(typeof item['within_outlier_limits'] === typeof undefined) {
                                                                                                        return (
                                                                                                            <tr key={item['identifier']} style={{textAlign: "center"}}>
                                                                                                                <td>{item['name']}</td>
                                                                                                                <td>{item['unit']}</td>
                                                                                                                <td>{item['processed']}</td>
                                                                                                                <td></td>
                                                                                                                <td></td>
                                                                                                                <td></td>
                                                                                                            </tr>
                                                                                                        )
                                                                                                    }
                                                                                                    else if(item['within_outlier_limits'][this.state.durationActual] === false) {
                                                                                                        return (
                                                                                                            <tr key={item['identifier']} style={{textAlign: "center"}}>
                                                                                                                <td style={{color: 'red'}}>{item['name']}</td>
                                                                                                                <td style={{color: 'red'}}>{item['unit']}</td>
                                                                                                                <td style={{color: 'red'}}>{item['processed']}</td>
                                                                                                                <td style={{color: 'red'}}></td>
                                                                                                                <td style={{color: 'red'}}>{item['outlier_limit_msg'][this.state.durationActual]}</td>
                                                                                                                <td style={{color: 'red'}}></td>
                                                                                                            </tr>
                                                                                                        )
                                                                                                    }
                                                                                                    else if(typeof item['within_operational_limits'] === typeof undefined) {
                                                                                                        return (
                                                                                                            <tr key={item['identifier']} style={{textAlign: "center"}}>
                                                                                                                <td>{item['name']}</td>
                                                                                                                <td>{item['unit']}</td>
                                                                                                                <td>{item['processed']}</td>
                                                                                                                <td></td>
                                                                                                                <td></td>
                                                                                                                <td></td>
                                                                                                            </tr>
                                                                                                        )
                                                                                                    }
                                                                                                    else if(item['within_operational_limits'][this.state.durationActual] === false) {
                                                                                                        return (
                                                                                                            <tr key={item['identifier']} style={{textAlign: "center"}}>
                                                                                                                <td style={{color: 'orange'}}>{item['name']}</td>
                                                                                                                <td style={{color: 'orange'}}>{item['unit']}</td>
                                                                                                                <td style={{color: 'orange'}}>{item['processed']}</td>
                                                                                                                <td style={{color: 'orange'}}></td>
                                                                                                                <td style={{color: 'orange'}}>{item['operational_limit_msg'][this.state.durationActual]}</td>
                                                                                                                <td style={{color: 'orange'}}></td>
                                                                                                            </tr>
                                                                                                        )
                                                                                                    }
                                                                                                    else {
                                                                                                        return (
                                                                                                            <tr key={item['identifier']} style={{textAlign: "center"}}>
                                                                                                                <td>{item['name']}</td>
                                                                                                                <td>{item['unit']}</td>
                                                                                                                <td>{item['processed']}</td>
                                                                                                                <td></td>
                                                                                                                <td></td>
                                                                                                                <td></td>
                                                                                                            </tr>
                                                                                                        )
                                                                                                    }
                                                                                                })
                                                                                            )
                                                                                        }
                                                                                        else if(this.state.selected[0] === 'DISTANCE AND TIME') {
                                                                                            return (
                                                                                                subcategoryObj[subcategory].map(item => {
                                                                                                    if(item['equipment_type'] === 'E') {
                                                                                                        return (
                                                                                                            <tr key={item['identifier']} style={{textAlign: "center"}}>
                                                                                                                <td style={{color: '#006400'}}><i>{item['name']}</i></td>
                                                                                                                <td style={{color: '#006400'}}><i>{item['unit']}</i></td>
                                                                                                                {/* <td style={{color: '#006400'}}><i>{item['processed']}</i></td> */}
                                                                                                                <td style={{color: '#006400'}}><i></i></td>
                                                                                                                <td style={{color: '#006400'}}><i></i></td>
                                                                                                                <td style={{color: '#006400'}}><i>{item['predictions'] === undefined ? "" : item['predictions'][this.state.durationActual] === undefined || item['predictions'][this.state.durationActual] === null ? "" : item['predictions'][this.state.durationActual][1] || item['predictions']['m12'][1]}</i></td>
                                                                                                                <td style={{color: '#006400'}}><i></i></td>
                                                                                                                <td style={{color: '#006400'}}><i></i></td>
                                                                                                            </tr>
                                                                                                        )
                                                                                                    }
                                                                                                    if(typeof item['within_outlier_limits'] === typeof undefined) {
                                                                                                        return (
                                                                                                            <tr key={item['identifier']} style={{textAlign: "center"}}>
                                                                                                                <td>{item['name']}</td>
                                                                                                                <td>{item['unit']}</td>
                                                                                                                <td>{item['processed']}</td>
                                                                                                                <td></td>
                                                                                                                <td>{item['predictions'] === undefined ? "" : item['predictions'][this.state.durationActual] === undefined || item['predictions'][this.state.durationActual] === null ? "" : item['predictions'][this.state.durationActual][1] || item['predictions']['m12'][1]}</td>
                                                                                                                <td></td>
                                                                                                                <td></td>
                                                                                                            </tr>
                                                                                                        )
                                                                                                    }
                                                                                                    else if(item['within_outlier_limits'][this.state.durationActual] === false) {
                                                                                                        return (
                                                                                                            <tr key={item['identifier']} style={{textAlign: "center"}}>
                                                                                                                <td style={{color: 'red'}}>{item['name']}</td>
                                                                                                                <td style={{color: 'red'}}>{item['unit']}</td>
                                                                                                                <td style={{color: 'red'}}>{item['processed']}</td>
                                                                                                                <td style={{color: 'red'}}></td>
                                                                                                                <td style={{color: 'red'}}>{item['predictions'] === undefined ? "" : item['predictions'][this.state.durationActual] === undefined || item['predictions'][this.state.durationActual] === null ? "" : item['predictions'][this.state.durationActual][1] || item['predictions']['m12'][1]}</td>
                                                                                                                <td style={{color: 'red'}}>{item['outlier_limit_msg'][this.state.durationActual]}</td>
                                                                                                                <td style={{color: 'red'}}></td>
                                                                                                            </tr>
                                                                                                        )
                                                                                                    }
                                                                                                    else if(typeof item['within_operational_limits'] === typeof undefined) {
                                                                                                        return (
                                                                                                            <tr key={item['identifier']} style={{textAlign: "center"}}>
                                                                                                                <td>{item['name']}</td>
                                                                                                                <td>{item['unit']}</td>
                                                                                                                <td>{item['processed']}</td>
                                                                                                                <td></td>
                                                                                                                <td>{item['predictions'] === undefined ? "" : item['predictions'][this.state.durationActual] === undefined || item['predictions'][this.state.durationActual] === null ? "" : item['predictions'][this.state.durationActual][1] || item['predictions']['m12'][1]}</td>
                                                                                                                <td></td>
                                                                                                                <td></td>
                                                                                                            </tr>
                                                                                                        )
                                                                                                    }
                                                                                                    else if(item['within_operational_limits'][this.state.durationActual] === false) {
                                                                                                        return (
                                                                                                            <tr key={item['identifier']} style={{textAlign: "center"}}>
                                                                                                                <td style={{color: 'orange'}}>{item['name']}</td>
                                                                                                                <td style={{color: 'orange'}}>{item['unit']}</td>
                                                                                                                <td style={{color: 'orange'}}>{item['processed']}</td>
                                                                                                                <td style={{color: 'orange'}}></td>
                                                                                                                <td style={{color: 'orange'}}>{item['predictions'] === undefined ? "" : item['predictions'][this.state.durationActual] === undefined || item['predictions'][this.state.durationActual] === null ? "" : item['predictions'][this.state.durationActual][1] || item['predictions']['m12'][1]}</td>
                                                                                                                <td style={{color: 'orange'}}>{item['operational_limit_msg'][this.state.durationActual]}</td>
                                                                                                                <td style={{color: 'orange'}}></td>
                                                                                                            </tr>
                                                                                                        )
                                                                                                    }
                                                                                                    else {
                                                                                                        
                                                                                                        // try{
                                                                                                            if('spe_messages' in item && this.state.durationActual in item['spe_messages'] && item['spe_messages'][this.state.durationActual][2] !== null) {
                                                                                                                console.log("VIOLET!!!!!!");
                                                                                                                return (
                                                                                                                    <tr key={item['identifier']} style={{textAlign: "center"}}>
                                                                                                                        <td style={{color: 'violet'}}>{item['name']}</td>
                                                                                                                        <td style={{color: 'violet'}}>{item['unit']}</td>
                                                                                                                        <td style={{color: 'violet'}}>{item['processed']}</td>
                                                                                                                        <td style={{color: 'violet'}}></td>
                                                                                                                        <td style={{color: 'violet'}}>{item['predictions'] === undefined ? "" : item['predictions'][this.state.durationActual] === undefined || item['predictions'][this.state.durationActual] === null ? "" : item['predictions'][this.state.durationActual][1] || item['predictions']['m12'][1]}</td>
                                                                                                                        <td style={{color: 'violet'}}>{item['spe_messages'][this.state.durationActual][2]}</td>
                                                                                                                        <td style={{color: 'violet'}}></td>
                                                                                                                    </tr>
                                                                                                                )
                                                                                                            }
                                                                                                            else if('spe_messages' in item && this.state.durationActual in item['spe_messages'] && item['spe_messages'][this.state.durationActual][1] !== null) {
                                                                                                                console.log("VIOLET!!!!!!");
                                                                                                                return (
                                                                                                                    <tr key={item['identifier']} style={{textAlign: "center"}}>
                                                                                                                        <td style={{color: 'violet'}}>{item['name']}</td>
                                                                                                                        <td style={{color: 'violet'}}>{item['unit']}</td>
                                                                                                                        <td style={{color: 'violet'}}>{item['processed']}</td>
                                                                                                                        <td style={{color: 'violet'}}></td>
                                                                                                                        <td style={{color: 'violet'}}>{item['predictions'] === undefined ? "" : item['predictions'][this.state.durationActual] === undefined || item['predictions'][this.state.durationActual] === null ? "" : item['predictions'][this.state.durationActual][1] || item['predictions']['m12'][1]}</td>
                                                                                                                        <td style={{color: 'violet'}}>{item['spe_messages'][this.state.durationActual][1]}</td>
                                                                                                                        <td style={{color: 'violet'}}></td>
                                                                                                                    </tr>
                                                                                                                )
                                                                                                            }
                                                                                                            else if('spe_messages' in item && this.state.durationActual in item['spe_messages'] && item['spe_messages'][this.state.durationActual][0] !== null) {
                                                                                                                console.log("VIOLET!!!!!!");
                                                                                                                return (
                                                                                                                    <tr key={item['identifier']} style={{textAlign: "center"}}>
                                                                                                                        <td style={{color: 'violet'}}>{item['name']}</td>
                                                                                                                        <td style={{color: 'violet'}}>{item['unit']}</td>
                                                                                                                        <td style={{color: 'violet'}}>{item['processed']}</td>
                                                                                                                        <td style={{color: 'violet'}}></td>
                                                                                                                        <td style={{color: 'violet'}}>{item['predictions'] === undefined ? "" : item['predictions'][this.state.durationActual] === undefined || item['predictions'][this.state.durationActual] === null ? "" : item['predictions'][this.state.durationActual][1] || item['predictions']['m12'][1]}</td>
                                                                                                                        <td style={{color: 'violet'}}>{item['spe_messages'][this.state.durationActual][0]}</td>
                                                                                                                        <td style={{color: 'violet'}}></td>
                                                                                                                    </tr>
                                                                                                                )
                                                                                                            }
                                                                                                            // else if('is_not_t2_anamolous' in item && item['is_not_t2_anamolous'][this.state.durationActual][2] === false) {
                                                                                                            //     console.log("VIOLET!!!!!!");
                                                                                                            //     return (
                                                                                                            //         <tr key={item['identifier']} style={{textAlign: "center"}}>
                                                                                                            //             <td style={{color: 'blue'}}>{item['name']}</td>
                                                                                                            //             <td style={{color: 'blue'}}>{item['unit']}</td>
                                                                                                            //             <td style={{color: 'blue'}}>{item['processed']}</td>
                                                                                                            //             <td style={{color: 'blue'}}>{item['predictions'] === undefined ? "" : item['predictions'][this.state.durationActual] === undefined || item['predictions'][this.state.durationActual] === null ? "" : item['predictions'][this.state.durationActual][1] || item['predictions']['m12'][1]}</td>
                                                                                                            //             <td style={{color: 'blue'}}></td>
                                                                                                            //             <td style={{color: 'blue'}}></td>
                                                                                                            //         </tr>
                                                                                                            //     )
                                                                                                            // }
                                                                                                            else {
                                                                                                                return (
                                                                                                                    <tr key={item['identifier']} style={{textAlign: "center"}}>
                                                                                                                        <td>{item['name']}</td>
                                                                                                                        <td>{item['unit']}</td>
                                                                                                                        <td>{item['processed']}</td>
                                                                                                                        <td></td>
                                                                                                                        <td>{item['predictions'] === undefined ? "" : item['predictions'][this.state.durationActual] === undefined || item['predictions'][this.state.durationActual] === null ? "" : item['predictions'][this.state.durationActual][1] || item['predictions']['m12'][1]}</td>
                                                                                                                        <td></td>
                                                                                                                        <td></td>
                                                                                                                    </tr>
                                                                                                                )
                                                                                                            }
                                                                                                        // }
                                                                                                        // catch(e) {
                                                                                                        //     return (
                                                                                                        //         <tr key={item['identifier']} style={{textAlign: "center"}}>
                                                                                                        //             <td>{item['name']}</td>
                                                                                                        //             <td>{item['unit']}</td>
                                                                                                        //             <td>{item['processed']}</td>
                                                                                                        //             <td></td>
                                                                                                        //             <td>{this.state.durationActual in item['operational_limit_msg'] ? item['operational_limit_msg'][this.state.durationActual] : ""}</td>
                                                                                                        //             <td></td>
                                                                                                        //         </tr>
                                                                                                        //     )
                                                                                                        // }
                                                                                                        
                                                                                                    }
                                                                                                })
                                                                                            )
                                                                                        }
                                                                                        else if(this.state.selected[0] === 'CHANGE IN SPEED') {
                                                                                            return (
                                                                                                subcategoryObj[subcategory].map(item => {
                                                                                                    if(item['equipment_type'] === 'E') {
                                                                                                        return (
                                                                                                            <tr key={item['identifier']} style={{textAlign: "center"}}>
                                                                                                                <td style={{color: '#006400'}}><i>{item['name']}</i></td>
                                                                                                                <td style={{color: '#006400'}}><i>{item['unit']}</i></td>
                                                                                                                {/* <td style={{color: '#006400'}}><i>{item['processed']}</i></td> */}
                                                                                                                <td style={{color: '#006400'}}><i></i></td>
                                                                                                                <td style={{color: '#006400'}}><i>{item['predictions'] === undefined ? "" : item['predictions'][this.state.durationActual] === undefined || item['predictions'][this.state.durationActual] === null ? "" : item['predictions'][this.state.durationActual][1] || item['predictions']['m12'][1]}</i></td>
                                                                                                                <td style={{color: '#006400'}}><i></i></td>
                                                                                                            </tr>
                                                                                                        )
                                                                                                    }
                                                                                                    if(typeof item['within_outlier_limits'] === typeof undefined) {
                                                                                                        return (
                                                                                                            <tr key={item['identifier']} style={{textAlign: "center"}}>
                                                                                                                <td>{item['name']}</td>
                                                                                                                <td>{item['unit']}</td>
                                                                                                                <td>{item['processed']}</td>
                                                                                                                <td>{item['predictions'] === undefined ? "" : item['predictions'][this.state.durationActual] === undefined || item['predictions'][this.state.durationActual] === null ? "" : item['predictions'][this.state.durationActual][1] || item['predictions']['m12'][1]}</td>
                                                                                                                <td></td>
                                                                                                            </tr>
                                                                                                        )
                                                                                                    }
                                                                                                    else if(item['within_outlier_limits'][this.state.durationActual] === false) {
                                                                                                        return (
                                                                                                            <tr key={item['identifier']} style={{textAlign: "center"}}>
                                                                                                                <td style={{color: 'red'}}>{item['name']}</td>
                                                                                                                <td style={{color: 'red'}}>{item['unit']}</td>
                                                                                                                <td style={{color: 'red'}}>{item['processed']}</td>
                                                                                                                <td style={{color: 'red'}}>{item['predictions'] === undefined ? "" : item['predictions'][this.state.durationActual] === undefined || item['predictions'][this.state.durationActual] === null ? "" : item['predictions'][this.state.durationActual][1] || item['predictions']['m12'][1]}</td>
                                                                                                                <td style={{color: 'red'}}>{item['outlier_limit_msg'][this.state.durationActual]}</td>
                                                                                                            </tr>
                                                                                                        )
                                                                                                    }
                                                                                                    else if(typeof item['within_operational_limits'] === typeof undefined) {
                                                                                                        return (
                                                                                                            <tr key={item['identifier']} style={{textAlign: "center"}}>
                                                                                                                <td>{item['name']}</td>
                                                                                                                <td>{item['unit']}</td>
                                                                                                                <td>{item['processed']}</td>
                                                                                                                <td>{item['predictions'] === undefined ? "" : item['predictions'][this.state.durationActual] === undefined || item['predictions'][this.state.durationActual] === null ? "" : item['predictions'][this.state.durationActual][1] || item['predictions']['m12'][1]}</td>
                                                                                                                <td></td>
                                                                                                            </tr>
                                                                                                        )
                                                                                                    }
                                                                                                    else if(item['within_operational_limits'][this.state.durationActual] === false) {
                                                                                                        return (
                                                                                                            <tr key={item['identifier']} style={{textAlign: "center"}}>
                                                                                                                <td style={{color: 'orange'}}>{item['name']}</td>
                                                                                                                <td style={{color: 'orange'}}>{item['unit']}</td>
                                                                                                                <td style={{color: 'orange'}}>{item['processed']}</td>
                                                                                                                <td style={{color: 'orange'}}>{item['predictions'] === undefined ? "" : item['predictions'][this.state.durationActual] === undefined || item['predictions'][this.state.durationActual] === null ? "" : item['predictions'][this.state.durationActual][1] || item['predictions']['m12'][1]}</td>
                                                                                                                <td style={{color: 'orange'}}>{item['operational_limit_msg'][this.state.durationActual]}</td>
                                                                                                            </tr>
                                                                                                        )
                                                                                                    }
                                                                                                    else if('spe_messages' in item && this.state.durationActual in item['spe_messages'] && item['spe_messages'][this.state.durationActual][2] !== null) {
                                                                                                        return (
                                                                                                            <tr key={item['identifier']} style={{textAlign: "center"}}>
                                                                                                                <td>{item['name']}</td>
                                                                                                                <td>{item['unit']}</td>
                                                                                                                <td>{item['processed']}</td>
                                                                                                                <td>{item['predictions'] === undefined ? "" : item['predictions'][this.state.durationActual] === undefined || item['predictions'][this.state.durationActual] === null ? "" : item['predictions'][this.state.durationActual][1] || item['predictions']['m12'][1]}</td>
                                                                                                                <td>{item['spe_messages'][this.state.durationActual][2]}</td>
                                                                                                            </tr>
                                                                                                        )
                                                                                                    }
                                                                                                    else if('spe_messages' in item && this.state.durationActual in item['spe_messages'] && item['spe_messages'][this.state.durationActual][1] !== null) {
                                                                                                        return (
                                                                                                            <tr key={item['identifier']} style={{textAlign: "center"}}>
                                                                                                                <td>{item['name']}</td>
                                                                                                                <td>{item['unit']}</td>
                                                                                                                <td>{item['processed']}</td>
                                                                                                                <td>{item['predictions'] === undefined ? "" : item['predictions'][this.state.durationActual] === undefined || item['predictions'][this.state.durationActual] === null ? "" : item['predictions'][this.state.durationActual][1] || item['predictions']['m12'][1]}</td>
                                                                                                                <td>{item['spe_messages'][this.state.durationActual][1]}</td>
                                                                                                            </tr>
                                                                                                        )
                                                                                                    }
                                                                                                    else if('spe_messages' in item && this.state.durationActual in item['spe_messages'] && item['spe_messages'][this.state.durationActual][0] !== null) {
                                                                                                        return (
                                                                                                            <tr key={item['identifier']} style={{textAlign: "center"}}>
                                                                                                                <td>{item['name']}</td>
                                                                                                                <td>{item['unit']}</td>
                                                                                                                <td>{item['processed']}</td>
                                                                                                                <td>{item['predictions'] === undefined ? "" : item['predictions'][this.state.durationActual] === undefined || item['predictions'][this.state.durationActual] === null ? "" : item['predictions'][this.state.durationActual][1] || item['predictions']['m12'][1]}</td>
                                                                                                                <td>{item['spe_messages'][this.state.durationActual][0]}</td>
                                                                                                            </tr>
                                                                                                        )
                                                                                                    }
                                                                                                    else {
                                                                                                        return (
                                                                                                            <tr key={item['identifier']} style={{textAlign: "center"}}>
                                                                                                                <td>{item['name']}</td>
                                                                                                                <td>{item['unit']}</td>
                                                                                                                <td>{item['processed']}</td>
                                                                                                                <td>{item['predictions'] === undefined ? "" : item['predictions'][this.state.durationActual] === undefined || item['predictions'][this.state.durationActual] === null ? "" : item['predictions'][this.state.durationActual][1] || item['predictions']['m12'][1]}</td>
                                                                                                                <td></td>
                                                                                                            </tr>
                                                                                                        )
                                                                                                    }
                                                                                                })
                                                                                            )
                                                                                        }
                                                                                        else if(this.state.selected[0] === 'VESSEL STATUS') {
                                                                                            return (
                                                                                                subcategoryObj[subcategory].map(item => {
                                                                                                    if(subcategory == 'Charter party') {
                                                                                                        let tempName = item['identifier'].replace('_cp', '');
                                                                                                        if(item['equipment_type'] === 'E') {
                                                                                                            return (
                                                                                                                <tr key={item['identifier']} style={{textAlign: "center"}}>
                                                                                                                    <td style={{color: '#006400'}}><i>{item['name']}</i></td>
                                                                                                                    <td style={{color: '#006400'}}><i>{item['unit']}</i></td>
                                                                                                                    {/* <td style={{color: '#006400'}}><i>{item['processed']}</i></td> */}
                                                                                                                    <td style={{color: '#006400'}}><i>{this.props.dailyData.dailyData['Charter Party Values'][item['identifier']]}</i></td>
                                                                                                                    <td style={{color: '#006400'}}><i>{this.props.dailyData.dailyData['Charter Party Prediction Values'][item['identifier']]}</i></td>
                                                                                                                    <td style={{color: '#006400'}}><i>{this.props.dailyData.dailyData['Static Data'][tempName]}</i></td>
                                                                                                                    <td style={{color: '#006400'}}><i>{this.props.dailyData.dailyData['Compliance Messages']}</i></td>
                                                                                                                </tr>
                                                                                                            )
                                                                                                        }
                                                                                                        if(typeof item['within_outlier_limits'] === typeof undefined) {
                                                                                                            return (
                                                                                                                <tr key={item['identifier']} style={{textAlign: "center"}}>
                                                                                                                    <td>{item['name']}</td>
                                                                                                                    <td>{item['unit']}</td>
                                                                                                                    <td>{this.props.dailyData.dailyData['Charter Party Values'][item['identifier']]}</td>
                                                                                                                    <td>{this.props.dailyData.dailyData['Charter Party Prediction Values'][item['identifier']]}</td>
                                                                                                                    <td>{this.props.dailyData.dailyData['Static Data'][tempName]}</td>
                                                                                                                    <td>{this.props.dailyData.dailyData['Compliance Messages']}</td>
                                                                                                                </tr>
                                                                                                            )
                                                                                                        }
                                                                                                        else if(item['within_outlier_limits'][this.state.durationActual] === false) {
                                                                                                            return (
                                                                                                                <tr key={item['identifier']} style={{textAlign: "center"}}>
                                                                                                                    <td style={{color: 'red'}}>{item['name']}</td>
                                                                                                                    <td style={{color: 'red'}}>{item['unit']}</td>
                                                                                                                    <td style={{color: 'red'}}>{this.props.dailyData.dailyData['Charter Party Values'][item['identifier']]}</td>
                                                                                                                    <td style={{color: 'red'}}>{this.props.dailyData.dailyData['Charter Party Prediction Values'][item['identifier']]}</td>
                                                                                                                    <td style={{color: 'red'}}>{this.props.dailyData.dailyData['Static Data'][tempName]}</td>
                                                                                                                    <td style={{color: 'red'}}>{this.props.dailyData.dailyData['Compliance Messages']}</td>
                                                                                                                </tr>
                                                                                                            )
                                                                                                        }
                                                                                                        else if(typeof item['within_operational_limits'] === typeof undefined) {
                                                                                                            return (
                                                                                                                <tr key={item['identifier']} style={{textAlign: "center"}}>
                                                                                                                    <td>{item['name']}</td>
                                                                                                                    <td>{item['unit']}</td>
                                                                                                                    <td>{this.props.dailyData.dailyData['Charter Party Values'][item['identifier']]}</td>
                                                                                                                    <td>{this.props.dailyData.dailyData['Charter Party Prediction Values'][item['identifier']]}</td>
                                                                                                                    <td>{this.props.dailyData.dailyData['Static Data'][tempName]}</td>
                                                                                                                    <td>{this.props.dailyData.dailyData['Compliance Messages']}</td>
                                                                                                                </tr>
                                                                                                            )
                                                                                                        }
                                                                                                        else if(item['within_operational_limits'][this.state.durationActual] === false) {
                                                                                                            return (
                                                                                                                <tr key={item['identifier']} style={{textAlign: "center"}}>
                                                                                                                    <td style={{color: 'orange'}}>{item['name']}</td>
                                                                                                                    <td style={{color: 'orange'}}>{item['unit']}</td>
                                                                                                                    <td style={{color: 'orange'}}>{this.props.dailyData.dailyData['Charter Party Values'][item['identifier']]}</td>
                                                                                                                    <td style={{color: 'orange'}}>{this.props.dailyData.dailyData['Charter Party Prediction Values'][item['identifier']]}</td>
                                                                                                                    <td style={{color: 'orange'}}>{this.props.dailyData.dailyData['Static Data'][tempName]}</td>
                                                                                                                    <td style={{color: 'orange'}}>{this.props.dailyData.dailyData['Compliance Messages']}</td>
                                                                                                                </tr>
                                                                                                            )
                                                                                                        }
                                                                                                        else {
                                                                                                            return (
                                                                                                                <tr key={item['identifier']} style={{textAlign: "center"}}>
                                                                                                                    <td>{item['name']}</td>
                                                                                                                    <td>{item['unit']}</td>
                                                                                                                    <td>{this.props.dailyData.dailyData['Charter Party Values'][item['identifier']]}</td>
                                                                                                                    <td>{this.props.dailyData.dailyData['Charter Party Prediction Values'][item['identifier']]}</td>
                                                                                                                    <td>{this.props.dailyData.dailyData['Static Data'][tempName]}</td>
                                                                                                                    <td>{this.props.dailyData.dailyData['Compliance Messages']}</td>
                                                                                                                </tr>
                                                                                                            )
                                                                                                        }
                                                                                                    }
                                                                                                    else {
                                                                                                        if(item['equipment_type'] === 'E') {
                                                                                                            return (
                                                                                                                <tr key={item['identifier']} style={{textAlign: "center"}}>
                                                                                                                    <td style={{color: '#006400'}}><i>{item['name']}</i></td>
                                                                                                                    <td style={{color: '#006400'}}><i>{item['unit']}</i></td>
                                                                                                                    {/* <td style={{color: '#006400'}}><i>{item['processed']}</i></td> */}
                                                                                                                    <td style={{color: '#006400'}}><i></i></td>
                                                                                                                    <td style={{color: '#006400'}}><i>{item['predictions'] === undefined ? "" : item['predictions'][this.state.durationActual] === undefined || item['predictions'][this.state.durationActual] === null ? "" : item['predictions'][this.state.durationActual][1] || item['predictions']['m12'][1]}</i></td>
                                                                                                                    <td style={{color: '#006400'}}><i></i></td>
                                                                                                                    <td style={{color: '#006400'}}><i></i></td>
                                                                                                                </tr>
                                                                                                            )
                                                                                                        }
                                                                                                        if(typeof item['within_outlier_limits'] === typeof undefined) {
                                                                                                            return (
                                                                                                                <tr key={item['identifier']} style={{textAlign: "center"}}>
                                                                                                                    <td>{item['name']}</td>
                                                                                                                    <td>{item['unit']}</td>
                                                                                                                    <td>{item['processed']}</td>
                                                                                                                    <td>{item['predictions'] === undefined ? "" : item['predictions'][this.state.durationActual] === undefined || item['predictions'][this.state.durationActual] === null ? "" : item['predictions'][this.state.durationActual][1] || item['predictions']['m12'][1]}</td>
                                                                                                                    <td></td>
                                                                                                                    <td></td>
                                                                                                                </tr>
                                                                                                            )
                                                                                                        }
                                                                                                        else if(item['within_outlier_limits'][this.state.durationActual] === false) {
                                                                                                            return (
                                                                                                                <tr key={item['identifier']} style={{textAlign: "center"}}>
                                                                                                                    <td style={{color: 'red'}}>{item['name']}</td>
                                                                                                                    <td style={{color: 'red'}}>{item['unit']}</td>
                                                                                                                    <td style={{color: 'red'}}>{item['processed']}</td>
                                                                                                                    <td style={{color: 'red'}}>{item['predictions'] === undefined ? "" : item['predictions'][this.state.durationActual] === undefined || item['predictions'][this.state.durationActual] === null ? "" : item['predictions'][this.state.durationActual][1] || item['predictions']['m12'][1]}</td>
                                                                                                                    <td style={{color: 'red'}}></td>
                                                                                                                    <td style={{color: 'red'}}>{item['outlier_limit_msg'][this.state.durationActual]}</td>
                                                                                                                </tr>
                                                                                                            )
                                                                                                        }
                                                                                                        else if(typeof item['within_operational_limits'] === typeof undefined) {
                                                                                                            return (
                                                                                                                <tr key={item['identifier']} style={{textAlign: "center"}}>
                                                                                                                    <td>{item['name']}</td>
                                                                                                                    <td>{item['unit']}</td>
                                                                                                                    <td>{item['processed']}</td>
                                                                                                                    <td>{item['predictions'] === undefined ? "" : item['predictions'][this.state.durationActual] === undefined || item['predictions'][this.state.durationActual] === null ? "" : item['predictions'][this.state.durationActual][1] || item['predictions']['m12'][1]}</td>
                                                                                                                    <td></td>
                                                                                                                    <td></td>
                                                                                                                </tr>
                                                                                                            )
                                                                                                        }
                                                                                                        else if(item['within_operational_limits'][this.state.durationActual] === false) {
                                                                                                            return (
                                                                                                                <tr key={item['identifier']} style={{textAlign: "center"}}>
                                                                                                                    <td style={{color: 'orange'}}>{item['name']}</td>
                                                                                                                    <td style={{color: 'orange'}}>{item['unit']}</td>
                                                                                                                    <td style={{color: 'orange'}}>{item['processed']}</td>
                                                                                                                    <td style={{color: 'orange'}}>{item['predictions'] === undefined ? "" : item['predictions'][this.state.durationActual] === undefined || item['predictions'][this.state.durationActual] === null ? "" : item['predictions'][this.state.durationActual][1] || item['predictions']['m12'][1]}</td>
                                                                                                                    <td style={{color: 'orange'}}></td>
                                                                                                                    <td style={{color: 'orange'}}>{item['operational_limit_msg'][this.state.durationActual]}</td>
                                                                                                                </tr>
                                                                                                            )
                                                                                                        }
                                                                                                        else if('spe_messages' in item && this.state.durationActual in item['spe_messages'] && item['spe_messages'][this.state.durationActual][2] !== null) {
                                                                                                            return (
                                                                                                                <tr key={item['identifier']} style={{textAlign: "center"}}>
                                                                                                                    <td>{item['name']}</td>
                                                                                                                    <td>{item['unit']}</td>
                                                                                                                    <td>{item['processed']}</td>
                                                                                                                    <td>{item['predictions'] === undefined ? "" : item['predictions'][this.state.durationActual] === undefined || item['predictions'][this.state.durationActual] === null ? "" : item['predictions'][this.state.durationActual][1] || item['predictions']['m12'][1]}</td>
                                                                                                                    <td></td>
                                                                                                                    <td>{item['spe_messages'][this.state.durationActual][2]}</td>
                                                                                                                </tr>
                                                                                                            )
                                                                                                        }
                                                                                                        else if('spe_messages' in item && this.state.durationActual in item['spe_messages'] && item['spe_messages'][this.state.durationActual][1] !== null) {
                                                                                                            return (
                                                                                                                <tr key={item['identifier']} style={{textAlign: "center"}}>
                                                                                                                    <td>{item['name']}</td>
                                                                                                                    <td>{item['unit']}</td>
                                                                                                                    <td>{item['processed']}</td>
                                                                                                                    <td>{item['predictions'] === undefined ? "" : item['predictions'][this.state.durationActual] === undefined || item['predictions'][this.state.durationActual] === null ? "" : item['predictions'][this.state.durationActual][1] || item['predictions']['m12'][1]}</td>
                                                                                                                    <td></td>
                                                                                                                    <td>{item['spe_messages'][this.state.durationActual][1]}</td>
                                                                                                                </tr>
                                                                                                            )
                                                                                                        }
                                                                                                        else if('spe_messages' in item && this.state.durationActual in item['spe_messages'] && item['spe_messages'][this.state.durationActual][0] !== null) {
                                                                                                            return (
                                                                                                                <tr key={item['identifier']} style={{textAlign: "center"}}>
                                                                                                                    <td>{item['name']}</td>
                                                                                                                    <td>{item['unit']}</td>
                                                                                                                    <td>{item['processed']}</td>
                                                                                                                    <td>{item['predictions'] === undefined ? "" : item['predictions'][this.state.durationActual] === undefined || item['predictions'][this.state.durationActual] === null ? "" : item['predictions'][this.state.durationActual][1] || item['predictions']['m12'][1]}</td>
                                                                                                                    <td></td>
                                                                                                                    <td>{item['spe_messages'][this.state.durationActual][0]}</td>
                                                                                                                </tr>
                                                                                                            )
                                                                                                        }
                                                                                                        else {
                                                                                                            return (
                                                                                                                <tr key={item['identifier']} style={{textAlign: "center"}}>
                                                                                                                    <td>{item['name']}</td>
                                                                                                                    <td>{item['unit']}</td>
                                                                                                                    <td>{item['processed']}</td>
                                                                                                                    <td>{item['predictions'] === undefined ? "" : item['predictions'][this.state.durationActual] === undefined || item['predictions'][this.state.durationActual] === null ? "" : item['predictions'][this.state.durationActual][1] || item['predictions']['m12'][1]}</td>
                                                                                                                    <td></td>
                                                                                                                    <td></td>
                                                                                                                </tr>
                                                                                                            )
                                                                                                        }
                                                                                                    }
                                                                                                })
                                                                                            )
                                                                                        }
                                                                                        else {
                                                                                            return (
                                                                                                subcategoryObj[subcategory].map(item => {
                                                                                                    if(item['equipment_type'] === 'E') {
                                                                                                        return (
                                                                                                            <tr key={item['identifier']} style={{textAlign: "center"}}>
                                                                                                                <td style={{color: '#006400'}}><i>{item['name']}</i></td>
                                                                                                                <td style={{color: '#006400'}}><i>{item['unit']}</i></td>
                                                                                                                {/* <td style={{color: '#006400'}}><i>{item['processed']}</i></td> */}
                                                                                                                <td style={{color: '#006400'}}><i></i></td>
                                                                                                                <td style={{color: '#006400'}}><i>{item['predictions'] === undefined ? "" : item['predictions'][this.state.durationActual] === undefined || item['predictions'][this.state.durationActual] === null ? "" : item['predictions'][this.state.durationActual][1] || item['predictions']['m12'][1]}</i></td>
                                                                                                                <td style={{color: '#006400'}}><i></i></td>
                                                                                                                <td style={{color: '#006400'}}><i></i></td>
                                                                                                                <td style={{color: '#006400'}}><i></i></td>
                                                                                                            </tr>
                                                                                                        )
                                                                                                    }
                                                                                                    if(typeof item['within_outlier_limits'] === typeof undefined) {
                                                                                                        return (
                                                                                                            <tr key={item['identifier']} style={{textAlign: "center"}}>
                                                                                                                <td>{item['name']}</td>
                                                                                                                <td>{item['unit']}</td>
                                                                                                                <td>{item['processed']}</td>
                                                                                                                <td>{item['predictions'] === undefined ? "" : item['predictions'][this.state.durationActual] === undefined || item['predictions'][this.state.durationActual] === null ? "" : item['predictions'][this.state.durationActual][1] || item['predictions']['m12'][1]}</td>
                                                                                                                <td></td>
                                                                                                                <td></td>
                                                                                                                <td></td>
                                                                                                            </tr>
                                                                                                        )
                                                                                                    }
                                                                                                    else if(item['within_outlier_limits'][this.state.durationActual] === false) {
                                                                                                        return (
                                                                                                            <tr key={item['identifier']} style={{textAlign: "center"}}>
                                                                                                                <td style={{color: 'red'}}>{item['name']}</td>
                                                                                                                <td style={{color: 'red'}}>{item['unit']}</td>
                                                                                                                <td style={{color: 'red'}}>{item['processed']}</td>
                                                                                                                <td style={{color: 'red'}}>{item['predictions'] === undefined ? "" : item['predictions'][this.state.durationActual] === undefined || item['predictions'][this.state.durationActual] === null ? "" : item['predictions'][this.state.durationActual][1] || item['predictions']['m12'][1]}</td>
                                                                                                                <td style={{color: 'red'}}>{item['outlier_limit_msg'][this.state.durationActual]}</td>
                                                                                                                <td style={{color: 'red'}}></td>
                                                                                                                <td style={{color: 'red'}}></td>
                                                                                                            </tr>
                                                                                                        )
                                                                                                    }
                                                                                                    else if(typeof item['within_operational_limits'] === typeof undefined) {
                                                                                                        return (
                                                                                                            <tr key={item['identifier']} style={{textAlign: "center"}}>
                                                                                                                <td>{item['name']}</td>
                                                                                                                <td>{item['unit']}</td>
                                                                                                                <td>{item['processed']}</td>
                                                                                                                <td>{item['predictions'] === undefined ? "" : item['predictions'][this.state.durationActual] === undefined || item['predictions'][this.state.durationActual] === null ? "" : item['predictions'][this.state.durationActual][1] || item['predictions']['m12'][1]}</td>
                                                                                                                <td></td>
                                                                                                                <td></td>
                                                                                                                <td></td>
                                                                                                            </tr>
                                                                                                        )
                                                                                                    }
                                                                                                    else if(item['within_operational_limits'][this.state.durationActual] === false) {
                                                                                                        return (
                                                                                                            <tr key={item['identifier']} style={{textAlign: "center"}}>
                                                                                                                <td style={{color: 'orange'}}>{item['name']}</td>
                                                                                                                <td style={{color: 'orange'}}>{item['unit']}</td>
                                                                                                                <td style={{color: 'orange'}}>{item['processed']}</td>
                                                                                                                <td style={{color: 'orange'}}>{item['predictions'] === undefined ? "" : item['predictions'][this.state.durationActual] === undefined || item['predictions'][this.state.durationActual] === null ? "" : item['predictions'][this.state.durationActual][1] || item['predictions']['m12'][1]}</td>
                                                                                                                <td style={{color: 'orange'}}>{item['operational_limit_msg'][this.state.durationActual]}</td>
                                                                                                                <td style={{color: 'orange'}}></td>
                                                                                                                <td style={{color: 'orange'}}></td>
                                                                                                            </tr>
                                                                                                        )
                                                                                                    }
                                                                                                    else {
                                                                                                        
                                                                                                        // try{
                                                                                                            if('spe_messages' in item && this.state.durationActual in item['spe_messages'] && item['spe_messages'][this.state.durationActual][2] !== null) {
                                                                                                                console.log("VIOLET!!!!!!");
                                                                                                                return (
                                                                                                                    <tr key={item['identifier']} style={{textAlign: "center"}}>
                                                                                                                        <td style={{color: 'violet'}}>{item['name']}</td>
                                                                                                                        <td style={{color: 'violet'}}>{item['unit']}</td>
                                                                                                                        <td style={{color: 'violet'}}>{item['processed']}</td>
                                                                                                                        <td style={{color: 'violet'}}>{item['predictions'] === undefined ? "" : item['predictions'][this.state.durationActual] === undefined || item['predictions'][this.state.durationActual] === null ? "" : item['predictions'][this.state.durationActual][1] || item['predictions']['m12'][1]}</td>
                                                                                                                        <td style={{color: 'violet'}}>{item['spe_messages'][this.state.durationActual][2]}</td>
                                                                                                                        <td style={{color: 'violet'}}></td>
                                                                                                                        <td style={{color: 'violet'}}></td>
                                                                                                                    </tr>
                                                                                                                )
                                                                                                            }
                                                                                                            else if('spe_messages' in item && this.state.durationActual in item['spe_messages'] && item['spe_messages'][this.state.durationActual][1] !== null) {
                                                                                                                console.log("VIOLET!!!!!!");
                                                                                                                return (
                                                                                                                    <tr key={item['identifier']} style={{textAlign: "center"}}>
                                                                                                                        <td style={{color: 'violet'}}>{item['name']}</td>
                                                                                                                        <td style={{color: 'violet'}}>{item['unit']}</td>
                                                                                                                        <td style={{color: 'violet'}}>{item['processed']}</td>
                                                                                                                        <td style={{color: 'violet'}}>{item['predictions'] === undefined ? "" : item['predictions'][this.state.durationActual] === undefined || item['predictions'][this.state.durationActual] === null ? "" : item['predictions'][this.state.durationActual][1] || item['predictions']['m12'][1]}</td>
                                                                                                                        <td style={{color: 'violet'}}>{item['spe_messages'][this.state.durationActual][1]}</td>
                                                                                                                        <td style={{color: 'violet'}}></td>
                                                                                                                        <td style={{color: 'violet'}}></td>
                                                                                                                    </tr>
                                                                                                                )
                                                                                                            }
                                                                                                            else if('spe_messages' in item && this.state.durationActual in item['spe_messages'] && item['spe_messages'][this.state.durationActual][0] !== null) {
                                                                                                                console.log("VIOLET!!!!!!");
                                                                                                                return (
                                                                                                                    <tr key={item['identifier']} style={{textAlign: "center"}}>
                                                                                                                        <td style={{color: 'violet'}}>{item['name']}</td>
                                                                                                                        <td style={{color: 'violet'}}>{item['unit']}</td>
                                                                                                                        <td style={{color: 'violet'}}>{item['processed']}</td>
                                                                                                                        <td style={{color: 'violet'}}>{item['predictions'] === undefined ? "" : item['predictions'][this.state.durationActual] === undefined || item['predictions'][this.state.durationActual] === null ? "" : item['predictions'][this.state.durationActual][1] || item['predictions']['m12'][1]}</td>
                                                                                                                        <td style={{color: 'violet'}}>{item['spe_messages'][this.state.durationActual][0]}</td>
                                                                                                                        <td style={{color: 'violet'}}></td>
                                                                                                                        <td style={{color: 'violet'}}></td>
                                                                                                                    </tr>
                                                                                                                )
                                                                                                            }
                                                                                                            // else if('is_not_t2_anamolous' in item && item['is_not_t2_anamolous'][this.state.durationActual][2] === false) {
                                                                                                            //     console.log("VIOLET!!!!!!");
                                                                                                            //     return (
                                                                                                            //         <tr key={item['identifier']} style={{textAlign: "center"}}>
                                                                                                            //             <td style={{color: 'blue'}}>{item['name']}</td>
                                                                                                            //             <td style={{color: 'blue'}}>{item['unit']}</td>
                                                                                                            //             <td style={{color: 'blue'}}>{item['processed']}</td>
                                                                                                            //             <td style={{color: 'blue'}}>{item['predictions'] === undefined ? "" : item['predictions'][this.state.durationActual] === undefined || item['predictions'][this.state.durationActual] === null ? "" : item['predictions'][this.state.durationActual][1] || item['predictions']['m12'][1]}</td>
                                                                                                            //             <td style={{color: 'blue'}}>{'spe_messages' in item ? item['spe_messages'][this.state.durationActual][2] : '_t2_messages' in item ? item['_t2_messages'][this.state.durationActual][2] : 'ewma_messages' in item ? item['ewma_messages'][this.state.durationActual][2] : ""}</td>
                                                                                                            //             <td style={{color: 'blue'}}></td>
                                                                                                            //             <td style={{color: 'blue'}}></td>
                                                                                                            //         </tr>
                                                                                                            //     )
                                                                                                            // }
                                                                                                            else {
                                                                                                                return (
                                                                                                                    <tr key={item['identifier']} style={{textAlign: "center"}}>
                                                                                                                        <td>{item['name']}</td>
                                                                                                                        <td>{item['unit']}</td>
                                                                                                                        <td>{item['processed']}</td>
                                                                                                                        <td>{item['predictions'] === undefined ? "" : item['predictions'][this.state.durationActual] === undefined || item['predictions'][this.state.durationActual] === null ? "" : item['predictions'][this.state.durationActual][1] || item['predictions']['m12'][1]}</td>
                                                                                                                        <td></td>
                                                                                                                        <td></td>
                                                                                                                        <td></td>
                                                                                                                    </tr>
                                                                                                                )
                                                                                                            }
                                                                                                        // }
                                                                                                        // catch(e) {
                                                                                                        //     return (
                                                                                                        //         <tr key={item['identifier']} style={{textAlign: "center"}}>
                                                                                                        //             <td>{item['name']}</td>
                                                                                                        //             <td>{item['unit']}</td>
                                                                                                        //             <td>{item['processed']}</td>
                                                                                                        //             <td>{item['predictions'] === undefined ? "" : item['predictions'][this.state.durationActual] === undefined || item['predictions'][this.state.durationActual] === null ? "" : item['predictions'][this.state.durationActual][1] || item['predictions']['m12'][1]}</td>
                                                                                                        //             <td></td>
                                                                                                        //             <td></td>
                                                                                                        //             <td></td>
                                                                                                        //         </tr>
                                                                                                        //     )
                                                                                                        // }
                                                                                                        
                                                                                                    }
                                                                                                })
                                                                                            )
                                                                                        }
                                                                                    }
                                                                                    else {
                                                                                        return (
                                                                                            <tr>
                                                                                                {
                                                                                                    // this.props.dailyData.dailyData && <td colSpan={this.props.dailyData.dailyData['Daily Report Header Columns'][this.state.selected[0]].length - 1}>No Data Found!</td>
                                                                                                }
                                                                                            </tr>
                                                                                        )
                                                                                    }
                                                                                })
                                                                            )
                                                                        })
                                                                    }
                                                                </tbody>
                                                                </>
                                                            )
                                                        }
                                                    })
                                                }
                                            </Table>
                                        </div>
                                    )
                                })
                                
                            }
                        </div>
                    </div>
                )
            }
            else {
                return(
                    <div id="daily_table">
                        <h4>{this.state.selected[0]}-{this.state.selected[1]}</h4>
                        <div>
                            {
                                this.state.daily && <Table bordered hover style={{width: "100%", wordWrap: "break-word", tableLayout: "fixed"}} size="sm">
                                    {
                                        Object.keys(this.state.daily['Latest Result']).map(category => {
                                            if(category === this.state.selected[0]) {
                                                return (
                                                    <thead>
                                                        <tr style={{backgroundColor: "#256F82", color: "white"}}>
                                                            {
                                                                Object.keys(this.state.daily['Daily Report Column Headers']).map(item => {
                                                                    if(item === this.state.selected[0]) {
                                                                        return (
                                                                            this.state.daily['Daily Report Column Headers'][item].map(val => {
                                                                                if(item !== 'VESSEL POSITION') {
                                                                                    if(val === 'Reported' || val === 'Expected' || val === 'Unit' || val === 'API_DATA' || val === 'Charter Pty' || val === 'Calculated' || val === 'Threshold') {
                                                                                        return (
                                                                                            <th key={val} style={{width: "8%", textAlign: 'center'}}>{val}</th>
                                                                                        )
                                                                                    }
                                                                                    else if(val === 'P') {
                                                                                        return (
                                                                                            <th key={val} style={{width: "2%", textAlign: 'center'}}>{val}</th>
                                                                                        )
                                                                                    }
                                                                                    else {
                                                                                        return (
                                                                                            <th key={val} style={{textAlign: "center"}}>{val}</th>
                                                                                        )
                                                                                    }
                                                                                }
                                                                                else {
                                                                                    return (
                                                                                        <th key={val} style={{textAlign: "center"}}>{val}</th>
                                                                                    )
                                                                                }
                                                                            })
                                                                        )
                                                                    }
                                                                })
                                                            }
                                                        </tr>
                                                    </thead>
                                                )
                                            }
                                        })
                                    }
                                    {
                                        Object.keys(this.state.daily['Latest Result']).map(category => {
                                            if(category === this.state.selected[0]) {
                                                return (
                                                    <tbody style={{backgroundColor: "#E6F2F5", color: "black"}}>
                                                        {
                                                            this.state.daily['Latest Result'][category].map(subcategoryObj => {
                                                                return (
                                                                    Object.keys(subcategoryObj).map(subcategory => {
                                                                        if(subcategory === this.state.selected[1] && subcategoryObj[subcategory].length !== 0) {
                                                                            if(this.state.selected[0] === 'VESSEL PARTICULARS') {
                                                                                return (
                                                                                    this.state.daily['List of Vessel Particulars'].map(i => {
                                                                                        return (
                                                                                            Object.keys(subcategoryObj[subcategory]).map(item => {
                                                                                                if(item === i) {
                                                                                                    return (
                                                                                                        <tr key={item} style={{textAlign: "center"}}>
                                                                                                            <td>{subcategoryObj[subcategory][item]['name']}</td>
                                                                                                            <td>{subcategoryObj[subcategory][item]['value']}</td>
                                                                                                        </tr>
                                                                                                    )
                                                                                                }
                                                                                            })
                                                                                        )
                                                                                    })
                                                                                )
                                                                            }
                                                                            else if(this.state.selected[0] === 'VESSEL POSITION') {
                                                                                return (
                                                                                    subcategoryObj[subcategory].map(item => {
                                                                                        if(item['equipment_type'] === 'E') {
                                                                                            return (
                                                                                                <tr key={item['identifier']} style={{textAlign: "center"}}>
                                                                                                    <td style={{color: '#006400'}}><i>{item['name']}</i></td>
                                                                                                    <td style={{color: '#006400'}}><i>{item['processed']}</i></td>
                                                                                                    {/* <td style={{color: '#006400'}}><i>{item['processed']}</i></td> */}
                                                                                                    <td style={{color: '#006400'}}><i></i></td>
                                                                                                    <td style={{color: '#006400'}}><i></i></td>
                                                                                                </tr>
                                                                                            )
                                                                                        }
                                                                                        if(typeof item['within_outlier_limits'] === typeof undefined) {
                                                                                            return (
                                                                                                <tr key={item['identifier']} style={{textAlign: "center"}}>
                                                                                                    <td>{item['name']}</td>
                                                                                                    <td>{item['processed']}</td>
                                                                                                    <td></td>
                                                                                                    <td></td>
                                                                                                </tr>
                                                                                            )
                                                                                        }
                                                                                        else if(item['within_outlier_limits'][this.state.durationActual] === false) {
                                                                                            return (
                                                                                                <tr key={item['identifier']} style={{textAlign: "center"}}>
                                                                                                    <td style={{color: 'red'}}>{item['name']}</td>
                                                                                                    <td style={{color: 'red'}}>{item['processed']}</td>
                                                                                                    <td style={{color: 'red'}}></td>
                                                                                                    <td style={{color: 'red'}}></td>
                                                                                                </tr>
                                                                                            )
                                                                                        }
                                                                                        else if(typeof item['wihtin_operational_limits'] === typeof undefined) {
                                                                                            return (
                                                                                                <tr key={item['identifier']} style={{textAlign: "center"}}>
                                                                                                    <td>{item['name']}</td>
                                                                                                    <td>{item['processed']}</td>
                                                                                                    <td></td>
                                                                                                    <td></td>
                                                                                                </tr>
                                                                                            )
                                                                                        }
                                                                                        else if(item['within_operational_limits'][this.state.durationActual] === false) {
                                                                                            return (
                                                                                                <tr key={item['identifier']} style={{textAlign: "center"}}>
                                                                                                    <td style={{color: 'orange'}}>{item['name']}</td>
                                                                                                    <td style={{color: 'orange'}}>{item['processed']}</td>
                                                                                                    <td style={{color: 'orange'}}></td>
                                                                                                    <td style={{color: 'orange'}}></td>
                                                                                                </tr>
                                                                                            )
                                                                                        }
                                                                                        
                                                                                        else {
                                                                                            return (
                                                                                                <tr key={item['identifier']} style={{textAlign: "center"}}>
                                                                                                    <td>{item['name']}</td>
                                                                                                    <td>{item['processed']}</td>
                                                                                                    <td></td>
                                                                                                    <td></td>
                                                                                                </tr>
                                                                                            )
                                                                                        }
                                                                                    })
                                                                                )
                                                                            }
                                                                            else if(this.state.selected[0] === 'WEATHER PARAMETERS') {
                                                                                return (
                                                                                    subcategoryObj[subcategory].map(item => {
                                                                                        if(item['equipment_type'] === 'E') {
                                                                                            return (
                                                                                                <tr key={item['identifier']} style={{textAlign: "center"}}>
                                                                                                    <td style={{color: '#006400'}}><i>{item['name']}</i></td>
                                                                                                    <td style={{color: '#006400'}}><i>{item['unit']}</i></td>
                                                                                                    {/* <td style={{color: '#006400'}}><i>{item['processed']}</i></td> */}
                                                                                                    <td style={{color: '#006400'}}><i></i></td>
                                                                                                    <td style={{color: '#006400'}}><i></i></td>
                                                                                                    <td style={{color: '#006400'}}><i></i></td>
                                                                                                    <td style={{color: '#006400'}}><i></i></td>
                                                                                                </tr>
                                                                                            )
                                                                                        }
                                                                                        if(typeof item['within_outlier_limits'] === typeof undefined) {
                                                                                            return (
                                                                                                <tr key={item['identifier']} style={{textAlign: "center"}}>
                                                                                                    <td>{item['name']}</td>
                                                                                                    <td>{item['unit']}</td>
                                                                                                    <td>{item['processed']}</td>
                                                                                                    <td></td>
                                                                                                    <td></td>
                                                                                                    <td></td>
                                                                                                </tr>
                                                                                            )
                                                                                        }
                                                                                        else if(item['within_outlier_limits'][this.state.durationActual] === false) {
                                                                                            return (
                                                                                                <tr key={item['identifier']} style={{textAlign: "center"}}>
                                                                                                    <td style={{color: 'red'}}>{item['name']}</td>
                                                                                                    <td style={{color: 'red'}}>{item['unit']}</td>
                                                                                                    <td style={{color: 'red'}}>{item['processed']}</td>
                                                                                                    <td style={{color: 'red'}}></td>
                                                                                                    <td style={{color: 'red'}}>{item['outlier_limit_msg'][this.state.durationActual]}</td>
                                                                                                    <td style={{color: 'red'}}></td>
                                                                                                </tr>
                                                                                            )
                                                                                        }
                                                                                        else if(typeof item['within_operational_limits'] === typeof undefined) {
                                                                                            return (
                                                                                                <tr key={item['identifier']} style={{textAlign: "center"}}>
                                                                                                    <td>{item['name']}</td>
                                                                                                    <td>{item['unit']}</td>
                                                                                                    <td>{item['processed']}</td>
                                                                                                    <td></td>
                                                                                                    <td></td>
                                                                                                    <td></td>
                                                                                                </tr>
                                                                                            )
                                                                                        }
                                                                                        else if(item['within_operational_limits'][this.state.durationActual] === false) {
                                                                                            return (
                                                                                                <tr key={item['identifier']} style={{textAlign: "center"}}>
                                                                                                    <td style={{color: 'orange'}}>{item['name']}</td>
                                                                                                    <td style={{color: 'orange'}}>{item['unit']}</td>
                                                                                                    <td style={{color: 'orange'}}>{item['processed']}</td>
                                                                                                    <td style={{color: 'orange'}}></td>
                                                                                                    <td style={{color: 'orange'}}>{item['operational_limit_msg'][this.state.durationActual]}</td>
                                                                                                    <td style={{color: 'orange'}}></td>
                                                                                                </tr>
                                                                                            )
                                                                                        }
                                                                                        else {
                                                                                            return (
                                                                                                <tr key={item['identifier']} style={{textAlign: "center"}}>
                                                                                                    <td>{item['name']}</td>
                                                                                                    <td>{item['unit']}</td>
                                                                                                    <td>{item['processed']}</td>
                                                                                                    <td></td>
                                                                                                    <td></td>
                                                                                                    <td></td>
                                                                                                </tr>
                                                                                            )
                                                                                        }
                                                                                    })
                                                                                )
                                                                            }
                                                                            else if(this.state.selected[0] === 'DISTANCE AND TIME') {
                                                                                return (
                                                                                    subcategoryObj[subcategory].map(item => {
                                                                                        if(item['equipment_type'] === 'E') {
                                                                                            return (
                                                                                                <tr key={item['identifier']} style={{textAlign: "center"}}>
                                                                                                    <td style={{color: '#006400'}}><i>{item['name']}</i></td>
                                                                                                    <td style={{color: '#006400'}}><i>{item['unit']}</i></td>
                                                                                                    {/* <td style={{color: '#006400'}}><i>{item['processed']}</i></td> */}
                                                                                                    <td style={{color: '#006400'}}><i></i></td>
                                                                                                    <td style={{color: '#006400'}}><i></i></td>
                                                                                                    <td style={{color: '#006400'}}><i>{item['predictions'] === undefined ? "" : item['predictions'][this.state.durationActual] === undefined || item['predictions'][this.state.durationActual] === null ? "" : item['predictions'][this.state.durationActual][1] || item['predictions']['m12'][1]}</i></td>
                                                                                                    <td style={{color: '#006400'}}><i></i></td>
                                                                                                    <td style={{color: '#006400'}}><i></i></td>
                                                                                                </tr>
                                                                                            )
                                                                                        }
                                                                                        if(typeof item['within_outlier_limits'] === typeof undefined) {
                                                                                            return (
                                                                                                <tr key={item['identifier']} style={{textAlign: "center"}}>
                                                                                                    <td>{item['name']}</td>
                                                                                                    <td>{item['unit']}</td>
                                                                                                    <td>{item['processed']}</td>
                                                                                                    <td></td>
                                                                                                    <td>{item['predictions'] === undefined ? "" : item['predictions'][this.state.durationActual] === undefined || item['predictions'][this.state.durationActual] === null ? "" : item['predictions'][this.state.durationActual][1] || item['predictions']['m12'][1]}</td>
                                                                                                    <td></td>
                                                                                                    <td></td>
                                                                                                </tr>
                                                                                            )
                                                                                        }
                                                                                        else if(item['within_outlier_limits'][this.state.durationActual] === false) {
                                                                                            return (
                                                                                                <tr key={item['identifier']} style={{textAlign: "center"}}>
                                                                                                    <td style={{color: 'red'}}>{item['name']}</td>
                                                                                                    <td style={{color: 'red'}}>{item['unit']}</td>
                                                                                                    <td style={{color: 'red'}}>{item['processed']}</td>
                                                                                                    <td style={{color: 'red'}}></td>
                                                                                                    <td style={{color: 'red'}}>{item['predictions'] === undefined ? "" : item['predictions'][this.state.durationActual] === undefined || item['predictions'][this.state.durationActual] === null ? "" : item['predictions'][this.state.durationActual][1] || item['predictions']['m12'][1]}</td>
                                                                                                    <td style={{color: 'red'}}>{item['outlier_limit_msg'][this.state.durationActual]}</td>
                                                                                                    <td style={{color: 'red'}}></td>
                                                                                                </tr>
                                                                                            )
                                                                                        }
                                                                                        else if(typeof item['within_operational_limits'] === typeof undefined) {
                                                                                            return (
                                                                                                <tr key={item['identifier']} style={{textAlign: "center"}}>
                                                                                                    <td>{item['name']}</td>
                                                                                                    <td>{item['unit']}</td>
                                                                                                    <td>{item['processed']}</td>
                                                                                                    <td></td>
                                                                                                    <td>{item['predictions'] === undefined ? "" : item['predictions'][this.state.durationActual] === undefined || item['predictions'][this.state.durationActual] === null ? "" : item['predictions'][this.state.durationActual][1] || item['predictions']['m12'][1]}</td>
                                                                                                    <td></td>
                                                                                                    <td></td>
                                                                                                </tr>
                                                                                            )
                                                                                        }
                                                                                        else if(item['within_operational_limits'][this.state.durationActual] === false) {
                                                                                            return (
                                                                                                <tr key={item['identifier']} style={{textAlign: "center"}}>
                                                                                                    <td style={{color: 'orange'}}>{item['name']}</td>
                                                                                                    <td style={{color: 'orange'}}>{item['unit']}</td>
                                                                                                    <td style={{color: 'orange'}}>{item['processed']}</td>
                                                                                                    <td style={{color: 'orange'}}></td>
                                                                                                    <td style={{color: 'orange'}}>{item['predictions'] === undefined ? "" : item['predictions'][this.state.durationActual] === undefined || item['predictions'][this.state.durationActual] === null ? "" : item['predictions'][this.state.durationActual][1] || item['predictions']['m12'][1]}</td>
                                                                                                    <td style={{color: 'orange'}}>{item['operational_limit_msg'][this.state.durationActual]}</td>
                                                                                                    <td style={{color: 'orange'}}></td>
                                                                                                </tr>
                                                                                            )
                                                                                        }
                                                                                        else {
                                                                                            
                                                                                            // try{
                                                                                                if('spe_messages' in item && this.state.durationActual in item['spe_messages'] && item['spe_messages'][this.state.durationActual][2] !== null) {
                                                                                                    console.log("VIOLET!!!!!!");
                                                                                                    return (
                                                                                                        <tr key={item['identifier']} style={{textAlign: "center"}}>
                                                                                                            <td style={{color: 'violet'}}>{item['name']}</td>
                                                                                                            <td style={{color: 'violet'}}>{item['unit']}</td>
                                                                                                            <td style={{color: 'violet'}}>{item['processed']}</td>
                                                                                                            <td style={{color: 'violet'}}></td>
                                                                                                            <td style={{color: 'violet'}}>{item['predictions'] === undefined ? "" : item['predictions'][this.state.durationActual] === undefined || item['predictions'][this.state.durationActual] === null ? "" : item['predictions'][this.state.durationActual][1] || item['predictions']['m12'][1]}</td>
                                                                                                            <td style={{color: 'violet'}}>{item['spe_messages'][this.state.durationActual][2]}</td>
                                                                                                            <td style={{color: 'violet'}}></td>
                                                                                                        </tr>
                                                                                                    )
                                                                                                }
                                                                                                else if('spe_messages' in item && this.state.durationActual in item['spe_messages'] && item['spe_messages'][this.state.durationActual][1] !== null) {
                                                                                                    console.log("VIOLET!!!!!!");
                                                                                                    return (
                                                                                                        <tr key={item['identifier']} style={{textAlign: "center"}}>
                                                                                                            <td style={{color: 'violet'}}>{item['name']}</td>
                                                                                                            <td style={{color: 'violet'}}>{item['unit']}</td>
                                                                                                            <td style={{color: 'violet'}}>{item['processed']}</td>
                                                                                                            <td style={{color: 'violet'}}></td>
                                                                                                            <td style={{color: 'violet'}}>{item['predictions'] === undefined ? "" : item['predictions'][this.state.durationActual] === undefined || item['predictions'][this.state.durationActual] === null ? "" : item['predictions'][this.state.durationActual][1] || item['predictions']['m12'][1]}</td>
                                                                                                            <td style={{color: 'violet'}}>{item['spe_messages'][this.state.durationActual][1]}</td>
                                                                                                            <td style={{color: 'violet'}}></td>
                                                                                                        </tr>
                                                                                                    )
                                                                                                }
                                                                                                else if('spe_messages' in item && this.state.durationActual in item['spe_messages'] && item['spe_messages'][this.state.durationActual][0] !== null) {
                                                                                                    console.log("VIOLET!!!!!!");
                                                                                                    return (
                                                                                                        <tr key={item['identifier']} style={{textAlign: "center"}}>
                                                                                                            <td style={{color: 'violet'}}>{item['name']}</td>
                                                                                                            <td style={{color: 'violet'}}>{item['unit']}</td>
                                                                                                            <td style={{color: 'violet'}}>{item['processed']}</td>
                                                                                                            <td style={{color: 'violet'}}></td>
                                                                                                            <td style={{color: 'violet'}}>{item['predictions'] === undefined ? "" : item['predictions'][this.state.durationActual] === undefined || item['predictions'][this.state.durationActual] === null ? "" : item['predictions'][this.state.durationActual][1] || item['predictions']['m12'][1]}</td>
                                                                                                            <td style={{color: 'violet'}}>{item['spe_messages'][this.state.durationActual][0]}</td>
                                                                                                            <td style={{color: 'violet'}}></td>
                                                                                                        </tr>
                                                                                                    )
                                                                                                }
                                                                                                // else if('is_not_t2_anamolous' in item && item['is_not_t2_anamolous'][this.state.durationActual][2] === false) {
                                                                                                //     console.log("VIOLET!!!!!!");
                                                                                                //     return (
                                                                                                //         <tr key={item['identifier']} style={{textAlign: "center"}}>
                                                                                                //             <td style={{color: 'blue'}}>{item['name']}</td>
                                                                                                //             <td style={{color: 'blue'}}>{item['unit']}</td>
                                                                                                //             <td style={{color: 'blue'}}>{item['processed']}</td>
                                                                                                //             <td style={{color: 'blue'}}>{item['predictions'] === undefined ? "" : item['predictions'][this.state.durationActual] === undefined || item['predictions'][this.state.durationActual] === null ? "" : item['predictions'][this.state.durationActual][1] || item['predictions']['m12'][1]}</td>
                                                                                                //             <td style={{color: 'blue'}}></td>
                                                                                                //             <td style={{color: 'blue'}}></td>
                                                                                                //         </tr>
                                                                                                //     )
                                                                                                // }
                                                                                                else {
                                                                                                    return (
                                                                                                        <tr key={item['identifier']} style={{textAlign: "center"}}>
                                                                                                            <td>{item['name']}</td>
                                                                                                            <td>{item['unit']}</td>
                                                                                                            <td>{item['processed']}</td>
                                                                                                            <td></td>
                                                                                                            <td>{item['predictions'] === undefined ? "" : item['predictions'][this.state.durationActual] === undefined || item['predictions'][this.state.durationActual] === null ? "" : item['predictions'][this.state.durationActual][1] || item['predictions']['m12'][1]}</td>
                                                                                                            <td></td>
                                                                                                            <td></td>
                                                                                                        </tr>
                                                                                                    )
                                                                                                }
                                                                                            // }
                                                                                            // catch(e) {
                                                                                            //     return (
                                                                                            //         <tr key={item['identifier']} style={{textAlign: "center"}}>
                                                                                            //             <td>{item['name']}</td>
                                                                                            //             <td>{item['unit']}</td>
                                                                                            //             <td>{item['processed']}</td>
                                                                                            //             <td></td>
                                                                                            //             <td>{this.state.durationActual in item['operational_limit_msg'] ? item['operational_limit_msg'][this.state.durationActual] : ""}</td>
                                                                                            //             <td></td>
                                                                                            //         </tr>
                                                                                            //     )
                                                                                            // }
                                                                                            
                                                                                        }
                                                                                    })
                                                                                )
                                                                            }
                                                                            else if(this.state.selected[0] === 'CHANGE IN SPEED') {
                                                                                return (
                                                                                    subcategoryObj[subcategory].map(item => {
                                                                                        if(item['equipment_type'] === 'E') {
                                                                                            return (
                                                                                                <tr key={item['identifier']} style={{textAlign: "center"}}>
                                                                                                    <td style={{color: '#006400'}}><i>{item['name']}</i></td>
                                                                                                    <td style={{color: '#006400'}}><i>{item['unit']}</i></td>
                                                                                                    {/* <td style={{color: '#006400'}}><i>{item['processed']}</i></td> */}
                                                                                                    <td style={{color: '#006400'}}><i></i></td>
                                                                                                    <td style={{color: '#006400'}}><i>{item['predictions'] === undefined ? "" : item['predictions'][this.state.durationActual] === undefined || item['predictions'][this.state.durationActual] === null ? "" : item['predictions'][this.state.durationActual][1] || item['predictions']['m12'][1]}</i></td>
                                                                                                    <td style={{color: '#006400'}}><i></i></td>
                                                                                                </tr>
                                                                                            )
                                                                                        }
                                                                                        if(typeof item['within_outlier_limits'] === typeof undefined) {
                                                                                            return (
                                                                                                <tr key={item['identifier']} style={{textAlign: "center"}}>
                                                                                                    <td>{item['name']}</td>
                                                                                                    <td>{item['unit']}</td>
                                                                                                    <td>{item['processed']}</td>
                                                                                                    <td>{item['predictions'] === undefined ? "" : item['predictions'][this.state.durationActual] === undefined || item['predictions'][this.state.durationActual] === null ? "" : item['predictions'][this.state.durationActual][1] || item['predictions']['m12'][1]}</td>
                                                                                                    <td></td>
                                                                                                </tr>
                                                                                            )
                                                                                        }
                                                                                        else if(item['within_outlier_limits'][this.state.durationActual] === false) {
                                                                                            return (
                                                                                                <tr key={item['identifier']} style={{textAlign: "center"}}>
                                                                                                    <td style={{color: 'red'}}>{item['name']}</td>
                                                                                                    <td style={{color: 'red'}}>{item['unit']}</td>
                                                                                                    <td style={{color: 'red'}}>{item['processed']}</td>
                                                                                                    <td style={{color: 'red'}}>{item['predictions'] === undefined ? "" : item['predictions'][this.state.durationActual] === undefined || item['predictions'][this.state.durationActual] === null ? "" : item['predictions'][this.state.durationActual][1] || item['predictions']['m12'][1]}</td>
                                                                                                    <td style={{color: 'red'}}>{item['outlier_limit_msg'][this.state.durationActual]}</td>
                                                                                                </tr>
                                                                                            )
                                                                                        }
                                                                                        else if(typeof item['within_operational_limits'] === typeof undefined) {
                                                                                            return (
                                                                                                <tr key={item['identifier']} style={{textAlign: "center"}}>
                                                                                                    <td>{item['name']}</td>
                                                                                                    <td>{item['unit']}</td>
                                                                                                    <td>{item['processed']}</td>
                                                                                                    <td>{item['predictions'] === undefined ? "" : item['predictions'][this.state.durationActual] === undefined || item['predictions'][this.state.durationActual] === null ? "" : item['predictions'][this.state.durationActual][1] || item['predictions']['m12'][1]}</td>
                                                                                                    <td></td>
                                                                                                </tr>
                                                                                            )
                                                                                        }
                                                                                        else if(item['within_operational_limits'][this.state.durationActual] === false) {
                                                                                            return (
                                                                                                <tr key={item['identifier']} style={{textAlign: "center"}}>
                                                                                                    <td style={{color: 'orange'}}>{item['name']}</td>
                                                                                                    <td style={{color: 'orange'}}>{item['unit']}</td>
                                                                                                    <td style={{color: 'orange'}}>{item['processed']}</td>
                                                                                                    <td style={{color: 'orange'}}>{item['predictions'] === undefined ? "" : item['predictions'][this.state.durationActual] === undefined || item['predictions'][this.state.durationActual] === null ? "" : item['predictions'][this.state.durationActual][1] || item['predictions']['m12'][1]}</td>
                                                                                                    <td style={{color: 'orange'}}>{item['operational_limit_msg'][this.state.durationActual]}</td>
                                                                                                </tr>
                                                                                            )
                                                                                        }
                                                                                        else if('spe_messages' in item && this.state.durationActual in item['spe_messages'] && item['spe_messages'][this.state.durationActual][2] !== null) {
                                                                                            console.log("VIOLET!!!!!!");
                                                                                            return (
                                                                                                <tr key={item['identifier']} style={{textAlign: "center"}}>
                                                                                                    <td>{item['name']}</td>
                                                                                                    <td>{item['unit']}</td>
                                                                                                    <td>{item['processed']}</td>
                                                                                                    <td>{item['predictions'] === undefined ? "" : item['predictions'][this.state.durationActual] === undefined || item['predictions'][this.state.durationActual] === null ? "" : item['predictions'][this.state.durationActual][1] || item['predictions']['m12'][1]}</td>
                                                                                                    <td>{item['spe_messages'][this.state.durationActual][2]}</td>
                                                                                                </tr>
                                                                                            )
                                                                                        }
                                                                                        else if('spe_messages' in item && this.state.durationActual in item['spe_messages'] && item['spe_messages'][this.state.durationActual][1] !== null) {
                                                                                            console.log("VIOLET!!!!!!");
                                                                                            return (
                                                                                                <tr key={item['identifier']} style={{textAlign: "center"}}>
                                                                                                    <td>{item['name']}</td>
                                                                                                    <td>{item['unit']}</td>
                                                                                                    <td>{item['processed']}</td>
                                                                                                    <td>{item['predictions'] === undefined ? "" : item['predictions'][this.state.durationActual] === undefined || item['predictions'][this.state.durationActual] === null ? "" : item['predictions'][this.state.durationActual][1] || item['predictions']['m12'][1]}</td>
                                                                                                    <td>{item['spe_messages'][this.state.durationActual][1]}</td>
                                                                                                </tr>
                                                                                            )
                                                                                        }
                                                                                        else if('spe_messages' in item && this.state.durationActual in item['spe_messages'] && item['spe_messages'][this.state.durationActual][0] !== null) {
                                                                                            console.log("VIOLET!!!!!!");
                                                                                            return (
                                                                                                <tr key={item['identifier']} style={{textAlign: "center"}}>
                                                                                                    <td>{item['name']}</td>
                                                                                                    <td>{item['unit']}</td>
                                                                                                    <td>{item['processed']}</td>
                                                                                                    <td>{item['predictions'] === undefined ? "" : item['predictions'][this.state.durationActual] === undefined || item['predictions'][this.state.durationActual] === null ? "" : item['predictions'][this.state.durationActual][1] || item['predictions']['m12'][1]}</td>
                                                                                                    <td>{item['spe_messages'][this.state.durationActual][0]}</td>
                                                                                                </tr>
                                                                                            )
                                                                                        }
                                                                                        else {
                                                                                            return (
                                                                                                <tr key={item['identifier']} style={{textAlign: "center"}}>
                                                                                                    <td>{item['name']}</td>
                                                                                                    <td>{item['unit']}</td>
                                                                                                    <td>{item['processed']}</td>
                                                                                                    <td>{item['predictions'] === undefined ? "" : item['predictions'][this.state.durationActual] === undefined || item['predictions'][this.state.durationActual] === null ? "" : item['predictions'][this.state.durationActual][1] || item['predictions']['m12'][1]}</td>
                                                                                                    <td></td>
                                                                                                </tr>
                                                                                            )
                                                                                        }
                                                                                    })
                                                                                )
                                                                            }
                                                                            else if(this.state.selected[0] === 'VESSEL STATUS') {
                                                                                return (
                                                                                    subcategoryObj[subcategory].map(item => {
                                                                                        if(subcategory == 'Charter party') {
                                                                                            let tempName = item['identifier'].replace('_cp','');
                                                                                            if(item['equipment_type'] === 'E') {
                                                                                                return (
                                                                                                    <tr key={item['identifier']} style={{textAlign: "center"}}>
                                                                                                        <td style={{color: '#006400'}}><i>{item['name']}</i></td>
                                                                                                        <td style={{color: '#006400'}}><i>{item['unit']}</i></td>
                                                                                                        {/* <td style={{color: '#006400'}}><i>{item['processed']}</i></td> */}
                                                                                                        <td style={{color: '#006400'}}><i>{this.props.dailyData.dailyData['Charter Party Values'][item['identifier']]}</i></td>
                                                                                                        <td style={{color: '#006400'}}><i>{this.props.dailyData.dailyData['Charter Party Prediction Values'][item['identifier']]}</i></td>
                                                                                                        <td style={{color: '#006400'}}><i>{this.props.dailyData.dailyData['Static Data'][tempName]}</i></td>
                                                                                                        <td style={{color: '#006400'}}><i>{this.props.dailyData.dailyData['Compliance Messages']}</i></td>
                                                                                                    </tr>
                                                                                                )
                                                                                            }
                                                                                            if(typeof item['within_outlier_limits'] === typeof undefined) {
                                                                                                return (
                                                                                                    <tr key={item['identifier']} style={{textAlign: "center"}}>
                                                                                                        <td>{item['name']}</td>
                                                                                                        <td>{item['unit']}</td>
                                                                                                        <td>{this.props.dailyData.dailyData['Charter Party Values'][item['identifier']]}</td>
                                                                                                        <td>{this.props.dailyData.dailyData['Charter Party Prediction Values'][item['identifier']]}</td>
                                                                                                        <td>{this.props.dailyData.dailyData['Static Data'][tempName]}</td>
                                                                                                        <td>{this.props.dailyData.dailyData['Compliance Messages']}</td>
                                                                                                    </tr>
                                                                                                )
                                                                                            }
                                                                                            else if(item['within_outlier_limits'][this.state.durationActual] === false) {
                                                                                                return (
                                                                                                    <tr key={item['identifier']} style={{textAlign: "center"}}>
                                                                                                        <td style={{color: 'red'}}>{item['name']}</td>
                                                                                                        <td style={{color: 'red'}}>{item['unit']}</td>
                                                                                                        <td style={{color: 'red'}}>{this.props.dailyData.dailyData['Charter Party Values'][item['identifier']]}</td>
                                                                                                        <td style={{color: 'red'}}>{this.props.dailyData.dailyData['Charter Party Prediction Values'][item['identifier']]}</td>
                                                                                                        <td style={{color: 'red'}}>{this.props.dailyData.dailyData['Static Data'][tempName]}</td>
                                                                                                        <td style={{color: 'red'}}>{this.props.dailyData.dailyData['Compliance Messages']}</td>
                                                                                                    </tr>
                                                                                                )
                                                                                            }
                                                                                            else if(typeof item['within_operational_limits'] === typeof undefined) {
                                                                                                return (
                                                                                                    <tr key={item['identifier']} style={{textAlign: "center"}}>
                                                                                                        <td>{item['name']}</td>
                                                                                                        <td>{item['unit']}</td>
                                                                                                        <td>{this.props.dailyData.dailyData['Charter Party Values'][item['identifier']]}</td>
                                                                                                        <td>{this.props.dailyData.dailyData['Charter Party Prediction Values'][item['identifier']]}</td>
                                                                                                        <td>{this.props.dailyData.dailyData['Static Data'][tempName]}</td>
                                                                                                        <td>{this.props.dailyData.dailyData['Compliance Messages']}</td>
                                                                                                    </tr>
                                                                                                )
                                                                                            }
                                                                                            else if(item['within_operational_limits'][this.state.durationActual] === false) {
                                                                                                return (
                                                                                                    <tr key={item['identifier']} style={{textAlign: "center"}}>
                                                                                                        <td style={{color: 'orange'}}>{item['name']}</td>
                                                                                                        <td style={{color: 'orange'}}>{item['unit']}</td>
                                                                                                        <td style={{color: 'orange'}}>{this.props.dailyData.dailyData['Charter Party Values'][item['identifier']]}</td>
                                                                                                        <td style={{color: 'orange'}}>{this.props.dailyData.dailyData['Charter Party Prediction Values'][item['identifier']]}</td>
                                                                                                        <td style={{color: 'orange'}}>{this.props.dailyData.dailyData['Static Data'][tempName]}</td>
                                                                                                        <td style={{color: 'orange'}}>{this.props.dailyData.dailyData['Compliance Messages']}</td>
                                                                                                    </tr>
                                                                                                )
                                                                                            }
                                                                                            else {
                                                                                                return (
                                                                                                    <tr key={item['identifier']} style={{textAlign: "center"}}>
                                                                                                        <td>{item['name']}</td>
                                                                                                        <td>{item['unit']}</td>
                                                                                                        <td>{this.props.dailyData.dailyData['Charter Party Values'][item['identifier']]}</td>
                                                                                                        <td>{this.props.dailyData.dailyData['Charter Party Prediction Values'][item['identifier']]}</td>
                                                                                                        <td>{this.props.dailyData.dailyData['Static Data'][tempName]}</td>
                                                                                                        <td>{this.props.dailyData.dailyData['Compliance Messages']}</td>
                                                                                                    </tr>
                                                                                                )
                                                                                            }
                                                                                        }
                                                                                        else {
                                                                                            if(item['equipment_type'] === 'E') {
                                                                                                return (
                                                                                                    <tr key={item['identifier']} style={{textAlign: "center"}}>
                                                                                                        <td style={{color: '#006400'}}><i>{item['name']}</i></td>
                                                                                                        <td style={{color: '#006400'}}><i>{item['unit']}</i></td>
                                                                                                        {/* <td style={{color: '#006400'}}><i>{item['processed']}</i></td> */}
                                                                                                        <td style={{color: '#006400'}}><i></i></td>
                                                                                                        <td style={{color: '#006400'}}><i>{item['predictions'] === undefined ? "" : item['predictions'][this.state.durationActual] === undefined || item['predictions'][this.state.durationActual] === null ? "" : item['predictions'][this.state.durationActual][1] || item['predictions']['m12'][1]}</i></td>
                                                                                                        <td style={{color: '#006400'}}><i></i></td>
                                                                                                        <td style={{color: '#006400'}}><i></i></td>
                                                                                                    </tr>
                                                                                                )
                                                                                            }
                                                                                            if(typeof item['within_outlier_limits'] === typeof undefined) {
                                                                                                return (
                                                                                                    <tr key={item['identifier']} style={{textAlign: "center"}}>
                                                                                                        <td>{item['name']}</td>
                                                                                                        <td>{item['unit']}</td>
                                                                                                        <td>{item['processed']}</td>
                                                                                                        <td>{item['predictions'] === undefined ? "" : item['predictions'][this.state.durationActual] === undefined || item['predictions'][this.state.durationActual] === null ? "" : item['predictions'][this.state.durationActual][1] || item['predictions']['m12'][1]}</td>
                                                                                                        <td></td>
                                                                                                        <td></td>
                                                                                                    </tr>
                                                                                                )
                                                                                            }
                                                                                            else if(item['within_outlier_limits'][this.state.durationActual] === false) {
                                                                                                return (
                                                                                                    <tr key={item['identifier']} style={{textAlign: "center"}}>
                                                                                                        <td style={{color: 'red'}}>{item['name']}</td>
                                                                                                        <td style={{color: 'red'}}>{item['unit']}</td>
                                                                                                        <td style={{color: 'red'}}>{item['processed']}</td>
                                                                                                        <td style={{color: 'red'}}>{item['predictions'] === undefined ? "" : item['predictions'][this.state.durationActual] === undefined || item['predictions'][this.state.durationActual] === null ? "" : item['predictions'][this.state.durationActual][1] || item['predictions']['m12'][1]}</td>
                                                                                                        <td style={{color: 'red'}}></td>
                                                                                                        <td style={{color: 'red'}}>{item['outlier_limit_msg'][this.state.durationActual]}</td>
                                                                                                    </tr>
                                                                                                )
                                                                                            }
                                                                                            else if(typeof item['within_operational_limits'] === typeof undefined) {
                                                                                                return (
                                                                                                    <tr key={item['identifier']} style={{textAlign: "center"}}>
                                                                                                        <td>{item['name']}</td>
                                                                                                        <td>{item['unit']}</td>
                                                                                                        <td>{item['processed']}</td>
                                                                                                        <td>{item['predictions'] === undefined ? "" : item['predictions'][this.state.durationActual] === undefined || item['predictions'][this.state.durationActual] === null ? "" : item['predictions'][this.state.durationActual][1] || item['predictions']['m12'][1]}</td>
                                                                                                        <td></td>
                                                                                                        <td></td>
                                                                                                    </tr>
                                                                                                )
                                                                                            }
                                                                                            else if(item['within_operational_limits'][this.state.durationActual] === false) {
                                                                                                return (
                                                                                                    <tr key={item['identifier']} style={{textAlign: "center"}}>
                                                                                                        <td style={{color: 'orange'}}>{item['name']}</td>
                                                                                                        <td style={{color: 'orange'}}>{item['unit']}</td>
                                                                                                        <td style={{color: 'orange'}}>{item['processed']}</td>
                                                                                                        <td style={{color: 'orange'}}>{item['predictions'] === undefined ? "" : item['predictions'][this.state.durationActual] === undefined || item['predictions'][this.state.durationActual] === null ? "" : item['predictions'][this.state.durationActual][1] || item['predictions']['m12'][1]}</td>
                                                                                                        <td style={{color: 'orange'}}></td>
                                                                                                        <td style={{color: 'orange'}}>{item['operational_limit_msg'][this.state.durationActual]}</td>
                                                                                                    </tr>
                                                                                                )
                                                                                            }
                                                                                            else if('spe_messages' in item && this.state.durationActual in item['spe_messages'] && item['spe_messages'][this.state.durationActual][2] !== null) {
                                                                                                console.log("VIOLET!!!!!!");
                                                                                                return (
                                                                                                    <tr key={item['identifier']} style={{textAlign: "center"}}>
                                                                                                        <td>{item['name']}</td>
                                                                                                        <td>{item['unit']}</td>
                                                                                                        <td>{item['processed']}</td>
                                                                                                        <td>{item['predictions'] === undefined ? "" : item['predictions'][this.state.durationActual] === undefined || item['predictions'][this.state.durationActual] === null ? "" : item['predictions'][this.state.durationActual][1] || item['predictions']['m12'][1]}</td>
                                                                                                        <td></td>
                                                                                                        <td>{item['spe_messages'][this.state.durationActual][2]}</td>
                                                                                                    </tr>
                                                                                                )
                                                                                            }
                                                                                            else if('spe_messages' in item && this.state.durationActual in item['spe_messages'] && item['spe_messages'][this.state.durationActual][1] !== null) {
                                                                                                console.log("VIOLET!!!!!!");
                                                                                                return (
                                                                                                    <tr key={item['identifier']} style={{textAlign: "center"}}>
                                                                                                        <td>{item['name']}</td>
                                                                                                        <td>{item['unit']}</td>
                                                                                                        <td>{item['processed']}</td>
                                                                                                        <td>{item['predictions'] === undefined ? "" : item['predictions'][this.state.durationActual] === undefined || item['predictions'][this.state.durationActual] === null ? "" : item['predictions'][this.state.durationActual][1] || item['predictions']['m12'][1]}</td>
                                                                                                        <td></td>
                                                                                                        <td>{item['spe_messages'][this.state.durationActual][1]}</td>
                                                                                                    </tr>
                                                                                                )
                                                                                            }
                                                                                            else if('spe_messages' in item && this.state.durationActual in item['spe_messages'] && item['spe_messages'][this.state.durationActual][0] !== null) {
                                                                                                console.log("VIOLET!!!!!!");
                                                                                                return (
                                                                                                    <tr key={item['identifier']} style={{textAlign: "center"}}>
                                                                                                        <td>{item['name']}</td>
                                                                                                        <td>{item['unit']}</td>
                                                                                                        <td>{item['processed']}</td>
                                                                                                        <td>{item['predictions'] === undefined ? "" : item['predictions'][this.state.durationActual] === undefined || item['predictions'][this.state.durationActual] === null ? "" : item['predictions'][this.state.durationActual][1] || item['predictions']['m12'][1]}</td>
                                                                                                        <td></td>
                                                                                                        <td>{item['spe_messages'][this.state.durationActual][0]}</td>
                                                                                                    </tr>
                                                                                                )
                                                                                            }
                                                                                            else {
                                                                                                return (
                                                                                                    <tr key={item['identifier']} style={{textAlign: "center"}}>
                                                                                                        <td>{item['name']}</td>
                                                                                                        <td>{item['unit']}</td>
                                                                                                        <td>{item['processed']}</td>
                                                                                                        <td>{item['predictions'] === undefined ? "" : item['predictions'][this.state.durationActual] === undefined || item['predictions'][this.state.durationActual] === null ? "" : item['predictions'][this.state.durationActual][1] || item['predictions']['m12'][1]}</td>
                                                                                                        <td></td>
                                                                                                        <td></td>
                                                                                                    </tr>
                                                                                                )
                                                                                            }
                                                                                        }
                                                                                        
                                                                                    })
                                                                                )
                                                                            }
                                                                            else {
                                                                                return (
                                                                                    subcategoryObj[subcategory].map(item => {
                                                                                        if(item['equipment_type'] === 'E') {
                                                                                            return (
                                                                                                <tr key={item['identifier']} style={{textAlign: "center"}}>
                                                                                                    <td style={{color: '#006400'}}><i>{item['name']}</i></td>
                                                                                                    <td style={{color: '#006400'}}><i>{item['unit']}</i></td>
                                                                                                    {/* <td style={{color: '#006400'}}><i>{item['processed']}</i></td> */}
                                                                                                    <td style={{color: '#006400'}}><i></i></td>
                                                                                                    <td style={{color: '#006400'}}><i>{item['predictions'] === undefined ? "" : item['predictions'][this.state.durationActual] === undefined || item['predictions'][this.state.durationActual] === null ? "" : item['predictions'][this.state.durationActual][1] || item['predictions']['m12'][1]}</i></td>
                                                                                                    <td style={{color: '#006400'}}><i></i></td>
                                                                                                    <td style={{color: '#006400'}}><i></i></td>
                                                                                                    <td style={{color: '#006400'}}><i></i></td>
                                                                                                </tr>
                                                                                            )
                                                                                        }
                                                                                        if(typeof item['within_outlier_limits'] === typeof undefined) {
                                                                                            return (
                                                                                                <tr key={item['identifier']} style={{textAlign: "center"}}>
                                                                                                    <td>{item['name']}</td>
                                                                                                    <td>{item['unit']}</td>
                                                                                                    <td>{item['processed']}</td>
                                                                                                    <td>{item['predictions'] === undefined ? "" : item['predictions'][this.state.durationActual] === undefined || item['predictions'][this.state.durationActual] === null ? "" : item['predictions'][this.state.durationActual][1] || item['predictions']['m12'][1]}</td>
                                                                                                    <td></td>
                                                                                                    <td></td>
                                                                                                    <td></td>
                                                                                                </tr>
                                                                                            )
                                                                                        }
                                                                                        else if(item['within_outlier_limits'][this.state.durationActual] === false) {
                                                                                            return (
                                                                                                <tr key={item['identifier']} style={{textAlign: "center"}}>
                                                                                                    <td style={{color: 'red'}}>{item['name']}</td>
                                                                                                    <td style={{color: 'red'}}>{item['unit']}</td>
                                                                                                    <td style={{color: 'red'}}>{item['processed']}</td>
                                                                                                    <td style={{color: 'red'}}>{item['predictions'] === undefined ? "" : item['predictions'][this.state.durationActual] === undefined || item['predictions'][this.state.durationActual] === null ? "" : item['predictions'][this.state.durationActual][1] || item['predictions']['m12'][1]}</td>
                                                                                                    <td style={{color: 'red'}}>{item['outlier_limit_msg'][this.state.durationActual]}</td>
                                                                                                    <td style={{color: 'red'}}></td>
                                                                                                    <td style={{color: 'red'}}></td>
                                                                                                </tr>
                                                                                            )
                                                                                        }
                                                                                        else if(typeof item['within_operational_limits'] === typeof undefined) {
                                                                                            return (
                                                                                                <tr key={item['identifier']} style={{textAlign: "center"}}>
                                                                                                    <td>{item['name']}</td>
                                                                                                    <td>{item['unit']}</td>
                                                                                                    <td>{item['processed']}</td>
                                                                                                    <td>{item['predictions'] === undefined ? "" : item['predictions'][this.state.durationActual] === undefined || item['predictions'][this.state.durationActual] === null ? "" : item['predictions'][this.state.durationActual][1] || item['predictions']['m12'][1]}</td>
                                                                                                    <td></td>
                                                                                                    <td></td>
                                                                                                    <td></td>
                                                                                                </tr>
                                                                                            )
                                                                                        }
                                                                                        else if(item['within_operational_limits'][this.state.durationActual] === false) {
                                                                                            return (
                                                                                                <tr key={item['identifier']} style={{textAlign: "center"}}>
                                                                                                    <td style={{color: 'orange'}}>{item['name']}</td>
                                                                                                    <td style={{color: 'orange'}}>{item['unit']}</td>
                                                                                                    <td style={{color: 'orange'}}>{item['processed']}</td>
                                                                                                    <td style={{color: 'orange'}}>{item['predictions'] === undefined ? "" : item['predictions'][this.state.durationActual] === undefined || item['predictions'][this.state.durationActual] === null ? "" : item['predictions'][this.state.durationActual][1] || item['predictions']['m12'][1]}</td>
                                                                                                    <td style={{color: 'orange'}}>{item['operational_limit_msg'][this.state.durationActual]}</td>
                                                                                                    <td style={{color: 'orange'}}></td>
                                                                                                    <td style={{color: 'orange'}}></td>
                                                                                                </tr>
                                                                                            )
                                                                                        }
                                                                                        else {
                                                                                            
                                                                                            // try{
                                                                                                if('spe_messages' in item && this.state.durationActual in item['spe_messages'] && item['spe_messages'][this.state.durationActual][2] !== null) {
                                                                                                    console.log("VIOLET!!!!!!");
                                                                                                    return (
                                                                                                        <tr key={item['identifier']} style={{textAlign: "center"}}>
                                                                                                            <td style={{color: 'violet'}}>{item['name']}</td>
                                                                                                            <td style={{color: 'violet'}}>{item['unit']}</td>
                                                                                                            <td style={{color: 'violet'}}>{item['processed']}</td>
                                                                                                            <td style={{color: 'violet'}}>{item['predictions'] === undefined ? "" : item['predictions'][this.state.durationActual] === undefined || item['predictions'][this.state.durationActual] === null ? "" : item['predictions'][this.state.durationActual][1] || item['predictions']['m12'][1]}</td>
                                                                                                            <td style={{color: 'violet'}}>{item['spe_messages'][this.state.durationActual][2]}</td>
                                                                                                            <td style={{color: 'violet'}}></td>
                                                                                                            <td style={{color: 'violet'}}></td>
                                                                                                        </tr>
                                                                                                    )
                                                                                                }
                                                                                                else if('spe_messages' in item && this.state.durationActual in item['spe_messages'] && item['spe_messages'][this.state.durationActual][1] !== null) {
                                                                                                    console.log("VIOLET!!!!!!");
                                                                                                    return (
                                                                                                        <tr key={item['identifier']} style={{textAlign: "center"}}>
                                                                                                            <td style={{color: 'violet'}}>{item['name']}</td>
                                                                                                            <td style={{color: 'violet'}}>{item['unit']}</td>
                                                                                                            <td style={{color: 'violet'}}>{item['processed']}</td>
                                                                                                            <td style={{color: 'violet'}}>{item['predictions'] === undefined ? "" : item['predictions'][this.state.durationActual] === undefined || item['predictions'][this.state.durationActual] === null ? "" : item['predictions'][this.state.durationActual][1] || item['predictions']['m12'][1]}</td>
                                                                                                            <td style={{color: 'violet'}}>{item['spe_messages'][this.state.durationActual][1]}</td>
                                                                                                            <td style={{color: 'violet'}}></td>
                                                                                                            <td style={{color: 'violet'}}></td>
                                                                                                        </tr>
                                                                                                    )
                                                                                                }
                                                                                                else if('spe_messages' in item && this.state.durationActual in item['spe_messages'] && item['spe_messages'][this.state.durationActual][0] !== null) {
                                                                                                    console.log("VIOLET!!!!!!");
                                                                                                    return (
                                                                                                        <tr key={item['identifier']} style={{textAlign: "center"}}>
                                                                                                            <td style={{color: 'violet'}}>{item['name']}</td>
                                                                                                            <td style={{color: 'violet'}}>{item['unit']}</td>
                                                                                                            <td style={{color: 'violet'}}>{item['processed']}</td>
                                                                                                            <td style={{color: 'violet'}}>{item['predictions'] === undefined ? "" : item['predictions'][this.state.durationActual] === undefined || item['predictions'][this.state.durationActual] === null ? "" : item['predictions'][this.state.durationActual][1] || item['predictions']['m12'][1]}</td>
                                                                                                            <td style={{color: 'violet'}}>{item['spe_messages'][this.state.durationActual][0]}</td>
                                                                                                            <td style={{color: 'violet'}}></td>
                                                                                                            <td style={{color: 'violet'}}></td>
                                                                                                        </tr>
                                                                                                    )
                                                                                                }
                                                                                                // else if('is_not_t2_anamolous' in item && item['is_not_t2_anamolous'][this.state.durationActual][2] === false) {
                                                                                                //     console.log("VIOLET!!!!!!");
                                                                                                //     return (
                                                                                                //         <tr key={item['identifier']} style={{textAlign: "center"}}>
                                                                                                //             <td style={{color: 'blue'}}>{item['name']}</td>
                                                                                                //             <td style={{color: 'blue'}}>{item['unit']}</td>
                                                                                                //             <td style={{color: 'blue'}}>{item['processed']}</td>
                                                                                                //             <td style={{color: 'blue'}}>{item['predictions'] === undefined ? "" : item['predictions'][this.state.durationActual] === undefined || item['predictions'][this.state.durationActual] === null ? "" : item['predictions'][this.state.durationActual][1] || item['predictions']['m12'][1]}</td>
                                                                                                //             <td style={{color: 'blue'}}>{'spe_messages' in item ? item['spe_messages'][this.state.durationActual][2] : '_t2_messages' in item ? item['_t2_messages'][this.state.durationActual][2] : 'ewma_messages' in item ? item['ewma_messages'][this.state.durationActual][2] : ""}</td>
                                                                                                //             <td style={{color: 'blue'}}></td>
                                                                                                //             <td style={{color: 'blue'}}></td>
                                                                                                //         </tr>
                                                                                                //     )
                                                                                                // }
                                                                                                else {
                                                                                                    return (
                                                                                                        <tr key={item['identifier']} style={{textAlign: "center"}}>
                                                                                                            <td>{item['name']}</td>
                                                                                                            <td>{item['unit']}</td>
                                                                                                            <td>{item['processed']}</td>
                                                                                                            <td>{item['predictions'] === undefined ? "" : item['predictions'][this.state.durationActual] === undefined || item['predictions'][this.state.durationActual] === null ? "" : item['predictions'][this.state.durationActual][1] || item['predictions']['m12'][1]}</td>
                                                                                                            <td></td>
                                                                                                            <td></td>
                                                                                                            <td></td>
                                                                                                        </tr>
                                                                                                    )
                                                                                                }
                                                                                            // }
                                                                                            // catch(e) {
                                                                                            //     return (
                                                                                            //         <tr key={item['identifier']} style={{textAlign: "center"}}>
                                                                                            //             <td>{item['name']}</td>
                                                                                            //             <td>{item['unit']}</td>
                                                                                            //             <td>{item['processed']}</td>
                                                                                            //             <td>{item['predictions'] === undefined ? "" : item['predictions'][this.state.durationActual] === undefined || item['predictions'][this.state.durationActual] === null ? "" : item['predictions'][this.state.durationActual][1] || item['predictions']['m12'][1]}</td>
                                                                                            //             <td></td>
                                                                                            //             <td></td>
                                                                                            //             <td></td>
                                                                                            //         </tr>
                                                                                            //     )
                                                                                            // }
                                                                                            
                                                                                        }
                                                                                    })
                                                                                )
                                                                            }
                                                                        }
                                                                        else {
                                                                            return (
                                                                                <tr>
                                                                                    {
                                                                                        // this.props.dailyData.dailyData && <td colSpan={this.props.dailyData.dailyData['Daily Report Header Columns'][this.state.selected[0]].length - 1}>No Data Found!</td>
                                                                                    }
                                                                                </tr>
                                                                            )
                                                                        }
                                                                    })
                                                                )
                                                            })
                                                        }
                                                    </tbody>
                                                )
                                            }
                                        })
                                    }
                                </Table>
                            }
                        </div>
                    </div>
                )
            }
        }
        
    }
}

export default connect(mapStateToProps)(MakeTable);