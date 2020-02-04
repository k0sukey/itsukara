import fs from 'fs';
import mkdirp from 'mkdirp';
import path from 'path';

mkdirp.sync('public');

const html = `<!DOCTYPE html>
<html lang="ja">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.8.0/css/bulma.min.css">
    <style>
html,
body {
  display: flex;
  height: 100%;
  width: 100%;
  align-items: center;
  justify-content: center;
}

.card.is-wide {
  width: 550px;
}

.card.has-text-centered {
  .card-header,
  .card-content,
  .card-footer {
    justify-content: center;
    align-items: center;
  }

  h1 {
    font-size: 1.75rem;
    font-weight: bold;
  }

  dt {
    padding-left: 60px;
  }
}

.card-header {
  padding: 1.75rem 0;
}

.card-content {
  padding: 3.5rem 0;
}

.card-footer {
  padding: 1rem 0;
  border: none;
  font-size: .9rem;
  color: lighten(black, 50%);
}
    </style>
    <title>配信スケジュール</title>
    <script type="application/javascript" src="https://cdn.jsdelivr.net/npm/whatwg-fetch@3.0.0/dist/fetch.umd.min.js"></script>
    <script type="text/javascript">
fetch('/itsukara.ics').then(function(response){
  const el = document.querySelector('#itsukara');
  el.textContent = response.headers.get('Date');
});
fetch('/holodule.ics').then(function(response){
  const el = document.querySelector('#holodule');
  el.textContent = response.headers.get('Date');
});
    </script>
  </head>
  <body>
    <main role="main">
      <div class="card has-text-centered is-wide">
        <div class="card-content">
          <h1>配信スケジュール.ics</h1>
          <dl>
            <dt class="has-text-left">にじさんじ</dt>
            <dd>
              更新：<a id="itsukara" href="/itsukara.ics"></a>
            </dd>
            <dt class="has-text-left">ホロライブ</dt>
            <dd>
              更新：<a id="itsukara" href="/holodule.ics"></a>
            </dd>
          </dl>
        </div>
      </div>
    </main>
  </body>
</html>
`;

fs.writeFileSync(
  path.join('public', 'index.html'),
  html,
);
