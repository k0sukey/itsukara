import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer';
import URLParse from 'url-parse';

(async () => {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const page = await browser.newPage();
  await page.goto('https://www.itsukaralink.jp/livers', {
    waitUntil: 'networkidle0',
  });

  const data = await page.evaluate(() => {
    const livers: Array<{
      name: string;
      thumbnail: string;
      channel: string;
    }> = [];
    document.querySelectorAll<HTMLDivElement>('.liver').forEach(liver => {
      const name = (liver.getElementsByClassName(
        'liver-followBoxText',
      )[0] as HTMLSpanElement).innerText;
      const images = liver.getElementsByTagName('img');
      const thumbnail = images[0].getAttribute('src') as string;
      const channel = (images[2]
        .parentElement as HTMLAnchorElement).getAttribute('href') as string;
      livers.push({
        name,
        thumbnail,
        channel,
      });
    });
    return livers;
  });

  const json = data.map(v => {
    const parsed = URLParse(v.channel);
    return {
      name: v.name,
      thumbnail: v.thumbnail,
      channelId: parsed.pathname.replace('/channel/', ''),
    };
  });

  await fs.writeFileSync(
    path.join('utils', 'nijisanji.json'),
    JSON.stringify(json),
  );

  await browser.close();
})();
