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
    <link rel="stylesheet" href="https://code.ionicframework.com/ionicons/2.0.1/css/ionicons.min.css">
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
}

.card-header {
  padding: 1.75rem 0;
}

.card-content {
  padding: 3.5rem 2rem;
}

.card-footer {
  padding: 1rem 0;
  border: none;
  font-size: .9rem;
}
    </style>
    <title>配信スケジュール</title>
    <script type="application/javascript" src="https://cdn.jsdelivr.net/npm/whatwg-fetch@3.0.0/dist/fetch.umd.min.js"></script>
    <script type="text/javascript">
fetch('/itsukara.ics', { method: 'HEAD' }).then(function(response){
  const el = document.querySelector('#itsukara');
  el.textContent = new Date(response.headers.get('Date')).toLocaleString();
});
fetch('/holodule.ics', { method: 'HEAD' }).then(function(response){
  const el = document.querySelector('#holodule');
  el.textContent = new Date(response.headers.get('Date')).toLocaleString();
});
    </script>
  </head>
  <body>
    <main role="main">
      <div class="card has-text-centered is-wide">
        <div class="card-content">
          <div class="field is-grouped is-grouped-multiline">
            <div class="control">
              <div class="tags has-addons">
                <span class="tag is-dark">
                  <span class="ion-calendar"></span>
                  <span style="margin-left: 6px;">にじさんじ</span>
                </span>
                <a class="tag is-info" id="itsukara" href="/itsukara.ics">2020/2/4 15:14:17</a>
              </div>
            </div>
            <div class="control">
              <div class="tags has-addons">
                <span class="tag is-dark">
                  <span class="ion-calendar"></span>
                  <span style="margin-left: 6px;">ホロライブ</span>
                </span>
                <a class="tag is-info" id="holodule" href="/holodule.ics">2020/2/4 15:14:17</a>
              </div>
            </div>
            <div class="control">
              <img src="https://api.netlify.com/api/v1/badges/05f95ea1-c925-4e99-99d5-3975b5c9a310/deploy-status">
            </div>
            <div class="control">
              <img src="https://circleci.com/gh/k0sukey/itsukara.svg?style=svg">
            </div>
          </div>
        </div>

        <footer class="card-footer" style="display: block;">
          配信スケジュール.ics
        </footer>
      </div>
    </main>
  </body>
</html>
`;

fs.writeFileSync(path.join('public', 'index.html'), html);
