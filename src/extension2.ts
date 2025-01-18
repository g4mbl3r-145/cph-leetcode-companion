import * as vscode from 'vscode';
import { exec } from 'child_process';
import * as fs from 'fs/promises';
import * as path from 'path';
import { getTestCases } from './fetchTestCase';
import { inputFileName, outputFileName } from './fetchTestCase';
// import{newInputArray} from './fetchTestCase';
// import{newOutputArray} from './fetchTestCase';
const outputChannel = vscode.window.createOutputChannel(`RUN cph-Leetcode program`);

export function activate(context: vscode.ExtensionContext) {
    console.log('Activating extension "cph-leetcode"');

    const fetchTestCasesCommand = vscode.commands.registerCommand('cph-leetcode.getTestCases', async () => {
        console.log('Command "cph-leetcode.getTestCases" triggered');
    
        const url = await vscode.window.showInputBox({
            placeHolder: "Enter the URL of the Leetcode problem",
            validateInput: (input: string) => {
                const regex = /^(https?:\/\/)(www\.)?leetcode\.com\/problems\/[a-zA-Z0-9-]+(\/.*)?$/;
                return regex.test(input) ? null : 'Please enter a valid LeetCode problem URL';
            },
        });
    
        if (!url) {
            vscode.window.showErrorMessage("URL is required");
            console.log("No URL provided");
            return;
        }
    
        const problemNameMatch = url.match(/leetcode\.com\/problems\/([a-zA-Z0-9-]+)/);
        if (!problemNameMatch) {
            vscode.window.showErrorMessage("Unable to extract problem name from URL");
            console.log("Invalid URL format");
            return;
        }
        const problemName = problemNameMatch[1]; 
        console.log("Extracted problem name:", problemName);
    
        const languages = ["C++", "Python"];
        const selectedLanguage = await vscode.window.showQuickPick(languages, {
            placeHolder: "Select a programming language",
        });
    
        if (!selectedLanguage) {
            vscode.window.showErrorMessage("Language selection is required");
            console.log("No language selected");
            return;
        }
    
        try {
            console.log("Fetching test cases for URL:", url);
            await getTestCases(url);
            vscode.window.showInformationMessage("Test cases fetched successfully!");
    
            const workspacePath = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
            console.log("workspacepath name is : ",workspacePath);

            if (!workspacePath) {
                vscode.window.showErrorMessage("No workspace folder found. Please open a folder in VS Code.");
                console.log("No workspace folder found");
                return;
            }
    
            const fileExtension = getFileExtension(selectedLanguage);
            const fileName = `${problemName}.${fileExtension}`;
            const filePath = path.join(workspacePath, fileName);
            console.log("filepath is : ",filePath);
            // Check if the file already exists
            try {
                await fs.access(filePath);
                console.log("File already exists, opening:  ", fileName);
    
                // Open the existing file
                const document = await vscode.workspace.openTextDocument(filePath);
                await vscode.window.showTextDocument(document);
            } catch {
                console.log("File does not exist, creating:", fileName);
    
                // Create the file with starter code if it does not exist
                const starterCode = getStarterCode(selectedLanguage);
                await fs.writeFile(filePath, starterCode, 'utf8');
                console.log(`File created: ${filePath}`);
                
                // Open the newly created file
                const document = await vscode.workspace.openTextDocument(filePath);
                await vscode.window.showTextDocument(document);
            }
        } catch (error: any) {
            vscode.window.showErrorMessage(`Error fetching test cases: ${error.message}`);
            console.error("Error fetching test cases:", error.message);
        }
    });
    ;

    const runAndCompareCommand = vscode.commands.registerCommand('cph-leetcode.runAndCompare', async () => {
        console.log('Command "cph-leetcode.runAndCompare" triggered');
        try {
            
            const activeEditor = vscode.window.activeTextEditor;
            // if(!activeEditor){
            //     return ;
            // }
            
            if (!activeEditor) {
                vscode.window.showErrorMessage("No active editor found.");
                console.log("No active editor found");
                return;
            }



            const inputpath=activeEditor.document.fileName;
            const inputdirpath=path.dirname(inputpath);
            const outputpath=activeEditor.document.fileName;
            const outputdirpath=path.dirname(outputpath);
            const probname=path.parse(inputpath).name;
            const inputproblemname= path.join(inputdirpath, path.parse(inputpath).name+'_inputs.txt');
            const outputproblemname= path.join(outputdirpath, path.parse(outputpath).name+'_outputs.txt');

            const inputread=(await fs.readFile(inputproblemname,'utf8')).split('\n\n');
            const outputread=(await fs.readFile(outputproblemname,'utf8')).split('\n\n');

           

            console.log("problem name: ",probname);

            const language = getLanguageFromExtension(activeEditor.document.languageId);
            console.log("activeEditor.document.languageId: ",activeEditor.document.languageId);
            const filePath = activeEditor.document.uri.fsPath;
 
            if (!language) {
                vscode.window.showErrorMessage("Unsupported language for execution.");
                console.log("Unsupported language for execution");
                return;
            }

            function normalizeOutput(output: string): string {
                return output
                    .split(/\r?\n/) // Split into lines, handle different newline formats
                    .map(line => line.trim()) // Trim spaces from each line
                     // Remove blank lines
                    .join("\n"); // Join back with a consistent newline
            }
            outputChannel.clear();  
            outputChannel.show(true);

             for (let i = 0; i < inputread.length; i++) {
                        const input = inputread[i].trim();
                        const expectedOutput = outputread[i]?.trim();
                        console.log(`Running test case ${i + 1}`);
                        console.log(`Input:\n${input}`);
                        console.log(`Expected Output:\n${expectedOutput}`);

                        
            
                        if (!expectedOutput) {
                            vscode.window.showWarningMessage(`Test case ${i + 1} does not have an expected output.`);
                            console.log(`Test case ${i + 1} skipped due to missing expected output.`);
                            continue;
                        }
            
                        try {
                            const userOutput = normalizeOutput(await runUserCode(filePath, input, language));
                            const normalizedExpectedOutput = normalizeOutput(expectedOutput);

                            outputChannel.appendLine('Input: ');
                            outputChannel.appendLine(input);
                            outputChannel.appendLine('Actual Output:');
                            outputChannel.appendLine(userOutput);
                            outputChannel.appendLine('Expected Output:');
                            outputChannel.appendLine(normalizedExpectedOutput);

                            if (userOutput === normalizedExpectedOutput) {
                                vscode.window.showInformationMessage(`Test case ${i + 1} passed.`);
                                console.log(`Test case ${i + 1} passed.`);
                                console.log("userOutput is ",userOutput);
                            } else {
                                vscode.window.showErrorMessage(`Test case ${i + 1} failed.\nExpected:\n${normalizedExpectedOutput}\n\nReceived:\n${userOutput}`);
                                console.log(`Test case ${i + 1} failed.\nExpected:\n${normalizedExpectedOutput}\n\nReceived:\n${userOutput}`);
                            }
                        } catch (error: any) {
                            vscode.window.showErrorMessage(`Error running test case ${i + 1}: ${error.message}`);
                            console.error(`Error running test case ${i + 1}:`, error.message);
                        }
                    }


            // const output = normalizeOutput(await runUserCode(filePath, inputFilePath, language));
            // const expectedOutput = normalizeOutput(await fs.readFile(outputFilePath, 'utf8'));
            
            // if (output === expectedOutput) {
            //     vscode.window.showInformationMessage("Test case passed!");
            //     console.log("Test case passed");
            // } else {
                
            //     vscode.window.showErrorMessage(`Test case failed.\nExpected:\n${expectedOutput}\n\nReceived:\n${output}`);
            //     console.log(`Test case failed.\nExpected:\n${expectedOutput}\n\nReceived:\n${output}`);
            // }
        } catch (error: any) {
            vscode.window.showErrorMessage(`Error: ${error.message}`);
            console.error("Error:", error.message);
        }
    });

    context.subscriptions.push(fetchTestCasesCommand, runAndCompareCommand);
    console.log('Extension "cph-leetcode" activated');
}

async function runUserCode(filePath: string, input: string, language: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        const command = getRunCommand(filePath, language);
        if (!command) {
            reject(new Error("Unsupported language"));
            return;
        }

        const child = exec(command, (error, stdout, stderr) => {
            if (error || stderr) {
                reject(new Error(stderr));
                return;
            }
            resolve(stdout.trim());
        });

        if (child.stdin) {
            child.stdin.write(input);
            child.stdin.end();
        }
    });
}
function getRunCommand(filePath: string, language: string): string | null {
    switch (language) {
        case "C++":
            return `g++ "${filePath}" -o "${filePath}.exe" && "${filePath}.exe"`;
        case "Python":
            return `python "${filePath}"`;
        // case "JavaScript":
        //     return `node "${filePath}"`;
        default:
            return null;
    }
}

function getFileExtension(language: string): string {
    switch (language) {
        case "C++": return "cpp";
        case "Python": return "py";
        // case "JavaScript": return "js";
        default: return "txt";
    }
}

function getStarterCode(language: string): string {
    switch (language) {
        case "C++": return `#include <iostream>\nusing namespace std;\nint main() {\n    return 0;\n}`;
        case "Python": return `# Write your code here\ndef main():\n    pass\n\nif __name__ == "__main__":\n    main()`;
        // case "JavaScript": return `function main() {\n}\nmain();`;
        default: return "// Unsupported language";
    }
}

function getLanguageFromExtension(extension: string): string | null {
    switch (extension) {
        case "cpp": return "C++";
        case "python": return "Python";
        // case "js": return "JavaScript";
        default: return null;
    }
}

export function deactivate() {}