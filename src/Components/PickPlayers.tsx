import React, { Component } from 'react';
import './PickPlayers.css';
import * as Utils from "./Utils";
import FieldPlayerCard from "./FieldPlayerCard";
import PlayerDisplay from "./PlayerDisplay";


interface PickPlayersProps {
    stats : any,
    saveTeam(selectedPlayers : (string | null)[]) : void,
    loadedPlayers : (string | null)[]
}

interface PickPlayersState {
    selectedCard: string | undefined,
    selectedPlayers : (string | null)[],
    playerMap : any,
    playersToDisplay : any,
    pageNum : number,
    searchPlayerText : string,
    searchTeamText : string,
    bestButton : string
}

class PickPlayers extends Component<PickPlayersProps, PickPlayersState> {
    constructor(props: PickPlayersProps) {
        super(props);
        this.state = {
            selectedCard: undefined,
            selectedPlayers: [null, null, null, null, null, null],
            playerMap: null,
            playersToDisplay: null,
            pageNum: 1,
            searchPlayerText : "",
            searchTeamText : "",
            bestButton : "Forward"
        }
    }

    componentDidMount(): void {
        this.loadMap();
        this.loadTeam();
    }

    loadTeam = () => {
        if (this.props.loadedPlayers.length === 0) {
            setTimeout(() => this.loadTeam(), 1000);
            return;
        }
        this.setState({
            selectedPlayers: this.props.loadedPlayers
        });
    }

    loadMap = () => {
        if (!this.props.stats) {
            setTimeout(() => this.loadMap(), 1000);
            return;
        }
        let playerMap = Utils.getPlayerMap(this.props.stats);
        playerMap.sort(Utils.sortByScore('Total', "Forward"));
        this.setState({
            playerMap: playerMap,
            playersToDisplay: playerMap
        });
    }

    handleCardClick = (playerName : string) => {
        if (this.state.selectedCard && !this.state.selectedPlayers.includes(playerName)) {
            let newPlayers : (string | null)[] = this.state.selectedPlayers.slice();
            let index : number = Utils.positionArr.indexOf(this.state.selectedCard)
            if (index >= newPlayers.length || index < 0) {
                return;
            }
            newPlayers[index] = playerName
            this.setState({
                selectedPlayers: newPlayers
            });
        }
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

    unSelectCard = (position : string) => {
        let index : number = Utils.positionArr.indexOf(position);
        let newPlayers = this.state.selectedPlayers.slice();
        newPlayers[index] = null;
        this.setState({
            selectedPlayers: newPlayers
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
        unsortedPlayers.sort(Utils.sortByScore('Total', this.state.bestButton))
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
        unsortedPlayers.sort(Utils.sortByScore('Total', this.state.bestButton))
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

    saveTeam = () => {
        this.props.saveTeam(this.state.selectedPlayers)
    }

    undoChanges = () => {
        this.setState({
            selectedPlayers: this.props.loadedPlayers
        })
    }

    handleBestButtonClick = (position:string) => {
        let unsortedPlayers = this.state.playersToDisplay.slice();
        unsortedPlayers.sort(Utils.sortByScore('Total', position))
        this.setState({
            bestButton: position,
            playersToDisplay: unsortedPlayers
        })
    }

    render() {
        let teamsEqual : boolean = Utils.arrayEquals(this.props.loadedPlayers, this.state.selectedPlayers)
        let saved = teamsEqual ? "Field-Button Save-Button Saved" : "Field-Button Save-Button";
        let undo = teamsEqual ? "Field-Button Undo-Button Undo" : "Field-Button Undo-Button";
        return(
            <div className="Pick-Players">
                <h1>Pick Players</h1>
                <p className="Selecting"> Selecting team for Round {parseInt(Utils.currentRound.slice(5, 6)) + 1}</p>
                <div className="Choose-Field-Container">
                    <div className="Choose-Players-Container">
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
                        <PlayerDisplay selectedPlayers={this.state.selectedPlayers}
                                       cardSelected={this.state.selectedCard !== undefined}
                                       handleCardClick={this.handleCardClick}
                                       playerMap={this.state.playersToDisplay}
                        />
                    </div>
                    <div className="Field">
                        {Utils.playerPositions.map((position : string, index ) =>
                            <FieldPlayerCard key={position + "left"}
                                             position={position}
                                             left={true}
                                             isSelected={this.state.selectedCard === (position + "L")}
                                             selectCard={() => this.selectCard(position + "L")}
                                             unSelectCard={() => this.unSelectCard(position + "L")}
                                             player={this.state.selectedPlayers[index * 2]}
                                             isPick={true}
                            />
                        )}
                        {Utils.playerPositions.map((position : string, index ) =>
                            <FieldPlayerCard key={position + "right"}
                                             position={position}
                                             left={false}
                                             isSelected={this.state.selectedCard === (position + "R")}
                                             selectCard={() => this.selectCard(position + "R")}
                                             unSelectCard={() => this.unSelectCard(position + "R")}
                                             player={this.state.selectedPlayers[index * 2 + 1]}
                                             isPick={true}
                            />
                        )}
                        <button className={saved} onClick={this.saveTeam}>
                            Save Team
                        </button>
                        <button className={undo} onClick={this.undoChanges}>
                            Undo Changes
                        </button>
                    </div>
                </div>
            </div>
        )
    }
}

export default PickPlayers;