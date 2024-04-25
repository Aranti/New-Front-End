import React from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { ProgressBar } from 'react-bootstrap';

class ProgressBarComponent extends React.Component {
    constructor(props) {
        super(props);

        this.cancel;
    }

    render() {
        return (
            <ProgressBar
                animated
                now={this.props.progress}
                label={this.props.label}
                min={0}
                max={100}
                style={{width: "95%"}}
            />
        )
    }
}

export default ProgressBarComponent;