import App, { AppContext } from 'next/app';
import Head from 'next/head';
import React from 'react';
import 'react-vertical-timeline-component/style.min.css';

export default class MyApp extends App {
  static async getInitialProps({ Component, ctx }: AppContext) {
    let pageProps = {};

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    return { pageProps };
  }

  render() {
    const { Component, pageProps } = this.props;

    return (
      <>
        <Head>
          <title>スケジュール.ics</title>
        </Head>
        <Component {...pageProps} />
      </>
    );
  }
}
