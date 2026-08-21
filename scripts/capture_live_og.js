const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

async function capture() {
  console.log('Launching browser...');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  await page.setViewport({
    width: 1200,
    height: 630,
    deviceScaleFactor: 2
  });

  console.log('Navigating to https://joinsophi.com ...');
  try {
    await page.goto('https://joinsophi.com', { waitUntil: 'networkidle2', timeout: 30000 });
  } catch (e) {
    console.log('Networkidle2 timeout, continuing with current page state:', e.message);
  }

  // Hide ads or banners if any
  await page.evaluate(() => {
    const selector = '.google-auto-placed, ins.adsbygoogle';
    document.querySelectorAll(selector).forEach(el => el.remove());
  });

  const outPng = path.join(__dirname, '..', 'public', 'og', 'home.png');
  const outOgImagePng = path.join(__dirname, '..', 'public', 'og-image.png');
  const outOgImageJpg = path.join(__dirname, '..', 'app', 'opengraph-image.jpg');
  const outTwitterJpg = path.join(__dirname, '..', 'app', 'twitter-image.jpg');

  console.log('Capturing screenshot...');
  await page.screenshot({ path: outPng, type: 'png' });
  fs.copyFileSync(outPng, outOgImagePng);

  // Use sharp to produce high quality JPEG versions for app/opengraph-image.jpg and twitter-image.jpg
  const sharp = require('sharp');
  await sharp(outPng).jpeg({ quality: 90 }).toFile(outOgImageJpg);
  await sharp(outPng).jpeg({ quality: 90 }).toFile(outTwitterJpg);

  console.log('Successfully captured live website screenshot and updated all OG image files!');
  await browser.close();
}

capture().catch(err => {
  console.error('Error capturing screenshot:', err);
  process.exit(1);
});
