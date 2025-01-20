import puppeteer from 'puppeteer';
import * as vscode from 'vscode';
import fs from 'fs/promises';
import path from 'path';

export let inputFileName: string | undefined;
export let outputFileName: string | undefined;
// export const newInputArray: string[] = [];
// export const newOutputArray: string[] = [];

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
      return (element as HTMLElement)?.innerText || "Element not found";
    });

    console.log("Content of .elfjS:", content);

    const inputRegex = /Input:\s*(.*?)(?=Output:|$)/gs;
    const outputRegex = /Output:\s*(.*?)(?=Explanation:|Example|Constraints:|$)/gs;

    const inputs: string[] = [];
    const outputs: string[] = [];

    
    let inputMatch: RegExpExecArray | null;
    while ((inputMatch = inputRegex.exec(content)) !== null) {
      const cleanedInput = cleanInput(inputMatch[1].trim());
      inputs.push(cleanedInput);

      // Split the cleaned input by two consecutive newlines and add each example to the array
      // newInputArray.push(...cleanedInput.split(/\n\n+/).map(part => part.trim()));
    }





    let outputMatch: RegExpExecArray | null;
    while ((outputMatch = outputRegex.exec(content)) !== null) {
      const cleanedOutput=cleanInput(outputMatch[1].trim());
      outputs.push(cleanedOutput);

      // newOutputArray.push(...cleanedOutput.split(/\n\n+/).map(part => part.trim()));
      
    }





    const problemNameMatch = url.match(/leetcode\.com\/problems\/([a-zA-Z0-9-]+)/);
    if (!problemNameMatch) {
      vscode.window.showErrorMessage("Unable to extract problem name from URL.");
      console.log("Invalid URL format");
      return;
    }

    const problemName = problemNameMatch[1];
    console.log("Extracted problem name:", problemName);

    const workspacePath = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
    if (!workspacePath) {
      vscode.window.showErrorMessage("No workspace folder found. Please open a folder in VS Code.");
      console.log("No workspace folder found");
      return;
    }

    const inputsFilePath = path.join(workspacePath, `${problemName}_inputs.txt`);
    const outputsFilePath = path.join(workspacePath, `${problemName}_outputs.txt`);
    // console.log("inputfiles :  ",inputsFilePath);
    inputFileName = `${problemName}_inputs.txt`;
    outputFileName = `${problemName}_outputs.txt`;

    // Check if input and output files already exist
    const inputsFileExists = await fileExists(inputsFilePath);
    const outputsFileExists = await fileExists(outputsFilePath);

    if (inputsFileExists && outputsFileExists) {
      console.log(`Files for problem "${problemName}" already exist.`);
      vscode.window.showInformationMessage(
        `Test case files for "${problemName}" already exist. Skipping file creation.`
      );
      return;
    }
   
    // Write inputs file if it doesn't exist
    if (!inputsFileExists) {
      await fs.writeFile(inputsFilePath, inputs.join('\n\n'), 'utf8');
      console.log(`Inputs written to ${inputsFilePath}`);
      const inputsDoc = await vscode.workspace.openTextDocument(inputsFilePath);
      await vscode.window.showTextDocument(inputsDoc);
    }

    // Write outputs file if it doesn't exist
    if (!outputsFileExists) {
      await fs.writeFile(outputsFilePath, outputs.join('\n\n'), 'utf8');
      console.log(`Outputs written to ${outputsFilePath}`);
      const outputsDoc = await vscode.workspace.openTextDocument(outputsFilePath);
      await vscode.window.showTextDocument(outputsDoc);
    }

    vscode.window.showInformationMessage(
      `Test cases successfully written to ${inputFileName} and ${outputFileName}`
    );
  } catch (error: any) {
    console.error("Error during scraping:", error.message);
    vscode.window.showErrorMessage(`Error fetching test cases: ${error.message}`);
  } finally {
    console.log("Closing browser");
    await browser.close();
  }
};

/**
 * Utility function to check if a file exists.
 */
async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

/**
 * Clean and normalize input/output strings.
 */
function cleanInput(rawData: string): string {
  // Split the input at any variable name followed by = and filter out empty parts
  let cleaned = rawData
    .split(/\b[a-zA-Z_0-9]+\s*=\s*/) // Split at variable assignment
    .filter(part => part.trim() !== "") // Remove empty parts
    .map(part => part.trim()) // Trim each part
    .map(part => part
      .replace(/"/g, '') // Remove double quotes
      .replace(/[\[\]]/g, '') // Remove brackets
      .replace(/,/g, ' ') // Replace commas with spaces
    ).join('\n');

  return cleaned;
}

