/// <reference types="../types/ical.js" />

import fs from 'fs';
import ical from 'ical.js';
import path from 'path';

const getEvents = (cal: string): ical.Component[] => {
  const parsed = ical.parse(cal);
  const root = new ical.Component(parsed);
  return root.getAllSubcomponents('vevent');
};

(async () => {
  const itsukara = await fs.readFileSync(path.join('public', 'itsukara.ics'), {
    encoding: 'utf8',
  });
  const holodule = await fs.readFileSync(path.join('public', 'holodule.ics'), {
    encoding: 'utf8',
  });
  const list = [...getEvents(itsukara), ...getEvents(holodule)].map(v => {
    const json = v.toJSON();
    return {
      uid: json[1][0][3],
      start: json[1][3][3],
      end: json[1][4][3],
      summary: json[1][5][3],
      description: json[1][6][3],
      url: json[1][7][3],
    };
  });
  list.sort(
    (a, b) => Date.parse(`${a.start}+09:00`) - Date.parse(`${b.start}+09:00`),
  );
  await fs.writeFileSync(
    path.join('public', 'timeline.json'),
    JSON.stringify(list),
  );
})();
