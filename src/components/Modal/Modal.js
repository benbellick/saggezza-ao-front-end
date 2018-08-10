import React, { Component } from 'react';

import './Modal.css';

class Modal extends Component {
    constructor(props) {
        super(props);

        const params = this.props.modalProps;

        this.state = {
            header: params.header,
            body: params.body,
            modalType: params.modalType,
            buttons: ''
        };
    }

    componentDidMount() {
        let buttonBlock = [];

        switch (this.state.modalType) {
            case 'alert':
                buttonBlock = <button className="button-primary-blue" onClick={() => this.passSelection(true)}>Accept</button>;
                break;
            case 'danger':
                buttonBlock = <button className="button-primary-danger" onClick={() => this.passSelection(true)}>Accept</button>;
                break;
            case 'prompt':
                buttonBlock.push(<button className="button-secondary-blue" onClick={() => this.passSelection(false)}>Cancel</button>);
                buttonBlock.push(<button className="button-primary-blue" onClick={() => this.passSelection(true)}>Accept</button>);
                break;
        }

        this.setState({ buttons: buttonBlock });
    }

    passSelection(status) {
        console.log(1)
        this.props.returnModalState(status);
    }

    getModal() {
        console.log(this.props.returnModalState);
        return this.props.returnModalState;
    }

    render() {
        return (
            <div className="component-modal">
                <div className="modal-wrapper">
                    <div className="content-wrapper">
                        <h3>{this.state.header}</h3>
                        <p>{this.state.body}</p>
                    </div>
                    <div className="button-wrapper">
                        {this.state.buttons}
                    </div>
                </div>
            </div>
        );
    }
}

export default Modal;
