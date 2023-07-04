const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const userName = 'pratap512';
const dataFolder = 'data';

const scraperObject = {
  url: `https://www.instagram.com/${userName}`,
  async scraper(browser) {
    let page = await browser.newPage();
    console.log(`Navigating to ${this.url}...`);
    await page.goto(this.url);

    // Wait for the required DOM to be rendered
    await page.waitForSelector('article');

    const dataObj = await page.evaluate(() => {
      const allElements = document.querySelectorAll('article img, article a, article div, article video, article span, article button');
      const posts = [];

      allElements.forEach((element) => {
        if (element.tagName === 'IMG' || element.tagName === 'A' || element.tagName === 'DIV') {
          const picture = element.src || element.href || element.style.backgroundImage;
          const comment = element.alt || element.getAttribute('aria-label') || '';
          if (picture && comment) {
            posts.push({ picture, comment });
          }
        }
      });

      return posts;
    });

    console.log(dataObj);

    await page.close();

    // Create the data folder if it doesn't exist
    if (!fs.existsSync(dataFolder)) {
      fs.mkdirSync(dataFolder);
    }

    // Generate a random 8-digit number
    const randomNumber = Math.floor(10000000 + Math.random() * 90000000);
    // Generate the date and time at which the data is scraped
    const now = Date.now();
    const date = new Date(now);

    const formattedDate = date.toLocaleString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

    const formattedDateTime = formattedDate.replace(/[/:, ]/g, '-');

    // Generate the file name
    const fileName = `${userName}_${formattedDateTime}.json`;
    // const fileName2 = `${userName}-${randomNumber}.json`;
    // Create the file path
    const filePath = path.join(dataFolder, fileName);

    // Write the JSON data to the file
    fs.writeFileSync(filePath, JSON.stringify(dataObj));
  },
};

module.exports = scraperObject;
