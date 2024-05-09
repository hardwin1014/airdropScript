const puppeteer = require("puppeteer");
const fs = require("fs");

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
  const data = JSON.parse(fs.readFileSync("testData.json", "utf8"));
  // const data = JSON.parse(fs.readFileSync("MetaMaskUserData1.json", "utf8"))
  // .addressBook.addressBook["*"];
  const arr = [];

  for (const item of data) {
    await page.goto("http://prospepe.top");
    // await page.type("#address", data[item].address);
    await page.type("#address", item.address);

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

    // 获取<span>标签的文本内容
    const value = await page.evaluate(() => {
      const span = document.querySelector("#dce-clipboard-value-001");
      return span ? span.textContent.trim() : null;
    });

    // 定义要写入的 JSON 数据
    const jsonData = { name: item.name, address: item.address, url: value };
    arr.push(jsonData)

    const cookies = await page.cookies();
    await page.deleteCookie(...cookies);

    // 生成随机等待时间（1秒到5秒之间）
    const randomWaitTime = Math.floor(Math.random() * 600) + 10; // 生成1000到5000毫秒之间的随机数

    // 等待随机的时间
    await sleep(randomWaitTime);

    await page.reload();
  }

  // 将 JSON 数据转换为字符串
  const jsonStringArr = JSON.stringify(arr);

  // 将字符串写入到文件中
  fs.writeFile("outputData.json", jsonStringArr, "utf8", (err) => {
    if (err) {
      console.error("写入文件时出错：", err);
      return;
    }
    console.log("JSON 数据已成功写入到 output.json 文件中。");
  });

  await browser.close();
}
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

autoFillForm();
