import React, { Component } from 'react';
import auth from '../../api/auth';
import './Register.css';

class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email: '',
            firstName: '',
            lastName: '',
            password: '',
            department: ''
        };

        this.handleChange = this.handleChange.bind(this);
        this.registerUser = this.registerUser.bind(this);
        this.cancelRegister = this.cancelRegister.bind(this);
    }

    render() {
        const { email, firstName, lastName, password } = this.state;

        return (
            <div className="component-register card-background">
                <div className="page-card">
                <h1>New User</h1>
                    <form onSubmit={this.registerUser} onReset={this.cancelRegister}>
                    <input name="email" placeholder="Email" type="email" value={email} onChange={this.handleChange} />
                    <input name="firstName" placeholder="First Name" type="text" value={firstName} onChange={this.handleChange} />
                    <input name="lastName" placeholder="Last Name" type="text" value={lastName} onChange={this.handleChange} />
                    <select name="department" required onChange={this.handleChange}>
                        <option value="" selected disabled>Please select:</option>
                        <option value="it">IT</option>
                        <option value="hr">HR</option>
                        <option value="office_management">Office Management</option>
                        <option value="operations">Operations</option>
                        <option value="recruiting">Recruiting</option>
                        <option value="training">Training</option>
                    </select>
                    <input name="password" placeholder="Password" type="password" value={password} onChange={this.handleChange} />
                    <button type="reset" className="button-primary-danger">Cancel</button>
                    <button type="submit" className="button-primary-blue">Register</button>
                </form>
                    
                </div>
            </div>
        );
    }

    handleChange(event) {
        const { name, value } = event.target;
        this.setState({ [name]: value });
        console.log(this.state.department);
        console.log(name, value);
    }

    registerUser(event) {
        const userInfo = this.state;

        event.preventDefault();
        auth.registerUser(userInfo).then((response) => {
            console.log(response)
            if (response === true) {
                this.props.changePage('login');
            } else {
                alert("Email already in Use")
            }
        });
        
    }

    cancelRegister(){
        this.props.changePage('login');
    }
}

export default Login;