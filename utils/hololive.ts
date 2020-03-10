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
        name: product.name,
        thumbnail: product.picture[0].thumbnailUrl,
        channelId: parsed.pathname.replace('/channel/', ''),
      };
    });

  await fs.writeFileSync(path.join('utils', 'hololive.json'), JSON.stringify(talents));
})();
