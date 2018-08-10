import React, { Component } from 'react';
import Saggezza from '../../assets/images/saggezza.png';
import './Login.css';
import auth from '../../api/auth';
import Modal from '../Modal/Modal';

class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email: '',
            password: '',
            modalShown: false
        };

        this.handleChange = this.handleChange.bind(this);
        this.submitCredentials = this.submitCredentials.bind(this);
        this.register = this.register.bind(this);
    }

    returnModalState(status) {
        console.log(12345, status, 12345);

        this.setState({ status: status });
        console.log(this.state.status);

        this.setState({ modalShown: false });
    }

    render() {
        const modalProps = {
            header: 'Incorrect ussername and/or password',
            body: 'Please check your credentials and ensure they are correct.',
            modalType: 'danger'
        };
        const { email, password } = this.state;

        return (
            <div className="component-login">
                <div className="login-wrapper">
                    <img src={Saggezza} alt="" />
                    <form onSubmit={this.submitCredentials}>
                    {this.state.modalShown && <Modal modalProps={modalProps} returnModalState={this.returnModalState.bind(this)} />}
                        <input name="email" placeholder="Email" type="email" value={email} onChange={this.handleChange} />
                        <input name="password" placeholder="Password" type="password" value={password} onChange={this.handleChange} />
                        <button className="button-primary-blue">Log In</button>
                    </form>
                    <p>Don't have an account yet? <a onClick={this.register}>Sign Up</a></p>
                </div>
            </div>
        );
    }

    handleChange(event) {
        const { name, value } = event.target;
        console.log({name, value});
        this.setState({ [name]: value });
    }

    submitCredentials(event) {
        const credentials = this.state;
        console.log(this.state.modalShown);
        event.preventDefault();
        auth.isValidUser(credentials).then((isValid) => {
            console.log("hey", isValid, "hey");
            if (isValid) {
                this.props.changePage('home');
            } else {
                this.setState({modalShown: true});
            }
            console.log(this.state.modalShown);

        });
    }

    register() {
        this.props.changePage('register');
    }
}

export default Login;
