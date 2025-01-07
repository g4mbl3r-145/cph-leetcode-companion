"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTestCases = void 0;
const puppeteer_1 = __importDefault(require("puppeteer"));
const promises_1 = __importDefault(require("fs/promises"));
const getTestCases = async (url) => {
    const browser = await puppeteer_1.default.launch({
        headless: false,
        defaultViewport: null,
    });
    const page = await browser.newPage();
    try {
        await page.goto(url, {
            waitUntil: "domcontentloaded",
        });
        await page.waitForSelector(".elfjS", { timeout: 5000 });
        const content = await page.evaluate(() => {
            const element = document.querySelector(".elfjS");
            return element ? element.innerText : "Element not found";
        });
        console.log("Content of .elfjS:", content);
        const inputRegex = /Input:\s*(.*?)(?=Output:|$)/gs;
        const outputRegex = /Output:\s*(.*?)(?=Explanation:|Example|Constraints:|$)/gs;
        const inputs = [];
        const outputs = [];
        let inputMatch;
        while ((inputMatch = inputRegex.exec(content)) !== null) {
            inputs.push(inputMatch[1].trim());
        }
        let outputMatch;
        while ((outputMatch = outputRegex.exec(content)) !== null) {
            outputs.push(outputMatch[1].trim());
        }
        await promises_1.default.writeFile('inputs.txt', inputs.join('\n\n'), 'utf8');
        console.log('Inputs written to inputs.txt');
        await promises_1.default.writeFile('outputs.txt', outputs.join('\n\n'), 'utf8');
        console.log('Outputs written to outputs.txt');
    }
    catch (error) {
        console.error("Error during scraping:", error.message);
    }
    finally {
        await browser.close();
    }
};
exports.getTestCases = getTestCases;
//# sourceMappingURL=fetchTestCase.js.map