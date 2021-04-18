import React, { Component } from 'react';
import './NavBar.css';
import * as Utils from './Utils';
import { Link } from "react-router-dom";

interface NavBarProps {

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

    render() {
        return(
                <div>
                    <div className="Nav">
                        {Utils.navTitles.map((navTitle : string, index : number) =>
                            <Link key={navTitle} className={this.state.curPage === navTitle ? "Nav-Button S" : "Nav-Button"}
                                  onClick={() => this.setState({
                                      curPage: navTitle,
                                  })}
                                  to={Utils.pathNames[index]}>{navTitle}</Link>
                        )}
                    </div>
                </div>
        )
    }
}

export default NavBar;