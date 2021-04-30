import React, { Component } from 'react';
import './DisplayPlayerCard.css';
import * as Utils from './Utils';

interface DisplayPlayerCardProps {
    isInTeam: boolean,
    selectingPlayer: boolean,
    player: any,
    rank: number,
    handleCardClick(player : string) : void
}

interface DisplayPlayerCardState {

}

class DisplayPlayerCard extends Component<DisplayPlayerCardProps, DisplayPlayerCardState> {
    constructor(props: DisplayPlayerCardProps) {
        super(props);
        this.state = {

        }
    }

    render() {
        let cardClassName : string = "";
        if (this.props.isInTeam) {
            cardClassName = "In-Team";
        } else if (this.props.selectingPlayer) {
            cardClassName = "Selecting-Player";
        }
        let playerName = this.props.player[0];
        let playerScoreForward = Utils.getPlayerScore(this.props.player, 'Total', "Forward") / (Utils.roundOptions.length - 1);
        let playerScoreMid = Utils.getPlayerScore(this.props.player, 'Total', "Mid") / (Utils.roundOptions.length - 1);
        let playerScoreDefense = Utils.getPlayerScore(this.props.player, 'Total', "Defense") / (Utils.roundOptions.length - 1);
        let teamName = this.props.player[1]['Team'];
        return (
            <tr className={cardClassName} onClick={() => this.props.handleCardClick(playerName)}>
                <td>{this.props.rank}</td>
                <td>{playerName}</td>
                <td>{teamName}</td>
                <td>{playerScoreForward}</td>
                <td>{playerScoreMid}</td>
                <td>{playerScoreDefense}</td>
            </tr>
        )
    }
}

export default DisplayPlayerCard;