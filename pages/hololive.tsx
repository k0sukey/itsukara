import unfetch from 'isomorphic-unfetch';
import { NextPage } from 'next';
import React, { useEffect, useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Divider from '@material-ui/core/Divider';
import InputAdornment from '@material-ui/core/InputAdornment';
import InputBase from '@material-ui/core/InputBase';
import Link from '@material-ui/core/Link';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import SearchIcon from '@material-ui/icons/Search';

interface Liver {
  name: string;
  channelId: string;
  thumbnail: string;
}

const NijisanjiPage: NextPage = () => {
  const [livers, setLivers] = useState<Array<Liver>>([]);
  const [keyword, setKeyword] = useState<string>('');

  useEffect(() => {
    (async () => {
      const response = await unfetch('hololive.json');
      const plain = await response.text();
      const json = JSON.parse(plain);
      setLivers(json);
    })();
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(event.target.value);
  };

  return (
    <>
      {livers.length > 0 && (
        <List
          component="div"
          subheader={
            <ListSubheader
              component="div"
              style={{ backgroundColor: '#ffffff' }}
            >
              <InputBase
                fullWidth
                placeholder="Search"
                style={{ marginTop: '14px' }}
                onChange={handleChange}
                startAdornment={
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                }
              />
              <Divider light />
            </ListSubheader>
          }
        >
          {livers
            .filter(liver => {
              if (keyword === '') {
                return true;
              }
              const regex = RegExp(`${keyword}`, 'gi');
              return regex.test(liver.name);
            })
            .map(liver => (
              <ListItem
                key={liver.channelId}
                button
                component={Link}
                underline="none"
                href={`/holodule/${liver.channelId}.ics`}
              >
                <ListItemAvatar>
                  <Avatar alt={liver.name} src={liver.thumbnail} />
                </ListItemAvatar>
                <ListItemText
                  primary={liver.name}
                  primaryTypographyProps={{
                    color: 'textPrimary',
                    style: { fontSize: '1.05rem', fontWeight: 500 },
                  }}
                />
              </ListItem>
            ))}
        </List>
      )}
    </>
  );
};

export default NijisanjiPage;
