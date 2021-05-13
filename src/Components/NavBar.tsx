import React, { Component } from 'react';
import './NavBar.css';
import * as Utils from './Utils';
import { Link } from "react-router-dom";

interface NavBarProps {
    numInvites: number | undefined
}

// curPage: the current page
interface NavBarState {
    curPage : string | undefined
}

class NavBar extends Component<NavBarProps, NavBarState> {
    constructor(props: NavBarProps) {
        super(props);
        this.state = {
            curPage : undefined
        }
    }

    componentDidMount(): void {
        if (!this.state.curPage) {
            this.setState({
                curPage: Utils.getPath()
            })
        }
    }

    formatNavTitle = (navTitle : string, index: number) => {
        let notification : any = (<div/>);
        if (navTitle === 'Leagues' && this.props.numInvites !== 0) {
            notification = (<div className="Notification"> {this.props.numInvites} </div>)
        }
        return (
            <div className="Nav-Wrapper" key={navTitle}>
                <Link className={this.state.curPage === navTitle ? "Nav-Button S" : "Nav-Button"}
                      onClick={() => this.setState({
                          curPage: navTitle,
                      })}
                      to={Utils.pathNames[index]}>{navTitle}</Link>
                {notification}
            </div>
        )
    }

    render() {
        return(
                <div>
                    <div className="Nav">
                        {Utils.navTitles.map((navTitle : string, index : number) =>
                            this.formatNavTitle(navTitle, index)
                        )}
                    </div>
                </div>
        )
    }
}

export default NavBar;