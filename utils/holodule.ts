import fs from 'fs';
import ical from 'ical-generator';
import mkdirp from 'mkdirp';
import path from 'path';
import puppeteer from 'puppeteer';

mkdirp.sync('public');

interface Event {
  name: string;
  start: Date;
  end: Date;
  url: string;
  summary: string;
  description: string;
}

(async () => {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const page = await browser.newPage();
  await page.goto('https://schedule.hololive.tv/', {
    waitUntil: 'networkidle0',
  });

  const data = await page.evaluate(() => {
    const all = document.querySelector<HTMLDivElement>('#all');
    if (all === null) {
      return [];
    }

    let holodule: Element | null;
    return Array.from(all.children).map(container => {
      holodule = container.getElementsByClassName('holodule').item(0);

      const thumbnails = container.getElementsByClassName('thumbnail');
      const list = Array.from(thumbnails)
        .map(thumbnail => {
          const name = thumbnail.getElementsByClassName('name').item(0);
          const datetime = thumbnail.getElementsByClassName('datetime').item(0);
          if (name === null || datetime === null) {
            return null;
          }

          return {
            href: thumbnail.getAttribute('href')!,
            name: name.textContent!.replace(/\s|\n/g, ''),
            datetime: datetime.textContent!.replace(/\s|\n/g, ''),
          };
        })
        .filter(v => v !== null);

      return {
        holodule:
          holodule === null
            ? null
            : holodule.textContent!.match(/[0-9]{2}\/[0-9]{2}/)![0],
        list,
      };
    });
  });

  const result = <typeof data>[];
  let j = 0;
  for (let i = 0; i < data.length; i++) {
    if (data[i].holodule === null) {
      result[j].list.push(...data[i].list);
    } else {
      result.push(data[i]);
      j = result.length - 1;
    }
  }

  const _events: Event[] = [];
  result.forEach(v => {
    if (v.holodule === null) {
      return;
    }
    const [mm, dd] = v.holodule.split('/');
    const start = new Date();
    start.setMonth(parseInt(mm, 10) - 1, parseInt(dd, 10));

    v.list.forEach(w => {
      if (w === null) {
        return null;
      }
      const [hh, mm] = w.datetime.split(':');
      start.setHours(parseInt(hh, 10), parseInt(mm, 10), 0, 0);
      const end = new Date(start);
      end.setHours(start.getHours() + 1);
      _events.push({
        start,
        end,
        name: w.name,
        url: w.href,
        summary: '',
        description: '',
      });
    });
  });

  const events: Event[] = [];
  for (let i = 0; i < _events.length; i++) {
    await page.goto(_events[i].url, {
      waitUntil: ['load', 'networkidle2'],
    });

    const json = await page.evaluate(() =>
      JSON.parse((window as any).ytplayer.config.args.player_response),
    );
    const summary = json.videoDetails.title;
    const description = json.videoDetails.shortDescription;
    events.push({ ..._events[i], summary, description });
  }

  const cal = ical({
    domain: 'https://vigilant-bartik-6c4b01.netlify.com/',
    name: 'ホロジュール.ics',
    timezone: 'Asia/Tokyo',
    ttl: 60 * 60 * 24,
  });

  events.forEach(event => {
    cal.createEvent({
      start: event.start,
      end: event.end,
      summary: event.summary,
      description: `${event.name}\n\n${event.description}`,
      url: event.url,
      timezone: 'Asia/Tokyo',
    });
  });

  await fs.writeFileSync(path.join('public', 'holodule.ics'), cal.toString());

  await browser.close();
})();
