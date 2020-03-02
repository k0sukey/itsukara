import Document, { Html, Head, Main, NextScript } from 'next/document';
import React from 'react';

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="ja">
        <Head>
          <title>配信スケジュール.ics</title>
          <meta
            name="description"
            content="にじさんじ・ホロライブの非公式スケジュール配信サイトです。"
          />
          <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        </Head>
        <body style={{ margin: 0, padding: 0 }}>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
