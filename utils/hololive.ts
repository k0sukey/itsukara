import fs from 'fs';
import unfetch from 'isomorphic-unfetch';
import path from 'path';
import URLParse from 'url-parse';

interface Product {
  name: string;
  picture: {
    thumbnailUrl: string;
  }[];
  button: {
    text: 'YouTube' | 'Bilibili';
    url: string;
  };
}

interface Response {
  data: {
    products: Product[];
  };
}

function normalizeName(name: string): string {
  if (name === '森美声/もりかりおぺ') {
    return 'Calli';
  }
  if (name === '小鳥遊キアラ/たかなしきあら') {
    return 'Kiara';
  }
  if (name === '一伊那尓栖/にのまえいなにす') {
    return 'Ina';
  }
  if (name === 'がうる・ぐら') {
    return 'Gura';
  }
  if (name === 'ワトソン・アメリア') {
    return 'Amelia';
  }
  if (name === 'Kureiji Ollie / クレイジー・オリー') {
    return 'Ollie';
  }
  if (name === 'Anya Melfissa / アーニャ・メルフィッサ') {
    return 'Anya';
  }
  if (name === 'Pavolia Reine / パヴォリア・レイネ') {
    return 'Reine';
  }
  return name;
}

(async () => {
  const response = await unfetch(
    'https://www.hololive.tv/r/v1/sites/11822129/portfolio/products?per=100',
  );
  const json = JSON.parse(await response.text()) as Response;
  const talents = json.data.products
    .filter(v => v.button.text === 'YouTube')
    .map(product => {
      const parsed = URLParse(product.button.url);
      return {
        name: normalizeName(product.name),
        thumbnail: product.picture[0].thumbnailUrl,
        channelId: parsed.pathname.replace('/channel/', '').replace(/\/$/, ''),
      };
    });

  talents.push({
    name: 'アキロゼ',
    thumbnail:
      'https://user-images.strikinglycdn.com/res/hrscywv4p/image/upload/c_limit,fl_lossy,h_1000,w_500,f_auto,q_auto/1369026/754557_771352.png',
    channelId: 'UCLbtM3JZfRTg8v2KGag-RMw',
  });
  talents.push({
    name: '癒月ちょこSub',
    thumbnail:
      'https://user-images.strikinglycdn.com/res/hrscywv4p/image/upload/c_limit,fl_lossy,h_1000,w_500,f_auto,q_auto/1369026/945730_248174.png',
    channelId: 'UCp3tgHXw_HI0QMk1K8qh3gQ',
  });

  await fs.writeFileSync(
    path.join('utils', 'hololive.json'),
    JSON.stringify(talents),
  );
})();
