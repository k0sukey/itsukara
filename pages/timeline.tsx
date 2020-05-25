import ical from 'ical.js';
import unfetch from 'isomorphic-unfetch';
import { NextPage } from 'next';
import React, { useEffect, useState } from 'react';
import ContainerDimensions from 'react-container-dimensions';
import Avatar from '@material-ui/core/Avatar';
import Container from '@material-ui/core/Container';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CssBaseline from '@material-ui/core/CssBaseline';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import ScheduleIcon from '@material-ui/icons/Schedule';
import YouTubeIcon from '@material-ui/icons/YouTube';

interface Talent {
  name: string;
  channelId: string;
  thumbnail: string;
}

interface Event {
  uid: string;
  start: string;
  end: string;
  summary: string;
  description: string;
  url: string;
}

interface Timeline {
  [start: string]: Event[];
}

function getTimeline(events: Event[]): Timeline {
  return events.reduce((acc, cur) => {
    acc[cur.start] = acc[cur.start] ? [...acc[cur.start], cur] : [cur];
    return acc;
  }, {} as Timeline);
}

function getDateTime(curr: string, prev: string | ''): string {
  const [currDate, currTime] = curr.split('T');
  const [hour, minute] = currTime.split(':');
  const prevDate = prev.split('T')[0];
  if (currDate === prevDate) {
    return `${hour}:${minute}`;
  }
  const [year, month, date] = currDate.split('-');
  return `${year}年${month}月${date}日 ${hour}:${minute}`;
}

function getAvatar(talents: Talent[], description: string): any {
  const name = description.split(' / ')[0];
  const found = talents.find(v => v.name === name);
  return found ? (
    <Avatar
      alt={name}
      src={found.thumbnail}
      style={{
        width: '54px',
        height: '54px',
        marginRight: '24px',
        backgroundColor: '#f1faee',
      }}
    />
  ) : (
    <Avatar
      style={{
        width: '54px',
        height: '54px',
        marginRight: '24px',
        backgroundColor: '#f1faee',
      }}
    >
      {name.charAt(0)}
    </Avatar>
  );
}

/**
 * https://coolors.co/22223b-4a4e69-9a8c98-c9ada7-f2e9e4
 */
const TimelinePage: NextPage = () => {
  const [talents, setTalents] = useState<Talent[]>([]);
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    const getTalents = async (url: string): Promise<Talent[]> => {
      const response = await unfetch(url);
      return JSON.parse(await response.text());
    };

    (async () => {
      setTalents([
        ...(await getTalents('./nijisanji.json')),
        ...(await getTalents('./hololive.json')),
      ]);
    })();
  }, []);

  useEffect(() => {
    const getEvents = async (url: string): Promise<ical.Component[]> => {
      const response = await unfetch(url);
      const parsed = ical.parse(await response.text());
      const root = new ical.Component(parsed);
      return root.getAllSubcomponents('vevent');
    };

    (async () => {
      const list = [
        ...(await getEvents('itsukara.ics')),
        ...(await getEvents('holodule.ics')),
      ].map(event => {
        const json = event.toJSON();
        return {
          uid: json[1][0][3],
          start: json[1][3][3],
          end: json[1][4][3],
          summary: json[1][5][3],
          description: json[1][6][3],
          url: json[1][7][3],
        };
      });
      list.sort((a, b) => a.start - b.start);
      setEvents(list);
    })();
  }, []);

  return (
    <>
      <CssBaseline />
      <div
        style={{
          paddingTop: '40px',
          paddingBottom: '40px',
          backgroundColor: '#4a4e69',
          color: '#f2e9e4',
        }}
      >
        <Container maxWidth="sm">
          {events.length > 0 && talents.length > 0 && (
            <dl style={{ margin: 0, padding: 0 }}>
              {Object.entries(getTimeline(events)).map(
                ([time, ev], idx, arr) => {
                  return (
                    <React.Fragment key={time}>
                      <dt
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          padding: '10px',
                          backgroundColor: '#22223b',
                          borderRadius: '27.5px',
                        }}
                      >
                        <ScheduleIcon fontSize="large" />
                        <Typography
                          variant="h5"
                          variantMapping={{ h5: 'h2' }}
                          style={{ paddingLeft: '10px' }}
                        >
                          {getDateTime(
                            time,
                            arr[idx - 1] ? arr[idx - 1][0] : '',
                          )}
                        </Typography>
                      </dt>
                      {ev.map((v, i, a) => (
                        <dd
                          key={v.uid}
                          style={{
                            position: 'relative',
                            display: 'flex',
                            marginLeft: 0,
                            paddingTop: i === 0 ? '40px' : '20px',
                            paddingBottom: i === a.length - 1 ? '40px' : '20px',
                          }}
                        >
                          <span
                            style={{
                              display: 'inline-box',
                              position: 'absolute',
                              top: 0,
                              left: '24px',
                              width: '8px',
                              height: '100%',
                              backgroundColor: '#22223b',
                            }}
                          ></span>
                          {getAvatar(talents, v.description)}
                          <Card style={{ width: '480px' }}>
                            <CardHeader
                              title={v.summary}
                              titleTypographyProps={{
                                variant: 'subtitle1',
                                variantMapping: { subtitle1: 'h3' },
                                style: { lineHeight: '1.2' },
                              }}
                              subheader={v.description.split(' / ')[0]}
                              subheaderTypographyProps={{
                                variant: 'subtitle2',
                              }}
                              action={
                                <IconButton
                                  onClick={() => window.open(v.url, '_blank')}
                                >
                                  <YouTubeIcon fontSize="large" />
                                </IconButton>
                              }
                              style={{
                                backgroundColor: '#9a8c98',
                                color: '#22223b',
                              }}
                            />
                            <CardActionArea>
                              <ContainerDimensions>
                                {({ width }) => (
                                  <CardMedia
                                    image={`http://img.youtube.com/vi/${
                                      v.url.split('?v=')[1]
                                    }/hq720.jpg`}
                                    title={v.summary}
                                    style={{
                                      height: `${Math.round(
                                        (width * 9) / 16,
                                      )}px`,
                                    }}
                                  />
                                )}
                              </ContainerDimensions>
                            </CardActionArea>
                          </Card>
                        </dd>
                      ))}
                    </React.Fragment>
                  );
                },
              )}
            </dl>
          )}
        </Container>
      </div>
    </>
  );
};

export default TimelinePage;
