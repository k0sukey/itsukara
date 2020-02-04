import ical from 'ical.js';
import unfetch from 'isomorphic-unfetch';
import { NextPage } from 'next';
import React, { useState } from 'react';
import ContainerDimensions from 'react-container-dimensions';
import { HotKeys } from 'react-hotkeys';
import YouTube from 'react-youtube';
import queryString from 'query-string';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';

import Layout from '../components/Layout';

interface Props {
  videoIds: string[];
}

interface Player {
  index: number;
  player: any;
}

const IndexPage: NextPage<Props> = props => {
  const [players, setPlayer] = useState<Player[]>([]);

  const handleMute = (index: number) => {
    const player = players.find(v => v.index === index);
    if (player === undefined) {
      return;
    }

    if (player.player.isMuted()) {
      player.player.unMute();
    } else {
      player.player.mute();
    }
  };
  const keyMap = {
    _1: '1',
    _2: '2',
    _3: '3',
    _4: '4',
    _5: '5',
    _6: '6',
    _7: '7',
    _8: '8',
    _9: '9',
  };
  const handlers = {
    _1: () => handleMute(1),
    _2: () => handleMute(2),
    _3: () => handleMute(3),
    _4: () => handleMute(4),
    _5: () => handleMute(5),
    _6: () => handleMute(6),
    _7: () => handleMute(7),
    _8: () => handleMute(8),
    _9: () => handleMute(9),
  };

  return (
    <Layout>
      <HotKeys keyMap={keyMap} handlers={handlers}>
        <GridList cellHeight={'auto'} cols={3}>
          {props.videoIds.map((videoId: string, index: number) => {
            return videoId === null ? null : (
              <GridListTile key={videoId}>
                <ContainerDimensions>
                  {({ width }) => (
                    <YouTube
                      videoId={videoId}
                      opts={{
                        playerVars: { autoplay: 1, controls: 0 },
                        width: `${Math.round(width) - 4}`,
                        height: `${Math.round((width * 9) / 16) - 4}`,
                      }}
                      onReady={e => {
                        console.log(e.target.getDuration());
                        e.target.mute();
                        setPlayer([
                          ...players,
                          { index: index + 1, player: e.target },
                        ]);
                      }}
                      onEnd={() => {
                        location.reload();
                      }}
                    ></YouTube>
                  )}
                </ContainerDimensions>
              </GridListTile>
            );
          })}
        </GridList>
      </HotKeys>
    </Layout>
  );
};

IndexPage.getInitialProps = async () => {
  const now = Date.now() - 4 * 60 * 60 * 1000;
  const response = await unfetch(
    'https://vigilant-bartik-6c4b01.netlify.com/itsukara.ics',
  );
  const plain = await response.text();
  const parsed = ical.parse(plain);
  const component = new ical.Component(parsed);
  const videoIds = component
    .getAllSubcomponents('vevent')
    .map(v => new ical.Event(v))
    .map(v => {
      return {
        start: v.startDate.toJSDate().getTime(),
        url: v.component.getFirstPropertyValue('url'),
      };
    })
    .filter(v => v.start >= now)
    .map(v => {
      const parsed = queryString.parseUrl(v.url);
      return parsed.query.v as string;
    });

  return { videoIds };
};

export default IndexPage;
