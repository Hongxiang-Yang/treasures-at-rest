import puppeteer from "puppeteer";

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  page.on("console", (msg) => console.log("PAGE LOG:", msg.type(), msg.text()));
  page.on("pageerror", (error) => console.log("PAGE ERROR:", error.message, error.stack));

  try {
    await page.goto("http://localhost:8081", { waitUntil: "networkidle0", timeout: 30000 });

    // Inject fake item with missing dateAdded and an item with broken data
    await page.evaluate(() => {
      window.localStorage.setItem(
        "idle-inventory.items.v1",
        JSON.stringify([
          {
            id: "fake-id",
            name: "Fake Item",
            category: "电子产品",
            expectedPrice: 100,
            condition: "good",
            status: "active",
          },
        ]),
      );
    });

    // reload to apply localstorage
    await page.reload({ waitUntil: "networkidle0" });

    console.log("Clicking card...");
    await page.waitForSelector(".bg-card", { timeout: 5000 });
    await page.click(".bg-card");
    await new Promise((r) => setTimeout(r, 2000));

    console.log("Checking if Dialog opened...");
    const html = await page.content();
    if (html.includes("This page didn't load")) {
      console.log("CRASH DETECTED: Error page is shown!");
    } else {
      console.log("NO CRASH detected on card click.");
    }

    // Also try share button
    await page.reload({ waitUntil: "networkidle0" });
    console.log("Clicking share button...");
    await page.waitForSelector(".lucide-share");
    await page.click(".lucide-share");
    await new Promise((r) => setTimeout(r, 2000));

    const html2 = await page.content();
    if (html2.includes("This page didn't load")) {
      console.log("CRASH DETECTED on share button!");
    } else {
      console.log("NO CRASH detected on share button.");
    }
  } catch (e) {
    console.log("Test failed:", e.message);
  }

  await browser.close();
})();
