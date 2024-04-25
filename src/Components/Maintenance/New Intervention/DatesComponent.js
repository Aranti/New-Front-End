import React from 'react';
import DatePicker from 'react-datepicker';
import '../../../../public/CommonCss/intervention.css';
import { Container, Form, Row, Button, Col } from 'react-bootstrap';

class DatesComponent extends React.Component {
    constructor(props) {
        super(props);

        this.handleGoForward = this.handleGoForward.bind(this);
    }

    handleGoForward = (e) => {
        e.preventDefault();
        this.props.goForward();
    }

    render() {
        return (
            <Container className="subcard">
                <Form>
                    <Form.Row>
                        <Form.Group as={Col} controlId="label1">
                            <Form.Label className="label">From Date:</Form.Label>
                        </Form.Group>
                        <Form.Group as={Col} controlId="input1">
                            <DatePicker
                                dateFormat="yyyy-MM-dd"
                                selected={this.props.values.fromDate}
                                onChange={(e) => this.props.handleChange('fromDate', new Date(e))}
                                placeholderText={"yyyy-mm-dd"}
                                required={true}
                            />
                        </Form.Group>
                    </Form.Row>
                    <Form.Row>
                        <Form.Group as={Col} controlId="label2">
                            <Form.Label className="label">To Date:</Form.Label>
                        </Form.Group>
                        <Form.Group as={Col} controlId="input2">
                            <DatePicker
                                dateFormat="yyyy-MM-dd"
                                selected={this.props.values.toDate}
                                onChange={(e) => this.props.handleChange('toDate', new Date(e))}
                                placeholderText={"yyyy-mm-dd"}
                                required={true}
                            />
                        </Form.Group>
                    </Form.Row>
                    <Button variant="primary" onClick={this.handleGoForward} className="nextbutton">Next</Button>
                </Form>
            </Container>
        )
    }
}

export default DatesComponent;