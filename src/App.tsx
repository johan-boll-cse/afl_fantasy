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
// import * as Utils from './Components/Utils';


/**
 * username: the current logged in user, or undefined if not logged in
 * loggingIn: if the user is currently logging in
 * signingUp: if the user is currently signing up
 * stats: a nested data set storing all of the player stats information for the AFL
 */
interface AppState {
    username: string | undefined,
    loggingIn : boolean,
    signingUp : boolean,
    stats : any
}

class App extends Component<any, AppState>{
    constructor(props : any) {
        super(props);
        this.state = {
            username: undefined,
            loggingIn: false,
            signingUp: false,
            stats : undefined
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
        })
    }

    render() {
        // What the app will display
        // TODO: Change to a react-router-dom setup with protected routes
        let appDisplay : any;
        if (!this.state.username) {
            if (this.state.loggingIn) {
                appDisplay = (
                    <div key={"LoggingIn"}>
                        <Login setUser={(username : string) => this.setState({
                            username : username,
                            signingUp : false,
                            loggingIn: false})}
                               handleClose={() => this.setState({
                                   loggingIn: false,
                                   signingUp: false
                               })}
                               handleSignUp={() => this.handleSignUp()}
                        />
                        <div  className="In-Login"/>
                    </div>
                )
            } else if (this.state.signingUp) {
                appDisplay = (
                    <div key={"SigningUp"}>
                        <SignUp setUser={(username : string) => this.setState({
                            username : username,
                            signingUp : false,
                            loggingIn: false})}
                                handleClose={() => this.setState({
                                    loggingIn: false,
                                    signingUp: false
                                })}
                                handleLogin={() => this.handleLogin()}
                        />
                        <div  className="In-Login"/>
                    </div>
                )
            } else {
                appDisplay = (
                    <div key={"NotLoggedIn"}>
                        <h1>Log In or Sign Up to make a team!</h1>
                    </div>
                )
            }
        } else {
            appDisplay = (
                <Router>
                    <NavBar />
                        <Switch>
                            <Route exact path="/">
                                <ViewTeam />
                            </Route>
                            <Route path="/pick-players">
                                <PickPlayers stats={this.state.stats} />
                            </Route>
                            <Route path="/player-leaderboard">
                                <PlayerLeaderBoard stats={this.state.stats}/>
                            </Route>
                            <Route path="/view-league">
                                <ViewLeague />
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
