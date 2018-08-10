import React, { Component } from 'react';
import './AddCandidate.css';
import Modal from '../Modal/Modal';
import format from '../../utils/formatter';
import api from '../../api/routes';
import NumberFormat from 'react-number-format';
import 'react-phone-number-input/style.css';
import PhoneInput from 'react-phone-number-input';


class AddCandidate extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email: '',
            firstName: '',
            lastName: '',
            phonePrimary: '',
            phoneSecondary: '',
            title: '',
            offerNegotiated: '',
            offerAccepted: '',
            isRemote: '',
            applicantId: '',
            salaryInitial: '',
            salaryFinal: '',
            startDate: '',
            continue: false,
            wrong: '',
            modalShow: false,
            status: {

            },
            report: {
                email: true,
                firstName: true,
                lastName: true,
                phonePrimary: true,
                phoneSecondary: true,
                title: true,
                offerNegotiated: true,
                offerAccepted: true,
                isRemote: true,
                applicantId: true,
                salaryInitial: true,
                salaryFinal: true,
                startDate: true,
            }
        };

        this.submitNewCandidate = this.submitNewCandidate.bind(this);
        this.navigateHome = this.navigateHome.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleOptionChange = this.handleOptionChange.bind(this);
        this.handleSalaryChange = this.handleSalaryChange.bind(this);
        this.handlePhoneChange = this.handlePhoneChange.bind(this);
        this.handleOptionChange = this.handleOptionChange.bind(this);
        this.handleDateChange = this.handleDateChange.bind(this);
    }


    componentDidMount() {
    }

    navigateHome() {
        this.props.changePage('candidates');
    }

    returnModalState(status) {
        console.log(status);
        this.setState({ modalShown: false });
    }

    handleOptionChange(event) {
        const { name, value } = event.target;
        let profile = this.state.profile;
        profile[name] = (value === 'true');
        this.setState({ profile: profile });
    }

    handleSalaryChange(event) {
        const { name, value } = event.target;
        let output = format.salaryToNumber(value);
        if (!isNaN(output)) {
            output = format.salaryToNumber(value);
        } else {
            output = -1;
        }
        this.setState({ [name]: output });
    }

    handlePhoneChange(event) {
        console.log(event.target);
        const { name, value } = event.target;
        let output = format.phoneToString(value);
        if (!isNaN(output)) {
            output = format.phoneToString(value);
        } else {
            output = -1;
        }
        this.setState({ [name]: value });
    }

    handleDateChange(event) {
        const { name, value } = event.target;
        let output = format.dateToString(value);
        this.setState({ [name]: output });
    }

    render() {
        const modalProps = {
            header: 'An error occurred!',
            body: 'Please fix these fields: ' + this.state.wrong,
            modalType: 'danger'
        };


        return (
            <div className="component-add-candidate card-background">
                <div className="page-card">
                    <a className="return-link" onClick={this.navigateHome}>Return</a>

                    <form onSubmit={this.submitNewCandidate}>
                        <label>Email*:</label>
                        <input className={this.state.report.email ? "" : "invalid"} name="email" type="email" value={this.state.email} onChange={this.handleChange} />
                        <label>First Name*:</label>
                        <input className={this.state.report.firstName ? "" : "invalid"} name="firstName" type="text" value={format.name(this.state.firstName)} onChange={this.handleChange} />
                        <label>Last Name*:</label>
                        <input className={this.state.report.lastName ? "" : "invalid"} name="lastName" type="text" value={format.name(this.state.lastName)} onChange={this.handleChange} />
                        <label>Phone Primary*:</label>
                        <PhoneInput
                            className={this.state.report.phonePrimary ? "" : "invalid"}
                            name = "phonePrimary"
                            displayInitialValueAsLocalNumber
                            country="US"
                            placeholder="Enter phone number"
                            value={this.state.phonePrimary}
                            onChange={value => this.setState({phonePrimary: value })} />
                        <label>Job Title*:</label>
                        <input className={this.state.report.title ? "" : "invalid"} name="title" type="text" value={format.name(this.state.title)} onChange={this.handleChange} />
                        <label htmlFor="startDate"> Start Date:</label>
                        <input name="startDate" type="date" value={this.state.startDate} onChange={this.handleDateChange} />

                        <label htmlFor="offerAccepted"> Offer Accepted:</label>
                        <div id="checkboxes">
                            <div className="checkboxgroup">
                                <label htmlFor="true">Yes</label>
                                <input type="radio" name="offerAccepted" value="true"
                                    checked={this.state.offerAccepted === 'true'}
                                    onChange={this.handleOptionChange} />
                            </div>
                            <div className="checkboxgroup">
                                <label htmlFor="false">No</label>
                                <input type="radio" name="offerAccepted" value="false"
                                    checked={this.state.offerAccepted === 'false'}
                                    onChange={this.handleOptionChange} />
                            </div>
                        </div>

                        <label htmlFor="offerNegotiated"> Offer Negotiated:</label>
                        <div id="checkboxes">
                            <div className="checkboxgroup">
                                <label htmlFor="true">Yes</label>
                                <input type="radio" name="offerNegotiated" value="true"
                                    checked={this.state.offerNegotiated === 'true'}
                                    onChange={this.handleOptionChange} />
                            </div>
                            <div className="checkboxgroup">
                                <label htmlFor="false">No</label>
                                <input type="radio" name="offerNegotiated" value="false"
                                    checked={this.state.offerNegotiated === 'false'}
                                    onChange={this.handleOptionChange} />
                            </div>
                        </div>

                        <label htmlFor="isRemote"> Is this candidate remote? </label>
                        <div id="checkboxes">
                            <div className="checkboxgroup">
                                <label htmlFor="true">Yes</label>
                                <input type="radio" name="isRemote" value="true"
                                    checked={this.state.isRemote === 'true'}
                                    onChange={this.handleOptionChange} />
                            </div>
                            <div className="checkboxgroup">
                                <label htmlFor="false">No</label>
                                <input type="radio" name="isRemote" value="false"
                                    checked={this.state.isRemote === 'false'}
                                    onChange={this.handleOptionChange} />
                            </div>
                        </div>
                        <label>Secondary Phone:</label>
                        <PhoneInput
                            className={this.state.report.phoneSecondary ? "" : "invalid"}
                            name = "phonePrimary"
                            displayInitialValueAsLocalNumber
                            country="US"
                            placeholder="Enter phone number"
                            value={this.state.phoneSecondary}
                            onChange={value => this.setState({phoneSecondary: value })} />
                        <label>Salary Initial: </label>
                        <input name="salaryInitial" type="text" value={format.salary(this.state.salaryInitial)} onChange={this.handleSalaryChange} />
                        <label>Salary Final:</label>
                        <input name="salaryFinal" type="text" value={format.salary(this.state.salaryFinal)} onChange={this.handleSalaryChange} />
                        <button className="button-primary-blue" onChange={this.handleChange} >Submit</button>
                    </form>
                    {this.state.modalShown && <Modal modalProps={modalProps} returnModalState={this.returnModalState.bind(this)} />}
                </div>
            </div>
        );
    }

    submitNewCandidate(event) {
        const camelToWords = {
            email: "Email",
            firstName: 'First Name',
            lastName: 'Last Name',
            phonePrimary: 'Primary Phone',
            phoneSecondary: 'Secondary Phone',
            title: 'Job Title',
            offerNegotiated: 'Offer Negotiated',
            offerAccepted: 'Offer Accepted',
            isRemote: 'Is Remote',
            applicantId: 'Applicant ID',
            salaryInitial: 'Initial Salary',
            salaryFinal: 'Final Salary',
            startDate: 'Start Date'
        }
        const candidateInformation = this.state;
        //Need to fix a lot of default info here, IMPORTANT
        candidateInformation.startDate = candidateInformation.startDate.toString();

        event.preventDefault();
        api.createNewCandidate(candidateInformation).then((output) => {
            if (output.status === 1) {
                this.navigateHome();
            } else {
                let errors = "";
                console.log("yo", output, "yo");
                let report = output.cand.report;
                console.log("yo", report, "yo");
                for (let keys in report) {
                    if (report[keys] === false && keys !== "total") {
                        errors += camelToWords[keys] + ", ";
                    }
                }
                errors = errors.substring(0, errors.length - 2);
                this.setState({ report: report });
                this.setState({ wrong: errors });
                this.setState({ modalShown: true });
                console.log(this.state);
            }
        });
    }

    handleChange(event) {
        const { name, value } = event.target;
        if (name === "firstName" || name === "lastName" || name === "title") {
            this.setState({ [name]: format.name(value) });
        } else {
            this.setState({ [name]: value });
        }
    }

    handleOptionChange(event) {
        const { name, value } = event.target;
        this.setState({ [name]: value });
    }
}

export default AddCandidate;
