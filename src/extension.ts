import * as vscode from 'vscode';
// this method is called when vs code is activated

const config = {
	default_color: 'red'
}
export function activate(context: vscode.ExtensionContext) {

	console.log('decorator sample is activated');



	let activeEditor = vscode.window.activeTextEditor;
	if (activeEditor) {
		triggerUpdateDecorations();
	}

	vscode.window.onDidChangeActiveTextEditor(editor => {
		activeEditor = editor;
		if (editor) {
			triggerUpdateDecorations();
		}
	}, null, context.subscriptions);

	vscode.workspace.onDidChangeTextDocument(event => {
		if (activeEditor && event.document === activeEditor.document) {
			triggerUpdateDecorations();
		}
	}, null, context.subscriptions);

	var timeout = null;
	function triggerUpdateDecorations() {
		if (timeout) {
			clearTimeout(timeout);
		}
		timeout = setTimeout(updateDecorations, 500);
	}

	function updateDecorations() {
		if (!activeEditor) {
			return;
		}
		const regEx = /(configuration|config).get\(['"](\w+)['"]\)/g;
		const text = activeEditor.document.getText();
		let match;
		while (match = regEx.exec(text)) {
			const startPos = activeEditor.document.positionAt(match.index);
			const configKey = match[2]
			const configValue = config[configKey];

			console.log(match)

			if (configValue) {
				const endPos = activeEditor.document.positionAt(match.index + match[0].length);
				const decoration = { range: new vscode.Range(startPos, endPos), hoverMessage: configValue };

				const decoType = vscode.window.createTextEditorDecorationType({
					after: {
						contentText: configValue + ' ',
						color: 'gray'
					}
				});
				activeEditor.setDecorations(decoType, [decoration]);


			}
		}
	}
}

