import React from 'react';
import InteractiveCard from './InteractiveCard';
import Header from '../HeaderComponent';

export class Interactive extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <React.Fragment>
                <Header isOverview={false} />
                <InteractiveCard />
            </React.Fragment>
        );
    }
}