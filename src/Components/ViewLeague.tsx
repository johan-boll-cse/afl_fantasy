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
            <div className="View">
                View League
            </div>
        )
    }
}

export default ViewLeague;