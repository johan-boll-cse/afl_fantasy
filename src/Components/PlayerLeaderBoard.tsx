import React, { Component } from 'react';
import * as Utils from './Utils';
import './PlayerLeaderBoard.css';

let roundSelected = "Total";

let tableHeaders : string[] = ["Rank", "Player", "Team", "Fantasy Score"];
Utils.statNames.map((statName : string) => tableHeaders.push(statName));

const NUM_PLAYERS_DISPLAYED : number = 50;

interface LBState {
    pageNum : number,
    playerMap : any
}

interface LBProps {
    stats : any
}

class PlayerLeaderBoard extends Component<LBProps, LBState> {
    constructor(props : LBProps) {
        super(props);
        this.state = {
            pageNum: 1,
            playerMap: undefined
        }
    }

    componentDidMount(): void {
        this.getPlayerMap();
    }

    formatRound = (player : any, position : number) => {
        let playerScore = this.getPlayerScore(player);
        let playerName = player[0];
        let teamName = player[1]["Team"];
        let playerStats = player[1][roundSelected];
        let statLabels = Object.keys(playerStats);
        statLabels.sort()
        let statArr : any[] = [];
        for (let i = 0; i < statLabels.length; i++) {
            let statVal = playerStats[statLabels[i]];
            if (statVal === "&nbsp;" || statVal === "-") {
                statVal = "0"
            }
            statArr.push(
                <td key={playerName + statLabels[i]}>{statVal}</td>
            );
        }
        return (
            <tr key={playerName}>
                <td>{position}</td>
                <td>{playerName}</td>
                <td>{teamName}</td>
                <td>{playerScore}</td>
                {statArr}
            </tr>
        )
    }

    getPlayerMap = () : any => {
        if (!this.props.stats) {
            setTimeout(() => this.getPlayerMap(), 1000);
            return;
        }
        let allPlayers : any[] = [];
        let entries = Object.entries(this.props.stats)
        for (let i = 0; i < entries.length; i++) {
            let curEntry : any = entries[i];
            let players : any = Object.entries(curEntry[1]['Players']);
            players.map((player:any) => allPlayers.push(player));
        }
        allPlayers.sort(this.sortByScore);
        this.setState({
            playerMap: allPlayers
        })
    }

    sortByScore = (playerA : any, playerB : any) : number => {
        let playerAVal = this.getPlayerScore(playerA);
        let playerBVal = this.getPlayerScore(playerB);
        return playerBVal - playerAVal;
    }

    getPlayerScore = (player : any) : number => {
        let stats : any = player[1][roundSelected];
        const statLabels = Object.keys(stats);
        let score : number = 0;
        for (let i = 0; i < statLabels.length; i++) {
            let statVal = stats[statLabels[i]];
            let statTitle = statLabels[i].replace(/\s/g, '');
            if (statVal === "&nbsp;" || statVal === "-") {
                statVal = "0"
            }
            const mult = Utils.statScores[statTitle];
            score += mult * statVal;
        }
        return score;
    }

    handleRoundClick = (roundNum : string) : any => {
        roundSelected = roundNum;
        this.getPlayerMap();
    }

    render() {
        let display : any[] = [];
        let pageButtons : any[] = [];
        if (this.state.playerMap) {
            const numButtons = Math.ceil(this.state.playerMap.length / NUM_PLAYERS_DISPLAYED);
            for (let i = 1; i <= numButtons; i++) {
                pageButtons.push(
                    <button className={i === this.state.pageNum ? "Page-Button Selected" : "Page-Button"}
                            key={"Page" + i}
                            onClick={() => this.setState({ pageNum: i})}>
                        {i}
                    </button>
                )
            }
            const start = (this.state.pageNum - 1) * NUM_PLAYERS_DISPLAYED;
            const end = Math.min((this.state.pageNum) * NUM_PLAYERS_DISPLAYED, this.state.playerMap.length)
            for (let i = start + 1; i <= end; i++) {
                display.push(this.formatRound(this.state.playerMap[i - 1], i))
            }
        } else {
            display.push(<tr key={"Load"}><td>Loading Player Stats...</td></tr>)
        }
        let tableHead : any[] = [];
        for (let i = 0; i < tableHeaders.length; i++) {
            tableHead.push(
                <th key={"TableHead" + i}>
                    {tableHeaders[i]}
                </th>
            )
        }
        return (
            <div className = "LB">
                <h1 className="LB-Title">Player Leaderboard</h1>
                {Utils.roundOptions.map((roundNum : string) => <button
                    className={(roundNum === roundSelected) ? "Round-Button Selected" : "Round-Button"}
                    key={"Round" + roundNum} id={roundNum}
                    onClick={() => this.handleRoundClick(roundNum)}>
                    {roundNum}
                </button>)}
                <table>
                    <thead>
                        <tr>
                            {tableHead}
                        </tr>
                    </thead>
                    <tbody>
                        {display}
                    </tbody>
                </table>
                {pageButtons}
            </div>
        )
    }
}

export default PlayerLeaderBoard;
