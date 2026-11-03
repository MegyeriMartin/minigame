// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { afterEach, describe, expect, it } from "vitest";
import Board from "./Board.jsx";

afterEach(cleanup);

function playMove(squares, index, player) {
    if (player === "O") {
        fireEvent.contextMenu(squares[index]);
    } else {
        fireEvent.click(squares[index]);
    }
}

describe("Board", () => {
    it("renders a 3-by-3 board with empty squares", () => {
        const { container } = render(<Board />);
        const squares = container.querySelectorAll(".square");

        expect(squares).toHaveLength(9);
        expect([...squares].map((square) => square.textContent)).toEqual(
            Array(9).fill(""),
        );
    });

    it("alternates players and ignores consecutive moves by the same player", () => {
        const { container } = render(<Board />);
        const squares = container.querySelectorAll(".square");

        fireEvent.click(squares[0]);
        fireEvent.click(squares[1]);
        expect(squares[1]).toHaveTextContent("");

        playMove(squares, 1, "O");
        playMove(squares, 2, "X");

        expect([...squares].slice(0, 3).map((square) => square.textContent)).toEqual([
            "X",
            "O",
            "X",
        ]);
    });

    it("shows the winner and updates the win score", () => {
        const { container } = render(<Board />);
        const squares = container.querySelectorAll(".square");
        const moves = [
            [0, "X"],
            [3, "O"],
            [1, "X"],
            [4, "O"],
            [2, "X"],
        ];

        moves.forEach(([index, player]) => playMove(squares, index, player));

        expect(screen.getByText("A nyertes: X!")).toBeInTheDocument();
        expect([...container.querySelectorAll(".score strong")].map((score) => score.textContent)).toEqual([
            "1",
            "0",
            "0",
        ]);
    });

    it("shows a draw and updates the draw score", () => {
        const { container } = render(<Board />);
        const squares = container.querySelectorAll(".square");
        const moves = [
            [0, "X"],
            [1, "O"],
            [2, "X"],
            [4, "O"],
            [3, "X"],
            [5, "O"],
            [7, "X"],
            [6, "O"],
            [8, "X"],
        ];

        moves.forEach(([index, player]) => playMove(squares, index, player));

        expect(screen.getByText("Döntetlen!")).toBeInTheDocument();
        expect([...container.querySelectorAll(".score strong")].map((score) => score.textContent)).toEqual([
            "0",
            "0",
            "1",
        ]);
    });
});
