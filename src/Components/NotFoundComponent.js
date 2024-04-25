import React from 'react';

class NotFoundComponent extends React.Component {
    constructor(props) {
        super(props);

    }

    render() {
        return (
            <div className='text-center' style={{paddingTop: "100px"}}>
                <h3>Page Not Found!</h3>
            </div>
        )
    }
}

export default NotFoundComponent;