import React, { Component } from 'react';
import './CandidateProfile.css';
import Modal from '../Modal/Modal';
import format from "../../utils/formatter";
import storage from '../../utils/storage';
import api from '../../api/routes';
import * as data from './checklistDescription';
import PhoneInput from 'react-phone-number-input';

class CandidateProfile extends Component {
    constructor(props) {
        super(props);

        let cand = JSON.parse(JSON.stringify(this.props.currentCandidate));

        cand['new_email'] = cand.email;

        this.state = {
            checklist: {},
            checklistStatus: {},
            checklistChangeAuthor: {},
            profile: cand,
            status: false,
            errorStatus: false,
            saveStatus: false,
            modalShown: false,
            saveModalShown: false,
            saveErrorModalShown: false,
            show: false,
            wrong: '',
            data: data,
            selectedTab: "hr",//could be nice feature to make this default to user's department
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
                startDate: true
            }
        };

        this.navigateHome = this.navigateHome.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.buildChecklist = this.buildChecklist.bind(this);
        this.updateProfile = this.updateProfile.bind(this);
        this.removeCandidate = this.removeCandidate.bind(this);
        this.confirm = this.confirm.bind(this);
        this.buildDeptChecklist = this.buildDeptChecklist.bind(this);
        this.selectTab = this.selectTab.bind(this);
        this.handleSalaryChange = this.handleSalaryChange.bind(this);
        this.handlePhoneChange = this.handlePhoneChange.bind(this);
        this.handleOptionChange = this.handleOptionChange.bind(this);
        this.pressed = this.pressed.bind(this);

    }


    //the phone ones are kind of the same as the salary ones, try and recycle

    selectTab(event) {
        this.setState({ selectedTab: event.currentTarget.id });
    }

    componentDidMount() {
        const email = this.props.currentCandidate.email;

        this.setState({ isAdmin: storage.returnAdminStatus() });

        new Promise((resolve) => {
            api.returnCandidateChecklist(email).then((checklist) => {
                console.log(checklist, "checklist");
                this.setState({
                    checklistStatus: JSON.parse(JSON.stringify(checklist))
                }/* , this.buildChecklist */);
                console.log("hmm", this.state.checklistStatus);
                resolve();
            });
        }).then(() => {
            api.returnCandidateChecklist(email, '', true).then((checklist) => {
                this.setState({
                    checklistChangeAuthor: JSON.parse(JSON.stringify(checklist))
                }, this.buildChecklist)
            });
        });
    }

    buildChecklist() {
        console.log("what about this")
        const checklist = this.state.checklistStatus;
        for (let i in checklist) {
            this.buildDeptChecklist(i);
        }
    }

    //overloading buildChecklist to take input
    buildDeptChecklist(deptChecklist) {
        const checklist = this.state.checklistStatus;
        let formedChecklist = [];
        let reactKey = 0;

        if (Object.keys(checklist).length) {
            formedChecklist.push(
                <div key={reactKey}>
                    <h3 className="checklist-header"></h3>
                    <ul>
                        {(() => {
                            let checklistItem = [],
                                reactKeyInner = 0;

                            for (let i in checklist[deptChecklist]) {
                                let inputVal = this.state.checklistStatus[deptChecklist][i];
                                let author = (this.state.checklistChangeAuthor[deptChecklist][i] === null) ? "" : this.state.checklistChangeAuthor[deptChecklist][i];
                                checklistItem.push(
                                    <li key={reactKeyInner} onClick={() => { this.handleClick(deptChecklist, i) }}>
                                        {this.state.data[deptChecklist][i]}
                                        {this.renderAuthor(author)}
                                        <div className="checklist-container">
                                            <input readOnly type="checkbox" checked={inputVal} id={reactKey + '-' + reactKeyInner} />
                                            <label htmlFor={reactKey + '-' + reactKeyInner}>
                                                <svg viewBox="0,0,50,50">
                                                    <path d="M5 30 L 20 45 L 40 10"></path>
                                                </svg>
                                            </label>
                                        </div>
                                    </li>
                                );

                                reactKeyInner++;
                            }
                            return checklistItem;
                        })()}
                    </ul>
                </div>
            );
        } else {
            formedChecklist = <div className="page-card"><p>Checklist Info Missing</p></div>;
        }
        let temp = this.state.checklist;
        temp[deptChecklist] = formedChecklist[0];
        this.setState({ checklist: temp });
        return formedChecklist;
    }


    handleClick(parent, child) {
        let tempChecklist = JSON.parse(JSON.stringify(this.state.checklistStatus));
        tempChecklist[parent][child] = !tempChecklist[parent][child];
        this.setState({ checklistStatus: tempChecklist }, this.buildChecklist);
        let info = {
            email: this.state.profile.email,
            department: parent,
            checklistStep: child,
            check: tempChecklist[parent][child]
        }
        api.switchStatus(info).then(() => {
            const email = this.props.currentCandidate.email;

            //possible fix is to update state rather than use api. API will
            //update automatically b/c that's what it does
            api.returnCandidateChecklist(email, '', true).then((checklist) => {
                this.setState({
                    checklistChangeAuthor: JSON.parse(JSON.stringify(checklist))
                }, this.buildChecklist)
            });
        });

    }

    handleChange(event) {
        const { name, value } = event.target;

        let profile = this.state.profile;

        profile[name] = value;
        this.setState({ profile: profile });
    }

    handleOptionChange(event) {
        const { name, value } = event.target;
        let profile = this.state.profile;
        profile[name] = (value == 'true');
        this.setState({ profile: profile });
    }

    pressed(tab) {
        if (this.state.selectedTab === tab) {
            return " pressed";
        } else {
            return "";
        }
    }

    handleSalaryChange(event) {
        const { name, value } = event.target;

        let profile = this.state.profile;
        let output = format.salaryToNumber(value);
        if (!isNaN(output)) {
            profile[name] = format.salaryToNumber(value);
        } else {
            profile[name] = -1;
        }
        this.setState({ profile: profile });
    }

    handlePhoneChange(event) {
        const { name, value } = event.target;

        let profile = this.state.profile;
        let output = format.phoneToString(value);
        if (!isNaN(output)) {
            profile[name] = format.phoneToString(value);
        } else {
            profile[name] = -1;
        }
        this.setState({ profile: profile });
    }

    navigateHome() {
        api.updateCompleteness(this.state.profile.email).then(() => {
            this.props.changePage('candidates');
        });

    }

    removeCandidate() {
        api.deleteCandidate(this.state.profile.email).then(() => {
            this.navigateHome();
        })
    }

    confirm() {
        this.setState({ modalShown: true });
    }

    renderAuthor(author) {
        if (author === "" || author === null) {
            return <div className="author w3-animate-opacity">
                <h4 className="unapproved w3-animate-opacity">Unapproved</h4>
            </div>
        } else {
            return <div className="author">
                <h4 className="approved w3-animate-opacity">Approved By:</h4>
                <p className="w3-animate-opacity">{author}</p>
            </div>
        }
    }

    updateProfile(event) {
        const reportIfDone = {
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
            startDate: true
        }
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
        event.preventDefault();

        if (!this.state.modalShown) {
            const candProfile = JSON.parse(JSON.stringify(this.state.profile));
            console.log("check it", this.state.profile);
            console.log(candProfile, "huh");
            api.editCandidate(candProfile).then((response) => {
                console.log("asdlfkjasdlfkj", response);
                if (response.message === "Candidate updated.") {
                    this.setState({ saveModalShown: true });
                    this.setState({ report: reportIfDone });
                } else if(response.message === "Unable to update candidate.") {
                    console.log("there was an error")
                }
                else {
                    let errors = "";
                    let report = response.report;
                    for (let keys in report) {
                        if (report[keys] === false && keys !== "total") {
                            errors += camelToWords[keys] + ", ";
                        }
                    }
                    errors = errors.substring(0, errors.length - 2);
                    this.setState({ report: report }, () =>
                        console.log(this.state.report, "should be right"));
                    this.setState({ wrong: errors });
                    this.setState({ saveErrorModalShown: true })
                }
            });
        }
    }

    returnModalState(status) {

        this.setState({ status: status });
        this.setState({ modalShown: false });
    }

    returnSaveModalState(saveStatus) {

        this.setState({ saveStatus: saveStatus });

        this.setState({ saveModalShown: false });
    }

    returnSaveErrorModalState(status) {
        this.setState({ errorStatus: status });
        this.setState({ saveErrorModalShown: false });
    }

    render() {
        const modalProps = {
            header: 'You are about to delete this candidate!',
            body: 'Are you sure you want to continue?',
            modalType: 'prompt'
        };

        const saveModalProps = {
            header: 'Update ',
            body: 'Your changes have been saved! ',
            modalType: 'alert'
        };

        const saveErrorModalProps = {
            header: 'Error ',
            body: 'Your changes have not been saved! Edit the boxes in red ' +
                'and make sure you have no partially complete answers. Please ' +
                'fix these fields: ' + this.state.wrong,
            modalType: 'alert'
        };

        const profile = this.state.profile,
            isAdmin = this.state.isAdmin;

        return (
            <div className="component-candidate-profile card-background">
                <div className="page-card candidate-profile-section">
                    <h3>Candidate Profile</h3>
                    <form onSubmit={this.updateProfile}>
                        <input type="checkbox" className="read-more-state" id="post-2" />
                        <ul className="read-more-wrap">
                            <fieldset className="split-column">
                                <label>First Name*:
                                <input readOnly={!isAdmin} name="first_name" className={this.state.report.firstName ? "" : "invalid"} type="string" value={profile.first_name} onChange={this.handleChange} />
                                </label>
                                <label>Last Name*:
                                <input readOnly={!isAdmin} name="last_name" className={this.state.report.lastName ? "" : "invalid"} type="string" value={profile.last_name} onChange={this.handleChange} />
                                </label>
                            </fieldset>
                            <fieldset className="split-column">
                                <label>Job Title*:
                                <input readOnly={!isAdmin} name="title" className={this.state.report.title ? "" : "invalid"} type="text" value={profile.title} onChange={this.handleChange} />
                                </label>
                                <label>Start Date:
                                <input readOnly={!isAdmin} name="start_date" type="date" className={this.state.report.startDate ? "" : "invalid"} value={format.date(profile.start_date)} onChange={this.handleChange} />
                                </label>
                            </fieldset>

                            {/* SHOW MORE */}
                            <fieldset className="read-more-target">

                                <fieldset className="split-column">
                                    <label>Phone Primary*:
                                    <PhoneInput
                                            readOnly={!isAdmin}
                                            className={this.state.report.phonePrimary ? "" : "invalid"}
                                            name="phonePrimary"
                                            displayInitialValueAsLocalNumber
                                            country="US"
                                            placeholder="Enter phone number"
                                            value={this.state.profile.phone_primary}
                                            onChange={(value) => {
                                                let temp = this.state.profile;
                                                temp.phone_primary = value;
                                                this.setState({ profile: temp })
                                            }} />
                                    </label>
                                    <label>Email*:
                                <input readOnly={/* !isAdmin For now no editing*/ true} name="new_email" className={this.state.report.email ? "" : "invalid"} type="text" value={profile.new_email} onChange={this.handleChange} />
                                    </label>
                                </fieldset>
                                <fieldset className="split-column">
                                    <label>Phone Secondary:
                                    <PhoneInput
                                            readOnly={!isAdmin}
                                            className={this.state.report.phoneSecondary ? "" : "invalid"}
                                            name="phoneSecondary"
                                            displayInitialValueAsLocalNumber
                                            country="US"
                                            placeholder="Enter phone number"
                                            value={this.state.profile.phone_secondary}
                                            onChange={(value) => {
                                                let temp = this.state.profile;
                                                temp.phone_secondary = value;
                                                this.setState({ profile: temp })
                                            }} />
                                    </label>
                                    <label>Jazz ID:
                                <input readOnly={true} name="applicant_id" type="text" value={profile.applicant_id} />
                                    </label>
                                </fieldset>
                                {isAdmin &&
                                    <fieldset className="split-column">
                                        <label>Salary Initial:
                                <input readOnly={!isAdmin} name="salary_offer_initial" className={this.state.report.salaryInitial ? "" : "invalid"} type="text" value={format.salary(profile.salary_offer_initial)} onChange={this.handleSalaryChange} />
                                        </label>
                                        <label>Salary Final:
                                <input readOnly={!isAdmin} name="salary_offer_final" className={this.state.report.salaryFinal ? "" : "invalid"} type="text" value={format.salary(profile.salary_offer_final)} onChange={this.handleSalaryChange} />
                                        </label>
                                    </fieldset>
                                }
                                <label htmlFor="is_remote"> Is Remote:</label>
                                <div id="checkboxes " className={this.state.report.isRemote ? "" : "invalid"} readOnly={!isAdmin}>
                                    <div className="checkboxgroup">
                                        <label htmlFor="true">Yes</label>
                                        <input type="radio" name="is_remote" value="true"
                                            readOnly={!isAdmin}
                                            checked={profile.is_remote === true}
                                            onChange={isAdmin ? this.handleOptionChange: ""}  />
                                    </div>
                                    <div className="checkboxgroup">
                                        <label htmlFor="false">No</label>
                                        <input type="radio" name="is_remote" value="false"
                                            readOnly={!isAdmin}
                                            checked={profile.is_remote === false}
                                            onChange={isAdmin ? this.handleOptionChange: ""} />
                                    </div>
                                </div>
                                <label htmlFor="offer_negotiated"> Offer Negotiated:</label>
                                <div id="checkboxes" className={this.state.report.offerNegotiated ? "" : "invalid"}>
                                    <div className="checkboxgroup">
                                        <label htmlFor="true">Yes</label>
                                        <input type="radio" name="offer_negotiated" value="true"
                                            checked={profile.offer_negotiated === true}
                                            onChange={isAdmin ? this.handleOptionChange: ""}  />
                                    </div>
                                    <div className="checkboxgroup">
                                        <label htmlFor="false">No</label>
                                        <input type="radio" name="offer_negotiated" value="false"
                                            checked={profile.offer_negotiated === false}
                                            onChange={isAdmin ? this.handleOptionChange: ""}  />
                                    </div>
                                </div>
                                <label htmlFor="offer_accepted"> Offer Accepted:</label>
                                <div id="checkboxes" className={this.state.report.offerAccepted ? "" : "invalid"}>
                                    <div className="checkboxgroup">
                                        <label htmlFor="true">Yes</label>
                                        <input type="radio" name="offer_accepted" value="true"
                                            checked={profile.offer_accepted === true}
                                            onChange={isAdmin ? this.handleOptionChange: ""}  />
                                    </div>
                                    <div className="checkboxgroup">
                                        <label htmlFor="false">No</label>
                                        <input type="radio" name="offer_accepted" value="false"
                                            checked={profile.offer_accepted === false}
                                            onChange={isAdmin ? this.handleOptionChange: ""}  />
                                    </div>
                                </div>
                            </fieldset>
                        </ul>
                        <label htmlFor="post-2" className="read-more-trigger"></label>
                        {isAdmin &&
                            <div className="button-wrapper">
                                <button className="button-primary-blue">Save Changes</button>
                                <button onClick={this.confirm} className="button-primary-danger">Delete Candidate</button>
                            </div>
                        }

                    </form>
                    <div>
                        {this.state.modalShown && <Modal modalProps={modalProps} returnModalState={this.returnModalState.bind(this)} />}
                        {this.state.status &&
                            this.removeCandidate()
                        }
                    </div>
                    {this.state.saveModalShown && <Modal modalProps={saveModalProps} returnModalState={this.returnSaveModalState.bind(this)} />}
                    {this.state.saveErrorModalShown && <Modal modalProps={saveErrorModalProps} returnModalState={this.returnSaveErrorModalState.bind(this)} />}

                </div>
                {this.state.checklist === null ? <div className="page-card"><p>Loading...</p></div> :
                    <div className="page-card checklist-section">
                        <div class="tab">
                            <button className={"button-secondary-blue" + this.pressed("hr")} id="hr" onClick={this.selectTab}>HR</button>
                            <button className={"button-secondary-blue" + this.pressed("it")} id="it" onClick={this.selectTab}>IT</button>
                            <button className={"button-secondary-blue" + this.pressed("office_management")} id="office_management" onClick={this.selectTab}>Office Management</button>
                            <button className={"button-secondary-blue" + this.pressed("operations")} id="operations" onClick={this.selectTab}>Operations</button>
                            <button className={"button-secondary-blue" + this.pressed("recruiting")} id="recruiting" onClick={this.selectTab}>Recruiting</button>
                            <button className={"button-secondary-blue" + this.pressed("training")} id="training" onClick={this.selectTab}>Training</button>
                        </div>

                        {(() => {
                            let tab = this.state.selectedTab;
                            return this.state.checklist[tab];
                        })()}
                    </div>}


                <div className='sticky-footer'>
                    <button onClick={this.navigateHome} className="button-primary-pink">Return</button>
                </div>
            </div>

        );
    }
}

export default CandidateProfile;