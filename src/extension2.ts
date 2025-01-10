// import * as vscode from 'vscode';
// import { exec } from 'child_process';
// import * as fs from 'fs/promises';
// import * as path from 'path';
// import { getTestCases } from './fetchTestCase';
// import { inputFileName, outputFileName } from './fetchTestCase';

// export function activate(context: vscode.ExtensionContext) {
//     console.log('Activating extension "cph-leetcode"');

//     const fetchTestCasesCommand = vscode.commands.registerCommand('cph-leetcode.getTestCases', async () => {
//         console.log('Command "cph-leetcode.getTestCases" triggered');

//         const url = await vscode.window.showInputBox({
//             placeHolder: "Enter the URL of the Leetcode problem",
//             validateInput: (input: string) => {
//                 const regex = /^(https?:\/\/)(www\.)?leetcode\.com\/problems\/[a-zA-Z0-9-]+(\/.*)?$/;
//                 return regex.test(input) ? null : 'Please enter a valid LeetCode problem URL';
//             },
//         });

//         if (!url) {
//             vscode.window.showErrorMessage("URL is required");
//             console.log("No URL provided");
//             return;
//         }

//         const problemNameMatch = url.match(/leetcode\.com\/problems\/([a-zA-Z0-9-]+)/);
//         if (!problemNameMatch) {
//             vscode.window.showErrorMessage("Unable to extract problem name from URL");
//             console.log("Invalid URL format");
//             return;
//         }
//         const problemName = problemNameMatch[1];
//         console.log("Extracted problem name:", problemName);

//         const languages = ["C++", "Python", "JavaScript"];
//         const selectedLanguage = await vscode.window.showQuickPick(languages, {
//             placeHolder: "Select a programming language",
//         });

//         if (!selectedLanguage) {
//             vscode.window.showErrorMessage("Language selection is required");
//             console.log("No language selected");
//             return;
//         }

//         try {
//             console.log("Fetching test cases for URL:", url);
//             await getTestCases(url);
//             vscode.window.showInformationMessage("Test cases fetched successfully!");

//             const workspacePath = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
//             if (!workspacePath) {
//                 vscode.window.showErrorMessage("No workspace folder found. Please open a folder in VS Code.");
//                 console.log("No workspace folder");
//                 return;
//             }

//             const fileExtension = getFileExtension(selectedLanguage);
//             const fileName = `${problemName}.${fileExtension}`;
//             const filePath = path.join(workspacePath, fileName);
//             const inputFiles = await vscode.workspace.findFiles('**/inputFileName', '**/node_modules/**', 1);
//             const inputFileUri = inputFiles[0];
//             const folderPath = vscode.Uri.joinPath(inputFileUri, '..');

            
//             // Check if the file already exists
//             try {
//                 await fs.access(filePath);
//                 console.log("File already exists, opening:", fileName);

//                 // Open the existing file
//                 const document = await vscode.workspace.openTextDocument(filePath);
//                 await vscode.window.showTextDocument(document);
//             } catch {
//                 console.log("File does not exist, creating:", fileName);

//                 // Create the file with starter code if it does not exist
//                 const starterCode = getStarterCode(selectedLanguage);
//                 await fs.writeFile(filePath, starterCode, 'utf8');
//                 const document = await vscode.workspace.openTextDocument(filePath);
//                 await vscode.window.showTextDocument(document);
//             }

//             // **********************
//         } catch (error: any) {
//             vscode.window.showErrorMessage(`Error fetching test cases: ${error.message}`);
//             console.error("Error fetching test cases:", error.message);
//         }
//     });

//     const runAndCompareCommand = vscode.commands.registerCommand('cph-leetcode.runAndCompare', async () => {
//         console.log('Command "cph-leetcode.runAndCompare" triggered');
//         try {
//             const inputFiles = await vscode.workspace.findFiles('**/inputFileName', '**/node_modules/**', 1);
//             const outputFiles = await vscode.workspace.findFiles('**/outputFileName', '**/node_modules/**', 1);

//             if (inputFiles.length === 0 || outputFiles.length === 0) {
//                 vscode.window.showErrorMessage("inputFileName or outputFileName file not found in the workspace.");
//                 console.log("inputFileName or outputFileName file not found");
//                 return;
//             }

//             const inputFilePath = inputFiles[0].fsPath;
//             const outputFilePath = outputFiles[0].fsPath;

//             const activeEditor = vscode.window.activeTextEditor;
//             if (!activeEditor) {
//                 vscode.window.showErrorMessage("No active editor found.");
//                 console.log("No active editor found");
//                 return;
//             }

//             const language = getLanguageFromExtension(activeEditor.document.languageId);
//             console.log(activeEditor.document.languageId);
//             const filePath = activeEditor.document.uri.fsPath;

//             if (!language) {
//                 vscode.window.showErrorMessage("Unsupported language for execution.");
//                 console.log("Unsupported language for execution");
//                 return;
//             }

//             function normalizeOutput(output: string): string {
//                 return output
//                     .split(/\r?\n/) // Split into lines, handle different newline formats
//                     .map(line => line.trim()) // Trim spaces from each line
//                     .filter(line => line !== "") // Remove blank lines
//                     .join("\n"); // Join back with a consistent newline
//             }

//             const output = normalizeOutput(await runUserCode(filePath, inputFilePath, language));
//             const expectedOutput = normalizeOutput(await fs.readFile(outputFilePath, 'utf8'));

//             if (output === expectedOutput) {
//                 vscode.window.showInformationMessage("Test case passed!");
//                 console.log("Test case passed");
//             } else {
//                 vscode.window.showErrorMessage(`Test case failed.\nExpected:\n${expectedOutput}\n\nReceived:\n${output}`);
//                 console.log(`Test case failed.\nExpected:\n${expectedOutput}\n\nReceived:\n${output}`);
//             }
//         } catch (error: any) {
//             vscode.window.showErrorMessage(`Error: ${error.message}`);
//             console.error("Error:", error.message);
//         }
//     });

//     context.subscriptions.push(fetchTestCasesCommand, runAndCompareCommand);
//     console.log('Extension "cph-leetcode" activated');
// }

// async function runUserCode(filePath: string, inputFilePath: string, language: string): Promise<string> {
//     return new Promise<string>((resolve, reject) => {
//         const command = getRunCommand(filePath, inputFilePath, language);
//         if (!command) {
//             reject(new Error("Unsupported language"));
//             return;
//         }

//         exec(command, (error, stdout, stderr) => {
//             if (error || stderr) {
//                 reject(new Error(stderr));
//                 return;
//             }
//             resolve(stdout.trim());
//         });
//     });
// }

// function getRunCommand(filePath: string, inputFilePath: string, language: string): string | null {
//     switch (language) {
//         case "C++":
//             return `g++ "${filePath}" -o "${filePath}.exe" && "${filePath}.exe" < "${inputFilePath}"`;
//         case "Python":
//             return `python "${filePath}" < "${inputFilePath}"`;
//         case "JavaScript":
//             return `node "${filePath}" < "${inputFilePath}"`;
//         default:
//             return null;
//     }
// }

// function getFileExtension(language: string): string {
//     switch (language) {
//         case "C++": return "cpp";
//         case "Python": return "py";
//         case "JavaScript": return "js";
//         default: return "txt";
//     }
// }

// function getStarterCode(language: string): string {
//     switch (language) {
//         case "C++": return `#include <iostream>\nusing namespace std;\nint main() {\n    return 0;\n}`;
//         case "Python": return `# Write your code here\ndef main():\n    pass\n\nif __name__ == "__main__":\n    main()`;
//         case "JavaScript": return `function main() {\n}\nmain();`;
//         default: return "// Unsupported language";
//     }
// }

// function getLanguageFromExtension(extension: string): string | null {
//     switch (extension) {
//         case "cpp": return "C++";
//         case "python": return "Python";
//         case "js": return "JavaScript";
//         default: return null;
//     }
// }

// export function deactivate() {}
