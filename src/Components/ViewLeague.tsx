import React, { Component } from 'react';
import './ViewLeague.css';
import ViewTeam from "./ViewTeam";
import CreateLeague from "./CreateLeague";
import firebase from "./firebase";
import InviteUser from "./InviteUser";
import * as Utils from "./Utils";
import profileIcon from "../Images/profileIcon.png";

interface ViewLeagueProps {
    username : string,
    userTeam : any,
    leagues : string[],
    stats : any,
    leagueInvites : string[],
    removeInvite(leagueName:string) : void
}

interface ViewLeagueState {
    leagueSelected: string | undefined,
    userSelected: string | undefined,
    displayTeam : any,
    displayLeagueList : Map<string, number> | undefined,
    displayLeagueTable : any,
    inCreate : boolean,
    inInvite : boolean
}

class ViewLeague extends Component<ViewLeagueProps, ViewLeagueState> {
    constructor(props: ViewLeagueProps) {
        super(props);
        this.state = {
            leagueSelected: undefined,
            userSelected: undefined,
            displayTeam: undefined,
            displayLeagueList: undefined,
            displayLeagueTable: undefined,
            inCreate: false,
            inInvite: false
        }
    }

    componentDidMount(): void {
        this.getUserLeagues();
    }

    formatLeagueList = (leagues : Map<string, number>) : any => {
        let displayList : any[] = [];
        leagues.forEach((numUsers, leagueName) => {
            displayList.push(
                <div key={leagueName}
                     onClick={() => this.handleLeagueClick(leagueName)}
                     className="League-League-Button"
                >
                    <p className="League-Text">{leagueName}</p>
                    <div className="Num-Users">
                        <p className="Num-Users-Text">{numUsers}</p>
                        <img className="Profile-Icon-Leagues" src={profileIcon} alt={"Profile"}/>
                    </div>
                </div>
            )
        })
        return (
            <div className="League-List">
                {displayList}
                <button className="Create-Button" onClick={() => this.setState({ inCreate: true})}>
                    Create League
                </button>
            </div>
        );
    }

    handleLeagueClick = (leagueName:string) => {
        this.setState({
            leagueSelected: leagueName
        });
        this.getLeagueDisplay(leagueName);
    }

    formatLeagueTable = (roundScores : any) : any => {
        let inviteButton : any;
        let backButton : any;
        if (this.state.leagueSelected === "Global" || !this.state.leagueSelected) {
            backButton = (<div/>)
            inviteButton = (<div/>)
        } else {
            backButton = (
                <button className="Back-Button" onClick={() => this.setState({ leagueSelected: undefined})}>Back</button>
            )
            inviteButton = (
                <button className="Invite-Button"
                        onClick={() => this.setState({ inInvite: true})}
                >Invite User</button>
            )
        }
        let displayList : any[] = [];
        let userMap : any[] = [];
        for (const username in roundScores) {
            if (roundScores.hasOwnProperty(username)) {
                const userScores : number[] = roundScores[username];
                const total : number = userScores[userScores.length - 1];
                let user = {username: username, total:total};
                userMap.push(user);
            }
        }
        userMap.sort(function(a, b) {
            return b['total'] - a['total'];
        });
        for (let i = 0; i < userMap.length; i++) {
            const user = userMap[i];
            const username = user['username'];
            const userScores = roundScores[username];
            displayList.push(
                <tr key={username} className="League-User-Row">
                    <td>{i + 1}</td>
                    <td className="League-Table-Column-User"  onClick={() => this.handleUserClick(username)}>{username}</td>
                    {userScores.map((score:number, index:number) => <td key={username + index}>{score}</td>)}
                </tr>
            )
        }
        return (
            <div className="League-Table">
                {backButton}
                <h2>{this.state.leagueSelected}</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Rank</th>
                            <th>Username</th>
                            {Utils.roundOptions.map((roundTitle:string) => <th key={roundTitle}>{roundTitle}</th>)}
                        </tr>
                    </thead>
                    <tbody>
                        {displayList}
                    </tbody>
                </table>
                {inviteButton}
            </div>
        )
    }

    handleUserClick = (user : string) => {
        this.setState({
            userSelected: user
        });
        this.getAnyUserTeam(user);
    }

    getAnyUserTeam = (username : string) : any => {
        const userDB = firebase.firestore().collection("userTeams");
        userDB.where('user', '==', username).get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    // doc.data() is never undefined for query doc snapshots
                    this.setState({
                        displayTeam: doc.data()['team'],
                        userSelected: username
                    })
                });
            })
            .catch((error) => {
                console.log("Error getting documents: ", error);
            });
    }

    getUserLeagues = () => {
        let leagues : Map<string, number> = new Map();
        const leagueDB = firebase.firestore().collection("leagues");
        leagueDB.where('users', 'array-contains', this.props.username).get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    // doc.data() is never undefined for query doc snapshots
                    if (doc.data()['leagueName'] !== "Global") {
                        leagues.set(doc.data()['leagueName'], doc.data()['users'].length);
                    }
                });
                this.setState({
                    displayLeagueList: leagues
                })
            })
            .catch((error) => {
                console.log("Error getting documents: ", error);
            });
    }

    getLeagueDisplay = (leagueName : string) => {
        const leagueDB = firebase.firestore().collection("leagues");
        leagueDB.where('leagueName', '==', leagueName).get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    // doc.data() is never undefined for query doc snapshots
                    this.setState({
                        displayLeagueTable: doc.data()['userScores']
                    })
                });
            })
            .catch((error) => {
                console.log("Error getting documents: ", error);
            });
    }

    handleGlobalClick = () => {
        this.getLeagueDisplay("Global");
        this.setState({
            leagueSelected: "Global"
        })
    }

    handleYourLeaguesClick = () => {
        this.getUserLeagues();
        this.setState({
            leagueSelected: undefined
        })
    }

    handleCloseCreateLeague = () => {
        this.setState({
            inCreate: false
        });
        this.getUserLeagues();
    }

    handleClosePopUp = () => {
        this.setState({
            userSelected: undefined,
            inInvite: false
        });
    }

    joinLeague = (league : string) => {
        const databaseRef = firebase.firestore().collection("leagues");
        databaseRef.where('leagueName', '==', league)
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    // doc.data() is never undefined for query doc snapshots
                    // This is the same code as in SignUp
                    const curUsers : string[] = doc.data()['users'];
                    curUsers.push(this.props.username);
                    const curUserScores : any = doc.data()['userScores'];
                    const userScores : number[] = []
                    Utils.roundOptions.map(() => userScores.push(0));
                    curUserScores[this.props.username] = userScores;
                    databaseRef.doc(doc.id).set({
                        users: curUsers,
                        userScores: curUserScores
                    }, {merge: true})
                    .catch((error) => {
                        console.log("Error getting documents: ", error);
                    });
                });
            })
            .catch((error) => {
                console.log("Error getting documents: ", error);
            });
            this.props.removeInvite(league);
    }

    declineLeague = (league : string ) => {
        this.props.removeInvite(league);
    }

    render() {
        let display : any;
        let overDisplay : any = <div/>;
        if (this.state.leagueSelected) {
            if (this.state.displayLeagueTable) {
                display = (this.formatLeagueTable(this.state.displayLeagueTable))
            } else {
                display = (
                    <div>
                        <button onClick={() => this.setState({ leagueSelected: undefined})}>Back</button>
                        <h2>{this.state.leagueSelected}</h2>
                        <p>Loading league info...</p>
                    </div>
                )
            }
        } else {
            if (this.state.displayLeagueList) {
                display = (this.formatLeagueList(this.state.displayLeagueList))
            } else {
                display = (<p>Loading your leagues...</p>)
            }
        }
        if (this.state.userSelected) {
            if (this.state.displayTeam) {
                overDisplay = (
                    <div>
                        <div className="Pop-Up">
                            <button className="Close-Pop-Up" onClick={() => this.handleClosePopUp()}> X </button>
                            <ViewTeam userTeam={this.state.displayTeam} username={this.state.userSelected} stats={this.props.stats}/>
                        </div>
                        <div className="In-Login"/>
                    </div>
                )
            } else {
                overDisplay = (
                    <div>
                        <p>Loading user team...</p>
                    </div>
                )
            }
        } else if (this.state.inCreate) {
            overDisplay = (
                <div>
                    <CreateLeague handleClose={() => this.handleCloseCreateLeague()}
                                  username={this.props.username}
                                  userTeam={this.props.userTeam}
                                  stats={this.props.stats}
                    />
                    <div className="In-Login"/>
                </div>
            )
        } else if (this.state.inInvite && this.state.leagueSelected) {
            overDisplay = (
                <div>
                    <InviteUser handleClose={() => this.handleClosePopUp()} leagueName={this.state.leagueSelected}/>
                    <div className="In-Login"/>
                </div>
            )
        }
        return(
            <div className="View-League">
                <h1>League Standings</h1>
                <div className="League-Display">
                    <div>
                        <button className={this.state.leagueSelected === "Global" ? "League-Button Selected" : "League-Button"}
                                onClick={() => this.handleGlobalClick()}>Global Standings</button>
                        <button className = {this.state.leagueSelected !== "Global" ? "League-Button Selected" : "League-Button"}
                                onClick={() => this.handleYourLeaguesClick()}>Your Leagues</button>
                    </div>
                    {display}
                    <div style={{backgroundColor: "red", textAlign: "center"}}>
                        <h3> Invites </h3>
                        {this.props.leagueInvites.map(((league:string) =>
                            <div key={league}>
                                <p>{league}</p>
                                <button className="Green" onClick={() => this.joinLeague(league)}>Join</button>
                                <button className="Red" onClick={() => this.declineLeague(league)}>Decline</button>
                            </div>
                            ))}
                    </div>
                </div>
                {overDisplay}
            </div>
        )
    }
}

export default ViewLeague;