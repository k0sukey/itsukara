import fs from 'fs';
import mkdirp from 'mkdirp';
import path from 'path';

mkdirp.sync('public');

const html = `<!DOCTYPE html>
<html lang="ja">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width">
    <link rel="stylesheet" href="https://fonts.googleapis.com/earlyaccess/kokoro.css">
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
  font-family: "Kokoro";
}

.card.is-wide {
  max-width: 340px;
}

.card-header {
  justify-content: center;
  align-items: center;
  padding: 1.75rem 0;
}

.card-content {
  justify-content: center;
  align-items: center;
  padding: 3.5rem 2rem;
}

.card-footer {
  justify-content: center;
  align-items: center;
  padding: 1rem 0;
  border: none;
  font-size: .9rem;
}
    </style>
    <title>配信スケジュール</title>
    <script type="application/javascript" src="https://cdn.jsdelivr.net/npm/whatwg-fetch@3.0.0/dist/fetch.umd.min.js"></script>
    <script type="text/javascript">
const onError = error => {
  const el = document.querySelector('#error');
  el.textContent = error.message;
  el.parentElement.style.display = 'block';
};

window.addEventListener('DOMContentLoaded', () => {
  fetch('/itsukara.ics').then(response => {
    if (response.status >= 200 && response.status < 300) {
      return response.text();
    } else {
      throw new Error(response.statusText)
    }
  }).then(text => {
      const matched = text.match(/X-WR-CALDESC:(.+)/ig)[0].replace('X-WR-CALDESC:', '');
      const el = document.querySelector('#itsukara');
      el.textContent = new Date(matched).toLocaleString();
  }).catch(onError);

  fetch('/holodule.ics').then(response => {
    if (response.status >= 200 && response.status < 300) {
      return response.text();
    } else {
      throw new Error(response.statusText)
    }
  }).then(text => {
      const matched = text.match(/X-WR-CALDESC:(.+)/ig)[0].replace('X-WR-CALDESC:', '');
      const el = document.querySelector('#holodule');
      el.textContent = new Date(matched).toLocaleString();
  }).catch(onError);
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
                  <span style="margin-left: 6px; font-weight: bold;">にじさんじ</span>
                </span>
                <a class="tag is-info" id="itsukara" href="/itsukara.ics">----/--/-- --:--:--</a>
              </div>
            </div>
            <div class="control">
              <div class="tags has-addons">
                <span class="tag is-dark">
                  <span class="ion-calendar"></span>
                  <span style="margin-left: 6px; font-weight: bold;">ホロライブ</span>
                </span>
                <a class="tag is-info" id="holodule" href="/holodule.ics">----/--/-- --:--:--</a>
              </div>
            </div>
            <div class="control is-small">
              <div class="tags has-addons">
                <span class="tag is-dark">
                  <span class="ion-social-github"></span>
                </span>
                <a class="tag is-light" href="https://github.com/k0sukey/itsukara" style="font-weight: bold;">Repository</a>
              </div>
            </div>
            <div class="control">
              <img src="https://circleci.com/gh/k0sukey/itsukara.svg?style=svg">
            </div>
            <div class="control">
              <img src="https://api.netlify.com/api/v1/badges/05f95ea1-c925-4e99-99d5-3975b5c9a310/deploy-status">
            </div>
          </div>

          <div class="notification is-danger" style="display: none; margin-top: 20px;"><span id="error"></span></div>
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
