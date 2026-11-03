// @ts-check
import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
    await page.goto("/");
});
test("the board has 9 squares", async ({ page }) => {
    const squares = page.locator(".square");
    await expect(squares).toHaveCount(9);
});
test("players take turns", async ({ page }) => {
    const squares = page.locator(".square");
    let texts;

    await squares.nth(0).click();
    texts = await squares.nth(0).textContent();
    expect(texts).toEqual("X");
    await squares.nth(1).click({ button: "right" });
    texts = await squares.nth(1).textContent();
    expect(texts).toEqual("O");
});

test("highlights the last played square", async ({ page }) => {
    const squares = page.locator(".square");

    await squares.nth(0).click();

    await expect(squares.nth(0)).toHaveClass(/lastcell/);
});

test("shows the winner and updates the win score", async ({ page }) => {
    const squares = page.locator(".square");
    const moves = [
        [0, "X"],
        [3, "O"],
        [1, "X"],
        [4, "O"],
        [2, "X"],
    ];

    for (const [index, player] of moves) {
        await squares.nth(index).click(player === "O" ? { button: "right" } : undefined);
    }

    await expect(page.getByText("A nyertes: X!")).toBeVisible();
    await expect(page.locator(".score strong").nth(0)).toHaveText("1");
});

test("shows a draw and updates the draw score", async ({ page }) => {
    const squares = page.locator(".square");
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

    for (const [index, player] of moves) {
        await squares.nth(index).click(player === "O" ? { button: "right" } : undefined);
    }

    await expect(page.getByText("Döntetlen!")).toBeVisible();
    await expect(page.locator(".score strong").nth(2)).toHaveText("1");
});

test("starts a new game without clearing the score", async ({ page }) => {
    const squares = page.locator(".square");
    const winningMoves = [
        [0, "X"],
        [3, "O"],
        [1, "X"],
        [4, "O"],
        [2, "X"],
    ];

    for (const [index, player] of winningMoves) {
        await squares.nth(index).click(player === "O" ? { button: "right" } : undefined);
    }

    await page.getByRole("button", { name: "Új játék" }).click();

    await expect(squares).toHaveText(Array(9).fill(""));
    await expect(page.getByText("A nyertes: X!")).toHaveCount(0);
    await expect(page.locator(".score strong").nth(0)).toHaveText("1");
    await expect(squares.nth(0)).not.toHaveClass(/lastcell/);
});

test("undoes the previous move and restores that player's turn", async ({ page }) => {
    const squares = page.locator(".square");

    await squares.nth(0).click();
    await squares.nth(1).click({ button: "right" });
    await page.getByRole("button", { name: "Vissza" }).click();

    await expect(squares.nth(1)).toHaveText("");
    await squares.nth(1).click({ button: "right" });
    await expect(squares.nth(1)).toHaveText("O");
});
