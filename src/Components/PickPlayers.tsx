import React, { Component } from 'react';

interface PickPlayersProps {
    stats : any
}

interface PickPlayersState {

}

class PickPlayers extends Component<PickPlayersProps, PickPlayersState> {
    constructor(props: PickPlayersProps) {
        super(props);
        this.state = {

        }
    }

    render() {
        let display : any;
        if (this.props.stats) {
            display = this.props.stats.map((team:any) =>
                <div key={team}>
                    {team['Team'].toString()}
                </div>);
        } else {
            display = "Loading"
        }
        return(
            <div className="View">
                <p>Pick Players</p>
                <p>{display}</p>
            </div>
        )
    }
}

export default PickPlayers;