"use server";

import puppeteer from "puppeteer";

export async function getTheatrePieces(url) {
    const rootUrl = "https://www.theatre-classique.fr/pages/programmes/";
    const piecesFields = ["author", "title", "date", "genre"];

    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        await page.goto(url);

        // Select all table rows elements
        const theatreTable = await page.$("tbody");
        const tableRow = await theatreTable.$("tr");
        const allTableRows = [tableRow];

        const theatrePieces = [];

        // Iterate over each table row element
        for (const tableRow of allTableRows) {
            // Select all children td elements of the current tr element
            const tableData = await tableRow.$$("td");
            const theatrePiecesInfos = {};

            // Process each table data element
            let index = 0;
            for (const data of tableData) {
                // Extract text content or other information from td elements
                const textContent = await page.evaluate(td => td.textContent.trim(), data);
                const substrings = ["HTML", "TXT", "PDF", "V. O.", "XML"];
                const includesSubstring = substrings.some(substring => textContent.includes(substring));

                if (!includesSubstring) {
                    theatrePiecesInfos[piecesFields[index]] = textContent;
                    index++;
                } else if (textContent.includes("HTML")) {
                    let href = await page.evaluate(td => {
                        const anchor = td.querySelector('a');
                        return anchor ? anchor.getAttribute('href') : null;
                    }, data);

                    if (href) {
                        if (href.startsWith('.')) {
                            href = href.slice(1);
                        }

                        const playUrl = rootUrl + href;
                        const charactersObj = {};
                        const playActs = {};

                        // Go to the play page
                        await page.goto(playUrl);

                        // Get each play's characters
                        const playCharacters = await page.$$(".distribution");
                        for (const character of playCharacters) {
                            const characterContent = await page.evaluate(p => p.textContent.trim(), character);
                            const splitCharText = characterContent.split(",");
                            const characterObj = {
                                name: splitCharText[0]?.trim(),
                                role: splitCharText[1]?.trim().replace(".", "") || "None"
                            };
                            charactersObj[characterObj.name] = characterObj;
                        }
                        console.log("characters:", charactersObj);
                    }
                }
            }
            theatrePieces.push(theatrePiecesInfos);
        }

        await browser.close();

        if (theatrePieces.length > 0) {
            return { success: true, theatrePieces };
        } else {
            throw new Error("Theatre pieces not found");
        }
    } catch (error) {
        console.error("getTheatrePieces error:", error);
        return { success: false, message: error.message };
    }
}
