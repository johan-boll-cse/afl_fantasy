import React, { Component } from 'react';
import * as Utils from './Utils';
import './PlayerLeaderBoard.css';

let tableHeaders : string[] = ["Rank", "Player", "Team", "Fantasy Score"];
Utils.statNames.map((statName : string) => tableHeaders.push(statName));

const NUM_PLAYERS_DISPLAYED : number = 50;

interface LBState {
    pageNum : number,
    playerMap : any,
    playersToDisplay : any,
    roundSelected : string,
    searchPlayerText : string,
    searchTeamText : string,
    bestButton : string
}

interface LBProps {
    stats : any
}

class PlayerLeaderBoard extends Component<LBProps, LBState> {
    constructor(props : LBProps) {
        super(props);
        this.state = {
            pageNum: 1,
            playerMap: undefined,
            playersToDisplay: undefined,
            roundSelected: "Total",
            searchPlayerText: "",
            searchTeamText: "",
            bestButton: "Forward"
        }
    }

    componentDidMount(): void {
        this.loadMap();
    }

    loadMap = () => {
        if (!this.props.stats) {
            setTimeout(() => this.loadMap(), 1000);
            return
        }
        let playerMap = Utils.getPlayerMap(this.props.stats);
        playerMap.sort(Utils.sortByScore("Total", "Forward"))
        this.setState({
            playerMap: playerMap,
            playersToDisplay: playerMap
        });
    }

    playerFilter = (player:string, text:string) : boolean => {
        const otherFormat = player.split(", ");
        const otherFormatPlayer = otherFormat[1] + " " + otherFormat[0];
        return player.toLowerCase().includes(text.toLowerCase()) || otherFormatPlayer.toLowerCase().includes(text.toLowerCase());
    }

    handleSearchPlayerText = (event : any) => {
        const text = event.target.value;
        let unsortedPlayers : any[] = this.updateDisplayedPlayers(text, this.state.searchTeamText);
        unsortedPlayers.sort(Utils.sortByScore(this.state.roundSelected, this.state.bestButton))
        this.setState({
            searchPlayerText: text,
            playersToDisplay: unsortedPlayers
        });

    }

    teamFilter = (playerTeam:string, text:string) => {
        if ("gws".includes(text.toLowerCase()) && playerTeam === "Greater Western Sydney") {
            return true;
        }
        return playerTeam.toLowerCase().includes(text.toLowerCase());
    }

    handleSearchTeamText = (event : any) => {
        const text = event.target.value;
        let unsortedPlayers = this.updateDisplayedPlayers(this.state.searchPlayerText, text);
        unsortedPlayers.sort(Utils.sortByScore(this.state.roundSelected, this.state.bestButton))
        this.setState({
            searchTeamText: text,
            playersToDisplay: unsortedPlayers
        });
    }

    updateDisplayedPlayers = (playerText : string, teamText : string) : any[] => {
        let allPlayers : any[] = Array.from(this.state.playerMap);
        if (playerText !== "") {
            allPlayers = allPlayers.filter((player : any) => this.playerFilter(player[0], playerText));
        }
        if (teamText !== "") {
            allPlayers = allPlayers.filter((player : any) => this.teamFilter(player[1]['Team'], teamText))
        }
        return allPlayers;
    }

    handleBestButtonClick = (position:string) => {
        let unsortedPlayers = this.state.playersToDisplay.slice();
        let unsortedPlayerMap = this.state.playerMap.slice();
        unsortedPlayers.sort(Utils.sortByScore(this.state.roundSelected, position))
        unsortedPlayerMap.sort(Utils.sortByScore(this.state.roundSelected, position))
        this.setState({
            bestButton: position,
            playersToDisplay: unsortedPlayers,
            playerMap: unsortedPlayerMap
        })
    }

    formatRound = (player : any, position : number) => {
        let playerScore : number[] = [Utils.getPlayerScore(player, this.state.roundSelected, "Forward"),
            Utils.getPlayerScore(player, this.state.roundSelected, "Mid"),
            Utils.getPlayerScore(player, this.state.roundSelected, "Defense")];
        let playerName = player[0];
        let teamName = player[1]["Team"] === "Greater Western Sydney" ? "GWS" : player[1]["Team"];
        let playerStats = player[1][this.state.roundSelected];
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
        let scoreDisplay = playerScore.map((score:number, index) => <td key={"Position" + index} className="Score-Cell">{score}</td>)
        return (
            <tr key={playerName}>
                <td>{position}</td>
                <td>{playerName}</td>
                <td>{teamName}</td>
                {scoreDisplay}
                {statArr}
            </tr>
        )
    }

    handleRoundClick = (roundNum : string) : any => {
        let unsortedPlayers = this.state.playersToDisplay.slice();
        let unsortedPlayerMap = this.state.playerMap.slice();
        unsortedPlayers.sort(Utils.sortByScore(roundNum, this.state.bestButton));
        unsortedPlayerMap.sort(Utils.sortByScore(roundNum, this.state.bestButton));
        this.setState({
            playerMap: unsortedPlayerMap,
            playersToDisplay: unsortedPlayers,
            roundSelected: roundNum
        })
    }

    render() {
        let display : any[] = [];
        let pageButtons : any[] = [];
        if (this.state.playersToDisplay) {
            const numButtons = Math.ceil(this.state.playersToDisplay.length / NUM_PLAYERS_DISPLAYED);
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
            const end = Math.min((this.state.pageNum) * NUM_PLAYERS_DISPLAYED, this.state.playersToDisplay.length)
            for (let i = start + 1; i <= end; i++) {
                display.push(this.formatRound(this.state.playersToDisplay[i - 1], this.state.playerMap.indexOf(this.state.playersToDisplay[i - 1]) + 1))
            }
        } else {
            display.push(<tr key={"Load"}><td>Loading Player Stats...</td></tr>)
        }
        let tableHead : any[] = [];
        for (let i = 0; i < tableHeaders.length; i++) {
            if (tableHeaders[i] === 'Fantasy Score') {
                tableHead.push(
                    <th key={"TableHead" + i} colSpan={3}>
                        <div className="Position-Wrapper">
                            <p className="Position-Title">{tableHeaders[i]}</p>
                            <div className="Positions">
                                <p className="Position-Text">Forward</p>
                                <p className="Position-Text">Mid</p>
                                <p className="Position-Text">Defense</p>
                            </div>
                        </div>
                    </th>
                )
            } else {
                if (Utils.statNames.includes(tableHeaders[i])) {
                    tableHead.push(
                        <th key={"TableHead" + i} className="Stat-Cells">
                            {tableHeaders[i]}
                        </th>
                    )
                } else {
                    tableHead.push(
                        <th key={"TableHead" + i}>
                            {tableHeaders[i]}
                        </th>
                    )
                }
            }
        }

        return (
            <div className = "LB">
                <h1 className="LB-Title">Player Leaderboard</h1>
                {Utils.roundOptions.map((roundNum : string) => <button
                    className={(roundNum === this.state.roundSelected) ? "Round-Button Selected" : "Round-Button"}
                    key={"Round" + roundNum} id={roundNum}
                    onClick={() => this.handleRoundClick(roundNum)}>
                    {roundNum === 'Total' ? 'Total' : Utils.roundWithSpace(roundNum)}
                </button>)}
                <div className="Filter-Players">
                    Filter Players
                    <div className="Filter-Players-Sub">
                        <p className="Left-Text">Search Player:</p>
                        <input onChange={this.handleSearchPlayerText}
                               value={this.state.searchPlayerText}/>
                    </div>
                    <div className="Filter-Players-Sub">
                        <p className="Left-Text">Search Team:</p>
                        <input onChange={this.handleSearchTeamText}
                               value={this.state.searchTeamText}/>
                    </div>
                    <div className="Filter-Players-Sub">
                        <p className="Left-Text">Sort By Best:</p>
                        {Utils.playerPositions.map((position:string) =>
                            <button key={position}
                                    className={this.state.bestButton === position ? "Best-Button Selected-Button" : "Best-Button"}
                                    onClick={() => this.handleBestButtonClick(position)}>
                                {position}
                            </button>)}
                    </div>
                </div>
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
