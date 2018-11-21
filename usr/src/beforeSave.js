export default async function BeforeSave(view, content) {
	if (view == 3) {
		// let t = [...document.querySelectorAll(`.view#view_${id} .page`)].map(i => i.innerText).reduce(i =>)
		// return await (await fetch('/compile', {
		// 	method: 'POST',
		// 	body: content
		// })).text();

		return content;
	}
}