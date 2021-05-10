import React, { Component } from 'react';
import './App.css';
import Login from './Components/Login';
import SignUp from "./Components/SignUp";
import Header from './Components/Header';
import NavBar from './Components/NavBar';
import firebase from './Components/firebase';
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import ViewTeam from "./Components/ViewTeam";
import PickPlayers from "./Components/PickPlayers";
import PlayerLeaderBoard from "./Components/PlayerLeaderBoard";
import ViewLeague from "./Components/ViewLeague";
import Info from "./Components/Info";
import * as Utils from './Components/Utils';
import Countdown from "./Components/Countdown";

// TODO: add comments, make it look nice, then make it update each round.
// ALSO TODO: Organize files.
// ALSO TODO: Make the leagues update when invites are accepted somehow.

/**
 * username: the current logged in user, or undefined if not logged in
 * loggingIn: if the user is currently logging in
 * signingUp: if the user is currently signing up
 * stats: a nested data set storing all of the player stats information for the AFL
 */
interface AppState {
    username : string | undefined,
    userTeam : any,
    loggingIn : boolean,
    signingUp : boolean,
    stats : any,
    leagueInvites : string[] | undefined
}

class App extends Component<any, AppState>{
    constructor(props : any) {
        super(props);
        this.state = {
            username: undefined,
            userTeam : undefined,
            loggingIn: false,
            signingUp: false,
            stats : undefined,
            leagueInvites : undefined
        }
    }

    componentDidMount(): void {
        this.getStatsData();
    }

    // Fetches the stats from the firestore database
    getStatsData = () => {
        const statsDB = firebase.firestore().collection("stats");
        const stats : any[] = [];
        statsDB.get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    // doc.data() is never undefined for query doc snapshots
                    stats.push(doc.data())
                });
                this.setState({
                    stats: stats
                })
            })
            .catch((error) => {
                console.log("Error getting documents: ", error);
            });
    }

    // Fetches the user's team from the firestore database if user is logged in
    // Adds an empty team with the given username if the user's team is not found
    getUserTeam = (username : string) : void => {
        const userDB = firebase.firestore().collection("userTeams");
        let loadedTeam : any;
        userDB.where('user', '==', username).get()
            .then((querySnapshot) => {
                if (querySnapshot.empty) {
                    loadedTeam = Utils.getEmptyTeam();
                    userDB.add({
                        user: this.state.username,
                        team: loadedTeam
                    });
                }
                querySnapshot.forEach((doc) => {
                    // doc.data() is never undefined for query doc snapshots
                    loadedTeam = doc.data()['team']
                });
                this.setState({
                    userTeam: loadedTeam
                })
            })
            .catch((error) => {
                console.log("Error getting documents: ", error);
            });
    }

    getUserInvites = (username : string) => {
        const invitesDB = firebase.firestore().collection("leagueInvites");
        invitesDB.where('username', '==', username).get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    // doc.data() is never undefined for query doc snapshots
                    this.setState({
                        leagueInvites: doc.data()['leagues']
                    });
                });
            })
            .catch((error) => {
                console.log("Error getting documents: ", error);
            });
    }

    // TODO: update ViewLeague when this is done and make it display the new league.
    removeLeagueInvite = (leagueName : string) => {
        const invitesDB = firebase.firestore().collection("leagueInvites");
        invitesDB.where('username', '==', this.state.username).get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    // doc.data() is never undefined for query doc snapshots
                    const curInvites : string[] = doc.data()['leagues'];
                    const leagueIndex = curInvites.indexOf(leagueName);
                    curInvites.splice(leagueIndex, 1);
                    this.setState({
                        leagueInvites: curInvites
                    });
                    invitesDB.doc(doc.id).set({
                        leagues: curInvites
                    }, {merge: true})
                });
            })
            .catch((error) => {
                console.log("Error getting documents: ", error);
            });
    }

    // Sets the user and loads in their team, if the user has one saved
    setUser = (username : string) => {
        this.getUserTeam(username);
        this.getUserInvites(username);
        this.setState({
            username : username,
            signingUp : false,
            loggingIn: false
        })
    }

    handleLogin = () => {
        this.setState({
            loggingIn: true,
            signingUp: false
        })
    }

    handleSignUp = () => {
        this.setState({
            loggingIn: false,
            signingUp: true
        })
    }

    handleLogout = () => {
        this.setState({
            loggingIn: false,
            signingUp: false,
            username: undefined,
            userTeam: undefined
        })
    }

    handleSaveTeam = (team : (string | null)[]) => {
        const databaseRef = firebase.firestore().collection("userTeams");
        let userTeam : any = {};
        databaseRef.where('user', '==', this.state.username).get()
            .then((querySnapshot) => {
                if (querySnapshot.empty) {
                    userTeam = Utils.getEmptyTeam();
                    userTeam[Utils.currentRound] = team;
                    databaseRef.add({
                        user: this.state.username,
                        team: userTeam
                    });
                }
                querySnapshot.forEach((doc) => {
                    // doc.data() is never undefined for query doc snapshots
                    userTeam = doc.data()['team'];
                    userTeam[Utils.currentRound] = team;
                    databaseRef.doc(doc.id).update({
                        team: userTeam
                    })
                });
                this.setState({
                    userTeam: userTeam
                })
            })
            .catch((error) => {
                console.log("Error getting documents: ", error);
            });
    }

    render() {
        // What the app will display
        let appDisplay : any;
        if (!this.state.username) {
            if (this.state.loggingIn) {
                appDisplay = (
                    <div key={"LoggingIn"}>
                        <Login setUser={(username : string) => this.setUser(username)}
                               handleClose={() => this.setState({
                                   loggingIn: false,
                                   signingUp: false
                               })}
                               handleSignUp={() => this.handleSignUp()}
                        />
                        <div className="In-Login"/>
                    </div>
                )
            } else if (this.state.signingUp) {
                appDisplay = (
                    <div key={"SigningUp"}>
                        <SignUp setUser={(username : string) => this.setUser(username)}
                                handleClose={() => this.setState({
                                    loggingIn: false,
                                    signingUp: false
                                })}
                                handleLogin={() => this.handleLogin()}
                        />
                        <div className="In-Login"/>
                    </div>
                )
            } else {
                appDisplay = (
                    <div className="Not-Logged-In" key={"NotLoggedIn"}>
                        <h1>Log In or Sign Up to make a team!</h1>
                        <div>
                            <p>Time Until Round {parseInt(Utils.currentRound.slice(5)) + 1}</p>
                            <Countdown endDate={Utils.nextRoundDate}/>
                        </div>
                    </div>
                )
            }
        } else {
            let pickPlayers : any;
            let viewTeam : any;
            let viewLeague : any;
            if (this.state.userTeam) {
                pickPlayers = (
                    <PickPlayers stats={this.state.stats}
                             saveTeam={this.handleSaveTeam}
                             loadedPlayers={this.state.userTeam[Utils.currentRound]}
                    />
                );
            } else {
                pickPlayers = (<div><p> Loading</p></div>);
            }
            if (this.state.userTeam && this.state.stats) {
                viewTeam = (<ViewTeam userTeam={this.state.userTeam} username={undefined} stats={this.state.stats}/>);
            } else {
                viewTeam = (<div><p> Loading</p></div>);
            }
            if (this.state.userTeam && this.state.stats && this.state.leagueInvites) {
                viewLeague = (<ViewLeague username={this.state.username}
                                          userTeam={this.state.userTeam}
                                          leagues={["Global", "Fake League"]}
                                          stats={this.state.stats}
                                          leagueInvites={this.state.leagueInvites}
                                          removeInvite={(leagueName:string) => this.removeLeagueInvite(leagueName)}
                />);
            } else {
                viewLeague = (<div><p> Loading</p></div>);
            }
            appDisplay = (
                <Router>
                    <NavBar />
                        <Switch>
                            <Route exact path="/">
                                {viewTeam}
                            </Route>
                            <Route path="/pick-players">
                                {pickPlayers}
                            </Route>
                            <Route path="/player-leaderboard">
                                <PlayerLeaderBoard stats={this.state.stats}/>
                            </Route>
                            <Route path="/view-league">
                                {viewLeague}
                            </Route>
                            <Route path="/info">
                                <Info />
                            </Route>
                        </Switch>
                </Router>
            )
        }
      return (
          <div className="App">
              <Header username={this.state.username}
                      inLogin={this.state.loggingIn || this.state.signingUp}
                      handleLogin={this.handleLogin}
                      handleSignUp={this.handleSignUp}
                      handleLogout={this.handleLogout}
              />
              {appDisplay}
          </div>
      );
  }
}

export default App;
