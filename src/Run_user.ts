import { exec } from 'child_process';
import * as fs from 'fs';
import * as vscode from 'vscode';

async function runUserCode(
    filePath: vscode.Uri,
    inputPath: vscode.Uri,
    language: string
): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        const outputPath = `${filePath.fsPath}.output`; // Temporary output file

        let command: string;
        switch (language) {
            case "C++":
                command = `g++ "${filePath.fsPath}" -o "${filePath.fsPath}.exe" && "${filePath.fsPath}.exe" < "${inputPath.fsPath}" > "${outputPath}"`;
                break;
            case "Python":
                command = `python "${filePath.fsPath}" < "${inputPath.fsPath}" > "${outputPath}"`;
                break;
            
            case "JavaScript":
                command = `node "${filePath.fsPath}" < "${inputPath.fsPath}" > "${outputPath}"`;
                break;
            default:
                reject(new Error("Unsupported language"));
                return;
        }

        exec(command, (error) => {
            if (error) {
                reject(error);
                return;
            }
            const programOutput = fs.readFileSync(outputPath, 'utf8').trim();
            resolve(programOutput); // Return the program's output
        });
    });
}

function compareOutputs(programOutput: string, expectedOutputPath: vscode.Uri): boolean {
    const expectedOutput = fs.readFileSync(expectedOutputPath.fsPath, 'utf8').trim();
    return programOutput === expectedOutput;
}
