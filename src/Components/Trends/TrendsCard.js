import React from 'react';
import { Col, Row, Button, Card, Container, Table, OverlayTrigger, Tooltip, Popover } from 'react-bootstrap';
import Select, { components } from 'react-select';
import "../../../public/CommonCss/trends.css";
import Collapsible from './CollapsibleTrends';
import Chart from './TrendsChart';
import responseData from '../../shared/response.json';
import individualParams from '../../shared/individualParams.json';
import equipmentParams from '../../shared/equipmentParams.json';
import indicesParams from '../../shared/indicesParams.json';
import TrendsTable from './TableComponent';
import { Loading } from '../LoadingComponent';
import { baseUrl } from '../../shared/baseUrl';
import { setDropdown, setCompare, setDuration, setOutliers, setAnomalies,
    setMulti, setEquipmentMulti, setIndexMulti, setTrends, setHover,
    getHover, setSisterVessel, setSimilarVessel, setIndividualParams,
    setIndividualEquip, setIndividualIndex, trendsLoading, trendsFailed,
    setGenericGroups, setNoonOrLogs, setDryDockPeriod, setEvaluationPeriod,
    setGroupSelection, setPerformanceType, setDryDockPeriodOptions, setEvaluationPeriodOptions,
    setDryDockOptionSelection, setEvaluationOptionSelection
 } from '../../redux/ActionCreators';
import { connect } from 'react-redux';
import axios from 'axios';

const urlSister = baseUrl + process.env.REACT_APP_GET_SISTER_VESSELS;
const urlSimilar = baseUrl + process.env.REACT_APP_GET_SIMILAR_VESSELS;
const urlIndividualParams = baseUrl + process.env.REACT_APP_GET_INDIVIDUAL_PARAMS;
const urlIndividualEquip = baseUrl + process.env.REACT_APP_GET_INDIVIDUAL_EQUIP;
const urlIndividualIndex = baseUrl + process.env.REACT_APP_GET_INDIVIDUAL_INDEX;

// function getChartData() {

//     let param = {
//         'ship_imo': 9591301,
//         'group': 'BASIC',
//         'duration': '30Days'
//     };

//     axios({
//         method: "get",
//         url: urls,
//         params: param
//     })
//     .then((res) => {
//         // this.setState({
//         //     data: res.data
//         // });
//         // console.log(res.data);
//         return res.data;
//     })
//     .catch((err) => {
//         console.log("Error", err);
//     });
// }



// function createPopoverBlockList(groupname) {
//     Object.keys(responseData['Generic']).map((key) => {
//         if(key == groupname) {
//             Object.keys(responseData['Generic'][key]).map((k) => {
//                 for(let i=0;i<responseData['Generic'][key][k].length;i++) {
//                     return (
//                         <>
//                             <h5>{k}</h5>
//                             <b>{k[i]}</b>
//                         </>
//                     )
//                 }
//             })
//         }
//     })
// }

const mapStateToProps = state => {
    return {
        trends: state.trends,
        hover: state.hover,
        fuelConsHover: state.fuelConsHover,
        options: state.options,
        currentShip: state.currentShip
    }
}

const mapDispatchToProps = (dispatch) => ({
    trendsLoading: (input) => { dispatch(trendsLoading(input)) },
    trendsFailed: (input) => { dispatch(trendsFailed(input)) },
    setTrends: (input) => { dispatch(setTrends(input)) },
    setDropdown: (input) => { dispatch(setDropdown(input)) },
    setCompare: (input) => { dispatch(setCompare(input)) },
    setDuration: (input) => { dispatch(setDuration(input)) },
    setOutliers: (input) => { dispatch(setOutliers(input)) },
    setAnomalies: (input) => { dispatch(setAnomalies(input)) },
    setNoonOrLogs: (input) => { dispatch(setNoonOrLogs(input)) },
    setMulti: (input) => { dispatch(setMulti(input)) },
    setEquipmentMulti: (input) => { dispatch(setEquipmentMulti(input)) },
    setIndexMulti: (input) => { dispatch(setIndexMulti(input)) },
    getHover: () => { dispatch(getHover())},
    setSisterVessel: (input) => { dispatch(setSisterVessel(input))},
    setSimilarVessel: (input) => { dispatch(setSimilarVessel(input))},
    setIndividualParams: (input) => { dispatch(setIndividualParams(input))},
    setIndividualEquip: (input) => { dispatch(setIndividualEquip(input))},
    setIndividualIndex: (input) => { dispatch(setIndividualIndex(input))},
    setGenericGroups: (input) => { dispatch(setGenericGroups(input))},
    setDryDockPeriod: (input) => { dispatch(setDryDockPeriod(input))},
    setEvaluationPeriod: (input) => { dispatch(setEvaluationPeriod(input))},
    setGroupSelection: (input) => { dispatch(setGroupSelection(input))},
    setPerformanceType: (input) => { dispatch(setPerformanceType(input))},
    setDryDockPeriodOptions: (input) => { dispatch(setDryDockPeriodOptions(input))},
    setEvaluationPeriodOptions: (input) => { dispatch(setEvaluationPeriodOptions(input))},
    setDryDockOptionSelection: (input) => { dispatch(setDryDockOptionSelection(input))},
    setEvaluationOptionSelection: (input) => { dispatch(setEvaluationOptionSelection(input))},
});



class TrendsCard extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            data: null,
            // key: 0,
            onHover: false,
            // rowOpen: false,
            compare: "None",
            duration: "30Days",
            outliers: false,
            anomalies: false,
            group: "",
            ship_imo: null,
            noonorlogs: "noon",
            selectedOptions: [],
            equipmentOptions: [],
            indexOptions: [],
            similarVessels: [],
            sisterVessels: [],
            // options: individualParams,
            // equipOptions: equipmentParams,
            // indicesOptions: indicesParams,
            tooltips: [
                {
                    value: "1",
                    label: 
                    (
                        <OverlayTrigger
                            placement="right"
                            trigger="click"
                            // delay={{show: "250", hide: "400"}}
                            
                            overlay={(
                                <Popover className="popover-scroll">
                                    <Popover.Title as="h4">List of Parameters</Popover.Title>
                                    <Popover.Content>
                                        {
                                            this.props.trends.generic_groups !== null ? 
                                            Object.keys(this.props.trends.generic_groups['Result']).map((key) => {
                                                if(this.props.trends.generic_groups['Groups'].includes(parseInt(key)) && key.toString() == '1') {
                                                    return (
                                                        Object.keys(this.props.trends.generic_groups['Result'][key]).map((k) => {
                                                            return(
                                                                <>
                                                                    <h5 key={k}>{k}</h5>
                                                                    {
                                                                        this.props.trends.generic_groups['Result'][key][k].map((item) => {
                                                                            return(
                                                                                <><b key={item}>{item}</b><br /></>
                                                                            )
                                                                        })
                                                                    }
                                                                </>
                                                            )
                                                        })
                                                    )
                                                }
                                            }) :
                                            Object.keys(responseData['Result']).map((key) => {
                                                if(key == 'BASIC') {
                                                    return (
                                                        Object.keys(responseData['Result'][key]).map((k) => {
                                                            return(
                                                                <>
                                                                    <h5 key={k}>{k}</h5>
                                                                    {
                                                                        responseData['Result'][key][k].map((item) => {
                                                                            return(
                                                                                <><b key={item}>{item}</b><br /></>
                                                                            )
                                                                        })
                                                                    }
                                                                </>
                                                            )
                                                        })
                                                    )
                                                }
                                            })
                                        }
                                    </Popover.Content>
                                </Popover>
                            )}
                        >
                            <span>{this.props.trends.generic_groups && this.props.trends.generic_groups['Groups'][0]}</span>
                        </OverlayTrigger>
                    )
                },
                {
                    value: "3",
                    label: 
                    (
                        <OverlayTrigger
                            placement="right"
                            trigger="click"
                            // delay={{show: "250", hide: "400"}}
                            // onHide={() => this.setState({hover: false})}
                            // onMouseEnter={() => this.setState({onHover: true})}
                            // onMouseLeave={() => this.setState({onHover: false})}
                            overlay={(
                                <Popover className="popover-scroll">
                                    <Popover.Title as="h4">List of Parameters</Popover.Title>
                                    <Popover.Content>
                                        {
                                            this.props.trends.generic_groups !== null ?
                                            Object.keys(this.props.trends.generic_groups['Result']).map((key) => {
                                                if(this.props.trends.generic_groups['Groups'].includes(parseInt(key)) && key.toString() == '3') {
                                                    return (
                                                        Object.keys(this.props.trends.generic_groups['Result'][key]).map((k) => {
                                                            return(
                                                                <>
                                                                    <h5 key={k}>{k}</h5>
                                                                    {
                                                                        this.props.trends.generic_groups['Result'][key][k].map((item) => {
                                                                            return(
                                                                                <><b key={item}>{item}</b><br /></>
                                                                            )
                                                                        })
                                                                    }
                                                                </>
                                                            )
                                                        })
                                                    )
                                                }
                                            }) :
                                            Object.keys(responseData['Result']).map((key) => {
                                                if(key == 'COMBUSTION PROCESS') {
                                                    return (
                                                        Object.keys(responseData['Result'][key]).map((k) => {
                                                            return(
                                                                <>
                                                                    <h5 key={k}>{k}</h5>
                                                                    {
                                                                        responseData['Result'][key][k].map((item) => {
                                                                            return(
                                                                                <><b key={item}>{item}</b><br /></>
                                                                            )
                                                                        })
                                                                    }
                                                                </>
                                                            )
                                                        })
                                                    )
                                                }
                                            })
                                        }
                                    </Popover.Content>
                                </Popover>
                            )}
                            rootClose
                        >
                            <span>{this.props.trends.generic_groups && this.props.trends.generic_groups['Groups'][2]}</span>
                        </OverlayTrigger>
                    )
                },
                {
                    value: "2",
                    label: 
                    (
                        <OverlayTrigger
                            placement="right"
                            trigger="click"
                            // delay={{show: "250", hide: "400"}}
                            // onHide={() => this.setState({hover: false})}
                            overlay={(
                                <Popover className="popover-scroll">
                                    <Popover.Title as="h4">List of Parameters</Popover.Title>
                                    <Popover.Content>
                                        {
                                            this.props.trends.generic_groups !== null ?
                                            Object.keys(this.props.trends.generic_groups['Result']).map((key) => {
                                                if(this.props.trends.generic_groups['Groups'].includes(parseInt(key)) && key.toString() == '2') {
                                                    return (
                                                        Object.keys(this.props.trends.generic_groups['Result'][key]).map((k) => {
                                                            return(
                                                                <>
                                                                    <h5 key={k}>{k}</h5>
                                                                    {
                                                                        this.props.trends.generic_groups['Result'][key][k].map((item) => {
                                                                            return(
                                                                                <><b key={item}>{item}</b><br /></>
                                                                            )
                                                                        })
                                                                    }
                                                                </>
                                                            )
                                                        })
                                                    )
                                                }
                                            }) :
                                            Object.keys(responseData['Result']).map((key) => {
                                                if(key == 'FO CONS & POWER DEVELOPED') {
                                                    return (
                                                        Object.keys(responseData['Result'][key]).map((k) => {
                                                            return(
                                                                <>
                                                                    <h5 key={k}>{k}</h5>
                                                                    {
                                                                        responseData['Result'][key][k].map((item) => {
                                                                            return(
                                                                                <><b key={item}>{item}</b><br /></>
                                                                            )
                                                                        })
                                                                    }
                                                                </>
                                                            )
                                                        })
                                                    )
                                                }
                                            })
                                        }
                                    </Popover.Content>
                                </Popover>
                            )}
                        >
                            <span>{this.props.trends.generic_groups && this.props.trends.generic_groups['Groups'][1]}</span>
                        </OverlayTrigger>
                    )
                },
                // {
                //     value: "4",
                //     label: 
                //     (
                //         <OverlayTrigger
                //             placement="right"
                //             trigger="click"
                //             // delay={{show: "250", hide: "400"}}
                //             // onHide={() => this.setState({hover: false})}
                //             overlay={(
                //                 <Popover className="popover-scroll">
                //                     <Popover.Title as="h4">List of Parameters</Popover.Title>
                //                     <Popover.Content>
                //                         {
                //                             this.props.trends.generic_groups !== null ?
                //                             Object.keys(this.props.trends.generic_groups['Result']).map((key) => {
                //                                 if(this.props.trends.generic_groups['Groups'].includes(parseInt(key)) && key.toString() == '4') {
                //                                     return (
                //                                         Object.keys(this.props.trends.generic_groups['Result'][key]).map((k) => {
                //                                             return(
                //                                                 <>
                //                                                     <h5 key={k}>{k}</h5>
                //                                                     {
                //                                                         this.props.trends.generic_groups['Result'][key][k].map((item) => {
                //                                                             return(
                //                                                                 <><b key={item}>{item}</b><br /></>
                //                                                             )
                //                                                         })
                //                                                     }
                //                                                 </>
                //                                             )
                //                                         })
                //                                     )
                //                                 }
                //                             }) :
                //                             Object.keys(responseData['Result']).map((key) => {
                //                                 if(key == 'Central Cooler') {
                //                                     return (
                //                                         Object.keys(responseData['Result'][key]).map((k) => {
                //                                             return(
                //                                                 <>
                //                                                     <h5 key={k}>{k}</h5>
                //                                                     {
                //                                                         responseData['Result'][key][k].map((item) => {
                //                                                             return(
                //                                                                 <><b key={item}>{item}</b><br /></>
                //                                                             )
                //                                                         })
                //                                                     }
                //                                                 </>
                //                                             )
                //                                         })
                //                                     )
                //                                 }
                //                             })
                //                         }
                //                     </Popover.Content>
                //                 </Popover>
                //             )}
                //         >
                //             <span>{this.props.trends.generic_groups && this.props.trends.generic_groups['Groups'][3]}</span>
                //         </OverlayTrigger>
                //     )
                // },
                {
                    value: "4",
                    label: 
                    (
                        <OverlayTrigger
                            placement="right"
                            trigger="click"
                            // delay={{show: "250", hide: "400"}}
                            // onHide={() => this.setState({hover: false})}
                            overlay={(
                                <Popover className="popover-scroll">
                                    <Popover.Title as="h4">List of Parameters</Popover.Title>
                                    <Popover.Content>
                                        {
                                            this.props.trends.generic_groups !== null ?
                                            Object.keys(this.props.trends.generic_groups['Result']).map((key) => {
                                                if(this.props.trends.generic_groups['Groups'].includes(parseInt(key)) && key.toString() == '4') {
                                                    return (
                                                        Object.keys(this.props.trends.generic_groups['Result'][key]).map((k) => {
                                                            return(
                                                                <>
                                                                    <h5 key={k}>{k}</h5>
                                                                    {
                                                                        this.props.trends.generic_groups['Result'][key][k].map((item) => {
                                                                            return(
                                                                                <><b key={item}>{item}</b><br /></>
                                                                            )
                                                                        })
                                                                    }
                                                                </>
                                                            )
                                                        })
                                                    )
                                                }
                                            }) :
                                            Object.keys(responseData['Result']).map((key) => {
                                                if(key == 'Main Engine Air Cooler') {
                                                    return (
                                                        Object.keys(responseData['Result'][key]).map((k) => {
                                                            return(
                                                                <>
                                                                    <h5 key={k}>{k}</h5>
                                                                    {
                                                                        responseData['Result'][key][k].map((item) => {
                                                                            return(
                                                                                <><b key={item}>{item}</b><br /></>
                                                                            )
                                                                        })
                                                                    }
                                                                </>
                                                            )
                                                        })
                                                    )
                                                }
                                            })
                                        }
                                    </Popover.Content>
                                </Popover>
                            )}
                        >
                            <span>{this.props.trends.generic_groups && this.props.trends.generic_groups['Groups'][3]}</span>
                        </OverlayTrigger>
                    )
                },
                // {
                //     value: "6",
                //     label: 
                //     (
                //         <OverlayTrigger
                //             placement="right"
                //             trigger="click"
                //             // delay={{show: "250", hide: "400"}}
                //             // onHide={() => this.setState({hover: false})}
                //             overlay={(
                //                 <Popover className="popover-scroll">
                //                     <Popover.Title as="h4">List of Parameters</Popover.Title>
                //                     <Popover.Content>
                //                         {
                //                             this.props.trends.generic_groups !== null ?
                //                             Object.keys(this.props.trends.generic_groups['Result']).map((key) => {
                //                                 if(this.props.trends.generic_groups['Groups'].includes(parseInt(key)) && key.toString() == '6') {
                //                                     return (
                //                                         Object.keys(this.props.trends.generic_groups['Result'][key]).map((k) => {
                //                                             return(
                //                                                 <>
                //                                                     <h5 key={k}>{k}</h5>
                //                                                     {
                //                                                         this.props.trends.generic_groups['Result'][key][k].map((item) => {
                //                                                             return(
                //                                                                 <><b key={item}>{item}</b><br /></>
                //                                                             )
                //                                                         })
                //                                                     }
                //                                                 </>
                //                                             )
                //                                         })
                //                                     )
                //                                 }
                //                             }) :
                //                             Object.keys(responseData['Result']).map((key) => {
                //                                 if(key == 'Main Engine Controls') {
                //                                     return (
                //                                         Object.keys(responseData['Result'][key]).map((k) => {
                //                                             return(
                //                                                 <>
                //                                                     <h5 key={k}>{k}</h5>
                //                                                     {
                //                                                         responseData['Result'][key][k].map((item) => {
                //                                                             return(
                //                                                                 <><b key={item}>{item}</b><br /></>
                //                                                             )
                //                                                         })
                //                                                     }
                //                                                 </>
                //                                             )
                //                                         })
                //                                     )
                //                                 }
                //                             })
                //                         }
                //                     </Popover.Content>
                //                 </Popover>
                //             )}
                //         >
                //             <span>{this.props.trends.generic_groups && this.props.trends.generic_groups['Groups'][5]}</span>
                //         </OverlayTrigger>
                //     )
                // },
                {
                    value: "5",
                    label: 
                    (
                        <OverlayTrigger
                            placement="right"
                            trigger="click"
                            // delay={{show: "250", hide: "400"}}
                            // onHide={() => this.setState({hover: false})}
                            overlay={(
                                <Popover className="popover-scroll">
                                    <Popover.Title as="h4">List of Parameters</Popover.Title>
                                    <Popover.Content>
                                        {
                                            this.props.trends.generic_groups !== null ?
                                            Object.keys(this.props.trends.generic_groups['Result']).map((key) => {
                                                if(this.props.trends.generic_groups['Groups'].includes(parseInt(key)) && key.toString() == '5') {
                                                    return (
                                                        Object.keys(this.props.trends.generic_groups['Result'][key]).map((k) => {
                                                            return(
                                                                <>
                                                                    <h5 key={k}>{k}</h5>
                                                                    {
                                                                        this.props.trends.generic_groups['Result'][key][k].map((item) => {
                                                                            return(
                                                                                <><b key={item}>{item}</b><br /></>
                                                                            )
                                                                        })
                                                                    }
                                                                </>
                                                            )
                                                        })
                                                    )
                                                }
                                            }) :
                                            Object.keys(responseData['Result']).map((key) => {
                                                if(key == 'Main Engine Exhuast Turbo Charger System') {
                                                    return (
                                                        Object.keys(responseData['Result'][key]).map((k) => {
                                                            return(
                                                                <>
                                                                    <h5 key={k}>{k}</h5>
                                                                    {
                                                                        responseData['Result'][key][k].map((item) => {
                                                                            return(
                                                                                <><b key={item}>{item}</b><br /></>
                                                                            )
                                                                        })
                                                                    }
                                                                </>
                                                            )
                                                        })
                                                    )
                                                }
                                            })
                                        }
                                    </Popover.Content>
                                </Popover>
                            )}
                        >
                            <span>{this.props.trends.generic_groups && this.props.trends.generic_groups['Groups'][4]}</span>
                        </OverlayTrigger>
                    )
                },
                {
                    value: "6",
                    label: 
                    (
                        <OverlayTrigger
                            placement="right"
                            trigger="click"
                            // delay={{show: "250", hide: "400"}}
                            // onHide={() => this.setState({hover: false})}
                            overlay={(
                                <Popover className="popover-scroll">
                                    <Popover.Title as="h4">List of Parameters</Popover.Title>
                                    <Popover.Content>
                                        {
                                            this.props.trends.generic_groups !== null ?
                                            Object.keys(this.props.trends.generic_groups['Result']).map((key) => {
                                                if(this.props.trends.generic_groups['Groups'].includes(parseInt(key)) && key.toString() == '6') {
                                                    return (
                                                        Object.keys(this.props.trends.generic_groups['Result'][key]).map((k) => {
                                                            return(
                                                                <>
                                                                    <h5 key={k}>{k}</h5>
                                                                    {
                                                                        this.props.trends.generic_groups['Result'][key][k].map((item) => {
                                                                            return(
                                                                                <><b key={item}>{item}</b><br /></>
                                                                            )
                                                                        })
                                                                    }
                                                                </>
                                                            )
                                                        })
                                                    )
                                                }
                                            }) :
                                            Object.keys(responseData['Result']).map((key) => {
                                                if(key == 'Main Engine PC System') {
                                                    return (
                                                        Object.keys(responseData['Result'][key]).map((k) => {
                                                            return(
                                                                <>
                                                                    <h5 key={k}>{k}</h5>
                                                                    {
                                                                        responseData['Result'][key][k].map((item) => {
                                                                            return(
                                                                                <><b key={item}>{item}</b><br /></>
                                                                            )
                                                                        })
                                                                    }
                                                                </>
                                                            )
                                                        })
                                                    )
                                                }
                                            })
                                        }
                                    </Popover.Content>
                                </Popover>
                            )}
                        >
                            <span>{this.props.trends.generic_groups && this.props.trends.generic_groups['Groups'][5]}</span>
                        </OverlayTrigger>
                    )
                },
                // {
                //     value: "7",
                //     label: 
                //     (
                //         <OverlayTrigger
                //             placement="right"
                //             trigger="click"
                //             // delay={{show: "250", hide: "400"}}
                //             // onHide={() => this.setState({hover: false})}
                //             overlay={(
                //                 <Popover className="popover-scroll">
                //                     <Popover.Title as="h4">List of Parameters</Popover.Title>
                //                     <Popover.Content>
                //                         {
                //                             this.props.trends.generic_groups !== null ?
                //                             Object.keys(this.props.trends.generic_groups['Result']).map((key) => {
                //                                 if(this.props.trends.generic_groups['Groups'].includes(parseInt(key)) && key.toString() == '7') {
                //                                     return (
                //                                         Object.keys(this.props.trends.generic_groups['Result'][key]).map((k) => {
                //                                             return(
                //                                                 <>
                //                                                     <h5 key={k}>{k}</h5>
                //                                                     {
                //                                                         this.props.trends.generic_groups['Result'][key][k].map((item) => {
                //                                                             return(
                //                                                                 <><b key={item}>{item}</b><br /></>
                //                                                             )
                //                                                         })
                //                                                     }
                //                                                 </>
                //                                             )
                //                                         })
                //                                     )
                //                                 }
                //                             }) :
                //                             Object.keys(responseData['Result']).map((key) => {
                //                                 if(key == 'Main Enginev JCW System') {
                //                                     return (
                //                                         Object.keys(responseData['Result'][key]).map((k) => {
                //                                             return(
                //                                                 <>
                //                                                     <h5 key={k}>{k}</h5>
                //                                                     {
                //                                                         responseData['Result'][key][k].map((item) => {
                //                                                             return(
                //                                                                 <><b key={item}>{item}</b><br /></>
                //                                                             )
                //                                                         })
                //                                                     }
                //                                                 </>
                //                                             )
                //                                         })
                //                                     )
                //                                 }
                //                             })
                //                         }
                //                     </Popover.Content>
                //                 </Popover>
                //             )}
                //         >
                //             <span>{this.props.trends.generic_groups && this.props.trends.generic_groups['Groups'][6]}</span>
                //         </OverlayTrigger>
                //     )
                // },
                // {
                //     value: "11",
                //     label: 
                //     (
                //         <OverlayTrigger
                //             placement="right"
                //             trigger="click"
                //             // delay={{show: "250", hide: "400"}}
                //             // onHide={() => this.setState({hover: false})}
                //             overlay={(
                //                 <Popover className="popover-scroll">
                //                     <Popover.Title as="h4">List of Parameters</Popover.Title>
                //                     <Popover.Content>
                //                         {
                //                             this.props.trends.generic_groups !== null ?
                //                             Object.keys(this.props.trends.generic_groups['Result']).map((key) => {
                //                                 if(this.props.trends.generic_groups['Groups'].includes(parseInt(key)) && key.toString() == '11') {
                //                                     return (
                //                                         Object.keys(this.props.trends.generic_groups['Result'][key]).map((k) => {
                //                                             return(
                //                                                 <>
                //                                                     <h5 key={k}>{k}</h5>
                //                                                     {
                //                                                         this.props.trends.generic_groups['Result'][key][k].map((item) => {
                //                                                             return(
                //                                                                 <><b key={item}>{item}</b><br /></>
                //                                                             )
                //                                                         })
                //                                                     }
                //                                                 </>
                //                                             )
                //                                         })
                //                                     )
                //                                 }
                //                             }) :
                //                             Object.keys(responseData['Result']).map((key) => {
                //                                 if(key == 'Main Enginev JCW System') {
                //                                     return (
                //                                         Object.keys(responseData['Result'][key]).map((k) => {
                //                                             return(
                //                                                 <>
                //                                                     <h5 key={k}>{k}</h5>
                //                                                     {
                //                                                         responseData['Result'][key][k].map((item) => {
                //                                                             return(
                //                                                                 <><b key={item}>{item}</b><br /></>
                //                                                             )
                //                                                         })
                //                                                     }
                //                                                 </>
                //                                             )
                //                                         })
                //                                     )
                //                                 }
                //                             })
                //                         }
                //                     </Popover.Content>
                //                 </Popover>
                //             )}
                //         >
                //             <span>Multi Axis - Unit 1</span>
                //         </OverlayTrigger>
                //     )
                // }
            ]
        }

        this.handleDropChange = this.handleDropChange.bind(this);
        this.onRadioChange = this.onRadioChange.bind(this);
        this.handleCheckChange = this.handleCheckChange.bind(this);
        this.handleMultiSelect = this.handleMultiSelect.bind(this);
        this.handleEquipmentSelect = this.handleEquipmentSelect.bind(this);
        this.handleIndexSelect = this.handleIndexSelect.bind(this);
        this.getSisterVessel = this.getSisterVessel.bind(this);
        this.handleVesselDrop = this.handleVesselDrop.bind(this);
        this.getIndividualParams = this.getIndividualParams.bind(this);
        this.getIndividualEquip = this.getIndividualEquip.bind(this);
        this.getIndividualIndex = this.getIndividualIndex.bind(this);
        this.res = this.res.bind(this);
        this.createOptionsListForGroups = this.createOptionsListForGroups.bind(this);
        this.selectDryDock = this.selectDryDock.bind(this);
        this.selectEvaluation = this.selectEvaluation.bind(this);
        this.selectPerformanceType = this.selectPerformanceType.bind(this);
        this.createOptionsListForDryDockSelection = this.createOptionsListForDryDockSelection.bind(this);
        this.createOptionsListForEvaluationSelection = this.createOptionsListForEvaluationSelection.bind(this);
        // this.getChartData = this.getChartData.bind(this);
        // this.createPopoverBlockList = this.createPopoverBlockList.bind(this);
    }

    handleDropChange = (e) => {
        this.setState({
            // group: e.label.props.children.props.children
            group: e.value
        });
        // this.props.setDropdown(e.label.props.children.props.children);
        this.props.setDropdown(e.value);
        this.props.setGroupSelection(e);
        let inter = document.getElementById('inter');
        if (inter) {
            inter.style.display = "none";
            inter.style.visibility = "hidden";
        }
        // inter.style.display = "none";
        // inter.style.visibility = "hidden";
        if(typeof this.props.trends.compare === typeof {}) {
            this.props.setCompare("None")
            this.props.setPerformanceType(null)
        }
    }

    onRadioChange = (e) => {
        if(e.target.value.includes("Com")) {
            let str = e.target.value.replace("Com", "");
            let specific = document.getElementById("specificsister");
            let similar = document.getElementById("similarsister");
            let inter = document.getElementById("inter")
            if(str === "SpecificSister") {
                specific.style.display = "contents";
                specific.style.visibility = "visible";
                similar.style.display = "none";
                similar.style.visibility = "hidden";
                inter.style.display = "none";
                inter.style.visibility = "hidden";
                
                // this.props.setCompare(str);
                // if(typeof this.props.options.sisterVessels === typeof []) {
                //     // this.getSisterVessel();
                // }
                
            }
            else if(str === "SimilarShips") {
                specific.style.display = "none";
                specific.style.visibility = "hidden";
                similar.style.display = "contents";
                similar.style.visibility = "visible";
                inter.style.display = "none";
                inter.style.visibility = "hidden";
                // this.setState({
                //     compare: str
                // });
                // this.props.setCompare(str);
                // if(typeof this.props.options.similarVessels === typeof []) {
                //     // this.getSimilarVessel();
                // }
                
            }
            else if(str === 'Intervention') {
                inter.style.display = "contents";
                inter.style.visibility = "visible";
                specific.style.display = "none";
                specific.style.visibility = "hidden";
                similar.style.display = "none";
                similar.style.visibility = "hidden";

                // this.getInterventionDates();
            }
            else {
                similar.style.display = "none";
                similar.style.visibility = "hidden";
                inter.style.display = "none";
                inter.style.visibility = "hidden";
                specific.style.display = "none";
                specific.style.visibility = "hidden";
                this.setState({
                    compare: str
                });
                this.props.setCompare(str);
            }
            
            // this.props.getTrends();
            console.log(str);
        }
        else if(e.target.value.includes("Duration")) {
            let str = e.target.value.replace("Duration", "");
            this.setState({
                duration: str
            });
            this.props.setDuration(str);
            // this.props.getTrends();
            console.log(str);
        }
        else {
            let key = e.target.value;
            this.setState({
                noonorlogs: key
            });
            this.props.setNoonOrLogs(key)
        }
    }

    handleCheckChange = (e) => {
        if(e.target.name == "outliers") {
            if(this.state.outliers === false) {
                this.setState({
                    outliers: true
                });
                this.props.setOutliers(true);
            }
            else {
                this.setState({
                    outliers: false
                });
                this.props.setOutliers(false);
            }
            // this.props.getTrends();
        }
        else if(e.target.name == "anomalies") {
            if(this.state.anomalies === false) {
                this.setState({
                    anomalies: true
                });
                this.props.setAnomalies(true);
            }
            else {
                this.setState({
                    anomalies: false
                });
                this.props.setAnomalies(false);
            }
            // this.props.getTrends();
        }
    }

    handleMultiSelect = (e) => {
        let arr = [];
        e.map(x => {
            arr.push(x.value);
        });
        // console.log(e);
        for(var x in arr) {
            if(!this.state.selectedOptions.includes(x)) {
                this.setState(prevState => ({
                    selectedOptions: [...prevState.selectedOptions, x]
                }));
            }
        }
        this.props.setMulti(arr);
        // this.props.getTrends();
        // console.log(arr);        
    }

    handleEquipmentSelect = (e) => {
        let arr = [];
        e.map(x => {
            arr.push(x.value);
        });
        // console.log(e);
        for(var x in arr) {
            if(!this.state.equipmentOptions.includes(x)) {
                this.setState(prevState => ({
                    selectedOptions: [...prevState.selectedOptions, x]
                }));
            }
        }
        this.props.setEquipmentMulti(arr);
        // this.props.getTrends();
        // console.log(arr);        
    }

    handleIndexSelect = (e) => {
        let arr = [];
        e.map(x => {
            arr.push(x.value);
        });
        // console.log(e);
        for(var x in arr) {
            if(!this.state.indexOptions.includes(x)) {
                this.setState(prevState => ({
                    selectedOptions: [...prevState.selectedOptions, x]
                }));
            }
        }
        this.props.setIndexMulti(arr);
        // this.props.getTrends();
        // console.log(arr);        
    }

    handleVesselDrop = (e) => {
        this.setState({
            compare: e.value
        });
        this.props.setCompare(e.value);
    }

    selectDryDock = (e) => {
        this.props.setDryDockPeriod(e.value);
        this.props.setDryDockOptionSelection(e);
        this.props.setCompare({'dry_dock_period': e.value});
        if(this.props.trends.group !== "") {
            this.props.setDropdown("")
        }
    }

    selectEvaluation = (e) => {
        this.props.setEvaluationPeriod(e.value);
        this.props.setEvaluationOptionSelection(e)
        this.props.setCompare({'evaluation_period': e.value});
        if(this.props.trends.group !== "") {
            this.props.setDropdown("")
        }
    }

    selectPerformanceType = (e) => {
        this.props.setPerformanceType(e.value);
        if(e.value === 'maintainance_trigger') {
            this.props.setDryDockOptionSelection({label: "01/05/2015-15/05/2015", value: "01/05/2015-15/05/2015"})
            this.props.setEvaluationOptionSelection({label: "15/12/2015-15/05/2016", value: "15/12/2015-15/05/2016"})
            this.props.setCompare({'dry_dock_period': e.value});
            // TESTING SHIPINTEL
            // this.props.setDryDockPeriod("01/01/2015-15/01/2015");
            // this.props.setEvaluationPeriod("15/07/2015-15/01/2016");
            // ACTUAL SHIPINTEL
            this.props.setDryDockPeriod("01/06/2015-15/06/2015");
            this.props.setEvaluationPeriod("16/12/2015-16/05/2016");
        }
        if(e.value === 'maintainance_effect') {
            this.props.setDryDockOptionSelection({label: "01/05/2015-15/05/2015", value: "01/05/2015-15/05/2015"})
            this.props.setEvaluationOptionSelection({label: "20/05/2015-20/11/2015", value: "20/05/2015-20/11/2016"})
            this.props.setCompare({'dry_dock_period': e.value});
            this.props.setDryDockPeriod("01/06/2015-15/06/2015");
            this.props.setEvaluationPeriod("20/06/2015-20/12/2015");
        }
        
        if(this.props.trends.group !== "") {
            this.props.setDropdown("")
        }
    }

    createOptionsListForDryDockSelection = () => {
        if(this.props.trends.performance_type === 'maintainance_trigger') {
            let options = [
                {label: "01/12/2015-15/12/2015", value: "01/12/2015-15/12/2015"}
            ]
            this.props.setDryDockPeriodOptions(options);
        }
        else if(this.props.trends.performance_type === 'maintainance_effect') {
            let options = [
                {label: "15/05/2015-15/11/2015", value: "15/05/2015-15/11/2015"}
            ]
            this.props.setDryDockPeriodOptions(options);
        }
        
    }

    createOptionsListForEvaluationSelection = () => {
        if(this.props.trends.performance_type === 'maintainance_trigger') {
            let options = [
                {label: "15/05/2015-15/11/2015", value: "15/05/2015-15/11/2015"}
            ]
            this.props.setEvaluationPeriodOptions(options);
        }
        else if(this.props.trends.performance_type === 'maintainance_effect') {
            let options = [
                {label: "15/12/2015-15/05/2016", value: "15/12/2015-15/05/2016"}
            ]
            this.props.setEvaluationPeriodOptions(options);
        }
    }

    getSisterVessel = async () => {
        let currentshipvalue = localStorage.getItem('firstshipvalue');
        let param = {'ship_imo': this.props.currentShip.currentShip ? this.props.currentShip.currentShip['value'] : currentshipvalue}
        await axios({
            method: "get",
            url: urlSister,
            params: param
        })
        .then(res => {
            // this.props.setSisterVessel(res.data);
            this.setState({
                sisterVessels: res.data
            })
        })
        .catch(error => console.log(error));
    }

    getSimilarVessel = async () => {
        let currentshipvalue = localStorage.getItem('firstshipvalue');
        let param = {'ship_imo': this.props.currentShip.currentShip ? this.props.currentShip.currentShip['value'] : currentshipvalue}
        await axios({
            method: "get",
            url: urlSimilar,
            params: param
        })
        .then(res => {
            // this.props.setSimilarVessel(res.data);
            this.setState({
                similarVessels: res.data
            })
        })
        .catch(error => console.log(error));
    }

    getIndividualParams = async () => {
        let currentshipvalue = localStorage.getItem('firstshipvalue');
        console.log("FIRST SHIP!!!!!!!!!!!!!!!", currentshipvalue)
        let param = {'ship_imo': this.props.currentShip.currentShip ? this.props.currentShip.currentShip['value'] : currentshipvalue}
        await axios({
            method: "get",
            url: urlIndividualParams,
            params: param
        })
        .then(res => {
            this.props.setIndividualParams(res.data);
        })
        .catch(error => console.log(error));
    }

    getIndividualEquip = async () => {
        let currentshipvalue = localStorage.getItem('firstshipvalue');
        let param = {'ship_imo': this.props.currentShip.currentShip ? this.props.currentShip.currentShip['value'] : currentshipvalue}
        await axios({
            method: "get",
            url: urlIndividualEquip,
            params: param
        })
        .then(res => {
            this.props.setIndividualEquip(res.data);
        })
        .catch(error => console.log(error));
    }

    getIndividualIndex = async () => {
        let currentshipvalue = localStorage.getItem('firstshipvalue');
        let param = {'ship_imo': this.props.currentShip.currentShip ? this.props.currentShip.currentShip['value'] : currentshipvalue}
        await axios({
            method: "get",
            url: urlIndividualIndex,
            params: param
        })
        .then(res => {
            this.props.setIndividualIndex(res.data);
        })
        .catch(error => console.log(error));
    }

    res = async () => {
        let currentshipvalue = localStorage.getItem('firstshipvalue');
        let param = {'ship_imo': this.props.currentShip.currentShip ? this.props.currentShip.currentShip['value'] : currentshipvalue}
        await axios({
            method: 'get',
            url: baseUrl + 'generic_group',
            params: param
        })
        .then(response => {
            this.props.setGenericGroups(response.data);
        })
        .catch(error => {
            this.props.trendsFailed(error);
        });
    }

    createOptionsListForGroups = () => {
        let optionsList=[];

        for(let groupnumber=0;groupnumber<this.props.trends.generic_groups['Groups'].length;groupnumber++) {
            let option = {
                value: (groupnumber+1).toString(),
                label: (
                    <OverlayTrigger
                            placement="right"
                            trigger="click"
                            // delay={{show: "250", hide: "400"}}
                            
                            overlay={(
                                <Popover className="popover-scroll">
                                    <Popover.Title as="h4">List of Parameters</Popover.Title>
                                    <Popover.Content>
                                        {
                                            this.props.trends.generic_groups !== null ? 
                                            Object.keys(this.props.trends.generic_groups['Result']).map((key) => {
                                                if(key === this.props.trends.generic_groups['Groups'][groupnumber].toString()) {
                                                    return (
                                                        Object.keys(this.props.trends.generic_groups['Result'][key]).map((k) => {
                                                            return(
                                                                <>
                                                                    <h5 key={k}>{k}</h5>
                                                                    {
                                                                        this.props.trends.generic_groups['Result'][key][k].map((item) => {
                                                                            return(
                                                                                <><b key={item}>{item}</b><br /></>
                                                                            )
                                                                        })
                                                                    }
                                                                </>
                                                            )
                                                        })
                                                    )
                                                }
                                            }) : ""
                                        }
                                    </Popover.Content>
                                </Popover>
                            )}
                        >
                            <span>{this.props.trends.generic_groups && this.props.trends.generic_groups['Groups'][groupnumber]}</span>
                        </OverlayTrigger>
                )
            }
            optionsList.push(option);
        }

        optionsList.push({'value': '', 'label': 'None'});

        return optionsList;
    }

    componentDidMount() {
        this.getIndividualParams();
        this.getIndividualEquip();
        this.getIndividualIndex();
        this.res();
        // this.getSimilarVessel();
        // this.getSisterVessel();
        // this.getChartData();
        // console.log("DID MOUNT");
        this.props.setCompare("None")
        // if(typeof this.props.trends.individual_params === typeof []) {
        //     this.getIndividualParams();
        // }
        // if(typeof this.props.trends.individual_equip === typeof []) {
        //     this.getIndividualEquip();
        // }
        // if(typeof this.props.trends.individual_index === typeof []) {
        //     this.getIndividualIndex();
        // }
        // if(typeof this.props.trends.generic_groups === typeof null) {
        //     this.res();
        // }
        // if(typeof this.props.options.sisterVessels === typeof []) {
        //     this.getSisterVessel();
        // }
        // if(typeof this.props.options.similarVessels === typeof []) {
        //     this.getSimilarVessel();
        // }
        if(this.props.currentShip.currentShip['value'] === 9592301 || this.props.currentShip.currentShip['value'] === '9592301') {
            this.props.setNoonOrLogs('logs');
        }
        else {
            this.props.setNoonOrLogs('noon');
        }
        // console.log(re);
    }

    componentDidUpdate(prevProps, prevState) {
        // this.res();
        // console.log(re);
        if(prevProps.currentShip.currentShip !== this.props.currentShip.currentShip) {
            console.log("DID UPDATE")
            // if(typeof this.props.trends.individual_params === typeof []) {
            //     this.getIndividualParams();
            // }
            // if(typeof this.props.trends.individual_equip === typeof []) {
            //     this.getIndividualEquip();
            // }
            // if(typeof this.props.trends.individual_index === typeof []) {
            //     this.getIndividualIndex();
            // }
            // if(typeof this.props.trends.generic_groups === typeof null) {
            //     this.res();
            // }
            // if(typeof this.props.options.sisterVessels === typeof []) {
            //     this.getSisterVessel();
            // }
            // if(typeof this.props.options.similarVessels === typeof []) {
            //     this.getSimilarVessel();
            // }
            this.getIndividualParams();
            this.getIndividualEquip();
            this.getIndividualIndex();
            this.res();
            this.getSimilarVessel();
            this.getSisterVessel();
            // this.getInterventionDates();
            if(this.props.currentShip.currentShip['value'] === 9592301 || this.props.currentShip.currentShip['value'] === '9592301') {
                this.props.setNoonOrLogs('logs');
            }
            else {
                this.props.setNoonOrLogs('noon');
            }
        }
        // if(prevProps.trends.compare !== this.props.trends.compare) {
        //     if(this.props.trends.compare === 'SpecificSister') {
        //         this.getSisterVessel()
        //     }
        //     if(this.props.trends.compare === 'SimilarShips') {
        //         this.getSimilarVessel()
        //     }
        // }
        if(prevProps.trends.generic_groups !== this.props.trends.generic_groups) {
            let optionsList = this.createOptionsListForGroups();
            this.setState({
                tooltips: optionsList
            })
            
        }
        if(prevProps.trends.compare !== this.props.trends.compare) {
            if(typeof this.props.trends.compare === typeof {}) {
                this.props.setGroupSelection({'label': "None", 'value': ""})
            }
            else if(this.props.trends.compare === 'LastYear' && this.props.trends.duration === '180Days') {
                this.props.setDuration('Lastyear180')
            }
            else if(this.props.trends.compare === 'LastYear' && this.props.trends.duration === '1Year') {
                this.props.setDuration('Lastyear')
            }
            else if(this.props.trends.compare === 'DryDock') {
                this.props.setDuration('DryDock')
            }
            else if(this.props.trends.compare === 'None') {
                this.props.setDuration('1Year')
            }
        }
        if(prevProps.trends.duration !== this.props.trends.duration) {
            if(this.props.trends.compare === 'LastYear' && this.props.trends.duration === '180Days') {
                this.props.setDuration('Lastyear180')
            }
            else if(this.props.trends.compare === 'LastYear' && this.props.trends.duration === '1Year') {
                this.props.setDuration('Lastyear')
            }
        }

        // if(prevProps.trends.performance_type !== this.props.trends.performance_type) {
        //     this.createOptionsListForDryDockSelection();
        //     this.createOptionsListForEvaluationSelection();
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

    render() {

        return(
            <Container fluid>
                <Row>
                    <Col md={2}>
                        <Collapsible title="Pick Parameters" default={true} className="trendscard trendsheight" style={{padding: "5px", alignItems: "center"}}>
                            <form>
                                <Row className="align-items-center">
                                    <Col className="col-12" style={{ fontSize: "15px" }}>
                                        <div style={{display:"flex",alignItems:"center"}}>
                                            {
                                                this.props.currentShip.currentShip['value'] === 9592301 || this.props.currentShip.currentShip['value'] === '9592301' ?
                                                <>
                                                <input style={{marginLeft:"0px"}} type="radio" id="noon" name="noonorlogs" value="noon" onChange={this.onRadioChange}/> <label htmlFor="noon" style={{marginLeft:"5px", marginRight:"20px"}}>Noon</label>
                                                <input styel={{marginLeft:"150px"}} type="radio" id="logs" name="noonorlogs" value="logs" onChange={this.onRadioChange} defaultChecked/> <label htmlFor="logs" style={{marginLeft:"5px"}}>Logs</label>
                                                </>
                                                :
                                                <>
                                                <input style={{marginLeft:"0px"}} type="radio" id="noon" name="noonorlogs" value="noon" onChange={this.onRadioChange} defaultChecked/> <label htmlFor="noon" style={{marginLeft:"5px", marginRight:"5px"}}>Noon</label>
                                                <input styel={{marginLeft:"150px"}} type="radio" id="logs" name="noonorlogs" value="logs" onChange={this.onRadioChange} /> <label htmlFor="logs" style={{marginLeft:"5px"}}>Logs</label>
                                                </>
                                            }
                                            {/* <label htmlFor='noon'><input type="radio" id="noon" name="noonorlogs" value="noon" onChange={this.onRadioChange} defaultChecked={this.props.currentShip.currentShip['value'] === '9592301' ? true : false} />Noon</label>
                                            <label htmlFor='logs'><input type="radio" id="logs" name="noonorlogs" value="logs" onChange={this.onRadioChange} defaultChecked={this.props.currentShip.currentShip['value'] === '9592301' ? true : false} />Logs</label> */}
                                        </div>
                                        <label htmlFor="group">Group of Parameters</label>
                                        <Select className="select-color" name="dropdown-group" options={this.state.tooltips} value={this.props.trends.group_selection&&this.props.trends.group_selection} onChange={this.handleDropChange}></Select>
                                        <label htmlFor="individual">Individual Parameters</label><br />
                                        {this.props.trends.individual_params && <Select className="select-color" isMulti={true} name="dropdown-individual" options={this.props.trends.individual_params['Individual']} onChange={this.handleMultiSelect}></Select>}
                                        <label htmlFor="equip">Individual Equipments</label><br />
                                        {this.props.trends.individual_equip && <Select className="select-color" isMulti={true} name="dropdown-equipment" options={this.props.trends.individual_equip['Individual']} onChange={this.handleEquipmentSelect}></Select>}
                                        <label htmlFor="index">Individual Indices</label><br />
                                        {this.props.trends.individual_index && <Select className="select-color" isMulti={true} name="dropdown-equipment" options={this.props.trends.individual_index['Individual']} onChange={this.handleIndexSelect}></Select>}
                                    </Col>
                                </Row>
                            </form>
                        </Collapsible>
                        <Collapsible title="Compare Mode" className="trendscard trendsheight" style={{padding: "5px", alignItems: "center"}}>
                            <form>
                                <Row >
                                    <Col style={{ fontSize: "15px" }}>
                                        <div style={{display:"flex",alignItems:"center"}}>
                                        <input style={{marginLeft:"-90px"}} type="radio" id="None" name="Compare" value="ComNone" checked={this.props.trends.compare&&this.props.trends.compare==="None"||this.props.trends.compare===null} onChange={this.onRadioChange} /> <label style={{marginLeft:"-90px"}} htmlFor="None">None</label>
                                        </div>
                                        <div style={{display:"flex",alignItems:"center"}}>
                                        <input style={{marginLeft:"-90px"}} type="radio" id="LastYear" name="Compare" value="ComLastYear" checked={this.props.trends.compare&&this.props.trends.compare==="LastYear"} onChange={this.onRadioChange} /> <label style={{marginLeft:"-90px"}} htmlFor="LastYear">Last Year</label>
                                        </div>
                                        <div>
                                        <input style={{marginLeft:"-90px"}} type="radio" id="DryDock" name="Compare" value="ComDryDock" checked={this.props.trends.compare&&this.props.trends.compare==="DryDock"} onChange={this.onRadioChange} /> <label style={{marginLeft:"-90px"}} htmlFor="DryDock">Dry Dock</label>
                                        </div>
                                        <div>
                                        <input style={{marginLeft:"-90px"}} type="radio" id="Specific" name="Compare" value="ComSpecificSister" checked={this.props.trends.compare&&this.props.trends.compare==="SpecificSister"} onChange={this.onRadioChange} /> <label style={{marginLeft:"-90px"}} htmlFor="Specific">Specific Sister</label>
                                        </div>
                                        <div style={{display: "none", visibility: "hidden"}} id="specificsister">
                                            <label htmlFor="spsis">Select Specific Sister:</label>
                                            { this.state.sisterVessels && <Select className="select-color select-dimensions" name="dropdown-specific" id="spsis" options={this.state.sisterVessels['Result']} onChange={this.handleVesselDrop} />}
                                        <br/>
                                        </div>
                                        

                                        {/* <label htmlFor="All"><input type="radio" id="All" name="Compare" value="ComAllSisters" checked={this.props.trends.compare&&this.props.trends.compare==="AllSisters"} onChange={this.onRadioChange} /> All Sisters</label> */}
                                        
                                        {/* <br/> */}
                                        <div>
                                        <input style={{marginLeft:"-90px"}} type="radio" id="Similar" name="Compare" value="ComSimilarShips" checked={this.props.trends.compare&&this.props.trends.compare==="SimilarShips"} onChange={this.onRadioChange} /> <label style={{marginLeft:"-90px"}} htmlFor="Similar">Similar Ships</label>
                                        </div>
                                        <div style={{display: "none", visibility: "hidden"}} id="similarsister">
                                        <label htmlFor="simsis">Select Similar Vessel:</label>
                                            { this.state.similarVessels && <Select className="select-color select-dimensions" name="dropdown-similar" id="simsis" options={this.state.similarVessels['Result']}  onChange={this.handleVesselDrop} />}
                                        <br/>
                                        </div>
                                        
                                        <div>
                                        <input style={{marginLeft:"-90px"}} type="radio" id="intervention" name="Compare" value="ComIntervention" checked={this.props.trends.compare&&typeof this.props.trends.compare === typeof {}} onChange={this.onRadioChange} /> <label style={{marginLeft:"-90px"}} htmlFor="intervention">Intervention Analysis</label>
                                        </div>
                                        <div style={{display: "none", visibility: "hidden"}} id="inter" className="trendsheight">
                                            <label htmlFor="performancetype">Performance Type:</label>
                                            <Select className="select-color" name="dropdown_performance_type" id="performancetype" options={[{label: "Maintenance Trigger", 'value': 'maintainance_trigger'}, {label: "Maintenance Effect", 'value': 'maintainance_effect'}]} onChange={this.selectPerformanceType} size="small" />
                                            <label htmlFor="interdrydockperiod">Select Dry Dock Period:</label>
                                            
                                            <Select
                                                className="select-color"
                                                name="dropdown-drydock"
                                                id="interdrydockperiod"
                                                options={
                                                    this.props.trends.performance_type === 'maintainance_trigger' ? [{label: "01/05/2015-15/05/2015", value: "01/05/2015-15/05/2015"}] :
                                                    this.props.trends.performance_type === 'maintainance_effect' ? [{label: "01/05/2015-15/05/2015", value: "01/05/2015-15/05/2015"}] :
                                                    [{'label': 'No Data', 'value': 'No Data'}]
                                                }
                                                // value={this.props.trends.dry_dock_option_selection&&this.props.trends.dry_dock_option_selection}
                                                value={
                                                    this.props.trends.performance_type === 'maintainance_trigger' ? {label: "01/05/2015-15/05/2015", value: "01/05/2015-15/05/2015"} :
                                                    this.props.trends.performance_type === 'maintainance_effect' ? {label: "01/05/2015-15/05/2015", value: "01/05/2015-15/05/2015"} :
                                                    [{'label': 'None', 'value': 'None'}]
                                                }
                                                onChange={this.selectDryDock}
                                                size="small" />
                                            {
                                                this.props.trends.performance_type === 'maintainance_trigger' ?
                                                <><label htmlFor="interdrop">Select Evaluation Period:</label>
                                                <Select
                                                    className="select-color"
                                                    name="dropdown-intervention"
                                                    id="interdrop"
                                                    options={
                                                        this.props.trends.performance_type === 'maintainance_trigger' ? [{label: "15/12/2015-15/05/2016", value: "15/12/2015-15/05/2016"}] :
                                                        this.props.trends.performance_type === 'maintainance_effect' ? [{label: "20/05/2015-20/11/2015", value: "20/05/2015-20/11/2016"}] :
                                                        [{'label': 'No Data', 'value': 'No Data'}]
                                                    }
                                                    // value={this.props.trends.evaluation_option_selection&&this.props.trends.evaluation_option_selection}
                                                    value={
                                                        this.props.trends.performance_type === 'maintainance_trigger' ? {label: "15/12/2015-15/05/2016", value: "15/12/2015-15/05/2016"} :
                                                        this.props.trends.performance_type === 'maintainance_effect' ? {label: "20/05/2015-20/11/2015", value: "20/05/2015-20/11/2016"} :
                                                        [{'label': 'None', 'value': 'None'}]
                                                    }
                                                    onChange={this.selectEvaluation}
                                                    size="small" /></> : ""
                                            }
                                            {
                                                this.props.trends.performance_type && this.props.trends.performance_type === 'maintainance_trigger' ?
                                                <p style={{fontSize: 15}}>
                                                    {
                                                        this.props.trends.trendsData['Trigger Period'] && "Reference Period: " + this.props.trends.trendsData['Trigger Period']['Reference']['Start'] + "-" + this.props.trends.trendsData['Trigger Period']['Reference']['End']
                                                    }
                                                </p> :
                                                this.props.trends.performance_type && this.props.trends.performance_type === 'maintainance_effect' ?
                                                <p style={{fontSize: 15}}>
                                                    {
                                                        this.props.trends.trendsData['Trigger Period'] && "Reference Period: " + this.props.trends.trendsData['Trigger Period']['Reference']['Start'] + "-" + this.props.trends.trendsData['Trigger Period']['Reference']['End']
                                                    }
                                                </p> :
                                                ""
                                            }
                                            {
                                                // this.props.trends.performance_type === 'maintainance_trigger' ?
                                                // <p style={{fontSize: 15}}>
                                                //     {
                                                //         this.props.trends.trendsData['Effect Period'] && "Evaluation Period: " + this.props.trends.trendsData['Effect Period']['Evaluation']['Start'] + "-" + this.props.trends.trendsData['Effect Period']['Evaluation']['End']
                                                //     }
                                                // </p> :
                                                this.props.trends.performance_type === 'maintainance_effect' ?
                                                <p style={{fontSize: 15}}>
                                                    {
                                                        this.props.trends.trendsData['Effect Period'] && "Evaluation Period: " + this.props.trends.trendsData['Effect Period']['Evaluation']['Start'] + "-" + this.props.trends.trendsData['Effect Period']['Evaluation']['End']
                                                    }
                                                </p> :
                                                ""
                                            }
                                            
                                            {/* { this.props.options.intervention && <Select className="select-color select-dimensions" name="dropdown-intervention" id="interdrop" options={this.props.options.intervention['Result']}  onChange={this.handleVesselDrop} />} */}
                                        </div>
                                    </Col>
                                </Row>
                            </form>
                        </Collapsible>
                        <Collapsible title="Baseline Data" className="trendscard trendsheight" style={{padding: "5px", alignItems: "center"}}>
                            <form>
                                <Row className="align-items-center">
                                    <Col style={{ fontSize: "15px" }}>
                                        <div style={{display:"flex",alignItems:"center"}}>
                                        {this.props.trends.compare && <input style={{marginLeft:"-90px"}} type="radio" id="180" name="Duration" value="Duration180Days" onChange={this.onRadioChange} />}
                                        <label style={{marginLeft:"-90px"}} htmlFor="180">180 Days</label>
                                        </div>
                                        <div style={{display:"flex",alignItems:"center"}}>
                                        {this.props.trends.compare && <input style={{marginLeft:"-90px"}} type="radio" id="1" name="Duration" value="Duration1Year" onChange={this.onRadioChange} defaultChecked={this.props.trends.compare==='DryDock'?false:true} /> }
                                        <label style={{marginLeft:"-90px"}} htmlFor="1">1 Year</label>
                                        </div>
                                        {
                                            this.props.trends.compare && this.props.trends.compare === 'LastYear' ?
                                            <label>
                                                {
                                                    this.props.trends.duration && this.props.trends.duration === 'Lastyear180' ?
                                                    "Reference Data to Compare - Last Year 180 Days" :
                                                    this.props.trends.duration && this.props.trends.duration === 'Lastyear' ?
                                                    "Reference Data to Compare - Last 1 Year" :
                                                    ""
                                                }
                                            </label>
                                            :
                                            this.props.trends.compare && this.props.trends.compare === 'DryDock' ?
                                            <label>Reference Data to Compare - 180 Days After Dry Dock</label> :
                                            ""
                                        }
                                        {/* <br />
                                        <label htmlFor="ly_180"><input type="radio" id="ly_180" name="Reference" value="DurationLastyear180" onChange={this.onRadioChange} /> Last Year 180 Days</label>
                                        <br/>
                                        <label htmlFor="ly_12"><input type="radio" id="ly_12" name="Reference" value="DurationLastyear" onChange={this.onRadioChange} defaultChecked={this.props.trends.compare==='LastYear'?true:false} /> Last 1 Year</label>
                                        <label htmlFor="Since"><input type="radio" id="Since" name="Reference" value="DurationSinceDryDock" onChange={this.onRadioChange} defaultChecked={this.props.trends.compare==='DryDock'?true:false} /> 180 Days After Dry Dock</label> */}
                                    </Col>
                                </Row>
                            </form>
                        </Collapsible>
                        <Collapsible title="Anomalies" className="trendscard trendsheight" style={{padding: "5px", alignItems: "center"}}>
                            <div style={{display:"flex",alignItems:"center"}}>
                            <input style={{marginLeft:"-90px"}} type="checkbox" name="outliers" value="outliers" id="outliers" onChange={this.handleCheckChange} /> <label style={{marginLeft:"-90px"}} htmlFor="outliers">Include Outliers</label>
                            </div>
                            <div style={{display:"flex",alignItems:"center"}}>
                            <input style={{marginLeft:"-90px"}} type="checkbox" name="anomalies" value="anomalies" id="anomalies" onChange={this.handleCheckChange} defaultChecked /> <label style={{marginLeft:"-90px"}} htmlFor="anomalies"> Show Anomalies (Insights)</label>
                            </div>
                        </Collapsible>
                    </Col>
                    <Col md={7}>
                        <Card className="trendsheight" style={{background: "#8A9090", marginTop: '5px'}}>
                            <div style={{height: "1000px", overflowY: "auto", overflowX: "auto"}}>
                                <Chart
                                    sister={this.state.sisterVessels}
                                    similar={this.state.similarVessels}
                                />
                            </div>
                        </Card>
                    </Col>
                    <Col md={3}>
                        {
                            this.props.hover && this.props.fuelConsHover && <TrendsTable
                                hoverData={this.props.hover}
                                fuelConsHoverData={this.props.fuelConsHover}
                                dryDockHover={this.props.hover.drydockhover&&this.props.hover.drydockhover}
                                short_names={this.props.trends.trendsData['Short Names']}
                            />
                        }
                    </Col>
                </Row>
            </Container>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TrendsCard);