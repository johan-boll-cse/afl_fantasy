/**
 * Returns a table for View Team with the given single player point breakdown,
 * playing at the given position, for the given round number
 * @param playerName
 * @param position
 * @param roundNum
 * @param stats
 */
export const getSinglePlayerTable = (playerName : string, position: string, roundNum : string, stats : any) : any => {
    const positionHeader = position.slice(0, 1).toUpperCase() + position.slice(1) + " Score"
    let tableHeaders : string[] = ["Stat", "Stat Amount", "Base Score", positionHeader, "Total Score"] ;
    let baseTotal : number = 0;
    let additionTotal : number = 0;
    let overallTotal : number = 0;
    let playerMap = getSpecificPlayerMap(stats, [playerName]);
    let player = playerMap[0];
    if (!player) {
        return (
            <p key={"DNE"}>Could not find player</p>
        )
    }
    let statArr: any[] = [];
    let playerStats = player[1][roundNum];
    let statLabels = Object.keys(playerStats);
    statLabels.sort()
    for (let j = 0; j < statLabels.length; j++) {
        let statVal = playerStats[statLabels[j]];
        if (statVal === "&nbsp;" || statVal === "-") {
            statVal = "0"
        }
        const noSpaceStat = statLabels[j].replace(" ", '');
        const basePoints = statScores[noSpaceStat] * parseInt(statVal);
        baseTotal += basePoints;
        const addedPoints = positionToScoreMap[position][noSpaceStat] * parseInt(statVal);
        additionTotal += addedPoints;
        const total = basePoints + addedPoints;
        overallTotal += total;
        const addClassName = addedPoints !== 0 ? "Green" : "";
        statArr.push(
            <tr key={playerName + statLabels[j]}>
                <td>{statLabels[j]}</td>
                <td>{statVal}</td>
                <td>{basePoints}</td>
                <td className={addClassName}>+{addedPoints}</td>
                <td>{total}</td>
            </tr>
        );
    }
    return (
        <table>
            <thead>
            <tr>
                {tableHeaders.map((header : string) => <th key={header}>{header}</th>)}
            </tr>
            </thead>
            <tbody>
            {statArr}
            <tr id={"Total-Row"}>
                <td colSpan={2}>Total</td>
                <td>{baseTotal}</td>
                <td className={"Green"}>+{additionTotal}</td>
                <td className={"Highlight"}>{overallTotal}</td>
            </tr>
            </tbody>
        </table>
    )
}


/**
 * Returns a table for View Team with the given players, for the given round number
 * @param players
 * @param roundNum
 * @param stats
 */
export const getTableHTML = (players : (string | null)[], roundNum : string, stats : any) : any => {
    let tableHeaders : string[] = ["Position", "Player", "Team"];
    statNames.map((stat:string) => tableHeaders.push(stat));
    tableHeaders.push("Fantasy Score");
    let tableBody : any[] = [];
    let playerMap = getSpecificPlayerMap(stats, players);
    let totals : number[] = [];
    statNames.map(() => totals.push(0));
    totals.push(0);
    for (let i = 0; i < players.length; i++) {
        let playerPosition = "";
        // is Forward
        if (i === 0 || i === 1) {
            playerPosition = "Forward";
            // is Mid
        } else if (i === 2 || i === 3) {
            playerPosition = "Mid";
            // is Defense
        } else {
            playerPosition = "Defense";
        }
        if (!players[i]) {
            tableBody.push(
                <tr key={"undefined" + i}>
                    <td>{playerPosition}</td>
                    <td colSpan={2}>-</td>
                    <td colSpan={9}/>
                    <td>0</td>
                </tr>
            );
            continue;
        }
        let playerIndex = 0;
        for (let j = 0; j < playerMap.length; j++) {
            if (playerMap[j][0] === players[i]) {
                playerIndex = j;
                break;
            }
        }
        let player = playerMap[playerIndex];
        if (!player) {
            continue;
        }
        let statArr: any[] = [];
        let playerName = player[0];
        let playerScore = getPlayerScore(player, roundNum, playerPosition);
        let teamName = player[1]["Team"];
        let playerStats = player[1][roundNum];
        let statLabels = Object.keys(playerStats);
        statLabels.sort()
        for (let j = 0; j < statLabels.length; j++) {
            let statVal = playerStats[statLabels[j]];
            if (statVal === "&nbsp;" || statVal === "-") {
                statVal = "0"
            }
            totals[j] += parseInt(statVal)
            statArr.push(<td key={playerName + statLabels[j]}>{statVal}</td>);
        }
        totals[statLabels.length] += playerScore
        tableBody.push(
            <tr key={playerName}>
                <td>{playerPosition}</td>
                <td>{playerName}</td>
                <td>{teamName}</td>
                {statArr}
                <td>{playerScore}</td>
            </tr>
        )
    }
    return (
        <table>
            <thead>
                <tr>
                    {tableHeaders.map((header : string) => <th key={header}>{header}</th>)}
                </tr>
            </thead>
            <tbody>
                {tableBody}
                <tr id={"Total-Row"}>
                    <td colSpan={3}>Total {roundWithSpace(roundNum)} Scores</td>
                    {totals.map((val:number, index) => <td key={"Total" + index} className={index === totals.length - 1 ? "Highlight" : ""}>{val}</td>)}
                </tr>
            </tbody>
        </table>
    )
}

export const getRoundPlayerScores = (userTeam : any, roundSelected : string, stats : any) : number[] => {
    let playerScores : number[] = []
    positionArr.map((position : string, index) => playerScores.push(
        getPlayerScore(getSpecificPlayerMap(stats,
            [userTeam[roundSelected][index]])[0], roundSelected, position.slice(0, position.length - 1))
    ));
    return playerScores
}

export const getAllRoundScores = (userTeam : any, stats : any) : number[] => {
    let result : number[] = []
    let overallTotal : number = 0;
    for (let i = 0; i < justRounds.length; i++) {
        let roundTotal : number = 0;
        let playerScores : number[] = getRoundPlayerScores(userTeam, justRounds[i], stats);
        playerScores.map((score : number) => roundTotal += score);
        overallTotal += roundTotal;
        result.push(roundTotal);
    }
    result.push(overallTotal);
    return result
}


/**
 * Used in App to get the url pathname selected at the moment
 * (used because browsers auto load the last selected path on login and we want to
 * make sure the app state reflects the auto loaded state)
 */
export const getPath = () : string | undefined => {
    const pathname = window.location.pathname;
    const index = pathNames.indexOf(pathname);
    if (index !== -1) {
        return navTitles[index];
    }
}

/**
 * takes the raw stats from the firestore database and creates a map of players -> stats
 * @param stats = raw stats from firestore
 */
export const getPlayerMap = (stats : any) : any => {
    let allPlayers : any[] = [];
    let entries = Object.entries(stats)
    for (let i = 0; i < entries.length; i++) {
        let curEntry : any = entries[i];
        let players : any = Object.entries(curEntry[1]['Players']);
        players.map((player:any) => allPlayers.push(player));
    }
    return allPlayers;
}


export const getSpecificPlayerMap = (stats : any, includedPlayers : (string | null)[]) => {
    let allPlayers : any[] = [];
    let entries = Object.entries(stats)
    for (let i = 0; i < entries.length; i++) {
        let curEntry : any = entries[i];
        let players : any = Object.entries(curEntry[1]['Players']);
        for (let j = 0; j < players.length; j++) {
            let player = players[j]
            if (includedPlayers.includes(player[0])) {
                allPlayers.push(player)
            }
        }
    }
    if (allPlayers.length === 0) {
        return [null];
    }
    return allPlayers;
}

/**
 * a custom sorting function to sort the playerMap
 * @param roundNum = string representation of the round number (also accepts Total)
 * @param position
 */
export const sortByScore = (roundNum : string, position : string) : any => {
    return function (playerA: any, playerB: any) {
        let playerAVal = getPlayerScore(playerA, roundNum, position);
        let playerBVal = getPlayerScore(playerB, roundNum, position);
        return playerBVal - playerAVal;
    }
}

/**
 * Helper function to get a player's score in @param roundNum.
 * @param player
 * @param roundNum
 * @param position
 */
export const getPlayerScore = (player : any, roundNum : string, position : string) : number => {
    if (!player) {
        return 0;
    }
    let stats : any = player[1][roundNum];
    const statLabels = Object.keys(stats);
    let score: number = 0;
    for (let i = 0; i < statLabels.length; i++) {
        let statVal = stats[statLabels[i]];
        let statTitle = statLabels[i].replace(/\s/g, '');
        if (statVal === "&nbsp;" || statVal === "-") {
            statVal = "0"
        }
        const mult = statScores[statTitle] + positionToScoreMap[position][statTitle];
        score += mult * statVal;
    }
    return score;
}

/**
 *
 */
export const filterByTeam = (player : any) : boolean => {
    return false;
}

/**
 * checks for players that have the same name in the AFL and modifies them to be different.
 * Unused because implemented in python web scraping code
 * Sam Reid -> Sam J Reid
 * Tom Lynch -> Tom J Lynch
 * Josh Kennedy -> Josh J Kennedy & Josh P Kennedy
 */
export const checkDoubleNames = (playerName : string, teamName : string) : string => {
    if (teamName === 'Sydney' && playerName === 'Kennedy, Josh') {
        return 'Kennedy, Josh P.'
    }
    if (teamName === 'West Coast' && playerName === 'Kennedy, Josh') {
        return 'Kennedy, Josh J.'
    }
    if (teamName === 'Greater Western Sydney' && playerName === 'Reid, Sam') {
        return 'Reid, Sam J.'
    }
    if (teamName === 'Richmond' && playerName === 'Lynch, Tom') {
        return 'Lynch, Tom J.'
    }
    return playerName
}

/**
 * checks if two arrays are equal. Code from: https://flexiple.com/javascript-array-equality/
 * @param arrayA
 * @param arrayB
 */
export const arrayEquals = (arrayA : any[], arrayB : any[]) : boolean => {
    return Array.isArray(arrayA) &&
        Array.isArray(arrayB) &&
        arrayA.length === arrayB.length &&
        arrayA.every((val, index) => val === arrayB[index]);
}

/**
 * Gets an empty team formatted into an array of players for each round
 */
export const getEmptyTeam = () => {
    let team : any = {};
    for (let i = 0; i < justRounds.length; i++) {
        team[justRounds[i]] = emptyTeam;
    }
    return team;
}

/**
 *
 */
export const roundWithSpace = (roundNum:string) => {
    if (roundNum.length > 5) {
        return roundNum.slice(0, 5) + " " + roundNum.slice(5);
    } else {
        return roundNum;
    }
}

/**
 *
 */
export const formatName = (playerName : string) => {
    let playerSplit = playerName.split(",");
    return playerSplit[1] + " " + playerSplit[0];
}


/**
 * Constants:
 */
// Max input length for all input fields
export const MAX_INPUT_LEN = 48;

// Min input length for signing up
export const MIN_INPUT_LEN = 4;

// Titles of the nav bar
export const navTitles = ["View Team", "Pick Players", "Player Leaderboard", "Leagues", "Info"];

// Associated names of the url path
export const pathNames = ["/", "/pick-players", "/player-leaderboard", "/view-league", "/info"];

// Names of statistics
export const statNames : string[] = ["Behinds", "Clearances", "Contested Marks", "Disposals", "Goal Assists", "Goals", "Marks", "One Percenters", "Tackles"];

// Round options
// TODO: change this dynamically
export const roundOptions : string[] = ["Round1", "Round2", "Round3", "Round4", "Round5", "Round6", "Round7", "Round8", "Total"];

// Just the rounds
export const justRounds : string[] = roundOptions.slice(0, roundOptions.length - 1);

// Last round that has been fully played
export const lastRound : string = justRounds[justRounds.length - 1];

// Current round
export const currentRound : string = lastRound.slice(0, 5) + (parseInt(lastRound.slice(5)) + 1)

// Next round date
// TODO: change this dynamically
export const nextRoundDate = 'April 30, 2021 2:50:00';

// Full null team
export const emptyTeam : (string | null)[] = [null, null, null, null, null, null];

// Positions for players
export const playerPositions : string[] = ["Forward", "Mid", "Defense"];

// Positions for picking players
export const positionArr : string[] = ['ForwardL', 'ForwardR', 'MidL', 'MidR', 'DefenseL', 'DefenseR'];

// General point values for stats
export const statScores : any = {
    Behinds: 10,
    Clearances: 10,
    ContestedMarks: 20,
    Disposals: 4,
    GoalAssists: 20,
    Goals: 60,
    Marks: 10,
    OnePercenters: 10,
    Tackles: 10,
};

// Additional points earned by forwards
export const forwardStatAdditions : any = {
    Behinds: 5,
    Clearances: 0,
    ContestedMarks: 0,
    Disposals: 0,
    GoalAssists: 0,
    Goals: 30,
    Marks: 0,
    OnePercenters: 0,
    Tackles: 0,
}

// Additional points earned by mids
export const midStatAdditions : any = {
    Behinds: 0,
    Clearances: 0,
    ContestedMarks: 0,
    Disposals: 2,
    GoalAssists: 10,
    Goals: 0,
    Marks: 0,
    OnePercenters: 0,
    Tackles: 0,
}

// Additional points earned by defenders
export const defenseStatAdditions : any = {
    Behinds: 0,
    Clearances: 5,
    ContestedMarks: 10,
    Disposals: 0,
    GoalAssists: 0,
    Goals: 0,
    Marks: 0,
    OnePercenters: 5,
    Tackles: 0,
}

export const positionToScoreMap : any = {
    "Forward" : forwardStatAdditions,
    "Mid" : midStatAdditions,
    "Defense" : defenseStatAdditions
}

