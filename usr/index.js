let path = '/Users/Jacob Schneider/Code';

addEventListener('load', async e => {
	document.querySelector('.markdown-rendered').innerHTML = await getTest();

	(await (await fetch(`/getdir?path=${encodeURI(path)}`, {
		method: 'POST'
	})).json()).forEach(i => {
		document.querySelector('.dir_view').innerHTML += `<li>${i}</li>`
	})
})

async function getTest() {
	let r = await fetch('/test/full_test.md')
	r = await r.text();

	return await (await fetch('/compile', {
		method: 'POST',
		body: r
	})).text()
}