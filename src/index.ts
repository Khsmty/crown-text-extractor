import readline from "node:readline";
import puppeteer from "puppeteer";
// import clipboard from "clipboardy";

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});

let url = "";
rl.question("▶️ URL を入力: ", (input_url) => {
	if (!input_url || !input_url.match(/^https?:\/\/.+/)) {
		console.error("🔴 入力された URL が不正です。終了します。");
		rl.close();
		process.exit(1);
	}

	url = input_url;
	console.log("💦 解析を開始します...");
	rl.close();
});

rl.on("close", async () => {
	const browser = await puppeteer.launch();
	const page = await browser.newPage();
	await page.goto(url);

	const text = await page.evaluate(() => {
		const div = document.getElementById("honbun");
		return div?.textContent as string;
	});
	if (!text) {
		console.error("🔴 テキストが取得できませんでした。終了します。");
		await browser.close();
		process.exit(1);
	}

	const result = text
		.replace(/\n/g, "")
		.split("/")
		.map((text) => text.trim())
		.join("\n");

	console.log("✅ テキストを抽出しました:\n");
	console.log(result);

	await browser.close();
	process.exit(0);
});
