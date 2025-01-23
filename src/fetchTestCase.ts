import puppeteer from 'puppeteer';
import * as vscode from 'vscode';
import fs from 'fs/promises';
import path from 'path';
import { stringify } from 'querystring';

export let inputFileName: string | undefined;
export let outputFileName: string | undefined;
// export const newInputArray: string[] = [];
// export const newOutputArray: string[] = [];
let Brackets: number[][] = [];


export const getTestCases = async (url: string): Promise<void> => {
  Brackets = [];
  const inputsBracketCounts: number[][] = [];
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
      const cleanedInput = cleanInput(inputMatch[1].trim(), inputsBracketCounts);
      inputs.push(cleanedInput);

      // Split the cleaned input by two consecutive newlines and add each example to the array
      // newInputArray.push(...cleanedInput.split(/\n\n+/).map(part => part.trim()));
    }

   for(let i=0;i<inputsBracketCounts.length;++i){
    console.log("Bracket counts for each input:", inputsBracketCounts[i]);

   }

    console.log("Bracket counts for each input:", inputsBracketCounts);

    let outputMatch: RegExpExecArray | null;
    while ((outputMatch = outputRegex.exec(content)) !== null) {
      const cleanedOutput=cleanOutput(outputMatch[1].trim());
      outputs.push(cleanedOutput);

      // newOutputArray.push(...cleanedOutput.split(/\n\n+/).map(part => part.trim()));
      
    }


    for(let i=0;i<inputsBracketCounts.length;++i){
      console.log("Bracket counts for each input:", inputsBracketCounts[i]);
  
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
   const inputlength=inputs.length;
   console.log("inputlength: ",inputlength);
    // Write inputs file if it doesn't exist
    
    // Initialize Brackets array with the correct length
    for (let i = 0; i < inputlength; i++) {
      Brackets.push([]);
    }
    const final: string[] = [];


    let r = 0;
    for (let j = 0; j < inputsBracketCounts.length; j +=(inputsBracketCounts.length)/inputlength) {
      for (let i = j; i < j + (inputsBracketCounts.length)/inputlength; ++i) {

        if (!Brackets[r]) {
          Brackets[r] = []; // Ensure Brackets[r] is initialized
        }
        if (inputsBracketCounts[i]) {
          for (let k = 0; k < inputsBracketCounts[i].length; ++k) {
            Brackets[r].push(inputsBracketCounts[i][k]);
          }
        }
      }

      // Only push non-empty arrays
      if (Brackets[r].length > 0) {
        ++r;
      } else {
        Brackets.pop();
      }
    }
    
    for(let i=0;i<Brackets.length;++i){
      let s: string = "" ;
      for(let j=0;j<Brackets[i].length;++j){
              let ck = (Brackets[i][j]).toString();
              s+=ck;
              s+=" ";
      }
      if (s) {
        s+="\n";
      }
      s+=inputs[i];
      final.push(s);
    }


    console.log("Brackets",Brackets);
      await fs.writeFile(inputsFilePath, final.join('\n\n'), 'utf8');
      
      // const inputlength=((await fs.readFile(inputsFilePath,'utf8')).split('\n\n')).length;
      // for(let i=0;i<inputlength;++i){

      // }

      
      console.log(`Inputs written to ${inputsFilePath}`);
      const inputsDoc = await vscode.workspace.openTextDocument(inputsFilePath);
      await vscode.window.showTextDocument(inputsDoc);
    

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

function cleanInput(rawData: string, inputsBracketCounts: number[][]): string {
  // Split the input at any variable name followed by = and filter out empty parts
  let vectorCount = 0; // Counter for vectors
  let matrixCount = 0; // Counter for matrices
  let cleaned = rawData
    .split(/\b[a-zA-Z_0-9]+\s*=\s*/) // Split at variable assignment
    .filter(part => part.trim() !== "") // Remove empty parts
    .map(part => {
      part = part.trim();

      // Calculate row and column counts for this part
      // calculateRowColumnCounts(part);

      if (/\],\[/g.test(part)) {
        // It's a matrix if ],[ is found
        matrixCount++;
        console.log("Matrix detected:", part);
        calculateRowColumnCounts(part, true, inputsBracketCounts);

        // Replace ],[ with newlines for better readability
        part = part.replace(/\],\[/g, '\n');
      } else if (/[\[\]]/g.test(part)) {
        // It's a vector if no nested structure is found
        vectorCount++;
        console.log("Vector detected:", part);
        calculateRowColumnCounts(part, false, inputsBracketCounts);

      }
      return part
      .replace(/\],\[/g, '\n') // Replace ],[ with a newline
      .replace(/"/g, '') // Remove double quotes
        .replace(/[\[\]]/g, '') // Remove brackets
        .replace(/,/g, ' '); // Replace commas with spaces
    })
    .join('\n');

    console.log("Count:", matrixCount, vectorCount);
  return cleaned;
}

function cleanOutput(rawData: string): string {
  // Split the input at any variable name followed by = and filter out empty parts
  let vectorCount = 0; // Counter for vectors
  let matrixCount = 0; // Counter for matrices
  let cleaned = rawData
    .split(/\b[a-zA-Z_0-9]+\s*=\s*/) // Split at variable assignment
    .filter(part => part.trim() !== "") // Remove empty parts
    .map(part => {
      part = part.trim();
      return part
      .replace(/\],\[/g, '\n') // Replace ],[ with a newline
      .replace(/"/g, '') // Remove double quotes
        .replace(/[\[\]]/g, '') // Remove brackets
        .replace(/,/g, ' '); // Replace commas with spaces
    })
    .join('\n');

    console.log("Count:", matrixCount, vectorCount);
  return cleaned;
}


/**
 * Function to calculate and store the number of rows and columns
 * for each example input in a 2D array format.
 */
function calculateRowColumnCounts(exampleData: string, isMatrix: boolean, inputsBracketCounts: number[][]): void {
  // Extract the main array structure using a regex
  const arrayDataMatch = exampleData.match(/\[.*\]/s); // Matches everything inside the outermost brackets
  if (!arrayDataMatch) {
    // inputsBracketCounts.push([0, 0]); // Push [0, 0] if no valid array structure found
    return;
  }

  const arrayData = arrayDataMatch[0];
  

  // Split into rows by matching inner arrays
  const rows = arrayData.match(/\[.*?\]/g) || [];
  const rowCount = rows.length;
console.log(rows);
  // Determine the column count for each row (assuming uniform structure)
  let columnCount = 0;
  if (rowCount === 1 && rows[0] === '[]') {
    // Handle the case where it's a single empty row `[]`
    columnCount = 0;
  } else if (rows.length > 0) {
    // Determine the column count for the first row (assuming uniform structure)
    columnCount = rows[0] ? (rows[0].match(/,/g) || []).length + 1 : 0;
  }
  console.log(columnCount);
  
  if (isMatrix){
    inputsBracketCounts.push([rowCount, columnCount]);
  } else {
    inputsBracketCounts.push([columnCount]);
  }

}

