const puppeteer = require('puppeteer');

const scraperObject = {
  url: 'https://www.instagram.com/anveshi25/?hl=en',
  async scraper(browser) {
    let page = await browser.newPage();
    console.log(`Navigating to ${this.url}...`);
    await page.goto(this.url);

    // Wait for the required DOM to be rendered
    await page.waitForSelector('article.x1iyjqo2');

    const dataObj = await page.evaluate(() => {
      const articleElements = document.querySelectorAll('article.x1iyjqo2');
      const posts = [];

      articleElements.forEach((articleElement) => {
        const imageElement = articleElement.querySelector('img');

        const picture = imageElement.src;
        const comment = imageElement.alt;

        posts.push({ picture, comment });
      });

      return posts.slice(0, 10); // Limit to first 10 posts
    });

    console.log(dataObj);

    await page.close();
  },
};

module.exports = scraperObject;
