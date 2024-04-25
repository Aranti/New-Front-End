import { nth } from 'lodash';
import React from 'react';
import { Table, Col, Row, Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import './ais.css'
const mapStateToProps = state => {
    return {
        ais: state.ais
    }
}

class AisTable extends React.Component {
    constructor(props) {
        super(props);
        console.log("aissssssssssss",this.props.ais)
    }

    render() {
        return (
            <div className='div1'>
                <h2 >AIS</h2>

                <Table bordered hover size="sm" style={{wordWrap: "break-word", minWidth: 'max-content'}}>
                    <thead>
                        <tr>
                            <th >Item</th>
                            <th >Observation 1</th>

                            {
                                (this.props.ais['aisData'] !== null) && (this.props.ais['aisData']['Ais']['Arrival Date'].length>1) ? Array.from(Array(this.props.ais['aisData']['Ais']['Arrival Date'].length-1), (e, i) => {
                                    return <th key={i}>Observation {i+2}</th>
                                }) : Array.from(Array(2), (e, i) => {
                                    return <th key={i}>Observation {i+2}</th>
                                })
                            }
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.props.ais['aisData'] !== null ? this.props.ais['aisData']['Ais List'].map(param => {
                                return (
                                    Object.keys(this.props.ais['aisData']['Ais']).map(key => {
                                        if(key === param) {
                                            return(
                                                <tr key={key}>
                                                    <td>{key}</td>
                                                    {
                                                        this.props.ais['aisData']['Ais'][key].map(ls => {
                                                            return (
                                                                <td>{ls}</td>
                                                            )
                                                        })
                                                    }
                                                </tr>
                                            )
                                        }
                                    })
                                )
                                
                            }) : ""
                        }
                    </tbody>
                </Table>
                <br />
                {/* <h2>Weather</h2>
                <Table bordered hover size="sm" style={{wordWrap: "break-word", tableLayout: "fixed"}}>
                    <thead>
                    </thead>
                    <tbody>
                        {
                            this.props.ais['aisData'] !== null ? this.props.ais['aisData']['Weather List'].map(param => {
                                return (
                                    Object.keys(this.props.ais['aisData']['Ais']).map(key => {
                                        if(key === param) {
                                            return(
                                                <tr key={key}>
                                                    <td>{key}</td>
                                                    {
                                                        this.props.ais['aisData']['Ais'][key].map(ls => {
                                                            return (
                                                                <td>{ls}</td>
                                                            )
                                                        })
                                                    }
                                                </tr>
                                            )
                                        }
                                    })
                                )
                            }) : ""
                        }
                    </tbody>
                </Table> */}
            </div>
        )
    }
}

export default connect(mapStateToProps)(AisTable)




// reference code for loops in array
{/* <div>
    {   
        direct loop in array(for i in arr)
        // this.props.ais['aisData'] !== null ? this.props.ais['aisData']['Ais']['Arrival Date'].map(param => {
        //         return (
        //                 <h3>{this.props.ais['aisData']['Ais']['Arrival Date'].length}</h3>
        //         )
                
        //     }) : ""

        loop in length of array (for i in range(0,len(arr)))
        // this.props.ais['aisData'] !== null ? Array.from(Array(this.props.ais['aisData']['Ais']['Arrival Date'].length), (e, i) => {
        //     return <li key={i}>Observation {i}</li>
            
        // }) : ""
    }
</div> */}