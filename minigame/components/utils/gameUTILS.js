const WIN_POSITIONS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
];

export function win_check(newStatus) {
    return WIN_POSITIONS.some(
        ([first, second, third]) =>
            newStatus[first] && newStatus[first] === newStatus[second] && newStatus[first] === newStatus[third],
    );
}