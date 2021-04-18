import React, { Component } from 'react';

interface ViewTeamProps {

}

interface ViewTeamState {

}

class ViewTeam extends Component<ViewTeamProps, ViewTeamState> {
    constructor(props: ViewTeamProps) {
        super(props);
        this.state = {

        }
    }

    render() {
        return(
            <div className="View-Team">
                <h1>View Team</h1>
            </div>
        )
    }
}

export default ViewTeam;