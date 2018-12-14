export default async function BeforeSave(view, content) {
	console.log("calling BeforeSave");
	if (view === 3) {
		// let t = [...document.querySelectorAll(`.view#view_${id} .page`)].map(i => i.innerText).reduce(i =>)
		// return await (await fetch('/compile', {
		// 	method: 'POST',
		// 	body: content
		// })).text();
		console.log(document.querySelector(`#view_${content.tabId} textarea`).value);
		return content;
	} else {
		return null;
	}
}