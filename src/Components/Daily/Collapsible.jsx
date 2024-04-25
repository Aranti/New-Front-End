import React from 'react';
import { connect } from 'react-redux';
import { setCollapsibleValue } from '../../redux/ActionCreators';

const mapStateToProps = state => {
    return {
        dailyCollapsible: state.dailyCollapsible,
        trends: state.trends
    }
}

const mapDispatchToProps = (dispatch) => ({
    setCollapsibleValue: (input) => { dispatch(setCollapsibleValue(input)) }
})

class Collapsible extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            open: false,
            default: this.props.default
        }

        this.togglePanel = this.togglePanel.bind(this);
    }

    togglePanel = (e) => {
        this.setState({
            open: !this.state.open,
            default: false
        });
        let collapsibleValue = '#'+this.props.title+'-All';
        this.props.setCollapsibleValue(collapsibleValue)
    }

    render() {
        return (
            <div>
                <div
                    onClick={(e) => this.togglePanel(e)}
                    className={this.props.className}
                    style={this.props.style}
                    tabIndex="1"
                >
                {this.props.title}
                </div>
                {this.state.open ? (
                    <div className="dailycontent" style={this.props.contentStyle}>
                        {this.props.children}
                    </div>
                ) : null}
                {this.state.default ? (
                    <div className="dailycontent" style={this.props.contentStyle}>
                        {this.props.children}
                    </div>
                ) : null}
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Collapsible);