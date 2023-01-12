const fs = require('fs')
const puppeteer = require('puppeteer')

async function run() {
  const data = []

  for (let i = 1; i <= 94; i++) {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    page.setDefaultNavigationTimeout(0)
    await page.goto(`https://www.techstars.com/mentors?currentPage=${i}`)

    // scrap the data
    const pageData = await page.$$eval('#item-undefined', elements =>
      elements.map(e => ({
        name: e.querySelector('#item-undefined h6').innerText || '',
        position: e.querySelector('#item-undefined p').innerText || '',
        linkedin: e.querySelector('#item-undefined > a:nth-child(4)')?.href || '',
        twitter: e.querySelector('#item-undefined > a:nth-child(5)')?.href || '',
      }))
    )

    data.push(pageData)
    console.log('Scrapped Data for Page #', i)
    await browser.close()
  }

  // Save data to JSON file
  fs.writeFile('data.json', JSON.stringify(data), err => {
    if (err) throw err
    console.log('File saved')
  })
}

run()
