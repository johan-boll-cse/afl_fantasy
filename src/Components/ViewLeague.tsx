import React, { Component } from 'react';
import './ViewLeague.css';
import ViewTeam from "./ViewTeam";
import CreateLeague from "./CreateLeague";
import firebase from "./firebase";


interface ViewLeagueProps {
    username : string,
    leagues : string[],
    stats : any
}

interface ViewLeagueState {
    leagueSelected: string | undefined,
    userSelected: string | undefined,
    displayTeam : any,
    displayLeagueList : string[] | undefined,
    displayLeagueTable : any,
    inCreate : boolean
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
            inCreate: false
        }
    }

    componentDidMount(): void {
        this.getUserLeagues();
    }

    formatLeagueList = (leagues : string[]) : any => {
        return (
            <div className="League-List">
                {leagues.map((league:string) =>
                <div key={league}
                     onClick={() => this.handleLeagueClick(league)}
                     className="League-League-Button"
                >
                    <p className="League-Text">{league}</p>
                </div>
                )}
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

    formatLeagueTable = (users : string[]) : any => {
        return (
            <div className="League-Table">
                <h2>{this.state.leagueSelected}</h2>
                {users.map((user:string) =>
                    <div key={user}
                            onClick={() => this.handleUserClick(user)}
                            className="League-User-Button"
                    >
                        <p className="User-Text">{user}</p>
                    </div>
                )}
            </div>
        );
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
        let leagues : string[] = [];
        const leagueDB = firebase.firestore().collection("leagues");
        leagueDB.where('users', 'array-contains', this.props.username).get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    // doc.data() is never undefined for query doc snapshots
                    if (doc.data()['leagueName'] !== "Global") {
                        leagues.push(doc.data()['leagueName'])
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
                        displayLeagueTable: doc.data()['users']
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
            userSelected: undefined
        });
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
                    <CreateLeague handleClose={() => this.handleCloseCreateLeague()} username={this.props.username}/>
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

                </div>
                {overDisplay}
            </div>
        )
    }
}

export default ViewLeague;