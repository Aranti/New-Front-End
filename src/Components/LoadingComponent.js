import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

/*
    May
    This component shows the spinner animation when a
    request is sent and awaiting response.
*/

export const Loading = () => {
    return (
        <div className="col-12" style={{alignItems: "center", marginLeft: "auto", marginRight: "auto"}}>
            <span><FontAwesomeIcon icon={faSpinner} spin pulse size='lg' /></span>
        </div>
    );
}