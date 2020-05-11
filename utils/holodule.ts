import fs from 'fs';
import ical from 'ical-generator';
import mkdirp from 'mkdirp';
import path from 'path';
import puppeteer from 'puppeteer';
import queryString from 'query-string';

import livers from './hololive.json';

mkdirp.sync('public');
mkdirp.sync('public/holodule');

interface Event {
  name: string;
  start: string;
  end: string;
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
        start: start.toJSON(),
        end: end.toJSON(),
        name: w.name,
        url: w.href,
        summary: '',
        description: '',
      });
    });
  });

  const events: Event[] = [];
  for (let i = 0; i < _events.length; i++) {
    const label = `fetch ${_events[i].url}`;
    console.time(label);

    await page.goto(_events[i].url, {
      waitUntil: ['load', 'networkidle2'],
    });
    await page.waitFor(3000);
    await page
      .waitForFunction(() => {
        try {
          return !!(window as any).ytplayer;
        } catch {
          return false;
        }
      })
      .catch(e => {
        if (e instanceof puppeteer.errors.TimeoutError) {
          console.timeEnd(label);
        }
      });

    const checker = await page
      .evaluate(() => (window as any).ytInitialPlayerResponse)
      .catch(e => {
        console.error(e);
        console.timeEnd(label);
      });
    if (checker.playabilityStatus.status !== 'UNPLAYABLE') {
      const json = await page
        .evaluate(() =>
          JSON.parse((window as any).ytplayer.config.args.player_response),
        )
        .catch(e => {
          console.error(e);
          console.timeEnd(label);
        });
      const summary = json.videoDetails.title;
      const description = json.videoDetails.shortDescription;
      events.push({ ..._events[i], summary, description });
      console.timeEnd(label);
    } else {
      events.push({
        ..._events[i],
        summary: `${checker.videoDetails.title}`,
        description: `${checker.videoDetails.shortDescription}`,
      });
      console.error(`${label}: ${checker.playabilityStatus.reason}`);
    }
  }

  const cal = ical({
    domain: 'https://vigilant-bartik-6c4b01.netlify.com/',
    url: 'https://vigilant-bartik-6c4b01.netlify.com/holodule.ics',
    name: 'ホロジュール.ics',
    description: new Date().toJSON(),
    timezone: 'Asia/Tokyo',
    ttl: 60 * 60 * 24,
    prodId: {
      company: 'スケジュール.ics',
      product: 'ホロジュール.ics',
      language: 'JA',
    },
  });

  events.forEach(event => {
    const parsed = queryString.parse(event.url.split('?')[1]);
    cal.createEvent({
      start: new Date(event.start),
      end: new Date(event.end),
      summary: event.summary,
      description: `${event.name} / ${event.url}\n\n${event.description}`,
      url: event.url,
      timezone: 'Asia/Tokyo',
      uid: parsed.v ? (parsed.v as string) : undefined,
    });
  });

  await fs.writeFileSync(path.join('public', 'holodule.ics'), cal.toString());

  for (let i = 0; i < livers.length; i++) {
    const liver = livers[i];
    const cal = ical({
      domain: 'https://vigilant-bartik-6c4b01.netlify.com/',
      url: `https://vigilant-bartik-6c4b01.netlify.com/holodule/${liver.channelId}.ics`,
      name: `${liver.name} ホロジュール.ics`,
      description: new Date().toJSON(),
      timezone: 'Asia/Tokyo',
      ttl: 60 * 60 * 24,
      prodId: {
        company: 'スケジュール.ics',
        product: `${liver.name} ホロジュール.ics`,
        language: 'JA',
      },
    });

    events
      .filter(event => event.name === liver.name)
      .forEach(event => {
        const parsed = queryString.parse(event.url.split('?')[1]);
        cal.createEvent({
          start: new Date(event.start),
          end: new Date(event.end),
          summary: event.summary,
          description: `${event.name} / ${event.url}\n\n${event.description}`,
          url: event.url,
          timezone: 'Asia/Tokyo',
          uid: parsed.v ? (parsed.v as string) : undefined,
        });
      });

    await fs.writeFileSync(
      path.join('public', 'holodule', `${liver.channelId}.ics`),
      cal.toString(),
    );
  }

  await fs.writeFileSync(
    path.join('public', 'hololive.json'),
    JSON.stringify(livers),
  );

  await browser.close();
})();
