/**
 * For App
 */

// Gets the current path
export const getPath = () : string | undefined => {
    const pathname = window.location.pathname;
    const index = pathNames.indexOf(pathname);
    if (index !== -1) {
        return navTitles[index];
    }
}

// checks for players that have the same name in the AFL and modifies them to be different
// Sam Reid -> Sam J Reid
// Tom Lynch -> Tom J Lynch
// Josh Kennedy -> Josh J Kennedy & Josh P Kennedy
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

// Titles of the nav bar
export const navTitles = ["View Team", "Pick Players", "Player Leaderboard", "League Standings", "Info"];

// Associated names of the url path
export const pathNames = ["/", "/pick-players", "/player-leaderboard", "/view-league", "/info"];

// Names of statistics
export const statNames : string[] = ["Behinds", "Clearances", "Contested Marks", "Disposals", "Goal Assists", "Goals", "Marks", "One Percenters", "Tackles"];

// Round options
export const roundOptions : string[] = ["Round1", "Round2", "Round3", "Round4", "Total"];

// Positions for players
export const playerPositions : string[] = ["Forward", "Mid", "Defense"];

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
