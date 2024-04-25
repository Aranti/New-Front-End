import React from 'react';
import '../../../../public/CommonCss/intervention.css';
import { Container, Form, Row, Button, Col } from 'react-bootstrap';
import Select from 'react-select';

const iv_category_options = [
    {'label': "Dry Docking", 'value': 'Dry Docking'},
    {'label': "Under Water", 'value': 'Under Water'},
    {'label': "Overhaul", 'value': 'Overhaul'}
];

const category_code_options = [
    {'label': "DD", 'value': 'DD'},
    {'label': "UW", 'value': 'UW'},
    {'label': "OH", 'value': 'OH'}
];

const category_description_options = [
    {'label': "Dry Docking", 'value': "Dry Docking"},
    {'label': "Underwater Maintenance", 'value': "Underwater Maintenance"},
    {'label': "Major Overhaul", 'value': "Major Overhaul"},
    {'label': "Minor Overhaul", 'value': "Minor Overhaul"},
    {'label': "Semi-Major Overhaul", 'value': "Semi-Major Overhaul"}
];

const iv_type_options = [
    {'label': "Major", 'value': "Major"},
    {'label': "Semi-Major", 'value': 'Semi-Major'},
    {'label': "Minor", 'value': "Minor"}
];

class InterventionDetails extends React.Component {
    constructor(props) {
        super(props);

        this.handleGoForward = this.handleGoForward.bind(this);
        this.handleGoBack = this.handleGoBack.bind(this);
    }

    handleGoForward = (e) => {
        e.preventDefault();
        this.props.goForward();
    }

    handleGoBack = (e) => {
        e.preventDefault();
        this.props.goBack();
    }

    render() {
        return(
            <Container className="subcard">
                <Form>
                    <Form.Row>
                        <Form.Group as={Col} controlId="label1">
                            <Form.Label className="label">Intervention Category</Form.Label>
                        </Form.Group>
                        <Form.Group as={Col} controlId="drop1">
                            <Select
                                options={iv_category_options}
                                onChange={(e) => this.props.handleChange('iv_category', e)}
                                value={this.props.values.iv_category}
                            />
                        </Form.Group>
                    </Form.Row>
                    <Form.Row>
                        <Form.Group as={Col} controlId="label2">
                            <Form.Label className="label">Category Code</Form.Label>
                        </Form.Group>
                        <Form.Group as={Col} controlId="drop2">
                            <Select
                                options={category_code_options}
                                onChange={(e) => this.props.handleChange('category_code', e)}
                                value={this.props.values.category_code}
                            />
                        </Form.Group>
                    </Form.Row>
                    <Form.Row>
                        <Form.Group as={Col} controlId="label3">
                            <Form.Label className="label">Category Description</Form.Label>
                        </Form.Group>
                        <Form.Group as={Col} controlId="drop3">
                            <Select
                                options={category_description_options}
                                onChange={(e) => this.props.handleChange('category_desc', e)}
                                value={this.props.values.category_desc}
                            />
                        </Form.Group>
                    </Form.Row>
                    <Form.Row>
                        <Form.Group as={Col} controlId="label4">
                            <Form.Label className="label">Intervention Type</Form.Label>
                        </Form.Group>
                        <Form.Group as={Col} controlId="drop4">
                            <Select
                                options={iv_type_options}
                                onChange={(e) => this.props.handleChange('iv_type', e)}
                                value={this.props.values.iv_type}
                            />
                        </Form.Group>
                    </Form.Row>
                    <Form.Row>
                        <Form.Group as={Col} controlId="label5">
                            <Form.Label className="label">Location</Form.Label>
                        </Form.Group>
                        <Form.Group as={Col} controlId="drop5">
                            <Form.Control
                                type='text'
                                placeholder='Enter Location'
                                onChange={(e) => this.props.handleChange('location', e)}
                                value={this.props.values.location}
                            />
                        </Form.Group>
                    </Form.Row>
                    <Form.Row>
                        <Form.Group as={Col} controlId="label6">
                            <Button variant="primary" onClick={this.handleGoBack} className="previousbutton">Previous</Button>
                        </Form.Group>
                        <Form.Group as={Col} controlId="label7">
                            <Button variant="primary" onClick={this.handleGoForward} className="nextbutton">Next</Button>
                        </Form.Group>
                    </Form.Row>
                </Form>
            </Container>
        )
    }
}

export default InterventionDetails;