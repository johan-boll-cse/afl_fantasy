import React, { Component} from 'react';
import './Header.css';
import profileIcon from '../Images/profileIcon.png';


/**
 * username: the current logged in user, or undefined if not logged in
 * inLogin: if the user is currently in the login screen
 * handle_____(): handles Login, Sign Up, and Logout buttons for the header
 */
interface HeaderProps {
    username: string | undefined,
    inLogin : boolean,
    handleLogin() : void,
    handleSignUp() : void,
    handleLogout() : void
}

interface HeaderState {

}

class Header extends Component<HeaderProps, HeaderState> {
    constructor(props : HeaderProps) {
        super(props);
        this.state = {

        }
    }

    render() {
        // The display on the right of the header
        let rightDisplay : any;
        // Dynamically reduces the height of the header if the user is logged in, and removes the title
        let headerClassName : string = "Header-Wrapper";
        let title : any = (
            <p className="Title">Fantasy Footie</p>
        );
        if (this.props.username) {
            headerClassName = "Header-Wrapper In";
            title = (
                <p className="Title"/>
            )
            rightDisplay = (
                <div className="Sign-Log-Wrapper">
                    <p className="Welcome">Welcome {this.props.username}</p>
                    <div className="Logout-Wrapper" onClick={this.props.handleLogout}>
                        Logout
                    </div>
                </div>
            );
        } else {
            if (this.props.inLogin) {
                rightDisplay = (
                    <div className="Sign-Log-Wrapper"/>
                )
            } else {
                rightDisplay = (
                    <div className="Sign-Log-Wrapper">
                        <div className="Login-Wrapper" onClick={this.props.handleLogin}>
                            <p className="Login">Log In</p>
                            <img className="Profile" src={profileIcon} alt={"Profile"}/>
                        </div>
                        <div className="SignUp-Wrapper" onClick={this.props.handleSignUp}>
                            <p className="SignUp"> Sign Up </p>
                            <p className="Plus"> + </p>
                        </div>
                    </div>
                )
            }
        }
        return (
            <div className={headerClassName}>
                <div className="Logo-Wrapper">
                    <a className="Logo" href="https://www.afl.com.au/" target="_new"> </a>
                </div>
                {title}
                {rightDisplay}
            </div>
        )
    }
}

export default Header;