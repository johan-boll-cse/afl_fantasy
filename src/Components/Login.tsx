import React, {Component} from 'react';
import './Login.css';
import firebase from "./firebase";
import * as Utils from './Utils';

/**
 * setUser(username): sets the username in App and logs in the user specified by the username parameter
 */
interface LoginProps {
    setUser(username : string) : void,
    handleClose() : void,
    handleSignUp() : void
}

/**
 * username: the current text in the username field
 * password: the current text in the password field
 * confirmPassword: the current text in the confirmPassword field
 * badLoginMessage: the current error message for Login
 * badSignUpMessage: the current error message for SignUp
 */

interface LoginState {
    username : string,
    password : string,
    errorMessage : string[],
}

class Login extends Component<LoginProps, LoginState> {
    constructor(props : LoginProps) {
        super(props);
        this.state = {
            username : "",
            password : "",
            errorMessage : [],
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
                    this.validateUser(userInfo)
                }
            querySnapshot.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots
                // There will only ever be one user per querySnapshot
                userInfo = doc.data();
                this.validateUser(userInfo);
            });
        })
            .catch((error) => {
                console.log("Error getting documents: ", error);
            });
    }

    validateUser = (userInfo : any) => {
        if (!userInfo || this.encrypt(this.state.password, userInfo['salt']) !== userInfo['password']) {
            let updateLoginMessage = this.state.errorMessage.slice();
            updateLoginMessage.push("Password does not match the given username");
            this.setState({
                errorMessage: updateLoginMessage
            });
        } else {
            this.props.setUser(this.state.username);
        }
    }

    // Extremely basic encryption system, but better than nothing
    encrypt = (password : string, salt : string) : string => {
        const crypto = require('crypto');
        const encryptString = password + salt;
        return crypto.createHash('sha1').update(encryptString).digest('hex');
    }

    /* For later:
    addUserPrefs = () => {
        const databaseRef = firebase.firestore().collection("userPrefs");
        databaseRef.add({
            user: this.state.username,
            number: 0
        });
    }

     */

    render() {
        return (
            <div className="Login-Container">
                <button className="Close" onClick={this.props.handleClose}> X </button>
                <h1 className="Login-Title">Log In</h1>
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
                        <div className="Flex">
                            <button className="Submit" type="submit">Log In</button>
                        </div>
                    </form>
                </div>
                <div className="Flex">
                    <p> Don't have an account?</p>
                    <button className="Switch-Button" onClick={this.props.handleSignUp}>Sign Up</button>
                </div>
            </div>
        )
    }
}

export default Login