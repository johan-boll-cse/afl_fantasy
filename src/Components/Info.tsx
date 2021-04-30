import React, { Component } from 'react';
import './Info.css';
import * as Utils from './Utils';

interface InfoProps {

}

interface InfoState {

}

class Info extends Component<InfoProps, InfoState> {
    constructor(props: InfoProps) {
        super(props);
        this.state = {

        }
    }

    render() {
        return(
            <div className="Info">
                <h1>Info</h1>
                <h3>Scoring:</h3>
                <p className="Info-Text">
                    Each round, players will earn fantasy points based on the stats they achieve during the game.
                    Points are assigned to all players from the base point value column, and then points are added according
                    to the position of the player within your fantasy team.
                </p>
                <table className="Stat-Info">
                    <thead className="Stat">
                    <tr>
                        <th>Statistic</th>
                        <th>Base Point Value</th>
                        <th>Forward</th>
                        <th>Mid</th>
                        <th>Defense</th>
                    </tr>
                    </thead>
                    <tbody>
                    {Utils.statNames.map((stat:string) =>
                        <tr className="Stat" key={stat}>
                            <td>{stat}</td>
                            <td>{Utils.statScores[stat.replace(/\s/g, '')]}</td>
                            <td className={Utils.forwardStatAdditions[stat.replace(/\s/g, '')] === 0 ? "Row" : "Row Green"}>
                                + {Utils.forwardStatAdditions[stat.replace(/\s/g, '')]}</td>
                            <td className={Utils.midStatAdditions[stat.replace(/\s/g, '')] === 0 ? "Row" : "Row Green"}>
                                + {Utils.midStatAdditions[stat.replace(/\s/g, '')]}</td>
                            <td className={Utils.defenseStatAdditions[stat.replace(/\s/g, '')] === 0 ? "Row" : "Row Green"}>
                                + {Utils.defenseStatAdditions[stat.replace(/\s/g, '')]}</td>
                        </tr>)}
                    </tbody>
                </table>
                <h3>Choosing players</h3>
                <p className="Info-Text">
                    In the Pick Team tab, you can search for and select your players. Every team can have 2 players assigned to each
                    position. Between rounds, you can substitute up to 2 of your players for new players to be used in the following
                    round. All team changes must be made before any games from the next round start.
                </p>
                <h3>Leagues</h3>
                <p className="Info-Text">
                    At the start of the season, you can join a league with up to 50 people. In the League Standings tab, you can
                    check on other people's teams and see how your team scores compare.
                </p>
                <p/>
            </div>
        )
    }
}

export default Info;