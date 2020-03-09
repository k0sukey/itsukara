import fs from 'fs';
import ical from 'ical-generator';
import unfetch from 'isomorphic-unfetch';
import mkdirp from 'mkdirp';
import path from 'path';
import queryString from 'query-string';

import livers from './nijisanji.json';

interface Liver {
  name: string;
}

interface Event {
  id: number;
  name: string;
  description: string;
  url: string;
  start_date: string;
  end_date: string;
  livers: Liver[];
}

interface Data {
  events: Event[];
}

interface Response {
  data: Data;
}

mkdirp.sync('public');
mkdirp.sync('public/itsukara');

(async () => {
  try {
    const response = await unfetch(
      'https://api.itsukaralink.jp/v1.2/events.json',
    );

    const cal = ical({
      domain: 'https://vigilant-bartik-6c4b01.netlify.com/',
      url: 'https://vigilant-bartik-6c4b01.netlify.com/itsukara.ics',
      name: 'いつから.ics',
      description: new Date().toJSON(),
      timezone: 'Asia/Tokyo',
      ttl: 60 * 60 * 24,
      prodId: {
        company: 'スケジュール.ics',
        product: 'いつから.ics',
        language: 'JA',
      },
    });

    const json = JSON.parse(await response.text()) as Response;
    json.data.events.forEach(event => {
      console.info(event.url);
      const [liver] = event.livers;
      const parsed = queryString.parse(event.url.split('?')[1]);
      cal.createEvent({
        start: new Date(event.start_date),
        end: new Date(event.end_date),
        summary: event.name,
        description: `${liver.name} / ${event.url}\n\n${event.description}`,
        url: event.url,
        timezone: 'Asia/Tokyo',
        uid: parsed.v ? (parsed.v as string) : undefined,
      });
    });

    await fs.writeFileSync(path.join('public', 'itsukara.ics'), cal.toString());

    for (let i = 0; i < livers.length; i++) {
      const liver = livers[i];
      const cal = ical({
        domain: 'https://vigilant-bartik-6c4b01.netlify.com/',
        url: `https://vigilant-bartik-6c4b01.netlify.com/itsukara/${liver.channelId}.ics`,
        name: `${liver.name} いつから.ics`,
        description: new Date().toJSON(),
        timezone: 'Asia/Tokyo',
        ttl: 60 * 60 * 24,
        prodId: {
          company: 'スケジュール.ics',
          product: `${liver.name} いつから.ics`,
          language: 'JA',
        },
      });

      json.data.events
        .filter(event => {
          const [_liver] = event.livers;
          return _liver.name === liver.name;
        })
        .forEach(event => {
          console.info(event.url);
          const [liver] = event.livers;
          const parsed = queryString.parse(event.url.split('?')[1]);
          cal.createEvent({
            start: new Date(event.start_date),
            end: new Date(event.end_date),
            summary: event.name,
            description: `${liver.name} / ${event.url}\n\n${event.description}`,
            url: event.url,
            timezone: 'Asia/Tokyo',
            uid: parsed.v ? (parsed.v as string) : undefined,
          });
        });

      await fs.writeFileSync(
        path.join('public', 'itsukara', `${liver.channelId}.ics`),
        cal.toString(),
      );
    }

    await fs.writeFileSync(path.join('public', 'nijisanji.json'), JSON.stringify(livers));
  } catch (error) {
    console.error(error);
  }
})();
