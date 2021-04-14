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
            <div className="View">
                View Team
            </div>
        )
    }
}

export default ViewTeam;