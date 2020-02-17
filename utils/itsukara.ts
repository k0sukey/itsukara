import fs from 'fs';
import got from 'got';
import ical from 'ical-generator';
import mkdirp from 'mkdirp';
import path from 'path';

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

(async () => {
  try {
    const response = await got(
      'https://api.itsukaralink.jp/v1.2/events.json',
    ).catch(e => {
      console.error(e);
      process.exit(1);
    });

    const cal = ical({
      domain: 'https://vigilant-bartik-6c4b01.netlify.com/',
      url: 'https://vigilant-bartik-6c4b01.netlify.com/itsukara.ics',
      name: 'いつから.ics',
      description: new Date().toJSON(),
      timezone: 'Asia/Tokyo',
      ttl: 60 * 60 * 24,
    });

    const json = JSON.parse(response.body) as Response;
    json.data.events.forEach(event => {
      const [liver] = event.livers;
      cal.createEvent({
        start: new Date(event.start_date),
        end: new Date(event.end_date),
        summary: event.name,
        description: `${liver.name} / ${event.url}\n\n${event.description}`,
        url: event.url,
        timezone: 'Asia/Tokyo',
      });
    });

    await fs.writeFileSync(path.join('public', 'itsukara.ics'), cal.toString());
  } catch (error) {
    console.error(error);
  }
})();
