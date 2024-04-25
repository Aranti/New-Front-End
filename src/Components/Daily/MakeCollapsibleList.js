import React from 'react';
import Collapsible from './Collapsible';
import { connect } from 'react-redux';

// const MakeCollapsibleList = (props) => {
//     return(
//         Object.keys(props.responseData['Category Dictionary']).map((item) => {
//             let href = '#'+item;
//             if(props.responseData[item].length === 1) {
//                 return <a href={href} style={{textDecoration: "none"}}><Collapsible title={item} className={props.collapsibleClass} /></a>
//             }
//             else {
//                 return(
//                     <Collapsible title={item} className={props.collapsibleClass}>
//                         {
//                             item.map((i) => {
//                                 return (
//                                     <a href={href} className={props.anchorClass} key={i}>{i}</a>
//                                 )
//                             })
//                         }
//                     </Collapsible>
//                 )
//             }
//         })
//     )
// }

const mapStateToProps = state => {
    return {
        dailyData: state.dailyData
    }
}

class MakeCollapsibleList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            responseData: {}
        }
    }

    componentDidMount() {
        console.log("COLLAPSIBLE", this.state.responseData);
    }

    componentDidUpdate(prevProps, prevState) {
        if(prevProps.dailyData !== this.props.dailyData) {
            this.setState({
                responseData: this.props.dailyData
            })
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

    // createAnomalyList(data) {
    //     let result=[];
    //     Object.keys(data['Latest Result'].map(category => {
    //         data['Latest Result'][category].map(subcategoryObj => {
    //             Object.keys(subcategoryObj).map(subcategory => {
    //                 if(subcategoryObj[subcategory][])
    //             })
    //         })
    //     }))
    // }
    
    render() {
        return(
            this.props.dailyData && (this.props.dailyData['Category List'].map(catName => {
                return (
                    Object.keys(this.props.dailyData['Category Dictionary']['data'][0]).map((item) => {
                        if(catName === item) {
                            if(Object.keys(this.props.dailyData['Anomaly List']).includes(catName)) {
                                if(this.props.dailyData['Category Dictionary']['data'][0][item].length === 1) {
                                    let href = '#' + item + '-'+ this.props.dailyData['Category Dictionary']['data'][0][item][0];
                                    // if(this.props.dailyData['Anomaly List'][catName].includes(this.props.dailyData['Category Dictionary']['data'][0][item][0])) {
                                    return <a href={href} style={{textDecoration: "none"}} onClick={(e) => this.props.handleClick(e, href)}><Collapsible title={item} className={this.props.collapsibleClass} style={{color: "#8b0000"}} /></a>
                                    // }
                                    // else {
                                    //     return <a href={href} style={{textDecoration: "none"}} onClick={(e) => this.props.handleClick(e, href)}><Collapsible title={item} className={this.props.collapsibleClass} /></a>
                                    // }
                                    // return <a href={href} style={{textDecoration: "none"}} onClick={(e) => this.props.handleClick(e, href)}><Collapsible title={item} className={this.props.collapsibleClass} /></a>
                                }
                                else {
                                    if(item === 'MAIN ENGINE') {
                                        return(
                                            <Collapsible title={item} className={this.props.collapsibleClass} default={true} style={{color: "#8b0000"}}>
                                                {
                                                    this.props.dailyData['Category Dictionary']['data'][0][item].map((i) => {
                                                        let href = '#' + item + '-' +i;
                                                        if(this.props.dailyData['Anomaly List'][catName].includes(i)) {
                                                            return (
                                                                <a href={href} style={{textDecoration: "none", color: "red"}} className={this.props.anchorClass} key={i} onClick={(e) => this.props.handleClick(e, href)}>{i}</a>
                                                            )
                                                        }
                                                        else if(this.props.dailyData['Anomaly List'][catName].includes(i+"_OP")) {
                                                            return (
                                                                <a href={href} style={{textDecoration: "none", color: "orange"}} className={this.props.anchorClass} key={i} onClick={(e) => this.props.handleClick(e, href)}>{i}</a>
                                                            )
                                                        }
                                                        else if(this.props.dailyData['Anomaly List'][catName].includes(i+"_SPE")) {
                                                            return (
                                                                <a href={href} style={{textDecoration: "none", color: "violet"}} className={this.props.anchorClass} key={i} onClick={(e) => this.props.handleClick(e, href)}>{i}</a>
                                                            )
                                                        }
                                                        else {
                                                            return (
                                                                <a href={href} style={{textDecoration: "none", color: "black"}} className={this.props.anchorClass} key={i} onClick={(e) => this.props.handleClick(e, href)}>{i}</a>
                                                            )
                                                        }
                                                        // return (
                                                        //     <a href={href} style={{textDecoration: "none"}} className={this.props.anchorClass} key={i} onClick={(e) => this.props.handleClick(e, href)}>{i}</a>
                                                        // )
                                                    })
                                                }
                                            </Collapsible>
                                        )
                                    }
                                    else {
                                        return(
                                            <Collapsible title={item} className={this.props.collapsibleClass} style={{color: "#8b0000"}}>
                                                {
                                                    this.props.dailyData['Category Dictionary']['data'][0][item].map((i) => {
                                                        let href = '#' + item + '-' +i;
                                                        if(this.props.dailyData['Anomaly List'][catName].includes(i)) {
                                                            return (
                                                                <a href={href} style={{textDecoration: "none", color: "red"}} className={this.props.anchorClass} key={i} onClick={(e) => this.props.handleClick(e, href)}>{i}</a>
                                                            )
                                                        }
                                                        else if(this.props.dailyData['Anomaly List'][catName].includes(i+"_OP")) {
                                                            return (
                                                                <a href={href} style={{textDecoration: "none", color: "orange"}} className={this.props.anchorClass} key={i} onClick={(e) => this.props.handleClick(e, href)}>{i}</a>
                                                            )
                                                        }
                                                        else if(this.props.dailyData['Anomaly List'][catName].includes(i+"_SPE")) {
                                                            return (
                                                                <a href={href} style={{textDecoration: "none", color: "violet"}} className={this.props.anchorClass} key={i} onClick={(e) => this.props.handleClick(e, href)}>{i}</a>
                                                            )
                                                        }
                                                        else {
                                                            return (
                                                                <a href={href} style={{textDecoration: "none", color: "black"}} className={this.props.anchorClass} key={i} onClick={(e) => this.props.handleClick(e, href)}>{i}</a>
                                                            )
                                                        }
                                                        // return (
                                                        //     <a href={href} style={{textDecoration: "none"}} className={this.props.anchorClass} key={i} onClick={(e) => this.props.handleClick(e, href)}>{i}</a>
                                                        // )
                                                    })
                                                }
                                            </Collapsible>
                                        )
                                    }
                                }
                            }
                            else {
                                if(this.props.dailyData['Category Dictionary']['data'][0][item].length === 1) {
                                    let href = '#' + item + '-'+ this.props.dailyData['Category Dictionary']['data'][0][item][0];
                                    return <a href={href} style={{textDecoration: "none", color: "black"}} onClick={(e) => this.props.handleClick(e, href)}><Collapsible title={item} className={this.props.collapsibleClass} /></a>
                                }
                                else {
                                    if(item === 'MAIN ENGINE') {
                                        return(
                                            <Collapsible title={item} className={this.props.collapsibleClass} default={true}>
                                                {
                                                    this.props.dailyData['Category Dictionary']['data'][0][item].map((i) => {
                                                        let href = '#' + item + '-' +i;
                                                        return (
                                                            <a href={href} style={{textDecoration: "none", color: "black"}} className={this.props.anchorClass} key={i} onClick={(e) => this.props.handleClick(e, href)}>{i}</a>
                                                        )
                                                    })
                                                }
                                            </Collapsible>
                                        )
                                    }
                                    else {
                                        return(
                                            <Collapsible title={item} className={this.props.collapsibleClass}>
                                                {
                                                    this.props.dailyData['Category Dictionary']['data'][0][item].map((i) => {
                                                        let href = '#' + item + '-' +i;
                                                        return (
                                                            <a href={href} style={{textDecoration: "none", color: "black"}} className={this.props.anchorClass} key={i} onClick={(e) => this.props.handleClick(e, href)}>{i}</a>
                                                        )
                                                    })
                                                }
                                            </Collapsible>
                                        )
                                    }
                                }
                            }
                            
                        }
                    })
                )
            }))
        )
    }
}

export default MakeCollapsibleList;