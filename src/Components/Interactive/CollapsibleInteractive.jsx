import React from 'react';

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
    }

    render() {
        return (
            <div>
                <div
                    onClick={(e) => this.togglePanel(e)}
                    className={this.props.className}
                    style={this.props.style}
                >
                    {this.props.title}
                </div>
                {this.state.open && (
                    <div className="interactivecontent">{this.props.children}</div>
                )}
                {this.state.default && (
                    <div className="interactivecontent">{this.props.children}</div>
                )}
            </div>
        );
    }
}

export default Collapsible;