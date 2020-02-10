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
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Sawarabi+Mincho">
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
  justify-content: flex-end;
  align-items: center;
  padding: 1.75rem 2rem 0 2rem;
  box-shadow: none;
}

.card-content {
  justify-content: center;
  align-items: center;
  padding: 1.75rem 2rem 3.5rem;
}

.card-footer {
  justify-content: center;
  align-items: center;
  padding: 1rem 0;
  border: none;
  font-size: .9rem;
}

.modal {
  font-family: "Sawarabi Mincho";
}

.modal-content {
  max-height: calc(100vh - 240px);
}
    </style>
    <title>配信スケジュール.ics</title>
    <script type="application/javascript" src="https://cdn.jsdelivr.net/npm/whatwg-fetch@3.0.0/dist/fetch.umd.min.js"></script>
    <script type="text/javascript">
const onError = error => {
  const el = document.querySelector('#error');
  el.textContent = error.message;
  el.parentElement.style.display = 'block';
};

window.addEventListener('DOMContentLoaded', () => {
  fetch('/itsukara.ics').then(response => {
    if (response.ok) {
      return response.text();
    } else {
      throw new Error('HTTP status: ' + response.status);
    }
  }).then(text => {
    const matched = text.match(/X-WR-CALDESC:(.+)/ig)[0].replace('X-WR-CALDESC:', '');
    const el = document.querySelector('#itsukara');
    el.textContent = new Date(matched).toLocaleString();
  }).catch(onError);

  fetch('/holodule.ics').then(response => {
    if (response.ok) {
      return response.text();
    } else {
      throw new Error('HTTP status: ' + response.status)
    }
  }).then(text => {
    const matched = text.match(/X-WR-CALDESC:(.+)/ig)[0].replace('X-WR-CALDESC:', '');
    const el = document.querySelector('#holodule');
    el.textContent = new Date(matched).toLocaleString();
  }).catch(onError);
});

function onOpenAbout() {
  const modal = document.querySelector('.modal');
  modal.classList.add('is-active');
}
function onCloseAbout() {
  const modal = document.querySelector('.modal');
  modal.classList.remove('is-active');
}
    </script>
  </head>
  <body>
    <main role="main">
      <div class="card has-text-centered is-wide">
        <header class="card-header">
          <button class="button is-right is-text is-small" onclick="onOpenAbout()">このサイトはなに?</button>
        </header>
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

        <footer class="card-footer">
          <div>
            <small class="has-text-grey-light">Unofficial live stream schedule<br>for Nijisanji and Hololive.</small>
          </div>
        </footer>
      </div>
    </main>

    <div class="modal">
      <div class="modal-background"></div>
      <div class="modal-content">
        <div class="box">
          <p>
            <span class="ion-calendar"></span> このサイトは、にじさんじ・ホロライブの非公式スケジュール配信サイトです。
            <a href="https://www.itsukaralink.jp">いつから.link</a>と<a href="https://schedule.hololive.tv">ホロジュール</a>から 1 時間に 1 度情報を取得して、<a href="https://ja.wikipedia.org/wiki/ICalendar">iCalendar</a> 形式の <a href="/itsukara.ics">itsukara.ics</a> と <a href="/holodule.ics">holodule.ics</a> を自動生成しています。
            配信されている .ics は、お使いの PC やスマートフォンのアプリに読み込ませて自由にご利用ください。
          </p>
          <hr>
          <ul class="is-size-7">
            <li><span class="ion-checkmark"></span> Google カレンダーをお使いの方は <a href="https://support.google.com/calendar/answer/37100">他のユーザーの Google カレンダーを追加する</a> のリンクを使用して追加するが参考になります</li>
            <li><span class="ion-checkmark"></span> Mac をお使いの方は <a href="https://support.apple.com/ja-jp/guide/calendar/icl1022/mac">Mac でカレンダーを照会する</a> が参考になります</li>
            <li><span class="ion-checkmark"></span> iPhone をお使いの方は <a href="/itsukara.ics">itsukara.ics</a> か <a href="/holodule.ics">holodule.ics</a> のリンクをタップするとカレンダーへ追加することができます</li>
          </ul>
          <hr>
          <ul class="is-size-7 has-text-grey">
            <li><span class="ion-android-warning"></span> まれに情報の取得に失敗することがあります。失敗した場合は、このサイトで表示されている何れかのバッジが Failed 等になっていると思います</li>
            <li><span class="ion-android-warning"></span> スケジュールは蓄積していませんので、過去に遡ってのスケジュールを確認することはできません（だいたい 1 日前くらいまでは確認できます）</li>
            <li><span class="ion-android-warning"></span> カレンダーの性質上、終了時間が開始時間の 1 時間後になっていますが、必ずしもその時間にライブストリームが終了するとは限りません</li>
            <li><span class="ion-android-warning"></span> 何かありましたら <a href="https://twitter.com/k0sukey"><span class="ion-social-twitter"></span> k0sukey</a> までどうぞ</li>
          </ul>
        </div>
      </div>
      <button class="modal-close is-large" onclick="onCloseAbout()"></button>
    </div>
  </body>
</html>
`;

fs.writeFileSync(path.join('public', 'index.html'), html);
