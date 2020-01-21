import fs from 'fs';
import got from 'got';
import ical from 'ical-generator';
import mkdirp from 'mkdirp';
import path from 'path';
import rimraf from 'rimraf';

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

rimraf.sync('public');
mkdirp.sync('public');

const date = new Date();
fs.writeFileSync(path.join('public', 'index.html'), `Last updated: ${date.toString()}`);

(async () => {
  try {
    const response = await got('https://api.itsukaralink.jp/v1.2/events.json');
    const cal = ical({
      domain: 'https://www.itsukaralink.jp/',
      name: 'いつから.link',
    });

    const json = JSON.parse(response.body) as Response;
    json.data.events.forEach(event => {
      const livers = event.livers.map(liver => liver.name).join('\n');
      cal.createEvent({
        start: new Date(event.start_date),
        end: new Date(event.end_date),
        summary: event.name,
        description: `${livers}\n\n${event.description}`,
        url: event.url,
      });
    });

    await fs.writeFileSync(path.join('public', 'itsukara.ics'), cal.toString());
  } catch (error) {
    console.error(error);
  }
})();
