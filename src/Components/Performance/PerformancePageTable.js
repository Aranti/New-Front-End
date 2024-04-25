import React from 'react';
import { Table, Row, Col } from 'react-bootstrap';
import '../../../public/CommonCss/performance.css';

class PerformancePageTable extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <>
                <Table bordered hover size="sm" className="performance-table-performance">
                    <thead>
                        <tr>
                            {
                                this.props.headers.map(header => {
                                    return (
                                        Object.keys(this.props.data[0]).map(key => {
                                            // console.log(header, key)
                                            if(key === header) {
                                                return (
                                                    <th key={key}>{key}</th>
                                                )
                                            }
                                        })
                                    )
                                })
                            }
                        </tr>
                    </thead>
                    <tbody>
                        {
                            Object.keys(this.props.data).map(rows => {
                                return (
                                    <tr key={rows}>
                                        {
                                            this.props.headers.map(header => {
                                                return (
                                                    Object.keys(this.props.data[rows]).map(col => {
                                                        if(header === col) {
                                                            return (
                                                                <td key={col}>{this.props.data[rows][col]}</td>
                                                            )
                                                        }
                                                    })
                                                )
                                            })
                                        }
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </Table>
            </>
        )
    }
}

export default PerformancePageTable;