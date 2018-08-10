import React, { Component } from 'react';
import storage from '../../utils/storage';
import './Candidates.css';
import Modal from '../Modal/Modal';
import api from '../../api/routes';
import search from '../../utils/search';
import Switch from "react-switch";


class Candidates extends Component {
    constructor(props) {
        super(props);

        this.state = {
            candidates: null,
            fullCandidates: null,
            modalShown: false,
            search: "",
            fracComplete: {},
            searchResult: [],
            searchType: "first_name",
            showCompleteSwitch: false,
            showDeleteSwitch: false,
            deleteDBModalShown: false,
            reintroduceModalShown: false,
            selectedCandidate: ''
        }

        this.viewCandidate = this.viewCandidate.bind(this);
        this.addCandidate = this.addCandidate.bind(this);
        this.jazzCandidates = this.jazzCandidates.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.candidateToWrapper = this.candidateToWrapper.bind(this);
        this.searchCand = this.searchCand.bind(this);
        this.handleShowDeleteChange = this.handleShowDeleteChange.bind(this);
        this.handleShowCompleteChange = this.handleShowCompleteChange.bind(this);
        this.confirmDeleteDB = this.confirmDeleteDB.bind(this);
        this.confirmReintroduce = this.confirmReintroduce.bind(this);
        this.updateCandidateList = this.updateCandidateList.bind(this);
    }


    updateCandidateList() {
        let candidates = [],
            reactKey = 0;
        //Note: Ideally want jazz import to update candidate dashboard on every refresh,
        //but cannot do this right now b/c deleting a candidate takes user back to candidate 
        //dashboard, causing a refresh. This means no candidates can be deleted.
        api.returnCandidates(this.state.showDeleteSwitch, this.state.showCompleteSwitch).then((candidateList) => {
            console.log("see if complete", candidateList);
            this.setState({ fullCandidates: candidateList });
            let promiseArray = []
            for (let candidate of candidateList) {
                promiseArray.push(api.getChecklistComplete(candidate).then((fracComplete) => {
                    let temp = this.state.fracComplete;
                    temp[candidate.email] = fracComplete;
                    this.setState({ fracComplete: temp });
                    candidates.push(this.candidateToWrapper(candidate, reactKey, fracComplete));
                    reactKey++;
                }))
            }
            Promise.all(promiseArray).then(() => {
                this.setState({ candidates: candidates });
            });
        });
    }


    componentDidMount() {
        this.setState({ isAdmin: storage.returnAdminStatus() });
        this.updateCandidateList();
    }

    candidateToWrapper(candidate, reactKey, fracComplete) {
        //console.log("were they deleted?", candidate.deleted, candidate.email);
        let deleted = candidate.deleted;
        if (!deleted) {
            let completed = candidate.completed;
            if (!completed) {
                return (
                    <div key={reactKey} className="candidate-wrapper">
                        <div className="candidate-info">
                            <a onClick={() => { this.viewCandidate(candidate) }}>View</a>
                            <p>{candidate.first_name} {candidate.last_name}</p>
                        </div>
                        <div className="candidate-status">
                            <div className="status" >
                                <p>{"Status: In-Progress (" + fracComplete.total[0] + "/" + fracComplete.total[1] + ")"}</p>
                            </div>
                            <p>{candidate.title}</p>
                        </div>
                    </div>
                )
            } else {
                return (
                    <div key={reactKey} className="candidate-wrapper" id="completed">
                        <div className="candidate-info">
                            <a onClick={() => { this.viewCandidate(candidate) }}>View</a>
                            <p>{candidate.first_name} {candidate.last_name}</p>
                        </div>
                        <div className="candidate-status completed">
                            <div className="status">
                                <p>Status:</p>
                                <p className="completed"> {"Completed " + "(" + fracComplete.total[0] + "/" + fracComplete.total[1] + ")"}</p>
                            </div>
                            <p>{candidate.title}</p>
                        </div>
                    </div>
                )
            }
        } else {
            return (
                <div key={reactKey} className="candidate-wrapper" id="deleted">
                    <div className="candidate-info">
                        <a className="disabled" onClick={() => { }}>View</a>
                        <p>{candidate.first_name} {candidate.last_name}</p>
                        {/*                         <button
                            name={candidate.email}
                            className="button-primary-danger small"
                            type="button"
                            onClick={this.confirmDeleteDB}>
                            Remove from database
                        </button> */}
                    </div>
                    <div className="candidate-status deleted">
                        <div className="status">
                            <p>Status:</p>
                            <p className="deleted"> Deleted</p>
                        </div>
                        <div className="first">
                            <a
                                className="reintroduce"
                                name={candidate.email}
                                onClick={this.confirmReintroduce}>
                                Reintroduce Candidate
                            </a>
                        </div>
                    </div>
                </div>
            )
        }
    }

    viewCandidate(candidate) {
        this.props.changePage('candidate-profile', candidate);
    }

    addCandidate() {
        this.props.changePage('add-candidate');
    }

    returnModalState(status) {
        this.setState({ modalShown: false });
    }


    searchCand(event) {
        let input = event.target.value;
        let output = [];
        let temp = search.candidate({ [this.state.searchType]: input }, this.state.fullCandidates);
        let promiseArray = [];
        let reactKey = 0;
        for (let cand in temp) {
            output.push(this.candidateToWrapper(temp[cand], reactKey, this.state.fracComplete[temp[cand].email]));
            reactKey++;
        }
        this.setState({ candidates: output });
    }

    confirmDeleteDB(event) {
        this.setState({ deleteDBModalShown: true });
        this.setState({ selectedCandidate: event.target.name });
    }

    returnDeleteDbState(status) {
        new Promise((resolve, reject) => {
            console.log(this.state.selectedCandidate);
            if (status) {
                api.removeDeletedCandFromDb(this.state.selectedCandidate).then(() => {
                    this.updateCandidateList();
                    console.log("bleh");
                    resolve();
                }).catch(() => {
                    console.log("blah")
                    reject();
                })
            } else {
                resolve();
            }
        }).then(() => {
            this.setState({ selectedCandidate: '' });
            this.setState({ deleteDBModalShown: false });
        });
    }

    confirmReintroduce(event) {
        this.setState({ reintroduceModalShown: true });
        this.setState({ selectedCandidate: event.target.name })
    }


    returnReintroduceState(status) {
        new Promise((resolve, reject) => {
            if (status) {
                api.reImport(this.state.selectedCandidate).then(() => {
                    this.updateCandidateList();
                    resolve()
                }).catch(() => {
                    reject()
                })
            } else {
                resolve()
            }
        }).then(() => {
            this.setState({ reintroduceModalShown: false });
            this.setState({ selectedCandidate: '' });
        });

    }

    jazzCandidates() {
        api.importCandidates().then(() => {
            let candidates = [],
                reactKey = 0;
            return new Promise((resolve) => {
                api.returnCandidates().then((candidateList) => {
                    let promiseArray = [];
                    for (let candidate of candidateList) {
                        promiseArray.push(
                            api.getChecklistComplete(candidate).then((fracComplete) => {
                                candidates.push(this.candidateToWrapper(candidate, reactKey, fracComplete));
                                reactKey++;
                            })
                        )
                    }
                    Promise.all(promiseArray).then(() => {
                        resolve();
                    });
                });
            }).then(() => {
                this.setState({ candidates: candidates });
            });

        });
    }

    handleChange(event) {
        const { name, value } = event.target;
        this.setState({ [name]: value });
    }

    handleShowDeleteChange(event) {
        event.preventDefault();
        console.log("check it out", event.target, event.target.checked);
        let checked = event.target.checked;
        console.log("this is the important value");
        this.setState({ showDeleteSwitch: checked },
            () => this.updateCandidateList());
    }

    handleShowCompleteChange(event) {
        let checked = event.target.checked;
        this.setState({ showCompleteSwitch: checked },
            () => this.updateCandidateList());
    }

    render() {
        const modalProps = {
            header: 'Test',
            body: 'This is an alert.',
            modalType: 'prompt'
        };

        const deleteDBModal = {
            header: 'Are you sure you\'d like to delete the candidate from the database?',
            body: 'Doing so will allow this candidate to be reimported from jazz',
            modalType: 'prompt'
        };

        const reintroduceModal = {
            header: 'Are you sure you\'d like to add the candidate again? ',
            body: 'Doing so will cause the candidate to be listed again with all the same credentials',
            modalType: 'prompt'
        };


        return (
            <div>
                <div className="component-candidates card-background">
                    {this.state.modalShown && <Modal modalProps={modalProps} returnModalState={this.returnModalState.bind(this)} />}
                    {this.state.deleteDBModalShown && <Modal modalProps={deleteDBModal} returnModalState={this.returnDeleteDbState.bind(this)} />}
                    {this.state.reintroduceModalShown && <Modal modalProps={reintroduceModal} returnModalState={this.returnReintroduceState.bind(this)} />}
                    <div className="candidate-header page-card">
                        <div className="search">
                            <label>Search Type: </label>
                            <select name="searchType" onChange={this.handleChange}>
                                {/* <option value="full_name"> Full Name</option> */}
                                <option value="first_name">First Name</option>
                                <option value="last_name">Last Name</option>
                                <option value="title"> Title</option>
                                <option value="email"> Email</option>
                            </select>
                        </div>
                        <input name="search" className="candidate-search" placeholder="Search Candidates" type="search" onKeyUp={this.searchCand}
                            value={this.state.search} onChange={this.handleChange} />
                        <button onClick={this.addCandidate} className="button-primary-blue candidate-add">Add Candidate</button>
                        <button onClick={this.jazzCandidates} className="button-primary-blue refresh">&#10227;</button>
                    </div>
                    <div className=" candidate page-card">
                        <div className="filters">
                            {this.state.isAdmin &&
                                <div className="delete">
                                    <input class="inp-cbx" id="cbxd" type="checkbox"
                                        onChange={this.handleShowDeleteChange}
                                        checked={this.state.showDeleteSwitch}
                                    />
                                    <label class="cbx" for="cbxd"><span>
                                        <svg width="12px" height="10px" viewbox="0 0 12 10">
                                            <polyline points="1.5 6 4.5 9 10.5 1"></polyline>
                                        </svg></span><span>Deleted</span></label>
                                </div>
                            }
                            <div className="complete">
                                <input class="inp-cbx" id="cbxc" type="checkbox"
                                    onChange={this.handleShowCompleteChange}
                                    checked={this.state.showCompleteSwitch}
                                />
                                <label class="cbx" for="cbxc"><span>
                                    <svg width="12px" height="10px" viewbox="0 0 12 10">
                                        <polyline points="1.5 6 4.5 9 10.5 1"></polyline>
                                    </svg></span><span>Completed</span></label>
                            </div>
                        </div>
                        {this.state.candidates === null ? <p>Loading...</p> : this.state.candidates}
                    </div>
                </div>
            </div>
        );
    }
}

export default Candidates;
