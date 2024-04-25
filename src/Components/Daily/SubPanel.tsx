import * as React from 'react';
import { SubPanelProps } from './SubPanelProps';
import { Col, Row } from 'react-bootstrap';

export const SubPanel = (props: SubPanelProps): JSX.Element => {
    return(
        <React.Fragment>
            <ul>
                <Row>
                    <Col xs={12}>
                        <li
                            style={{
                                color: props.getLevelColor(props.subitem),
                                fontWeight: 500,
                                margin: "5px 0 0 5px",
                                whiteSpace: "nowrap",
                                cursor: "pointer"
                            }}
                            onClick={() => {
                                props.categoryHandler(props.subitem)
                            }}
                        >
                            {props.subitem.name}
                        </li>
                    </Col>
                </Row>
            </ul>
        </React.Fragment>
    );
};