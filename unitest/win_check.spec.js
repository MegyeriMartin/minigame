import { describe, expect, it } from "@jest/globals";
import { win_check } from "../minigame/components/utils/gameUTILS.js";

const winningLines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
];

describe("win_check", () => {
    it.each(winningLines)("detects a win on cells %j", (line) => {
        const status = Array(9).fill(undefined);
        line.forEach((index) => {
            status[index] = "X";
        });

        expect(win_check(status)).toBe(true);
    });

    it("detects wins for either player", () => {
        expect(win_check(["O", "O", "O", undefined, "X", undefined, undefined, undefined, undefined])).toBe(true);
    });

    it.each([
        ["an empty board", Array(9).fill(undefined)],
        ["a partial matching line", ["X", "X", undefined, undefined, undefined, undefined, undefined, undefined, undefined]],
        ["a mixed line", ["X", "O", "X", undefined, undefined, undefined, undefined, undefined, undefined]],
        ["a full draw", ["X", "O", "X", "X", "O", "O", "O", "X", "X"]],
    ])("does not detect a win on %s", (_description, status) => {
        expect(win_check(status)).toBe(false);
    });
});
