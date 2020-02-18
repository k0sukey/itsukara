import ical from 'ical.js';
import unfetch from 'isomorphic-unfetch';
import { NextPage } from 'next';
import React from 'react';
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from 'react-vertical-timeline-component';
import queryString from 'query-string';

type Box = 'nijisanji' | 'hololive';

interface Event {
  id: string;
  box: Box;
  title: string;
  description: string;
  start: number;
  url: string;
}
interface Props {
  itsukara: Event[];
  holodule: Event[];
}

const TimelinePage: NextPage<Props> = props => {
  const events = props.itsukara
    .concat(props.holodule)
    .sort((a, b) => b.start - a.start);

  return (
    <VerticalTimeline>
      {events.map(event => {
        const date = new Date(event.start);
        return (
          <VerticalTimelineElement
            key={event.id}
            date={date.toLocaleString()}
            className="vertical-timeline-element--work"
            contentStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}
            contentArrowStyle={{ borderRight: '7px solid  rgb(33, 150, 243)' }}
            iconStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}
          >
            <h3 className="vertical-timeline-element-title">{event.title}</h3>
            <p>
              <img src={`http://img.youtube.com/vi/${event.id}/mqdefault.jpg`} />
            </p>
          </VerticalTimelineElement>
        );
      })}
    </VerticalTimeline>
  );
};

TimelinePage.getInitialProps = async () => {
  const getEvents = async (box: Box, url: string): Promise<Event[]> => {
    const response = await unfetch(url);
    const plain = await response.text();
    const parsed = ical.parse(plain);
    const component = new ical.Component(parsed);
    return component
      .getAllSubcomponents('vevent')
      .map(v => new ical.Event(v))
      .map(v => {
        const url = v.component.getFirstPropertyValue('url');
        const parsed = queryString.parseUrl(url);
        return {
          id: parsed.query.v as string,
          box,
          title: v.component.getFirstPropertyValue('summary'),
          description: v.component.getFirstPropertyValue('description'),
          start: v.startDate.toJSDate().getTime(),
          url,
        };
      });
  };

  const itsukara = await getEvents(
    'nijisanji',
    'https://vigilant-bartik-6c4b01.netlify.com/itsukara.ics',
  );
  const holodule = await getEvents(
    'hololive',
    'https://vigilant-bartik-6c4b01.netlify.com/holodule.ics',
  );

  return {
    itsukara,
    holodule,
  };
};

export default TimelinePage;
