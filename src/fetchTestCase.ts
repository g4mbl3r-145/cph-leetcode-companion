import puppeteer from 'puppeteer';
import * as vscode from 'vscode';
import fs from 'fs/promises';
import path from 'path';

export const getTestCases = async (url: string): Promise<void> => {
  console.log("Launching browser");
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
  });

  const page = await browser.newPage();

  try {
    console.log("Navigating to URL:", url);
    await page.goto(url, {
      waitUntil: "domcontentloaded",
    });

    console.log("Waiting for selector .elfjS");
    await page.waitForSelector(".elfjS", { timeout: 5000 });

    console.log("Evaluating page content");
    const content = await page.evaluate(() => {
      const element = document.querySelector(".elfjS");
      return (element as HTMLElement) ? (element as HTMLElement).innerText : "Element not found";
    });

    console.log("Content of .elfjS:", content);

    const inputRegex = /Input:\s*(.*?)(?=Output:|$)/gs;
    const outputRegex = /Output:\s*(.*?)(?=Explanation:|Example|Constraints:|$)/gs;

    const inputs: string[] = [];
    const outputs: string[] = [];

    let inputMatch: RegExpExecArray | null;
    while ((inputMatch = inputRegex.exec(content)) !== null) {
      inputs.push(cleanInput(inputMatch[1].trim()));
    }

    let outputMatch: RegExpExecArray | null;
    while ((outputMatch = outputRegex.exec(content)) !== null) {
      outputs.push(cleanInput(outputMatch[1].trim()));
    }

    const problemNameMatch = url.match(/leetcode\.com\/problems\/([a-zA-Z0-9-]+)/);
    if (!problemNameMatch) {
      vscode.window.showErrorMessage("Unable to extract problem name from URL");
      console.log("Invalid URL format");
      return;
    }
    const problemName = problemNameMatch[1];
    console.log("Extracted problem name:", problemName);

    const workspacePath = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
    if (!workspacePath) {
      vscode.window.showErrorMessage("No workspace folder found. Please open a folder in VS Code.");
      console.log("No workspace folder");
      return;
    }

    const inputsFilePath = path.join(workspacePath, `inputs-${problemName}.txt`);
    const outputsFilePath = path.join(workspacePath, `outputs-${problemName}.txt`);

    const inputsFileExists = await fileExists(inputsFilePath);
    const outputsFileExists = await fileExists(outputsFilePath);

    if (inputsFileExists && outputsFileExists) {
      vscode.window.showInformationMessage(`Test cases for \"${problemName}\" already exist.`);
      console.log(`Test cases for \"${problemName}\" already exist: ${inputsFilePath}, ${outputsFilePath}`);
      return;
    }

    if (!inputsFileExists) {
      await fs.writeFile(inputsFilePath, inputs.join('\n'), 'utf8');
      console.log(`Inputs written to ${inputsFilePath}`);
    }

    if (!outputsFileExists) {
      await fs.writeFile(outputsFilePath, outputs.join('\n'), 'utf8');
      console.log(`Outputs written to ${outputsFilePath}`);
    }

    vscode.window.showInformationMessage(`Test cases have been successfully written for \"${problemName}\" in the workspace folder.`);
  } catch (error: any) {
    console.error("Error during scraping:", error.message);
    vscode.window.showErrorMessage(`Error fetching test cases: ${error.message}`);
  } finally {
    console.log("Closing browser");
    await browser.close();
  }
};

// Helper function to check if a file exists
async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

// Normalization function for cleaning inputs and outputs
function cleanInput(rawData: string): string {
  let cleanedArray = rawData
    .split(/\b[a-zA-Z_0-9]+\s*=\s*/) // Split at variable assignment
    .filter(part => part.trim() !== "") // Remove empty parts
    .map(part => part.trim()) // Trim each part
    .map(part => part
      .replace(/"/g, '') // Remove double quotes
      .replace(/[\[\]]/g, '') // Remove brackets
      .replace(/,/g, ' ') // Replace commas with spaces
    );

  let cleaned = cleanedArray.join('\n');
  return cleaned;
}
