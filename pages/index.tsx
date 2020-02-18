import ical from 'ical.js';
import unfetch from 'isomorphic-unfetch';
import { NextPage } from 'next';
import React, { useEffect, useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Link from '@material-ui/core/Link';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Modal from '@material-ui/core/Modal';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import CheckIcon from '@material-ui/icons/Check';
import HelpIcon from '@material-ui/icons/Help';
import WarningIcon from '@material-ui/icons/Warning';
import Skeleton from '@material-ui/lab/Skeleton';

type Box = 'itsukara' | 'holodule';

const IndexPage: NextPage = () => {
  const [isOpen, setOpen] = useState<boolean>(false);
  const [itsukara, setItsukara] = useState<Date | null>(null);
  const [holodule, setHolodule] = useState<Date | null>(null);

  useEffect(() => {
    const getLastModified = async (box: Box, url: string): Promise<void> => {
      const response = await unfetch(url);
      const plain = await response.text();
      const parsed = ical.parse(plain);
      const component = new ical.Component(parsed);
      const description = component.getFirstPropertyValue('x-wr-caldesc');
      if (box === 'itsukara') {
        setItsukara(new Date(description));
      }
      if (box === 'holodule') {
        setHolodule(new Date(description));
      }
    };
    getLastModified(
      'itsukara',
      'https://vigilant-bartik-6c4b01.netlify.com/itsukara.ics',
    );
    getLastModified(
      'holodule',
      'https://vigilant-bartik-6c4b01.netlify.com/holodule.ics',
    );
  }, []);

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justify="center"
        style={{ minHeight: '100vh' }}
      >
        <Grid item>
          <Card style={{ minWidth: 340, maxWidth: 340 }}>
            <CardHeader
              title="配信スケジュール.ics"
              subheader={
                <Typography color="textSecondary">
                  Unofficial live stream schedule based on{' '}
                  <Link
                    color="textSecondary"
                    style={{ fontSize: '0.85rem' }}
                    href="https://nijisanji.ichikara.co.jp/"
                  >
                    にじさんじ
                  </Link>
                  (
                  <Link
                    color="textSecondary"
                    style={{ fontSize: '0.85rem' }}
                    href="https://www.itsukaralink.jp/"
                  >
                    いつから.link
                  </Link>
                  ) and{' '}
                  <Link
                    color="textSecondary"
                    style={{ fontSize: '0.85rem' }}
                    href="https://www.hololive.tv/"
                  >
                    ホロライブ
                  </Link>
                  (
                  <Link
                    color="textSecondary"
                    style={{ fontSize: '0.85rem' }}
                    href="https://schedule.hololive.tv/"
                  >
                    ホロジュール
                  </Link>
                  ).
                </Typography>
              }
            />
            <CardContent>
              <List>
                <ListItem
                  button
                  component={Link}
                  underline="none"
                  href="https://vigilant-bartik-6c4b01.netlify.com/itsukara.ics"
                >
                  <ListItemAvatar>
                    <Avatar>
                      <CalendarTodayIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={<Box fontWeight="bold">にじさんじ</Box>}
                    primaryTypographyProps={{ color: 'textPrimary' }}
                    secondary={
                      itsukara === null ? (
                        <Skeleton animation="wave" />
                      ) : (
                        itsukara.toLocaleString()
                      )
                    }
                  />
                </ListItem>
                <ListItem
                  button
                  component={Link}
                  underline="none"
                  href="https://vigilant-bartik-6c4b01.netlify.com/holodule.ics"
                >
                  <ListItemAvatar>
                    <Avatar>
                      <CalendarTodayIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={<Box fontWeight="bold">ホロライブ</Box>}
                    primaryTypographyProps={{ color: 'textPrimary' }}
                    secondary={
                      holodule === null ? (
                        <Skeleton animation="wave" />
                      ) : (
                        holodule.toLocaleString()
                      )
                    }
                  />
                </ListItem>
              </List>
            </CardContent>
            <CardActions>
              <img
                src="https://circleci.com/gh/k0sukey/itsukara.svg?style=svg"
                alt="CircleCI"
              />
              <img
                src="https://api.netlify.com/api/v1/badges/05f95ea1-c925-4e99-99d5-3975b5c9a310/deploy-status"
                alt="netlify"
              />
              <IconButton
                color="primary"
                onClick={handleOpen}
                style={{ marginLeft: 'auto' }}
              >
                <HelpIcon />
              </IconButton>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
      <Modal
        open={isOpen}
        onClose={handleClose}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Paper
          style={{ width: 300, height: 400, overflowY: 'scroll', padding: 20 }}
        >
          <Typography>
            このサイトは、にじさんじ・ホロライブの非公式スケジュール配信サイトです。
            いつから.linkとホロジュールから 1 時間に 1
            度情報を取得して、iCalendar 形式の{' '}
            <Link href="https://vigilant-bartik-6c4b01.netlify.com/itsukara.ics">
              itsukara.ics
            </Link>{' '}
            と{' '}
            <Link href="https://vigilant-bartik-6c4b01.netlify.com/holodule.ics">
              holodule.ics
            </Link>{' '}
            を自動生成しています。 配信されている .ics は、お使いの PC
            やスマートフォンのアプリに読み込ませて自由にご利用ください。
          </Typography>
          <Divider style={{ marginTop: 10 }} />
          <List dense>
            <ListItem style={{ padding: 0 }}>
              <ListItemIcon>
                <CheckIcon />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography style={{ fontSize: '0.85rem' }}>
                    Google カレンダーをお使いの方は{' '}
                    <Link href="https://support.google.com/calendar/answer/37100">
                      他のユーザーの Google カレンダーを追加する
                    </Link>{' '}
                    が参考になります
                  </Typography>
                }
              />
            </ListItem>
            <ListItem style={{ padding: 0 }}>
              <ListItemIcon>
                <CheckIcon />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography style={{ fontSize: '0.85rem' }}>
                    Mac をお使いの方は{' '}
                    <Link href="https://support.apple.com/ja-jp/guide/calendar/icl1022/mac">
                      Mac でカレンダーを照会する
                    </Link>{' '}
                    が参考になります
                  </Typography>
                }
              />
            </ListItem>
            <ListItem style={{ padding: 0 }}>
              <ListItemIcon>
                <CheckIcon />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography style={{ fontSize: '0.85rem' }}>
                    iPhone をお使いの方は{' '}
                    <Link href="https://vigilant-bartik-6c4b01.netlify.com/itsukara.ics">
                      itsukara.ics
                    </Link>{' '}
                    か{' '}
                    <Link href="https://vigilant-bartik-6c4b01.netlify.com/holodule.ics">
                      holodule.ics
                    </Link>{' '}
                    のリンクをタップするとカレンダーへ追加することができます
                  </Typography>
                }
              />
            </ListItem>
          </List>
          <Divider />
          <List dense>
            <ListItem style={{ padding: 0 }}>
              <ListItemIcon>
                <WarningIcon />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography style={{ fontSize: '0.85rem' }}>
                    まれに情報の取得に失敗することがあります。失敗した場合は、このサイトで表示されている何れかのバッジが
                    Failed 等になっていると思います
                  </Typography>
                }
              />
            </ListItem>
            <ListItem style={{ padding: 0 }}>
              <ListItemIcon>
                <WarningIcon />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography style={{ fontSize: '0.85rem' }}>
                    スケジュールは蓄積していませんので、過去に遡ってのスケジュールを確認することはできません（だいたい
                    1 日前くらいまでは確認できます）
                  </Typography>
                }
              />
            </ListItem>
            <ListItem style={{ padding: 0 }}>
              <ListItemIcon>
                <WarningIcon />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography style={{ fontSize: '0.85rem' }}>
                    カレンダーの性質上、終了時間が開始時間の 1
                    時間後になっていますが、必ずしもその時間にライブストリームが終了するとは限りません
                  </Typography>
                }
              />
            </ListItem>
            <ListItem style={{ padding: 0 }}>
              <ListItemIcon>
                <WarningIcon />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography style={{ fontSize: '0.85rem' }}>
                    何かありましたら{' '}
                    <Link href="https://twitter.com/k0sukey">k0sukey</Link>{' '}
                    までどうぞ
                  </Typography>
                }
              />
            </ListItem>
          </List>
        </Paper>
      </Modal>
    </>
  );
};

export default IndexPage;
