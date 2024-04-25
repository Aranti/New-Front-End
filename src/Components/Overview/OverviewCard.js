import React from 'react';
import { Col, Row, Button, Card, Container, Table } from 'react-bootstrap';
import { connect } from 'react-redux';
import '../../../public/CommonCss/overview.css'
import { Loading } from '../LoadingComponent'

const mapStateToProps = state => {
    return {
        overview: state.overview
    }
}

class OverviewCard extends React.Component {
    constructor(props) {
        super(props);

        this.state = {

        }
        this.createTotalIssuesCount = this.createTotalIssuesCount.bind(this);
    }

    createTotalIssuesCount() {
        let count=0;
        if(this.props.overview.overview !== null) {
            Object.keys(this.props.overview.overview['Result']).map(key => {
                count = count + this.props.overview.overview['Total Issues'][key].length
            })
        }

        return count;
    }

    render() {
        return (
            <React.Fragment>
                <Container fluid>
                    <Row>
                        <Col md={2}>
                            <Card className="overviewcard carddimensions">
                                <Card.Body className="cardBodyBackground cardBodyColor">
                                    {
                                        this.props.overview.isLoading === true ? <div style={{fontSize: "small"}}><Loading /></div> :
                                        this.props.overview.errMess !== null ? this.props.overview.errMess.message :
                                        this.props.overview.overview !== null ? this.props.overview.overview['Active Ships'] : ""
                                    }
                                </Card.Body>
                                <Card.Footer className="footerBackground">Active Ships <br /> <i style={{fontSize: "smaller"}}>{
                                    this.props.overview.isLoading === true ? <Loading /> :
                                    this.props.overview.errMess !== null ? this.props.overview.errMess.message :
                                    this.props.overview.overview !== null ? this.props.overview.overview['Total Ships'].toString() + " Total Ships" : ""
                                }</i></Card.Footer>
                            </Card>
                        </Col>
                        <Col md={2}>
                            <Card className="overviewcard carddimensions">
                                <Card.Body className="cardBodyBackground" style={{color: "red"}}>
                                    {
                                        // this.createTotalIssuesCount()
                                        this.props.overview.isLoading === true ? <div style={{fontSize: "small"}}><Loading /></div> :
                                        this.props.overview.errMess !== null ? this.props.overview.errMess.message :
                                        this.props.overview.overview !== null ? this.props.overview.overview['Total Issues'] : ""
                                    }
                                </Card.Body>
                                <Card.Footer className="footerBackground">Total Issues</Card.Footer>
                            </Card>
                        </Col>
                        <Col md={2}>
                            <Card className="overviewcard carddimensions">
                                <Card.Body className="cardBodyBackground">
                                    
                                </Card.Body>
                                <Card.Footer className="footerBackground">Fleet Health</Card.Footer>
                            </Card>
                        </Col>
                        <Col md={2}>
                            <Card className="overviewcard carddimensions">
                                <Card.Body className="cardBodyBackground cardBodyColor" >
                                    {
                                        this.props.overview.isLoading === true ? <div style={{fontSize: "small"}}><Loading /></div> :
                                        this.props.overview.errMess !== null ? this.props.overview.errMess.message :
                                        this.props.overview.overview !== null ? this.props.overview.overview['Daily Data Received'] : ""
                                    }
                                </Card.Body>
                                <Card.Footer className="footerBackground">Daily Data Received</Card.Footer>
                            </Card>
                        </Col>
                        <Col md={4}>
                            <Card className="overviewcard carddimensions">
                                <Card.Body className="cardBodyBackground">
                                    
                                </Card.Body>
                                <Card.Footer className="footerBackground">
                                    {
                                        this.props.overview.isLoading === true ? <div style={{fontSize: "small"}}><Loading /></div> :
                                        this.props.overview.errMess !== null ? this.props.overview.errMess.message :
                                        this.props.overview.overview !== null ? "Tracking " + this.props.overview.overview['Active Ships'] + " Active Ships" : ""
                                    }
                                </Card.Footer>
                            </Card>
                        </Col>
                    </Row><hr />
                </Container>
            </React.Fragment>
        )
    }
}

export default connect(mapStateToProps)(OverviewCard);