import React, { Component } from 'react';
import './PlayerDisplay.css';
import DisplayPlayerCard from "./DisplayPlayerCard";

const NUM_PLAYERS_DISPLAYED : number = 50;

interface PlayerDisplayProps {
    selectedPlayers : (string | null)[],
    cardSelected : boolean,
    handleCardClick(player : string) : void,
    playerMap: any
}

interface PlayerDisplayState {
    pageNum : number
}

class PlayerDisplay extends Component<PlayerDisplayProps, PlayerDisplayState> {
    constructor(props: PlayerDisplayProps) {
        super(props);
        this.state = {
            pageNum: 1
        }
    }

    formatPlayer = (player : any, rank: number) => {
        let playerName = player[0];
        return (
            <DisplayPlayerCard isInTeam={this.props.selectedPlayers.includes(playerName)}
                               selectingPlayer={this.props.cardSelected}
                               player={player}
                               rank={rank}
                               handleCardClick={this.props.handleCardClick}
                               key={playerName}
            />
        )
    }

    render() {
        let display : any[] = [];
        let pageButtons : any[] = [];
        if (this.props.playerMap) {
            const numButtons = Math.ceil(this.props.playerMap.length / NUM_PLAYERS_DISPLAYED);
            for (let i = 1; i <= numButtons; i++) {
                pageButtons.push(
                    <button className={i === this.state.pageNum ? "Page-Button-Small Selected-Page" : "Page-Button-Small"}
                            key={"Page" + i}
                            onClick={() => this.setState({ pageNum: i})}>
                        {i}
                    </button>
                )
            }
            const start = (this.state.pageNum - 1) * NUM_PLAYERS_DISPLAYED;
            const end = Math.min((this.state.pageNum) * NUM_PLAYERS_DISPLAYED, this.props.playerMap.length)
            for (let i = start + 1; i <= end; i++) {
                display.push(this.formatPlayer(this.props.playerMap[i - 1], i));
            }
        } else {
            display.push(<tr key={"Loading"}><td colSpan={6}>Loading Player Stats...</td></tr>)
        }
        if (display.length === 0) {
            display.push(<tr key={"No-Players"}><td colSpan={6}>No Players Found</td></tr>)
        }
        return(
            <div className="Player-Display">
                <div className="Players-Container">
                    <table>
                        <thead>
                            <tr className="Table-Row">
                                <th>Rank</th>
                                <th>Player</th>
                                <th>Team</th>
                                <th colSpan={3}>
                                    <div className="Position-Wrapper">
                                        <p className="Position-Title">Avg. Round Score</p>
                                        <div className="Positions">
                                            <p className="Position-Text">Forward</p><p className="Position-Text">Mid</p><p className="Position-Text">Defense</p>
                                        </div>
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {display}
                        </tbody>
                    </table>
                </div>
                {pageButtons}
            </div>
        )
    }
}

export default PlayerDisplay;