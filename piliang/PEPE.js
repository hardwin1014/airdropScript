const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");
const filePath = path.resolve(__dirname, "../piliang/cointool_sanqian.json");

async function autoFillForm() {
  const browser = await puppeteer.launch({
    headless: false,
    ignoreHTTPSErrors: true,
    dumpio: true,
    autoClose: false,
    args: ["--no-sandbox", "--window-size=1366,850"],
  });
  const page = await browser.newPage();

  await page.setViewport({ width: 1366, height: 768 });
  const data = JSON.parse(fs.readFileSync(filePath, "utf8"));

  let count = 0
  for (const item of data) {
    count++
    console.log(count)
    await page.goto("http://prospepe.top");
    await page.type("#address", item);

    await page.click("#sbm1");

    await page.waitForSelector("#tqy");
    await page.waitForNavigation("#tqy");
    await page.click("#tqy");

    // 关闭弹框
    await page.evaluate(() => {
      window.alert = () => {
        console.log("Alert is suppressed");
      };
    });
    await page.waitForSelector("#tq");
    await page.click("#tq");

    // 关闭弹框
    await page.evaluate(() => {
      window.alert = () => {
        console.log("Alert is suppressed");
      };
    });
    const cookies = await page.cookies();
    await page.deleteCookie(...cookies);
    // 生成随机等待时间（1秒到5秒之间）
    const randomWaitTime = Math.floor(Math.random() * 2000) + 1000; // 生成1000到5000毫秒之间的随机数

    // 等待随机的时间
    await sleep(randomWaitTime);

    await page.reload();
  }
  await browser.close();
}
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

autoFillForm();
