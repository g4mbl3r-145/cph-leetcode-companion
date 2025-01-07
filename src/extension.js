"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = __importStar(require("vscode"));
const fetchTestCase_1 = require("./fetchTestCase");
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
function activate(context) {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "cph-leetcode" is now active!');
    // The command has been defined in the package.json file
    // Now provide the implementation of the command with registerCommand
    // The commandId parameter must match the command field in package.json
    const disposable = vscode.commands.registerCommand('cph-leetcode.getTestCases', async () => {
        // The code you place here will be executed every time your command is executed
        // Display a message box to the user
        // vscode.window.showInformationMessage('Hello World from cph-leetcode!');
        const url = await vscode.window.showInputBox({
            placeHolder: "Enter the URL of the Leetcode problem",
            validateInput: (input) => {
                // Basic validation to ensure it's a valid URL (can be extended)
                const regex = /^(https?:\/\/)(www\.)?leetcode\.com\/problems\/[a-zA-Z0-9-]+\/?$/;
                return regex.test(input) ? null : 'Please enter a valid LeetCode problem URL';
            },
        });
        if (!url) {
            vscode.window.showErrorMessage("URL is required");
            return;
        }
        try {
            await (0, fetchTestCase_1.getTestCases)(url);
            vscode.window.showInformationMessage("Test cases fetched successfully!");
            console.log("Current Working Directory: ", process.cwd());
        }
        catch (error) {
            vscode.window.showErrorMessage(`Error fetching test cases: ${error.message}`);
        }
    });
    context.subscriptions.push(disposable);
}
// This method is called when your extension is deactivated
function deactivate() { }
//# sourceMappingURL=extension.js.map