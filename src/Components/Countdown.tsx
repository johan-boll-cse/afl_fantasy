import React, { Component } from 'react';
import './Countdown.css';

interface CountdownProps {
    endDate: string
}

interface CountdownState {
    days: number,
    hours: number,
    min: number,
    sec: number,
    interval: any,

}

class Countdown extends Component<CountdownProps, CountdownState> {
    constructor(props : CountdownProps) {
        super(props);

        this.state = {
            days: 0,
            hours: 0,
            min: 0,
            sec: 0,
            interval: null
        }
    }

    componentDidMount() {
        // update every second
        let interval = setInterval(() => {
            const date = this.calculateCountdown(this.props.endDate);
            date ? this.setState({
                days: date.days,
                hours: date.hours,
                min: date.min,
                sec: Math.round(date.sec)
            }) : this.stop();
        }, 1000);
        this.setState({
            interval: interval
        });
    }

    componentWillUnmount() {
        this.stop();
    }

    calculateCountdown(endDate : string) {
        let diff = (new Date(endDate).getTime() - new Date().getTime()) / 1000;
        // clear countdown when date is reached
        if (diff <= 0) return false;

        const timeLeft = {
            years: 0,
            days: 0,
            hours: 0,
            min: 0,
            sec: 0
        };

        // calculate time difference between now and expected date
        if (diff >= (365.25 * 86400)) { // 365.25 * 24 * 60 * 60
            timeLeft.years = Math.floor(diff / (365.25 * 86400));
            diff -= timeLeft.years * 365.25 * 86400;
        }
        if (diff >= 86400) { // 24 * 60 * 60
            timeLeft.days = Math.floor(diff / 86400);
            diff -= timeLeft.days * 86400;
        }
        if (diff >= 3600) { // 60 * 60
            timeLeft.hours = Math.floor(diff / 3600);
            diff -= timeLeft.hours * 3600;
        }
        if (diff >= 60) {
            timeLeft.min = Math.floor(diff / 60);
            diff -= timeLeft.min * 60;
        }
        timeLeft.sec = diff;

        return timeLeft;
    }

    stop() {
        clearInterval(this.state.interval);
    }

    addLeadingZeros(value : number) {
        let strValue = String(value);
        while (strValue.length < 2) {
            strValue = '0' + strValue;
        }
        return strValue;
    }

    render() {
        const countDown = this.state;

        return (
            <div className="Countdown">
                <span className="Countdown-col">
                  <span className="Countdown-col-element">
                      <strong>{this.addLeadingZeros(countDown.days)}</strong>
                      <span>{countDown.days === 1 ? 'Day' : 'Days'}</span>
                  </span>
                </span>

                <span className="Countdown-col">
                  <span className="Countdown-col-element">
                    <strong>{this.addLeadingZeros(countDown.hours)}</strong>
                    <span>Hours</span>
                  </span>
                </span>


                <span className="Countdown-col">
                  <span className="Countdown-col-element">
                    <strong>{this.addLeadingZeros(countDown.min)}</strong>
                    <span>Min</span>
                  </span>
                </span>

                <span className="Countdown-col">
                  <span className="Countdown-col-element">
                    <strong>{this.addLeadingZeros(countDown.sec)}</strong>
                    <span>Sec</span>
                  </span>
                </span>
            </div>
        );
    }
}

export default Countdown;