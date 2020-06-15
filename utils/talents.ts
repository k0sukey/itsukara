import fs from 'fs';
import path from 'path';

import nijisanji from './nijisanji.json';
import hololive from './hololive.json';

(async () => {
  const list = [
    ...[...nijisanji].map(v => ({ ...v, box: 'nijisanji' })),
    ...[...hololive].map(v => ({ ...v, box: 'hololive' })),
  ];
  await fs.writeFileSync(
    path.join('public', 'talents.json'),
    JSON.stringify(list),
  );
})();
