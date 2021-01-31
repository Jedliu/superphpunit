// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
// const clipboardy = require('clipboardy');
const fs = require("fs");
const path = require("path");

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "superphpunit" is now active!');

	let disposable = vscode.commands.registerCommand('superphpunit.phpunit', async (folder) => {

		let activeTermOrNull = vscode.window.activeTerminal;
		if (activeTermOrNull === null || activeTermOrNull === undefined) {
			vscode.window.showErrorMessage('Please activate the vsc terminal to run the phpunit test!');
			return;
		}
		let activeTerm = activeTermOrNull;
		activeTerm.show(true);
		
		let editor = vscode.window.activeTextEditor;
		if (editor === null || editor === undefined) {
			vscode.window.showErrorMessage('Please select the test function name or active the selection on the editor!');
			return;
		}

		let selection = editor.selection;
		let text = editor.document.getText(selection);
		
		if(!text){
			
			let newUri = folder;  // folder will be undefined when triggered by keybinding

			// use this if triggered by a menu item,
			if (!folder) {
				await vscode.commands.executeCommand('copyFilePath'); // copy filepath by the command
				folder = await vscode.env.clipboard.readText();  // returns a string
				newUri = await vscode.Uri.file(folder);          // make it a Uri 
			}

			let files = newUri.path.split('\n');
			if(typeof files === "object" && files.length >0){
				for (let index = 0; index < files.length; index++) {
					let fileName = path.basename(files[index]);
					if(!fileName.match(/.php/g)){
						vscode.window.showErrorMessage('Run phpunit test only support .php files!');
						return;
					}else{
						fileName = fileName.replace('.php','');
						// console.log(fileName);
						activeTerm.sendText('vendor/bin/phpunit --filter '+fileName);
					}
				}
			}
		}else{
			// console.log(text);
			activeTerm.sendText('vendor/bin/phpunit --filter '+text);
		}

		
        // clipboardy.write(accumulator).then(showWarning('Filename/s has been copied to clipboard'));
	});

	context.subscriptions.push(disposable);
}
// @ts-ignore
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	// @ts-ignore
	activate,
	deactivate
}
