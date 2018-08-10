import React, { Component } from 'react';
import './Header.css';

import storage from '../../utils/storage';

import logoWhite from '../../assets/images/logo-white.png';

class Header extends Component {
    constructor(props) {
        super(props);

        this.state = {
            firstName: ''
        }

        this.handleLogout = this.handleLogout.bind(this);
    }

    componentDidMount() {
        const firstName = storage.returnUser();

        this.setState({ firstName: firstName });
    }

    handleLogout() {
        this.props.logout();
    }

    render() {
        const firstName = this.state.firstName;

        return (
            <div className="component-header">
                <img src={logoWhite} alt="" />
                <p>Welcome, {firstName} <a onClick={this.handleLogout}>Log Out</a></p>
            </div>
        );
    }
}

export default Header;
