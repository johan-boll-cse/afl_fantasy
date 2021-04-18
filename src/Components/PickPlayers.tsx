import React, { Component } from 'react';
import './PickPlayers.css';
import * as Utils from "./Utils";
import FieldPlayerCard from "./FieldPlayerCard";

const positionArr : string[] = ['ForwardL', 'ForwardR', 'MidL', 'MidR', 'DefenseL', 'DefenseR']

interface PickPlayersProps {
    stats : any
}

interface PickPlayersState {
    selectedCard: string | undefined,
    selectedPlayers : any[]
}

class PickPlayers extends Component<PickPlayersProps, PickPlayersState> {
    constructor(props: PickPlayersProps) {
        super(props);
        this.state = {
            selectedCard: undefined,
            selectedPlayers: ['Brown, Luke', 'Eggmolesse-Smith, Derek', 'Wines, Ollie', 'Williams, Zac', 'Cox, Mason', undefined]
        }
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
                {teamArr}
            </div>
        )
    }

    handleCardClick = (playerName : string) => {
        if (this.state.selectedCard) {
            let newPlayers : string[] = this.state.selectedPlayers.slice()
            let index : number = positionArr.indexOf(this.state.selectedCard)
            if (index >= newPlayers.length || index < 0) {
                return;
            }
            newPlayers[index] = playerName
            this.setState({
                selectedPlayers: newPlayers
            });
        }
    }

    formatPlayers = (player : string, teamStats : any, team : string) => {
        const playerStats = teamStats[player];
        const playerName = Utils.checkDoubleNames(player, team);
        const roundArr : any = this.formatRound(playerStats, playerName, team);

        return (
            <div key={playerName} onClick={() => this.handleCardClick(playerName)}>
                <div className="Player-Card">
                    <p className="Player">{playerName}</p>
                    {roundArr}
                </div>
            </div>
        )
    }

    formatRound = (playerStats : any, player : string, team : string) => {
        const score = this.getPlayerScore(playerStats)
        return (
            <div key={player + "Avg"} className="Team-Score">
                <p className="Player-Text">Team: {team}</p>
                <p className="Player-Text">Average Round Score: {Math.round(score / (Utils.roundOptions.length - 1))}</p>
            </div>
        );
    }

    getPlayerScore = (player : any) : number => {
        const stats : any = player['Total'];
        const statLabels = Object.keys(stats);
        let score : number = 0;
        for (let i = 0; i < statLabels.length; i++) {
            let statVal = stats[statLabels[i]];
            let statTitle = statLabels[i].replace(' ', '');
            if (statVal === "&nbsp;" || statVal === "-") {
                statVal = "0"
            }
            const mult = Utils.statScores[statTitle];
            score += mult * statVal;
        }
        return score;
    }

    selectCard = (position : string) => {
        if (position === this.state.selectedCard) {
            this.setState({
                selectedCard: undefined
            })
        } else {
            this.setState({
                selectedCard: position
            })
        }
    }

    render() {
        let display : any;
        if (this.props.stats) {
            display = this.props.stats.map((team:any) => this.formatTeams(team))
        } else {
            display = <p> Loading Players... </p>
        }
        return(
            <div className="Pick-Players">
                <h1 className="">Pick Players</h1>
                <div className="Choose-Field-Container">
                    <div className="Choose-PLayer-Container">
                        <p className="Sort-Players"> Sort Players</p>
                        <div className="Players-Container">
                            {display}
                        </div>
                    </div>
                    <div className="Field">
                        {Utils.playerPositions.map((position : string, index ) =>
                            <FieldPlayerCard key={position + "left"}
                                             position={position}
                                             left={true}
                                             isSelected={this.state.selectedCard === (position + "L")}
                                             selectCard={() => this.selectCard(position + "L")}
                                             player={this.state.selectedPlayers[index * 2]}/>
                        )}
                        {Utils.playerPositions.map((position : string, index ) =>
                            <FieldPlayerCard key={position + "left"}
                                             position={position}
                                             left={false}
                                             isSelected={this.state.selectedCard === (position + "R")}
                                             selectCard={() => this.selectCard(position + "R")}
                                             player={this.state.selectedPlayers[index * 2 + 1]}/>
                        )}
                    </div>
                </div>
            </div>
        )
    }
}

export default PickPlayers;