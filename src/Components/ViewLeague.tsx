import React, { Component } from 'react';

interface ViewLeagueProps {

}

interface ViewLeagueState {

}

class ViewLeague extends Component<ViewLeagueProps, ViewLeagueState> {
    constructor(props: ViewLeagueProps) {
        super(props);
        this.state = {

        }
    }

    render() {
        return(
            <div className="View-League">
                <h1>View League</h1>
            </div>
        )
    }
}

export default ViewLeague;