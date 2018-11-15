window.Alert = function(message, header) {
	let b = new UIbox(new template({
		content: message || "No Message",
		buttons: [new button('OK', 'ok')]
	}), header || "Message").show();
}

window.Confirm = async function(message, header) {
	let res = true;
	try {
		await new UIbox(new template({
			content: message || "Do you wish to proceed?",
			buttons: [new button('Cancel', 'cancel'), new button("OK", 'ok')]
		}), header || "Are you sure?").get();
	} catch (e) {
		res = false;
		console.log(e);

	}
	return res;
}

window.Prompt = async function(message, header, valueName) {
	let r = null;
	try {
		r = await new UIbox(new template({
			content: `${message || "Enter Some Value"}<input placeholder="${valueName || "Input Data Here"}">`,
			buttons: [new button('Cancel', 'cancel'), new button('OK', 'ok')]
		}), header || "Enter Value").get();
	} catch (e) {
		r = null
		console.log(e);
	}

	return r;
}