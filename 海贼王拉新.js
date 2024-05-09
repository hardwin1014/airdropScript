const puppeteer = require("puppeteer");
const fs = require("fs");

// 邀请头目下面的新人使用

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
  const data = JSON.parse(fs.readFileSync("onPiece.json", "utf8")).addressBook
    .addressBook["*"];
  const tips = JSON.parse(fs.readFileSync("outputData.json", "utf8"));

  for (const item in data) {
    for (let tip of tips) {
      if (data[item].name.includes(tip.name)) {
        await page.goto(tip.url);
        await page.type("#address", data[item].address);

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

        // 生成随机等待时间（1秒到5秒之间）
        const randomWaitTime = Math.floor(Math.random() * 6000) + 1000; // 生成1000到5000毫秒之间的随机数

        // 等待随机的时间
        await sleep(randomWaitTime);

        const cookies = await page.cookies();
        await page.deleteCookie(...cookies);
        await page.reload();
      }
    }
  }
  await browser.close();
}
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
autoFillForm();
