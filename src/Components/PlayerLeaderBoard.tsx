import React, { Component } from 'react';
import './PlayerLeaderBoard.css';

const statScores : any = {
    Disposals: 5,
    Marks: 10,
    Goals: 60,
    Behinds: 10,
    GoalAssists: 20,
    Tackles: 10,
}

let roundSelected = "Total";

const roundOptions : string[] = ["Round1", "Round2", "Round3", "Total"]
const tableHeaders : string[] = ["Rank", "Player", "Team", "Fantasy Score", "Behinds", "Disposals", "Goal Assists", "Goals", "Marks", "Tackles"];

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

    formatTeams = (team : any) => {
        const teamName : string = team["Team"];
        const teamStats : any = team["Players"];
        const players : string[] = Object.keys(teamStats);
        const teamArr : any[] = [];
        players.forEach((player : string) =>
            teamArr.push(this.formatPlayers(player, teamStats, teamName))
        );

        return (
            <div key={teamName}>
                <p className="Team">{teamName}</p>
                <div className="Flex-Col">
                    {teamArr}
                </div>
            </div>
        )
    }

    formatPlayers = (player : string, teamStats : any, team : string) => {
        const playerStats = teamStats[player]
        const roundNums = Object.keys(playerStats);
        roundNums.sort();
        const roundArr : any[] = []
        for (let i = 0; i < roundNums.length; i++) {
            if (roundNums[i] !== "Team") {
                if (roundNums[i] === roundSelected) {
                    roundArr.push(
                        this.formatRound(roundNums[i], playerStats, player, team)
                    )
                }
            }
        }
        return (
            <div key={team + player}>
                <div className="Flex H20 B">
                    <p className="Player">{player}</p>
                    {roundArr}
                </div>
            </div>
        )
    }

    formatRound = (roundNum : string, playerStats : any, player : string, team : string) => {
        const roundStats = playerStats[roundNum]
        const statLabels = Object.keys(roundStats);
        statLabels.sort()
        const statArr : any[] = [];
        let score : number = 0;
        for (let i = 0; i < statLabels.length; i++) {
            let statVal = roundStats[statLabels[i]];
            let statTitle = statLabels[i] === "Goal Assists" ? "GoalAssists" : statLabels[i];
            if (statVal === "&nbsp;" || statVal === "-") {
                statVal = "0"
            }
            const mult = statScores[statTitle];
            score += mult * statVal;
            statArr.push(
                <p className="Stats" key={team + player + roundNum + statLabels[i]}>{statLabels[i]}:{statVal}</p>
            );
        }
        return (
            <div key={team + player + roundNum} className="Flex W50">
                Team: {team}<b>{roundNum}:</b> {statArr} Score: {score}
            </div>
        );
    }

    formatRound2 = (player : any, position : number) : any => {
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
                <p className="Stats" key={playerName + teamName + statLabels[i]}>| {statLabels[i]}:{statVal}</p>
            );
        }
        return (
            <div key={playerName + teamName} className="Flex W50 NW">
                <p>Position: {position}</p>
                <p>{playerName}:</p>
                <p>Score: {playerScore}</p>
                <div className="Flex">Team: {teamName} {statArr}</div>
            </div>
        )
    }

    formatRound3 = (player : any, position : number) => {
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
                <td key={playerName + teamName + statLabels[i]}>{statVal}</td>
            );
        }
        return (
            <tr key={playerName + teamName}>
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
            let statTitle = statLabels[i] === "Goal Assists" ? "GoalAssists" : statLabels[i];
            if (statVal === "&nbsp;" || statVal === "-") {
                statVal = "0"
            }
            const mult = statScores[statTitle];
            score += mult * statVal;
        }
        return score;
    }

    handleRoundClick = (roundNum : string) : any => {
        console.log(roundNum)
        roundSelected = roundNum;
        this.getPlayerMap();
    }

    render() {
        let display : any[] = [];
        /*if (this.props.stats) {
            display = this.props.stats.map((team:any) => this.formatTeams(team))
        } else {
            display = (
                <p>
                    Loading...
                </p>
            )
        }*/
        let pageButtons : any[] = [];
        if (this.state.playerMap) {
            const numButtons = Math.ceil(this.state.playerMap.length / NUM_PLAYERS_DISPLAYED);
            for (let i = 1; i <= numButtons; i++) {
                pageButtons.push(
                    <button className={i === this.state.pageNum ? "Page-Button Blue" : "Page-Button Grey"}
                            key={"Page" + i}
                            onClick={() => this.setState({ pageNum: i})}>
                        Page {i}
                    </button>
                )
            }
            const start = (this.state.pageNum - 1) * NUM_PLAYERS_DISPLAYED;
            const end = Math.min((this.state.pageNum) * NUM_PLAYERS_DISPLAYED, this.state.playerMap.length)
            for (let i = start + 1; i <= end; i++) {
                //display.push(this.formatRound2(this.state.playerMap[i], i))
                display.push(this.formatRound3(this.state.playerMap[i - 1], i))
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
        // let table : any[] = [];

        /*
        return (
            <div className="LB">
                <h1>Leader Board</h1>
                {roundOptions.map((roundNum : string) => <button key={"Round" + roundNum} id={roundNum} onClick={() => this.handleRoundClick(roundNum)}>{roundNum}</button>)}
                <p>Current Selection: {roundSelected}</p>
                {pageButtons}
                {tableHeaders}
                {display}
            </div>
        );*/
        return (
            <div className = "LB">
                <h1>Player Leaderboard</h1>
                {roundOptions.map((roundNum : string) => <button
                    className={(roundNum === roundSelected) ? "Round-Button Blue" : "Round-Button Grey"}
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
