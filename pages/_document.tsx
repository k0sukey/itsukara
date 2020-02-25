import Document, { Html, Head, Main, NextScript } from 'next/document';
import React from 'react';

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="ja">
        <Head>
          <meta charSet="utf-8" />
          <meta
            name="viewport"
            content="initial-scale=1.0, width=device-width"
          />
          <style jsx global>
            {`
              body {
                margin: 0;
                padding: 0;
              }
            `}
          </style>
        </Head>
        <body style={{ margin: 0, padding: 0 }}>
          <Main></Main>
          <NextScript></NextScript>
        </body>
      </Html>
    );
  }
}
