import React, { Component } from 'react';
import './Home.css';

import Candidates from '../../components/Candidates/Candidates';
import Header from '../../components/Header/Header';

import storage from '../../utils/storage';
import CandidateProfile from '../../components/CandidateProfile/CandidateProfile';
import AddCandidate from '../../components/AddCandidate/AddCandidate';

class Home extends Component {
    constructor(props) {
        super(props);

        this.state = {
            currentPage: 'candidates',
            params: {}
        };
    }

    logout() {
        storage.clearStorage();
        this.props.changePage('login');
    }

    changeView(page, params = {}) {
        this.setState({
            currentPage: page,
            params: params
        });
    }

    render() {
        const currentPage = this.state.currentPage,
            params = this.state.params;

        console.log(params);

        return (
            <div className="container-home">
                <Header logout={this.logout.bind(this)} />
                {(() => {
                    switch (currentPage) {
                        case 'candidates':
                            return (
                                <Candidates changePage={this.changeView.bind(this)} />
                            )
                        case 'candidate-profile':
                            return (
                                <CandidateProfile currentCandidate={params} changePage={this.changeView.bind(this)} />
                            )
                        case 'add-candidate':
                            return (
                                <AddCandidate changePage={this.changeView.bind(this)} />
                            )
                        default:
                            return (
                                <Candidates changePage={this.changeView.bind(this)} />
                            )
                    }
                })()}
            </div>
        );
    }
}

export default Home;
