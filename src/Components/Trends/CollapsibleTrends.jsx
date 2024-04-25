import React from 'react';
import { connect } from 'react-redux';

const mapStateToProps = state => {
    return {
        hover: state.hover
    }
}

class Collapsible extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            open: false,
            default: this.props.default,
            hover: null
        }

        this.togglePanel = this.togglePanel.bind(this);
    }

    componentDidMount() {
        
    }

    // shouldComponentUpdate(nextState, nextProps) {
    //     if(this.props !== nextProps || this.state !== nextState) {
    //         return true;
    //     }
    //     else {
    //         return false;
    //     }
    // }

    // componentDidUpdate(prevProps, prevState) {
    //     if(prevProps.hover.hover !== this.props.hover.hover) {
    //         this.setState({
    //             hover: this.props.hover.hover
    //         });
    //     }
    // }

    togglePanel = (e) => {
        this.setState({
            open: !this.state.open,
            default: false
        });
    }

    render() {
        return(
            <div>
                <div
                    onClick={this.togglePanel}
                    className={this.props.className}
                    style={this.props.style}
                >
                    {this.props.title}
                </div>
                {this.state.open && (
                    <div style={this.props.contentStyle} className="trendscontent">
                        {this.props.children}
                    </div>
                )}
                {!this.state.open && this.state.default && (
                    <div style={this.props.contentStyle} className="trendscontent">
                        {this.props.children}
                    </div>
                )}
            </div>
        );
    }
}

export default connect(mapStateToProps)(Collapsible);