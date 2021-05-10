import React, {Component} from 'react';
import './Login.css';
import firebase from "./firebase";
import * as Utils from './Utils';


/**
 * setUser(username): sets the username in App and logs in the user specified by the username parameter
 * handleClose(): closes the sign up pop up
 * handleLogin(): switches over to the login pop up
 */
interface SignUpProps {
    setUser(username : string) : void,
    handleClose() : void,
    handleLogin() : void
}

/**
 * username: the current text in the username field
 * password: the current text in the password field
 * confirmPassword: the current text in the confirmPassword field
 * errorMessage: the error message for a bad sign up
 */

interface SignUpState {
    username : string,
    password : string,
    confirmPassword : string,
    errorMessage : string[]
}

class SignUp extends Component<SignUpProps, SignUpState> {
    constructor(props : SignUpProps) {
        super(props);
        this.state = {
            username : "",
            password : "",
            confirmPassword : "",
            errorMessage : []
        }
    }

    updateMessages = (message : string) => {
        let updateMessage = this.state.errorMessage.slice();
        if (!updateMessage.includes(message)) {
            updateMessage.push(message);
        }
        this.setState({
            errorMessage: updateMessage
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

    handlePasswordChange = (event : any) => {
        const updatePass = event.target.value;
        if (updatePass.length > Utils.MAX_INPUT_LEN) {
            const errorMessage = "Password must be shorter than " + Utils.MAX_INPUT_LEN + " characters";
            this.updateMessages(errorMessage)
        } else {
            this.setState( {
                password : updatePass
            })
        }
    }

    handleConfirmPasswordChange = (event : any) => {
        const updatePass = event.target.value;
        if (updatePass.length > Utils.MAX_INPUT_LEN) {
            const errorMessage = "Password must be shorter than " + Utils.MAX_INPUT_LEN + " characters";
            this.updateMessages(errorMessage)
        } else {
            this.setState( {
                confirmPassword : event.target.value
            })
        }
    }

    handleSubmit = (event : any) => {
        event.preventDefault();
        this.setState({
            errorMessage : []
        });
        const databaseRef = firebase.firestore().collection("users");
        let userInfo : any = null;
        databaseRef.where('username', '==', this.state.username)
            .get()
            .then((querySnapshot) => {
                if (querySnapshot.empty) {
                    this.validateUser(userInfo, databaseRef)
                }
                querySnapshot.forEach((doc) => {
                    // doc.data() is never undefined for query doc snapshots
                    // There will only ever be one user per querySnapshot
                    userInfo = doc.data();
                    this.validateUser(userInfo, databaseRef);
                });
            })
            .catch((error) => {
                console.log("Error getting documents: ", error);
            });
    }

    validateUser = (userInfo : any, databaseRef : any) => {
        let messageUser = "Username must be at least " + Utils.MIN_INPUT_LEN + " characters long";
        let messagePass = "Password must be at least " + Utils.MIN_INPUT_LEN + " characters long";
        let badSignUp = false;
        if (this.state.username.length < Utils.MIN_INPUT_LEN) {
            badSignUp = true;
            this.updateMessages(messageUser)
        }
        if (this.state.password.length < Utils.MIN_INPUT_LEN) {
            badSignUp = true;
            this.updateMessages(messagePass)
        }
        if (badSignUp) {
            return;
        }
        if (userInfo) {
            let updateSignUpMessage = this.state.errorMessage.slice();
            updateSignUpMessage.push("Username is taken");
            this.setState({
                errorMessage: updateSignUpMessage
            });
        } else if (this.state.password !== this.state.confirmPassword) {
            let updateSignUpMessage = this.state.errorMessage.slice();
            updateSignUpMessage.push("Passwords do not match");
            this.setState({
                errorMessage: updateSignUpMessage
            });
        } else {
            this.addUser(databaseRef);
        }
    }

    // Extremely basic encryption system, but better than nothing
    encrypt = (password : string, salt : string) : string => {
        const crypto = require('crypto');
        const encryptString = password + salt;
        return crypto.createHash('sha1').update(encryptString).digest('hex');
    }

    // Adds a user to the database with a salt and hashed password
    addUser = (databaseRef : any) => {
        const crypto = require('crypto');
        const salt = crypto.randomBytes(16).toString();
        const encryptPW = this.encrypt(this.state.password, salt);
        databaseRef.add({
            username: this.state.username,
            password: encryptPW,
            salt: salt
        });
        this.addUserOtherDB()
    }

    addUserOtherDB = () => {
        const databaseRefLeagues = firebase.firestore().collection("leagues");
        databaseRefLeagues.where('leagueName', '==', "Global").get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    // doc.data() is never undefined for query doc snapshots
                    const curUsers : string[] = doc.data()['users'];
                    curUsers.push(this.state.username);
                    const curUserScores : any = doc.data()['userScores'];
                    const userScores : number[] = []
                    Utils.roundOptions.map(() => userScores.push(0));
                    curUserScores[this.state.username] = userScores;
                    databaseRefLeagues.doc(doc.id).set({
                        users: curUsers,
                        userScores: curUserScores
                    }, {merge: true}).then(() =>
                        this.props.setUser(this.state.username)
                    ).catch((error) => {
                        console.log("Error getting documents: ", error);
                    });
                });
            })
            .catch((error) => {
                console.log("Error getting documents: ", error);
            });
        const databaseRefInvites = firebase.firestore().collection("leagueInvites");
        databaseRefInvites.add({
            username: this.state.username,
            leagues: []
        });
    }

    render() {
        return (
            <div className="Login-Container">
                <button className="Close" onClick={this.props.handleClose}> X </button>
                <h1 className="Login-Title">Create an Account</h1>
                <div id="red">{this.state.errorMessage.map((message:string) => <p key={message} className="Error">{message}</p>)}</div>
                <div className="Form-Wrapper">
                    <form onSubmit={this.handleSubmit}>
                        <label>
                            <p className="Input-Title">Username</p>
                            <input type="text"
                                   className="Input"
                                   placeholder="Enter username"
                                   onChange={this.handleUsernameChange}
                                   value={this.state.username}/>
                        </label>
                        <label>
                            <p className="Input-Title">Password</p>
                            <input type="password"
                                   className="Input"
                                   placeholder="Enter password"
                                   onChange={this.handlePasswordChange}
                                   value={this.state.password}/>
                        </label>
                        <label>
                            <p className="Input-Title">Confirm Password</p>
                            <input type="password"
                                   className="Input"
                                   placeholder="Enter password"
                                   onChange={this.handleConfirmPasswordChange}
                                   value={this.state.confirmPassword}/>
                        </label>
                        <div>
                            <button className="Submit" type="submit">Create Account</button>
                        </div>
                    </form>
                </div>
                <div className="Flex">
                    <p> Already have an account?</p>
                    <button className="Switch-Button" onClick={this.props.handleLogin}>Log In</button>
                </div>
            </div>
        )
    }
}

export default SignUp;