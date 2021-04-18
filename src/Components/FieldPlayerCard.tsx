import React, { Component } from 'react';
import './FieldPlayerCard.css';
import * as player_images from './PlayerImages';
import plusIcon from'../Images/plus.png';


interface FieldPlayerCardProps {
    position: string,
    left: boolean,
    isSelected: boolean,
    selectCard() : void,
    player : any,
}

interface FieldPlayerCardState {

}

class FieldPlayerCard extends Component<FieldPlayerCardProps, FieldPlayerCardState> {
    constructor(props: FieldPlayerCardProps) {
        super(props);
        this.state = {

        }
    }

    render() {
        let left : string = this.props.left ?  "L" : "R";
        let selected : string = this.props.isSelected ? " Card-Selected" : "";
        let containerClassName : string = "Field-Card-Container " + this.props.position + left;
        let playerName : string = "";
        let imageClassName : string = "Player-Image Plus-Icon";
        let imageURL : string | undefined = plusIcon;
        console.log(this.props.player)
        if (this.props.player) {
            playerName = this.props.player
            imageURL = player_images.playerImagesUrls.get(playerName);
            if (!imageURL) {
                imageURL = '//static.zerohanger.com/images/body-shot.png';
                imageClassName = "Player-Image No-Image";
            } else {
                imageClassName = "Player-Image";

            }
        }
        let playerFontScale = 40 / playerName.length + 10;
        return(
            <div className={containerClassName} onClick={this.props.selectCard}>
                <div className={"Field-Card" + selected}>
                    <div className="Field-Card-Box">
                        <img className={imageClassName} src={imageURL} alt={"AFL-Player"}/>
                        <p className="Card-Player-Name" style={{fontSize: playerFontScale + "px"}}>{playerName}</p>
                    </div>
                    <p className="Field-Card-Title"> {this.props.position}</p>
                </div>
                <div className="Field-Card-Marker"/>
            </div>
        )
    }
}

export default FieldPlayerCard;