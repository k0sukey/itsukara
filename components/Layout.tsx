import Head from 'next/head';
import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      backgroundColor: theme.palette.common.black,
    },
  }),
);

const Layout: React.FC = ({ children }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Head>
        <title>いつから.ics</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <style jsx global>
          {`
            body {
              margin: 0;
              padding: 0;
              background-color: #000000;
            }
          `}
        </style>
      </Head>
      {children}
    </div>
  );
};
export default Layout;
