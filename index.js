// EDIT THIS FILE TO COMPLETE ASSIGNMENT QUESTION 1

// const { chromium } = require("playwright");

// ---------------------------------------
//          Firefox Browser Tests
// ---------------------------------------

const {firefox} = require("playwright");

async function sortHackerNewsArticles() {
  // launch browser
  const browser = await firefox.launch({ headless: false });
  //   const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  // go to Hacker News
  await page.goto("https://news.ycombinator.com/newest");

  while (true) {
    const articleCount = await page.$$eval('ttr.athing', rows => rows.length);
    if (articleCount >= 100) break;

    const moreLinks = await page.$('a.morerlink');
    if (!moreLinks) break;

    await Promise.all([
      page.waitForLoadState('load'),
      moreLinks.click()
    ]);
  }

  const articles = await page.evaluate(() => {
    const items = Array.from(document.querySelectorAll('tr.athing'));
    const subtexts = Array.from(document.querySelectorAll('tr.athing > a'));
    const results = [];

    for (let i = 0; i < items.length && results.length < 100; i++) {
      const row = items[i];
      const subtext = subtexts[i];
      const titleT = row.querySelector('.titleline > a');
      const title = titleT?.innerText;
      const link = titleT?.href;
      const dateS = subtext?.querySelector('span.age > a')?.getAttribute('title');
      const date = new Date(dateS);

      if (title && link && date) {
        results.push({title, link, date});
      }
    }

    results.sort((a, b) => b.date - a.date);
    return results.slice(0,100);
  });

  await page.evaluate(() => {
    for (let i = 100; i < articles.length; i++) {
      const articleRow = articles[i];
      const subtextRow = subtexts[i];

      articleRow.style.display = 'none';
      if (subtextRow) {
        subtextRow.style.display = 'none';
      }
    }
  })

  // console.log(articles)
}


(async () => {
  await sortHackerNewsArticles();
})();