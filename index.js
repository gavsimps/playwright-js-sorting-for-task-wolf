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

  const articles = [];

  while (articles.length < 100) {
    const currArt = await page.evaluate(() => {
      const items = Array.from(document.querySelectorAll('tr.athing'));
      const subtexts = Array.from(document.querySelectorAll('tr.athing + tr'));
      const results = [];




      for (let i = 0; i < items.length; i ++) {
        const item = items[i];
        const subtext = subtexts[i];

        const titleT = item.querySelector('.titleline > a');
        console.log(titleT)
        const title = titleT.innerText;
        const link = titleT.href;
        
        const dateS = subtext.querySelector('span.age > a').getAttribute('title');
        console.log(dateS)
        const date = new Date(dateS);

        if (title && link && date) {
          results.push({title, link,date});
        }
      }



      return results;
    });




    for (const article of currArt) {
      if (articles.length >= 100) break;
      if (!articles.find(a => a.link === article.link)) {
        articles.push(article);
      }
    }

    if (articles.length < 100) {
      const moreLink = await page.$('a.morelink');
      if (!moreLink) break;



      await Promise.all([
        page.waitForNavigation({ waitUntil: 'load' }),
        moreLink.click(),
      ]);
    }
  }

    articles.sort((a, b) => b.date - a.date);
    console.log(articles.slice(0,100));

}


(async () => {
  await sortHackerNewsArticles();
})();