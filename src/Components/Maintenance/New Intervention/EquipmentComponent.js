import React from 'react';
import '../../../../public/CommonCss/intervention.css';
import { Container, Form, Row, Button, Col } from 'react-bootstrap';
import Select from 'react-select';

const equipment_code_options = [
    {'label': "Code1", 'value': "Code1"},
    {'label': "Code2", 'value': "Code2"},
    {'label': "Code3", 'value': "Code3"},
]

const job_code_options = [
    {'label': "Code1", 'value': "Code1"},
    {'label': "Code2", 'value': "Code2"},
    {'label': "Code3", 'value': "Code3"},
]

class EquipmentComponent extends React.Component {
    constructor(props) {
        super(props);

        this.handleGoBack = this.handleGoBack.bind(this);
    }

    handleGoBack = (e) => {
        e.preventDefault();
        this.props.goBack()
    }

    render() {
        return (
            <Container className="subcard">
                <Form>
                    {
                        this.props.values.equipment_list.map((x, i) => {
                            return (
                                <>
                                    <Form.Row key={i}>
                                        <Form.Group as={Col} controlId="label1">
                                            <Form.Label className="label">Equipment Description</Form.Label>
                                        </Form.Group>
                                        <Form.Group as={Col} controlId="label2">
                                            <Form.Control
                                                as="textarea"
                                                rows={3}
                                                placeholder="Short Description of the Equipment..."
                                                onChange={(e) => this.props.handleChange('equipment_list', 'equip_desc', e, i)}
                                            />
                                        </Form.Group>
                                    </Form.Row>
                                    <Form.Row key={i+1}>
                                        <Form.Group as={Col} controlId="label3">
                                            <Form.Label className="label">Equipment Code</Form.Label>
                                        </Form.Group>
                                        <Form.Group as={Col} controlId="label4">
                                            <Select
                                                options={equipment_code_options}
                                                onChange={(e) => this.props.handleChange('equipment_list', 'equip_code', e, i)}
                                            />
                                        </Form.Group>
                                    </Form.Row>
                                    <Form.Row key={i+2}>
                                        <Form.Group as={Col} controlId="label5">
                                            <Form.Label className="label">Job Code</Form.Label>
                                        </Form.Group>
                                        <Form.Group as={Col} controlId="label">
                                            <Select
                                                options={job_code_options}
                                                onChange={(e) => this.props.handleChange('equipment_list', 'job_code', e, i)}
                                            />
                                        </Form.Group>
                                    </Form.Row>
                                    <div className="btn-box" key={i+3}>
                                        {
                                            this.props.values.equipment_list.length !== 1 && <Button size='sm' className="mr10" onClick={() => this.props.handleRemoveClick('equipment_list', i)}>Remove</Button>
                                        }
                                        {
                                            this.props.values.equipment_list.length-1 === i && <Button size='sm' className="addbutton" onClick={() => this.props.handleAddClick('equipment_list')}>Add</Button>
                                        }
                                    </div>
                                </>
                            )
                        })
                    }
                    <br /><hr />
                    <Form.Row>
                        <Form.Group as={Col} controlId="label5">
                            <Button variant="primary" onClick={this.handleGoBack} className="previousbutton">Previous</Button>
                        </Form.Group>
                    </Form.Row>
                </Form>
            </Container>
        )
    }
}

export default EquipmentComponent;