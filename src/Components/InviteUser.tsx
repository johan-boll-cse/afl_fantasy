import React, { Component } from 'react';
import './InviteUser.css';
import * as Utils from './Utils';
import firebase from "./firebase";

interface InviteUserProps {
    handleClose() : void,
    leagueName: string
}

interface InviteUserState {
    username: string,
    errorMessage: string[],
    isSent : boolean,
    isSending : boolean
}

class InviteUser extends Component<InviteUserProps, InviteUserState> {
    constructor(props: InviteUserProps) {
        super(props);
        this.state = {
            username: "",
            errorMessage: [],
            isSent : false,
            isSending : false
        }
    }

    updateMessages = (message : string) => {
        let updateMessage = this.state.errorMessage.slice();
        if (!updateMessage.includes(message)) {
            updateMessage.push(message);
        }
        this.setState({
            errorMessage: updateMessage,
        });
    }

    handleUsernameChange = (event : any) => {
        const updateUser = event.target.value;
        if (updateUser.length > Utils.MAX_INPUT_LEN) {
            this.updateMessages("Username must be shorter than " + Utils.MAX_INPUT_LEN + " characters");
        } else {
            this.setState( {
                username : updateUser
            })
        }
    }

    handleSubmit = (event : any) => {
        event.preventDefault();
        this.setState({
            errorMessage : []
        });
        // Send invite to user
        this.addInvite();
        this.setState({
            isSending : true,
        })
    }

    addInvite = () => {
        const leagueDB = firebase.firestore().collection("leagues");
        leagueDB.where('leagueName', '==', this.props.leagueName).get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    // doc.data() is never undefined for query doc snapshots
                    const currentUsers : string[] = doc.data()['users'];
                    if (currentUsers.includes(this.state.username)) {
                        this.updateMessages(this.state.username + " is already in this league");
                        this.setState({
                            isSending: false,
                            isSent: false
                        })
                    } else {
                        const databaseRefInvite = firebase.firestore().collection("leagueInvites");
                        databaseRefInvite.where('username', '==', this.state.username)
                            .get()
                            .then((querySnapshot) => {
                                if (querySnapshot.empty) {
                                    this.updateMessages("User not found");
                                    this.setState({
                                        isSending: false
                                    })
                                }
                                querySnapshot.forEach((doc) => {
                                    // doc.data() is never undefined for query doc snapshots
                                    // There will only ever be one user per querySnapshot
                                    const curLeagues : string[] = doc.data()['leagues'];
                                    if (curLeagues.includes(this.props.leagueName)) {
                                        this.updateMessages("User already has an invite for this league");
                                        this.setState({
                                            isSending : false,
                                            isSent : false
                                        });
                                    } else {
                                        curLeagues.push(this.props.leagueName);
                                        databaseRefInvite.doc(doc.id).set({
                                            leagues: curLeagues
                                        }, {merge: true}).then(() =>
                                            this.setState({
                                                isSending : false,
                                                isSent : true
                                            })
                                        );
                                    }
                                });
                            })
                            .catch((error) => {
                                console.log("Error getting documents: ", error);
                            });
                    }
                });
            })
            .catch((error) => {
                console.log("Error getting documents: ", error);
            });
    }

    render() {
        let display : any;
        if (this.state.isSending) {
            display = (<p>Sending Invite to {this.state.username}...</p>)
        } else if (this.state.isSent) {
            display = (
                <div className="Invite-Wrapper">
                    <p>{this.state.username} successfully invited to {this.props.leagueName}</p>
                    <button className="Pop-Up-Button" onClick={() => this.setState({ isSent : false, username: ""})}> Add another user </button>
                </div>
            )
        } else {
            display = (
                <div className="Invite-Wrapper">
                    <div id="red">{this.state.errorMessage.map((message:string) => <p key={message} className="Error">{message}</p>)}</div>
                    <div className="Form-Wrapper">
                        <form onSubmit={this.handleSubmit}>
                            <label>
                                <p className="Input-Title">Invite User</p>
                                <input type="text"
                                       className="Input"
                                       placeholder="Enter League Name"
                                       onChange={this.handleUsernameChange}
                                       value={this.state.username}/>
                            </label>
                            <div className="Flex">
                                <button className="Submit" type="submit">Invite</button>
                            </div>
                        </form>
                    </div>
                </div>
            )
        }
        return(
            <div className="Invite-User">
                <button className="Close" onClick={this.props.handleClose}> X </button>
                <h1 className="Invite-User-Title">Create League</h1>
                {display}
            </div>
        )
    }
}

export default InviteUser;