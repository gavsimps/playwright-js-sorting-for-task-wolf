// EDIT THIS FILE TO COMPLETE ASSIGNMENT QUESTION 1
// const { chromium } = require("playwright");

// async function sortHackerNewsArticles() {
//   // launch browser
//   const browser = await chromium.launch({ headless: false });
//   const context = await browser.newContext();
//   const page = await context.newPage();

//   // go to Hacker News
//   await page.goto("https://news.ycombinator.com/newest");
// }

// (async () => {
//   await sortHackerNewsArticles();
// })();

// ---------------------------------------
//          Firefox Browser Tests
// ---------------------------------------

const {firefox} = require("playwright");

async function sortHackerNewsArticles() {
  // launch browser
  const browser = await firefox.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  // go to Hacker News
  await page.goto("https://news.ycombinator.com/newest");

  const articles = [];
  const unId = new Set();

  // checks the current list length
  while (articles.length < 100) {
    // evaluates page for all elements matching 'tr' with class of 'athing'
    const items = await page.$$eval('tr.athing', rows => {
      // takes array of items and goes through each
      return rows.map(row => {
        // grabs innerHTML of a tag after class 'titleline'
        const title = row.querySelector('.titleline > a').innerHTML;
        // grabs the link
        const link = row.querySelector('.titleline > a').href;
        // grabs identifier for each
        const id = row.getAttribute('id');
        return {id, title, link};
      });
    });
  

    // evaluates page for tr with class 'athing' with a subsequent tr
    const subtexts = await page.$$eval('tr.athing + tr', rows => {
      return rows.map(row => {
        // looks for span tage with class age and an a tag
        const artDate = row.querySelector('span.age > a');
        // looks through and grabs the title attribute
        const artTime = artDate?.getAttribute('title');
        return artTime;
      });
    });

    for (let i = 0; i < items.length; i++) {
      // stops running if list hits 100 or more
      if (articles.length >= 100) break;

      // skips duplicates
      const id = items[i].id;
      if (!id || unId.has(id)) continue;

      // checks subtext of each
      if (subtexts[i]) {
        // converts artTime to Date
        const date = new Date(subtexts[i]);
        // adds items and then Date to each item in array 'articles'
        articles.push({...items[i], date});
        unId.add(id)
      }
    }

    // since page doesnt show more than 30 entries
    if (articles.length < 100) {
      const moreLinks = await page.$('a.morelink');
      if (moreLinks) {
        await Promise.all([
          // constant loops - broken
          page.waitForLoadState('load'),
          moreLinks.click(),
        ]);
      }
      else {
        // stops generating pages
        break;
      }
    }
  }

  // sort by date (newest first)
  articles.sort((a,b) => b.date - a.date);

  // console logging the sorted array
  console.log(articles.slice(0,100));

}


(async () => {
  await sortHackerNewsArticles();
})();