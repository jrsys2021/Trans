// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { MD5 } from './md5';
import httpUtil from './http';
//'/api/trans/vip/translate'
// eslint-disable-next-line @typescript-eslint/naming-convention  
const Config = vscode.workspace.getConfiguration("TextTrans");
export function activate(context: vscode.ExtensionContext) {

	httpUtil.SetBaseUrl(Config.ApiUrl);
	let disposable = vscode.commands.registerCommand('trans', async function () {

		let editor = vscode.window.activeTextEditor;
		if(editor){
			editor?.edit(async function (editBuilder: vscode.TextEditorEdit) {
				const doc = editor?.document;
				const selection = editor?.selection as vscode.Selection;
				const text = doc?.getText(selection);
				// const apid: string = '20210323000738624';
				// const key: string = 'VcIEB9QGFWvemlzLJeDQ';
				const apid: string = Config.AppID;
				const key: string = Config.AppKey;
	
				const data = {
					q: text,
					appid: apid,
					salt: (new Date).getTime(),
					from: Config.SrcLan,
					to: Config.DestLan,
					sign: ''
				};
				const str1: string = apid + data.q + data.salt.toString() + key;
				data.sign = MD5(str1);

				await httpUtil.get(Config.ApiUrl,
					data).then((res: any) => {
						if (res.trans_result) {
							vscode.window.showErrorMessage(res.trans_result[0].dst);
							SetResutl(res.trans_result[0].dst);
						}
						else {
							console.log(res);
							
						}
					}).catch((err: any) => {
						console.log(err);
					});
			});
		}
	});

	context.subscriptions.push(disposable);
}
// eslint-disable-next-line @typescript-eslint/naming-convention
function SetResutl(result:string){
	let editor = vscode.window.activeTextEditor;
	if(!editor){
		return;
	}

	const selection = editor.selection;
	editor.edit((editBuilder)=>{
		editBuilder.replace(selection,result);
	});
}
// This method is called when your extension is deactivated
export function deactivate() { }

