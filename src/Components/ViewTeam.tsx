import React, { Component } from 'react';
import * as Utils from "./Utils";
import './ViewTeam.css';
import FieldPlayerCard from "./FieldPlayerCard";

interface ViewTeamProps {
    userTeam: any,
    username: string | undefined,
    stats: any
}

interface ViewTeamState {
    roundSelected: string,
    playerSelected : string | undefined
}

class ViewTeam extends Component<ViewTeamProps, ViewTeamState> {
    constructor(props: ViewTeamProps) {
        super(props);
        this.state = {
            roundSelected: Utils.currentRound,
            playerSelected: undefined
        }
    }

    handleRoundClick = (roundNum : string) : any => {
        this.setState({
            roundSelected: roundNum,
            playerSelected: undefined
        })
    }

    handleSelectCard = (player : string) => {
        if (player === null) {
            return;
        }
        if (player === this.state.playerSelected) {
            this.setState({
                playerSelected: undefined
            })
        } else {
            this.setState({
                playerSelected: player
            })
        }
    }

    unused = () => {
        return;
    }

    render() {
        let lowerDisplay : any;
        let lowerTitle : string = "";
        if (this.state.playerSelected && this.state.playerSelected !== 'Total') {
            const playerIndex = this.props.userTeam[this.state.roundSelected].indexOf(this.state.playerSelected);
            const playerPosition = Utils.positionArr[playerIndex].slice(0, Utils.positionArr[playerIndex].length - 1);
            lowerDisplay = Utils.getSinglePlayerTable(this.state.playerSelected, playerPosition, this.state.roundSelected, this.props.stats);
            lowerTitle = "Point breakdown for " + Utils.formatName(this.state.playerSelected);
        } else if (this.state.playerSelected === 'Total') {
            lowerDisplay = Utils.getTableHTML(this.props.userTeam[this.state.roundSelected], this.state.roundSelected, this.props.stats);
            lowerTitle = "Overall " + Utils.roundWithSpace(this.state.roundSelected) + " Stats Breakdown";
        } else {
            lowerDisplay = (
                <p> Select a player card above to see a player's score calculation, or select the Total card to see the team's overall performance for the round.</p>
            )
        }
        let playerScores : number[] = []
        Utils.positionArr.map((position : string, index) => playerScores.push(
            Utils.getPlayerScore(Utils.getSpecificPlayerMap(this.props.stats, [this.props.userTeam[this.state.roundSelected][index]])[0], this.state.roundSelected, position.slice(0, position.length - 1))
        ));
        let total : number = 0;
        Utils.positionArr.map((position : string, index) => total += playerScores[index]);
        let title : any = this.props.username ? <div/> : <h1>View Team</h1>;
        return (
            <div className="View-Team">
                {title}
                {Utils.justRounds.map((roundNum : string) => <button
                    className={(roundNum === this.state.roundSelected) ? "Round-Button Selected" : "Round-Button"}
                    key={"Round" + roundNum} id={roundNum}
                    onClick={() => this.handleRoundClick(roundNum)}>
                    {roundNum.slice(0, 5) + " " + roundNum.slice(5, 6)}
                </button>)}
                <h2>{this.props.username ? this.props.username + "'s" : "Your"} {Utils.roundWithSpace(this.state.roundSelected)} Team</h2>
                <div className="Player-Card-Container">
                    {Utils.positionArr.map((position : string, index ) =>
                        <div className="Player-Card-Margin" key={position}>
                            <FieldPlayerCard
                                             position={position.slice(0, position.length - 1)}
                                             left={true}
                                             isSelected={this.state.playerSelected === this.props.userTeam[this.state.roundSelected][index]}
                                             selectCard={() => this.handleSelectCard(this.props.userTeam[this.state.roundSelected][index])}
                                             unSelectCard={() => this.unused()}
                                             player={this.props.userTeam[this.state.roundSelected][index]}
                                             isPick={false}
                            />
                            <p className="Score-Text">{playerScores[index]}</p>
                        </div>
                    )}
                    <div className="Total-Container" onClick={() => this.handleSelectCard('Total')}>
                        <p className={this.state.playerSelected === 'Total' ? "Total Card-Selected" : "Total"}>Total</p>
                        <p className="Score-Text">{total}</p>
                    </div>
                </div>
                <h2>{lowerTitle}</h2>
                {lowerDisplay}
            </div>
        )
    }
}

export default ViewTeam;