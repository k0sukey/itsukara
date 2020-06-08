import ical from 'ical.js';
import unfetch from 'isomorphic-unfetch';
import { NextPage } from 'next';
import Head from 'next/head';
import React, { useEffect, useRef, useState } from 'react';
import ContainerDimensions from 'react-container-dimensions';
import { ListChildComponentProps, VariableSizeList } from 'react-window';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Container from '@material-ui/core/Container';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CssBaseline from '@material-ui/core/CssBaseline';
import Fab from '@material-ui/core/Fab';
import Typography from '@material-ui/core/Typography';
import BlockIcon from '@material-ui/icons/Block';
import ScheduleIcon from '@material-ui/icons/Schedule';
import UpdateIcon from '@material-ui/icons/Update';

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

type TimelineItem = Event & {
  itemType: 'term' | 'full' | 'short' | 'event';
};

function getDateTime(curr: string, prev: string): TimelineItem {
  const [currDate, currTime] = curr.split('T');
  const [hour, minute] = currTime.split(':');
  if (currDate === prev.split('T')[0]) {
    return {
      itemType: 'short',
      uid: curr,
      start: curr,
      end: '',
      summary: `${hour}:${minute}`,
      description: '',
      url: '',
    };
  }

  const [year, month, date] = currDate.split('-');
  return {
    itemType: 'full',
    uid: curr,
    start: curr,
    end: '',
    summary: `${year}年${month}月${date}日 ${hour}:${minute}`,
    description: '',
    url: '',
  };
}

function getAvatar(talents: Talent[], description: string): any {
  const name = description.split(' / ')[0];
  const found = talents.find(v => {
    const regex = new RegExp(name);
    return regex.test(v.name);
  });
  return found ? (
    <Avatar
      alt={name}
      src={found.thumbnail}
      style={{
        position: 'absolute',
        top: '20px',
        left: 0,
        width: '54px',
        height: '54px',
        backgroundColor: '#f1faee',
      }}
    />
  ) : (
    <Avatar
      style={{
        position: 'absolute',
        top: '20px',
        left: 0,
        width: '54px',
        height: '54px',
        backgroundColor: '#f1faee',
      }}
    >
      {name.charAt(0)}
    </Avatar>
  );
}

/**
 * https://coolors.co/fffcf2-ccc5b9-403d39-252422-eb5e28
 */
const TimelinePage: NextPage = () => {
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down('sm'));

  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<VariableSizeList>(null);
  const [containerRect, setContainerRect] = useState<DOMRect | null>(null);
  const [talents, setTalents] = useState<Talent[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [timelineItems, setTimelineItems] = useState<TimelineItem[]>([]);

  const scrollToCurrent = () => {
    if (!listRef.current || timelineItems.length === 0) {
      return;
    }

    const now = Date.now();
    const foundIndex = timelineItems.findIndex(v => {
      if (v.itemType === 'event') {
        return false;
      }
      return Date.parse(`${v.start}+09:00`) > now;
    });
    listRef.current.scrollToItem(foundIndex, 'start');
  };

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }
    setContainerRect(containerRef.current.getBoundingClientRect());
  }, [containerRef]);

  useEffect(() => {
    const getTalents = async (url: string): Promise<Talent[]> => {
      const response = await unfetch(url);
      return JSON.parse(await response.text());
    };

    (async () => {
      setTalents([
        ...(await getTalents('nijisanji.json')),
        ...(await getTalents('hololive.json')),
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
      list.sort(
        (a, b) =>
          Date.parse(`${a.start}+09:00`) - Date.parse(`${b.start}+09:00`),
      );
      setEvents(list);
    })();
  }, []);

  useEffect(() => {
    if (events.length === 0 || talents.length === 0) {
      return;
    }

    const ordered = events.reduce((acc, cur) => {
      acc[cur.start] = acc[cur.start] ? [...acc[cur.start], cur] : [cur];
      return acc;
    }, {} as { [start: string]: Event[] });

    const list: TimelineItem[] = [];
    Object.entries(ordered).forEach(([start, events_], idx, arr) => {
      list.push(getDateTime(start, arr[idx - 1] ? arr[idx - 1][0] : ''));
      events_.forEach(event => list.push({ itemType: 'event', ...event }));
    });

    setTimelineItems([
      {
        itemType: 'term',
        uid: 'START',
        start: '',
        end: '',
        summary: 'Start',
        description: '',
        url: '',
      },
      ...list,
      {
        itemType: 'term',
        uid: 'END',
        start: '',
        end: '',
        summary: 'End',
        description: '',
        url: '',
      },
    ]);
  }, [events, talents]);

  useEffect(scrollToCurrent, [timelineItems]);

  const timelineItem = (v: ListChildComponentProps) => {
    const item = v.data[v.index];

    if (item.itemType === 'term') {
      return (
        <div style={v.style}>
          <Container
            maxWidth="sm"
            style={{
              position: 'relative',
              display: 'flex',
              height: '100%',
              padding: 0,
            }}
          >
            {item.uid === 'START' && (
              <span
                style={{
                  display: 'inline-box',
                  position: 'absolute',
                  bottom: 0,
                  left: '24px',
                  width: '8px',
                  height: '44px',
                  backgroundColor: '#252422',
                }}
              />
            )}
            {item.uid === 'END' && (
              <span
                style={{
                  display: 'inline-box',
                  position: 'absolute',
                  top: 0,
                  left: '24px',
                  width: '8px',
                  height: '44px',
                  backgroundColor: '#252422',
                }}
              />
            )}
            <Container
              style={{
                position: 'absolute',
                top: '20px',
                display: 'flex',
                width: '54px',
                height: '54px',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '10px',
                backgroundColor: '#252422',
                borderRadius: '50%',
                color: '#eb5e28',
              }}
            >
              <BlockIcon style={{ fontSize: '36px' }} />
            </Container>
          </Container>
        </div>
      );
    }

    if (item.itemType === 'full' || item.itemType === 'short') {
      return (
        <div style={v.style}>
          <Container
            maxWidth="sm"
            style={{
              display: 'flex',
              height: '100%',
              alignItems: 'center',
              padding: '10px',
              backgroundColor: '#252422',
              borderRadius: '24px',
              color: '#eb5e28',
            }}
          >
            <ScheduleIcon fontSize="large" />
            <Typography
              variant="h5"
              variantMapping={{ h5: 'h2' }}
              style={{ paddingLeft: '10px' }}
            >
              {item.summary}
            </Typography>
          </Container>
        </div>
      );
    }

    return (
      <div style={v.style}>
        <Container
          maxWidth="sm"
          style={{
            position: 'relative',
            display: 'flex',
            height: '100%',
            padding: 0,
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
              backgroundColor: '#252422',
            }}
          />
          {getAvatar(talents, item.description)}
          <Card
            style={{
              position: 'absolute',
              top: '10px',
              right: '0px',
              width: 'calc(100% - 66px)',
            }}
          >
            <ContainerDimensions>
              {({ width }) => (
                <>
                  <CardHeader
                    title={item.summary}
                    titleTypographyProps={{
                      variant: 'subtitle1',
                      variantMapping: { subtitle1: 'h3' },
                      style: {
                        width: `${width - 32}px`,
                        lineHeight: '1.2',
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                        textOverflow: 'ellipsis',
                      },
                    }}
                    subheader={item.description.split(' / ')[0]}
                    subheaderTypographyProps={{
                      variant: 'subtitle2',
                      style: { color: '#ccc5b9' },
                    }}
                    style={{
                      backgroundColor: '#403d39',
                      color: '#fffcf2',
                    }}
                  />
                  <CardMedia
                    component="iframe"
                    allowFullScreen
                    src={`https://www.youtube.com/embed/${
                      item.url.split('?v=')[1]
                    }`}
                    style={{
                      height: `${Math.round((width * 9) / 16)}px`,
                      border: 'none',
                    }}
                  />
                </>
              )}
            </ContainerDimensions>
          </Card>
        </Container>
      </div>
    );
  };

  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1.0,viewport-fit=cover"
        />
        <title>タイムライン</title>
      </Head>
      <CssBaseline />
      <div
        ref={containerRef}
        style={{
          height: '100vh',
          backgroundColor: '#ccc5b9',
          color: '#252422',
        }}
      >
        {containerRect !== null && (
          <VariableSizeList
            ref={listRef}
            overscanCount={3}
            width={containerRect.width}
            height={containerRect.height}
            itemCount={timelineItems.length}
            itemData={timelineItems}
            itemSize={i => {
              if (timelineItems[i].itemType === 'term') {
                return 88;
              }
              if (isXs) {
                return timelineItems[i].itemType === 'event'
                  ? Math.round(((containerRect.width - 78) * 9) / 16) + 95
                  : 48;
              }
              return timelineItems[i].itemType === 'event' ? 390 : 48;
            }}
          >
            {timelineItem}
          </VariableSizeList>
        )}
      </div>
      <Fab
        onClick={scrollToCurrent}
        style={{
          position: 'fixed',
          right: '20px',
          bottom: '20px',
          backgroundColor: '#eb5e28',
          color: '#252422',
        }}
      >
        <UpdateIcon />
      </Fab>
    </>
  );
};

export default TimelinePage;
