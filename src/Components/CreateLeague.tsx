import React, { Component } from 'react';
import './CreateLeague.css';
import firebase from "./firebase";

interface CreateLeagueProps {
    handleClose() : void,
    username : string
}

interface CreateLeagueState {
    leagueName: string,
    errorMessage : string[]
}

const MAX_INPUT_LEN = 48;

class CreateLeague extends Component<CreateLeagueProps, CreateLeagueState> {
    constructor(props: CreateLeagueProps) {
        super(props);
        this.state = {
            leagueName: "",
            errorMessage: []
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

    handleLeagueNameChange = (event : any) => {
        const updateLeague = event.target.value;
        if (updateLeague.length > MAX_INPUT_LEN) {
            this.updateMessages("League Name must be shorter than " + MAX_INPUT_LEN + " characters");
        } else {
            this.setState( {
                leagueName : updateLeague
            })
        }
    }

    handleSubmit = (event : any) => {
        event.preventDefault();
        this.setState({
            errorMessage : []
        });
        const databaseRef = firebase.firestore().collection("leagues");
        databaseRef.where('leagueName', '==', this.state.leagueName)
            .get()
            .then((querySnapshot) => {
                if (querySnapshot.empty) {
                    this.addLeague(databaseRef)
                    this.props.handleClose();
                } else {
                    this.setState({
                        errorMessage: ["League Name is taken"]
                    })
                }
            })
            .catch((error) => {
                console.log("Error getting documents: ", error);
            });
    }

    // Adds a user to the database with a salt and hashed password
    addLeague = (databaseRef : any) => {
        databaseRef.add({
            leagueName: this.state.leagueName,
            users: [this.props.username]
        });
    }

    render() {
        return(
            <div className="Create-League">
                <button className="Close" onClick={this.props.handleClose}> X </button>
                <h1 className="Create-League-Title">Create League</h1>
                <div id="red">{this.state.errorMessage.map((message:string) => <p key={message} className="Error">{message}</p>)}</div>
                <div className="Form-Wrapper">
                    <form onSubmit={this.handleSubmit}>
                        <label>
                            <p className="Input-Title">League Name</p>
                            <input type="text"
                                   className="Input"
                                   placeholder="Enter League Name"
                                   onChange={this.handleLeagueNameChange}
                                   value={this.state.leagueName}/>
                        </label>
                        <div className="Flex">
                            <button className="Submit" type="submit">Create League</button>
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}

export default CreateLeague;