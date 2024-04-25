import React from 'react';
import Collapsible from './CollapsibleInteractive';
import { Col, Row, Button, Card, Container, Table } from 'react-bootstrap';
import { connect } from 'react-redux';

const mapStateToProps = state => {
    return {
        interactive: state.interactive,
        options: state.options,
        hover: state.hover
    }
}

class InteractiveTable extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <React.Fragment>
                <Collapsible title="Table" className="interactiveheader interactivecard">
                    <form>
                        <Table responsive bordered>
                            <thead>
                                <tr>
                                    <th>{this.props.interactive.interactiveData.X_name}</th>
                                    {/* <th>{this.props.interactive.z_axis === '' ? this.props.interactive.interactiveData.Y_name:this.props.interactive.interactiveData.Z_name}</th> */}
                                    {this.props.interactive.z_axis === '' ? '' : <th>{this.props.interactive.interactiveData.Z_name}</th>}
                                    <td>{this.props.interactive.interactiveData.Y_name}</td>
                                    {/* <th>CI</th> */}
                                </tr>
                            </thead>
                            <tbody>
                                {this.props.hover.interactivehover && <tr>
                                    <td>{this.props.hover.interactivehover[this.props.interactive.interactiveData['X_name']]}</td>
                                    {this.props.interactive.z_axis === '' ? '' : <td>{this.props.hover.interactivehover[this.props.interactive.interactiveData['Z_name']]}</td>}
                                    <td>{this.props.hover.interactivehover[this.props.interactive.interactiveData['Y_name']]}</td>
                                </tr>}
                                {/* <tr>
                                    {
                                        this.props.hover.interactivehover && Object.keys(this.props.hover.interactivehover).map(key => {
                                            if(this.props.hover.interactivehover[key] !== undefined) {
                                                return (
                                                    <td>{this.props.hover.interactivehover[key]}</td>
                                                )
                                            }
                                        })
                                    }
                                </tr> */}
                                {/* <tr>
                                    <td>asda</td>
                                    <td>asda</td>
                                    <td>asda</td>
                                </tr>
                                <tr>
                                    <td>asda</td>
                                    <td>asda</td>
                                    <td>asda</td>
                                </tr>
                                <tr>
                                    <td>asda</td>
                                    <td>asda</td>
                                    <td>asda</td>
                                </tr>
                                <tr>
                                    <td>asda</td>
                                    <td>asda</td>
                                    <td>asda</td>
                                </tr> */}
                            </tbody>
                        </Table>
                    </form>
                </Collapsible>
            </React.Fragment>
        );
    }
}

export default connect(mapStateToProps)(InteractiveTable);