import * as React from 'react';
import { useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import { MainPanelProps } from './MainPanelProps';
import { SubPanel } from './SubPanel';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowAltCircleRight } from '@fortawesome/free-solid-svg-icons';
import { getStatusColor } from './dailyHelpers';


export const MainPanel = (props: MainPanelProps) => {
    const {
        item,
        getLevelColor,
        passItem,
        categoryHandler
    } = props;

    const [showItem, setShowItem] = useState(false);

    const sendItem = () => {
        passItem(item);
    };

    const double = () => {
        setShowItem(!showItem);
        sendItem();
    };

    return(
        <React.Fragment>
            <Row style={{ marginTop: "5px", backgroundColor: "b5daf3" }}>
                <Col xs={9} style={{ borderLeft: getStatusColor(item), textAlign: "center" }}>
                    <strong
                        style={{ float: "left", padding: "12px 0 12px 0", cursor: "pointer" }}
                        onClick={() => { double(); }}
                    >
                        {item.name}
                    </strong>
                </Col>
                <Col xs={3}>
                    <div
                        style={{
                            float: "right",
                            margin: "12px 0 12px 0",
                            whiteSpace: "nowrap"
                        }}
                    >
                        <FontAwesomeIcon
                            icon={faArrowAltCircleRight}
                            onClick={sendItem}
                            style={{ cursor: "pointer" }}
                        />
                    </div>
                </Col>
            </Row>
            <Row>
                <Col xs={12}>
                    {
                        !(item.data === undefined) && (((item.status == 2 || item.status == 3) && !showItem) ||
                        (!(item.status == 2 || item.status == 3) && showItem)) &&
                        item.data.map(subitem => {
                            if(item.data.length > 1) {
                                return(
                                    <SubPanel
                                        subitem={subitem}
                                        getLevelColor={getLevelColor}
                                        categoryHandler={categoryHandler}
                                    />
                                );
                            }
                        })
                    }
                </Col>
            </Row>
        </React.Fragment>
    )
}