import ical from 'ical.js';
import unfetch from 'isomorphic-unfetch';
import { NextPage } from 'next';
import React, { useEffect, useState } from 'react';
import PacmanLoader from 'react-spinners/PacmanLoader';
import Avatar from '@material-ui/core/Avatar';
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
import CheckIcon from '@material-ui/icons/Check';
import HelpIcon from '@material-ui/icons/Help';
import ScheduleIcon from '@material-ui/icons/Schedule';
import WarningIcon from '@material-ui/icons/Warning';
import Skeleton from '@material-ui/lab/Skeleton';

type BoxType = 'itsukara' | 'holodule';

const IndexPage: NextPage = () => {
  const [isOpen, setOpen] = useState<boolean>(false);
  const [isLoaded, setLoaded] = useState<boolean>(false);
  const [itsukara, setItsukara] = useState<Date | null>(null);
  const [holodule, setHolodule] = useState<Date | null>(null);

  useEffect(() => {
    setLoaded(true);
  }, [itsukara, holodule]);
  useEffect(() => {
    const getLastModified = async (
      boxType: BoxType,
      url: string,
    ): Promise<void> => {
      const response = await unfetch(url);
      const plain = await response.text();
      const parsed = ical.parse(plain);
      const component = new ical.Component(parsed);
      const description = component.getFirstPropertyValue('x-wr-caldesc');
      if (boxType === 'itsukara') {
        setItsukara(new Date(description));
      }
      if (boxType === 'holodule') {
        setHolodule(new Date(description));
      }
    };
    getLastModified('itsukara', '/itsukara.ics');
    getLastModified('holodule', '/holodule.ics');
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
          {!isLoaded && <PacmanLoader />}
          {isLoaded && (
            <Card style={{ minWidth: 340, maxWidth: 340 }}>
              <CardHeader
                title={
                  <Typography
                    variant="h1"
                    color="textPrimary"
                    style={{ fontSize: '1.5rem' }}
                  >
                    <ScheduleIcon fontSize="small" /> 配信スケジュール.ics
                  </Typography>
                }
                subheader={
                  <Typography color="textSecondary">
                    Unofficial live stream schedule based on{' '}
                    <Link
                      style={{ fontSize: '0.85rem' }}
                      href="https://nijisanji.ichikara.co.jp/"
                    >
                      にじさんじ
                    </Link>
                    (
                    <Link
                      style={{ fontSize: '0.85rem' }}
                      href="https://www.itsukaralink.jp/"
                    >
                      いつから.link
                    </Link>
                    ) and{' '}
                    <Link
                      style={{ fontSize: '0.85rem' }}
                      href="https://www.hololive.tv/"
                    >
                      ホロライブ
                    </Link>
                    (
                    <Link
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
                <List dense component="div">
                  <ListItem
                    button
                    component={Link}
                    underline="none"
                    href="/itsukara.ics"
                  >
                    <ListItemAvatar>
                      <Avatar
                        alt="にじさんじ"
                        src="data:image/jpeg;base64,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"
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primary="にじさんじ"
                      primaryTypographyProps={{
                        color: 'textPrimary',
                        style: { fontSize: '1.05rem', fontWeight: 500 },
                      }}
                      secondary={
                        itsukara === null ? (
                          <Skeleton animation="wave" />
                        ) : (
                          itsukara.toLocaleString()
                        )
                      }
                    />
                  </ListItem>
                  <Divider light variant="inset" />
                  <ListItem
                    button
                    component={Link}
                    underline="none"
                    href="/holodule.ics"
                  >
                    <ListItemAvatar>
                      <Avatar
                        alt="ホロライブ"
                        src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4QAqRXhpZgAASUkqAAgAAAABADEBAgAHAAAAGgAAAAAAAABHb29nbGUAAP/bAIQAAwICCAgICAgICAgICAgICAgICAgICAgICAgGCAYHCAgICAgICAgICAgIBgYHCggICAgJCQkIBwsNCggNBggJCAEDBAQGBQYKBgYICAgKCAgKCAgICggICgoKCAgICAgICAgNCAgICAoICAgICAgICAgICggICAgICAgKCAgICAgI/8AAEQgBIAEgAwERAAIRAQMRAf/EAB0AAQABBQEBAQAAAAAAAAAAAAAFAQQGBwgCAwn/xABFEAACAQICBQcHCAkEAwAAAAAAAQIDEQQhBQYSMVEHEyJBYXGBIzI0UnSCkQhCYnKhsbLBFDVDU5Kis9HwM3OD4SRUZP/EABwBAQABBQEBAAAAAAAAAAAAAAAGAQIDBAUHCP/EAEYRAAIBAgIGBAoHBwIHAQAAAAABAgMRBCEFEjFBUWEGInGBEzIzUnKCkaGxsiM1QnN0wdE0U2KSs+Hwg6IUJENjZNLxVP/aAAwDAQACEQMRAD8A/VMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEZpPWbD0cqtaEH6rd5fwq8vsNinh6lTxIt87Ze3YczFaTwuFdq1aEHt1XLrexXl7ixwvKBg5uyxEE/pKUF8ZxivtMssFXjm4Pus/g2aVLpBo+q7RrwXpKUPnjFE/CaaTTTT3NZp9zNNq2076kpK6aaexo9FCoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAANacovKHKEnh8PLZlHKrUW9P1IcGvnS3rcs7td7A4JSXhKiun4sfzfLgt+15bfNekXSGdOTwuFlqtZVai2p+ZDn50tsfFXWu46tlK+bzbzbebb4t9ZIjy9tt3ebebb2t8XvbKAoSuhNaK+HfkqjiuuD6UH3xeSvxjaXaa9XD06vjxT57H7f1yOpgtJ4rBP6Co4q+cHnB9qeSvvcbS5mxtAcr9Kdo4iLpS9eN5U33rOcfhJcWjhVtGSjnTetyeT/R+7sPRsB0vo1Oriouk/PjeUO+15x9jS3yRnuExkKkVKEozi90otNfFHGlFxdpJp8GTulWp1oqdOUZxeyUWmvcfYtMwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABZaax/NUatT93TnP+GLa+4y0oa84x4yS9rNPG1/+Hw9St+7pyn/LFv8AI5wnUbbbd222297bzbfa22ydJJZLds7D5ycnJuUndttt8W3dt8282eSpaAAAAC90XpmrQltUqkqb69l5P60XeMveTMVSlCorTin/AJu3ruNzC4yvhZa9CpKm99nk/STvGXrJ8jYWgOWHdHEw/wCSmvtlBv7Yt/VOJW0XvpP1X+T/AF9p6DgOmGyGMh/qQXvlFu/fFvlFGwtF6YpVo7VKcZx+i812Nb4vsaTOJUpTpu001/m7+x6FhcZRxUNehOM1yezk1tT5NJl6YjcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIXXT0TE/7FX8EjawnloenH4o42mv2Cv9xU+RnPNSolvJulc+e5SUc2Ws8a+rIyKJrOs9x5WMkV1UUVWR96eMT35fcWOJmjVT25H3TLDMAAAfbCYydOSnTlKElulFuL7rrq7NzLZRjJWkk1wauZqVadGWvSlKEl9qLafZlu4p5PeZ5oDleqQtHEQ52PrwtGp4xyhL+TxONW0ZGWdN6vJ5r9V7yd4DpfWp2jioeFXnxsp96yhJ98e9mx9Ca0UMQr0qik+uLymu+Lz8d3acKrh6lJ9eLXPd7dh6NgtJ4bGq9CpGT3x2SXanZ99rcGSprnUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIXXT0PE/wCxV/BI2sJ5aHpx+KOLpr9gxH3FT5Gc01qt39xPUrHzfOWs7ngqWAAAHuFVrcyjVy5Sa2FzTxvExuPA2I1uJcRlfcWGdNPYVBUAHqE2mmm01mmnZp8U1mn3FGr5PMujJxalFtNZpp2afFNZp9hmegOVXEUrRq+Xgsuk7VEvr2e17ybfrI5VbR1OecOo+Wz2bu7ZwJlgOlWKw9o1vp4rLN2ml6Wet6ybe+S2mydAa9YbE2UJ7M3+zqWjPwzal7rZwq2Dq0c5K685Zr9V3o9I0fpzCY60ac9Wb/6c7Rl3ZtS9VvmZAaR3wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACD159CxXs9X8Ejcwfl4enH4o4enfq7Efh6nyM5oJ4fNwAAAAAAAKxm1uKFU2thc08bx+KLHHgbEa3EuYVE9xY1Y2FJPYeihUABoBq5lGgOUbE0LLa52HqVG219WfnLx2l2HPrYGlVztqvivzWz4PmSjAdIsZg+rreFh5k22/Vl4y79ZcjZOgOUzDV7Rk+Zm/m1GlFt+rPzXwV9lvgcGtgKtPNLWXFfmtvxR6Po/pLg8VaM34Gby1ZtWb4Rl4r4K9pPgZYmc0lhUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEHrx6HivZ6v4JG5g/Lw9OPxRwtO/V2I/D1PkZzO2Tw+bylwXC4AUgUsergoAAAAAmAnYuKeMfXn95Y4meNVrbmXVOsnuMbVjZjNS2HsoXAAAE5oDXPEYaypzvD93PpQ8FdOPuuJqVsLTrZyWfnLJ/370zt4DTOLwOVGd4r/AKcutDuV04+q1zubI0Bys0Klo1lzE+L6VN+9a8feSS4s4NbRtSGcOuvY/Zv7vYej4DpZhq9o4heAlxbvB+tZW9ZJLZdmb0ayklKLUovNNNNNcU1kzktNOzVuRNoTjOKlFqSeaaaaa4prJnsoXgAAAAAAAAAAAAAAAAAAAAAAAAAg9efQsV7PV/BI3MH5eHpx+KOFp36uxH4ep8jOZieHziUAAAAABVMFLFUwUKgAAAAA+9PFtdv+cSxxRljVa5lzTxKf/ZY4tGzGomfUtMgAABJaG1irYd3pVJRzu474Pvg+i++1+0wVaFOqrTinz39z2/kdHB6QxGCd6FSUM7uO2L7Yvq58bX5mxdAcsEJWjiIbD/eQvKHjHOUfBzOHW0XJZ0nfk8n7dj9x6JgOl9Odo4uGo/3kLuN+azlHucjPsBpGnVip05xnF9cZKS7stz7HmjizhKDtJNPg0T6hiKWIhr0ZxnF/ajJNdmW/itq3lyWGwAAAAAAAAAAAAAAAAAAAAAACD149DxXs9X8EjcwXl6fpx+KOFp36uxH4ep8jOZSeHziAAAAAAAAAVTAsVTBbYqAAAAAD608S1/2WuKZkjUaLqni0+z/OJjcWbMaqe3I+xaZQAAC60dpOpRlt0pypy4xdr9jW6S7JJoxzpxqK00muf5b13G1h8TWw0/CUJypy4xe3k1sa5STRsDQHLDJWjiYbS/eU1Z+9Buz74tfVOLW0WnnSdv4X+T/X2k/wHTCStHGQ1v8AuQVn60W7Pm4tcomxNEafo11tUakZrrSfSjf1ou0o+KRw6tGdJ2nFr4Psex9x6HhMfh8ZHWoVIz4pPNX85O0o96RIGE3wAAAAAAAAAAAAAAAAAAAQevHoeK9nq/gkbuC8vT9OPxOFp36uxH4ep8jOZSdnziAAAAAAAAAAAAVTAKpgpYqCgAAAAPdOs1uKNJl8ZuOwuqeMXXl9xjcTYjVT25FwmWGdO4AAB9MPiJQkpQlKMlulFuLXirMtlFSVmk1wZkp1J05KdOUoyWyUW013qzNn6hcpMpyjQxLvKTUadWyV5PJQnbK73RkkrvJ5tNx/GYBRXhKWxZyjy4rlxXesj07QPSSVWaw2Labk0qdWyV5bFCdsrv7Mkld5POzeyzgnpIAAAAAAAAAAAAAAAAABB68eh4r2er+CRu4Ly9P04/E4Wnfq7Efh6nyM5lJ2fOIAAAAAAAAAAAAAABW4BVSBSxUFAAAAAeoVGtxRq5VSa2FzTxvH7Cxx4GzGtxLmM09xjM6aewqCpVSazTs1mmsmmtzXagVu1mm01mmtqa2Nc09h0doLHOrRpVHvnThJ98opv7SC1oalSUeEmvYz6MwNd4jDU6z2zpxm+2UU2X5hN4AAAAAAAAAAAAAAAAEHrx6HivZ6v4JG7gvL0/Tj8Thad+rsR+HqfIzmUnZ84gAAAAAAAAAAAAAAAAAAA9KQKWK3BQAAAAFYytuBVNrYXFPG8TG48DPGtxLygttpRzcmklxcskvizG+rm92ZtQTqNRhm20kubyS9p0foHC7FClD1acI/wxS/IgtaWtUk+Mm/az6MwFJUsNTpr7NOMfZFIvzCb4AAAAAAAAAAAAAAAAIPXj0PFez1fwSN3BeXp+nH4nC079XYj8PU+RnMpOz5xAAAAAAAAAAAAAAAAAAAAAABXaBSx6TBQAAAutH6MqVXs04OT67bl3t5LxZZOcYK8nb/ADcbOHw1XES1aUHLjbYu1vJd77DYOqWqPMNVKjUqnUl5sE99r2vLtsrdXE4+IxHhFqxyXvf9ifaK0SsJLwtVqU9yXixW+17XlztlsW9vcGj30IfVX3EWqeM+09ew3ko+ivgXBjNgAAAAAAAAAAAAAAAAEHrx6HivZ6v4JG7gvL0/Tj8Thad+rsR+HqfIzmUnZ84gAAAAAAAAAAAAAAAAAAAAAAAAAvtGaIq1nanBy4vdFd8nku7f2GOdSMPGduW828Pg6uJdqUXLi9kV2t5d23kZpofk9hGzrS236kbqC73lKX8vccypjG8oK3N7f0XvJfhOj9OHWxEtd+arqPtylL3LimZbQw8YJRjFRityikkvBHPbbd278yV06cacVGEVFLYkkl7j3KSWbySzb4Jb2U27C9u2bMv1Vx6q4ahUW6pShNd0opr7Gjk4qm6dacH9mTT7U7MmWjqqq4WlUWyVOMl2OKa9xKmqdEAAAAAAAAAAAAAAAAEHrx6HivZ6v4JG7gvL0/Tj8Thad+rsR+HqfIzmUnZ84gAAAAAAAAAAAAAAAAAAAAAAkNFaCq1n5OLa65PKC75fkrvsMVSrGn4z7t5vYXBVsS/oo3W+Tyiu1/krvkZrojk+pws6r5yXq7oL85eNl2HMqYyTyh1ee/8AsTDCaBpU+tWfhH5uyK/OXfZPgZTSpKKSikkskkkku5LJGg23m8yTRiopRikktiSsl2WyPRQuPli8bCnFzqSjCEd8ptRiu9uyL4QlN6sU5N7Eld+4snUjTi5TailtbaSXbfI1drvynwrRlQwzbi8qlRpraj1xgnnsvdKTtdZJWd3KcDoyVJqrW2rOMeD4y5rcls2vgQ3SOmI1oujQd08pz2XW+Mb7nvb2rJZO5vrk69Awfs1H+nEgmkf2qr97L5mew6F+r8P9xT+SJkRzjsgAAAAAAAAAAAAAAAAg9ePQ8V7PV/BI3cF5en6cficLTv1diPw9T5Gcyk7PnEAAAAAAAAAAAAAAAAAAAEnonVytW8yPR9eWUPj190UzDUrQp+M8+G//ADtOjhdH18VnTjl57yj7d/qpmbaI1BpQs6nlZcGrQXu5395tPgjmVMXKWUeqvf8A52Exwug6NLrVfpZcGrR9md/WbXJGTRikrJWSySWSXcjQJGkkrLJLYioKlvpDSVOlFzqzjTgt8ptRXdnvfYs2ZKdOdSWrCLk+CVzFVqwpR16koxS3tpL3/A1prLy3RV44WG2/3tVNQX1aeUpd8nDudyS4bQjfWryt/DGzfe9i7k+4iWL6QxXVw0db+OV0u6OUn3uPeav01p6tiJbdapKo1uv5sb+rFWjHwSv13JRRoU6C1acVHjba+17X3kPxGJq4iWtVk5NbL7F6KWS4ZK733LKnUs011GZq5rp2zO0uTeV9H4J//LQ/pxPGdJZYqr97P5mfSuhHfR+Hf/j0/kiZIc47QAAAAAAAAAAAAAAAAIPXj0PFez1fwSN3BeXp+nH4nC079XYj8PU+RnMpOz5xAAAAAAAAAAAAAAAABL6I1XrVrOMdmPrzyj4dcvdTXajXqV4U9rz4Lb/bvOrhNG18TnGOrHz5ZLu3y7lbmjNtEai0adnPysuMl0V3Qz/mcvA5lTFzlkuquW32/oTDCaFoUetP6WXGS6qfKOf+5vlYyNI0iQAFSz0ppilQjt1qkKceMna74RW+T7IpszUqM6stWnFyfJe98FzeRgrV6dCOvVlGC4t2u+C4vkszWWsvLdvjhKf/AC1U/wCWnk+5za7YEmw2hN9eXqR/N/8AquxkQxfSH7OGj680/dHJ98mrb4s1lpXTFWvLbrVJVJdTk91+qKyjFdkUkSalRhSjq04qK5fnvfeyI1q9SvLXqyc3xe7sWxdiSLMzGAAHmpUSTb3JXfgCp2byR1trRejpetg8O/jSgzxvSitjKy/70/mZ9I6Ad9GYV8cLR/pxMtOWd4AAAAAAAAAAAAAAAAEHrx6HivZ6v4JG7gvL0/Tj8Thad+rsR+HqfIzmUnZ84gAAAAAAAAAAAAAm9Eao1q2ajsQ9eeS91edLvSt2mtUxEIb7vgvz3fmdjCaKxGIzUdSPnSTXsXjPt2czNtEalUaVm1zk/Wnayf0Y7l47T7TmVMVOeS6q4L8yY4TQ9Ch1mvCS86VrL0VsXfd8yfNM7oALDTOn6OHjt1qkaa6rvpSt1Rirym+yKZsUcPUrvVpxcuzYu17F3s1cRiaWHjrVZqK3X2vlFbW+STZq/WXltk7xwsNlbudqq8u+EL7Me+e19VEnw2hEutXlf+COzve191u0iGL6QyfVw0bfxyWfqrYu2V+cTWmkNJVK0nOrOVSb+dJ3fcupLsSS7CS06cKcdWEVFcEv8u+bzIlVqzqy16knJ8W7+zclyVkW5kMQAABb4rHRh5zz4LN/D+9kC5RbILSOlXPJZR4db7/7feXWM0Y2O7ORz9U6N9hwv9GmeNaV/ba330/nZ9E9H/qvC/haP9KJmJyjvgAAAAAAAAAAAAAAAAg9ePQ8V7PV/BI3cF5en6cficLTv1diPw9T5Gcyk7PnEAAAAAAAAAAE/ojUutVs2ubg/nTWb7oec/Gy7TVqYmEMtr4L9dh3MJofEYjNrwcfOks+6Pje2y4MzbQ+p9GjZ225+vOzt9WPmr4N9py6mJnPLYuC/PeTHCaJw+Hztry86WfsXir2X5k2ap2QARendZ6GGjtVqkYcI75y+rBXk+9Ky62jaoYWrXdqcW+L2JdreS9pp4nF0cNHWqzUeC2t9iV5PuRq3WXlrqTvHCw5qO7nJpSqd8Y5wj7234Epw2hYR61Z6781XUe95SfdbvIdi+kE53jh46i8+VnLtSziuV9bsRrnGY2dSTnUlKc3vlJuTfi+rs3IkUIRgtWKUUtyVl7iK1KkqktecnJva223793LYtx8S8xgAAFtitIwhvefBZv/AK8bAuUWyGxWm5Syj0V2b/j1eFi6xlUEiObKmQMA775HY20To2+/9Bw39GmeM6V/ba330/nZ9DaATWjMKn/+Wj/SiZgco74AAAAAAAAAAAAAAAAIjW7DueFxMVvlQqpd7hI2sLLVrQfCa+JyNMU3UwNeC2yoVEu1wZzAmT4+a07gAAAAAFUgVMi0RqNWqWclzUOMl0n3Q3/xbPiadTFQhkus+Wz2/od7CaFr1utNeCjxl4z7I7V61u8zbRGqtGjZxjtT9eecvDqj7qT7WcypiJ1Mm7Lgv8z7yY4TRlDDZxjrS8+Wb7ty9VLnclzWOsACH1g1uw+FV61RRfVBdKpLuhG7t9J2j2o3MPg6uIf0cW1vlsS73l3LPkaGKx1DCq9WaT3RWcn2JXdubyW9mq9ZOWitUvHDx5iPry2ZVX98IeG0+EkSrDaFpwzqvXfBXUfyk++y4ohuL0/VqdWgvBLznZz/ADiuGWs+DTNeYjESnJynKUpPfKTcpPvbu2SCMVFasUklsSVl7iLylKb1pNyb2tttvtbzPBcWgAAFpitJwhvd3wWb8epeILlFshsXpmcsl0V2b/j/AGsXWMqgkWBUyAAAEzqdqhVx+JpYWint1ZJSkt1Kndc5VlfLZpxbl9J7MVdzSerisTDC0pVqmyKyXnS+zFc5PLkrt5Js28HgqmNrRw1K+tN2bVurC6U6jvlaCd+btFXckn+hWj8DGlThSgrQpwjCK4RglFL4JHiM5ucnKWbk232t3Z9LU4RpxUIqyilFLklZFwWGQAAAAAAAAAAAAAAAAFtpL/Tn9SX3My0vHXajUxfkZ+g/gc564auOjNzivJTd0/VbzcHwXq8Vl1E4w9ZVI2e1e/n+p8+6W0e8NUdSK+jm7p+a3m4vgvN5ZbUY8bZwQAVjFt2Su3uSzb7l1gqk27LNvYltfYZNojUKrUs6nko9uc33R6veafYzSqYuEco9Z+7/ADsJFhNB1qvWq/RR55yfYt3rO64Ga6J1ao0fMjeXry6Uvj83uikjl1K86m15cFs/ztJjhdHUMN5OOfnyzl/bsikiUMB0gAQWseu+Gwq8rUW31U4dKo/dXm983Fdpv4bA1sR4kcvOeUfbv7FdnNxekKGFX0ks90FnJ9y2dsrLmap1k5Y8RVvGgv0eHFWlVa7ZWtD3FdesSrDaHpU86n0j4bIru2vvy5EMxenq1Xq0V4KPHJzffsj6ufCRgVSo225Nyk83KTbk3xbd232tneSSVkkktiWS7rZEabbd2229rbbb5tvNvmzyVKAAAFli9LQhle74L83uX39hWxeotkPi9Lzll5q4L83v+5FbGVRSLEqXgAAFYQbaSTbbskk2231JLNvsRR5Zvdtf6hZuyzbySWbb4JLNvkszb+oPyY8fi7TxC/QqLs/KLaryWT6NFPoda8rKEk/mNb4zjekGHodWn9NLl4qfOW/1U0+KJno3opjMVadZf8PD+JXqNZPKKfV22+kakms4NbenOTvkswejKbhhoPbnbna9R7Vars7tqVklFZtU4RhTTbainJt+fY7SNfGyvVeS8WCyjG/Bb3u1pNyaSTdkj1bRehsNo2DjQi9aVtepJ3nKysrvJJbWoQUYJuTUU5O+XnMO4AAAAAAAAAAAAAAAAAAWOm66jRqSe5Qlf4GehFyqRS3tGljZatCbe6D+BgtWipJxkk08mmrprg08mdpNp3WRBJQjJOMkmnk01dNcHcxfH8ndKTvCUqfZ58fBNpr+I34YyS8ZKXufu/QjdfQFCbvTlKny8aPvs/8AdYtaPJpG/SrNrhGCT+LlL7i9457orvf/AMNaHR2N+vVbXBRS97cvgZJorQFKj/pwSfXJ5zfvPNLsVl2GlUrTqeM+7cSHDYGhhvJwSe+Tzl7XnbkrLkSBhN8AGOay8oGGwt1UntVF+yp2lU8c1GHvyj2XOjhtH1sRnGNo+fLJd299yZysXpPD4XKcry8yNnLvzSXrNGqdZeV3E17xpf8Aj03ddB3qNdtSycfcUWuLJXhtEUaWc/pHzXV7lv8AWv2IheL05Xr3jT+ij/C+s1zlk16tmnvZg0pXbbzbd23m23vbfW+07mzIjvPjm3xfF8wAAAAWGK0xCOS6T4Ld4v8AtcrYvUGyHxelZz67Lgvze9/d2FTKopFmVLwAAD3QoSnJQhGU5ydowhFylJ8IxinKT7EmyjairtpJbW2kl2t5LvKpOTUYpybyUUm23wikm2+SVzc+oXyWcbiXGeMawVF57OU8TLglDOnSus9qpKUlknSd3aK43pFh6N40fpZcc1Bd/jS4WikntUuM30d0RxeJaliWsPDerqVV7lZZwjfxlKUpNbHTzy6P1G5IsBo5Xw9CPOWs69Tyld33+Uldxi/Up7Ed2WRBMZpPEYvys3q7oLKPsW183d8z1DR+hMHgM6FNa2+pLrTd82taV2o3+zG0eCMyOUd0AAAAAAAAAAAAAAAAAAAAAxblS/VuPza/8TEZrevJTzXadXRX7ZR++h8yI/0h+q8VZtf8rWzWTX0cs1zW413yf64RxdCLbXPQSjWj17W7bS9WpZyXB3XzTvaQwbw1RpLqybcHy83tjsfc95AtGY9Yukm2teKSqLn5y/hla64ZrajJzmHYAAAMW1m5SMLhbxc+cqL9lStKSf0ndRh4vat81nUw2ja2IzS1Y+dLJd299ytzRxsXpbD4bJy15L7EbN9+dl3u/BM1RrLyrYrEXjF8xTfzaTe019KrlJ90VBPc0yV4bRVCjm14SXGSy7lmvbd8LELxemsRiOrF+Cjwi3fvlk/5dXg7owz/AD4nZOCVAAAAI7FabhHJdJ9m74/2uVsZFBsh8VpKc97suCyXjx8SplUUi1KlwAAB9sDgp1Zxp0oSqVJu0acIuc5PsjFNu295ZLN2sWTlGEXKTUUtrbSS7W8i6EJVJqnBOUpZRjFNyfYld5b3sSzdkbw1A+Sliq+zUx01haWT5qDU8RJcJPOlS6uurLenGDREsb0jo0urh14SXnO6guzZKXsiuDaJ7o3ofiKzU8W/ARyeompVHxT2whu3zbTd1Bo6L1K5MMDo+NsLh4Qla0qr6dafX0qsrzau29lNQW5RSSRBcXpDEYt/TTbV7qOyK7ErK/O13vbZ6dgNEYTAL/l6UYtqzm+tOSu31pSvJq7dlfVWyKSsjKjnHYAAAAAAAAAAAAAAAAAAAAAAAAMX5Uv1bj/ZMR/SmdXRX7ZR++h8yI/0g+q8V+Fq/wBORxzovSlSjNVKU3Ccd0lwdrprc4uyvFpp2WWSPXqtKFWLhNKSe5/FcGtzWZ860a06M1UpycZLY1we1Pc07K6eWS3pGzdDcumSWIoXdvPoySu/9ue7wqPuRGa2gs70p+rJfmtv8pLqHSPK1en60Hte/qytb+d9xIYrl0oJdChWlLqUnCC8ZJ1GvCLNeGgqrfWnBLlrN+9R+JtT6R0UupTqSe5PViu9pyf+1mCaycpuKxN47XM03+zpNq64Tn50u7oxfqnew2jKFDO2vLzpZ+xbF73zI3i9L4jEZX8HHzYXX8z8Z+5NbUYkkdU4iVskVBUAFGwCNxWnIxyj0n9nx6/D4lbGRQe8h8VpCU97y4LJfDr8blTKopFuVLgAAC60XourXqRpUac6tWXm06cXOb7bK7srq8nkutox1KkacXOclGK2ybsvfv4La9xkpU51pqlSjKc3shFNya2Xstyurt5Le0b21B+SXXqbNTSFVYeGTeHotTrNZO06udOnndNQVV2+dFvKH43pLTheOGjrvz5XUe1Lxpcr6ue1NHoOjuhtapaeMn4KO3wULSm1k7SlnCOd1JRU7rOMovNdFan8n+DwENjCYeFK6SlNK9Sdt3OVZXqT3fOkyDYrG18U9atNy4L7K9FK0V3I9NwOjMLgY6uHpRhe13tlKysnOTvOTtvk2zITROmAAAAAAAAAAAAAAAAAAAAAAAAAAAYnys1dnRekJPqweIfwpTOron9to/fQ+ZEf6Q/VeK/C1v6UjjM9jPm8AAAAAApKVs3kuLAIzFaeisorafHcv7v7O8rYyKHEh8VjZT85+HUvAqZUkth8CpcAAAX2hNBV8TUVHD0qleq/mU4uTSfXLqhH6U3GK62jDVrU6MderKMI+dJ2XYt7fJXfIzUKFXET8FQhKpPbqRV3bc3uins1pNR4s37qD8kictmppGtsR/8AWw7vN8OcrvKPWnGnFvNWqRtnDMb0miurhY3f7yez1Y7+Tk1ziei6O6GTk1PHVFFfuabes+GtPKyte8YRvezVRWs+htVtTMLgqfN4WhToxectiPSm0rbU5u8pytlebbIRiMXWxMtatOU3uu8kuCWxLkkel4PAYfBw1MPThTTd3qrOTsleT2ydkleTbyJo1DfAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMN5Zv1RpP2HFf0ah1tE/ttH76Hzoj/SH6rxX4Wt/SkcTaI0ipJRb6SyX0kvz4/Hiexs+c5RtmSZQxgA8zqJK7aS4vJAEXitPJZQV3xeS+G9/YVsZVDiRGIxcp+c79nUu5biplSSPiVKgAAEnq5qxiMZU5rC0aleeV1Ti2oXvZ1J+ZTjk+lOUU92/I16+Ip4eOvVnGC4t7fRW1vlFNmxhsNWxVTwWHhKpLeoq6je7Tm/FgnZ2c2k9iu8joLUL5IyyqaSrX3P9Gw7aXXlUr5Sd1a6pRhZ3tUlchWM6TfZwsP9Sa+WOzvk3dbYo9J0d0Lv18dU/wBKm2uOUp5SeVsqai4tO05I6D1f1Zw+EpqlhqNOjTXzacVG7zzk1nKTu25SbbbeeZCa+IqV5a9Wcpvi3fuXBclkelYbCUcLDwdCnGnFfZjFJXbu27bW2223m222SZrm0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAYbyzfqjSfsOK/o1DraJ/baP30PnRH+kP1Xivwtb+lI4GTPZT56L+hpupHhL62/4pp/G5SxY4Jn1nrBPqUV8X+YsU1ER9fEyk7ybf8AnUtyBelbYfMqVAAAJrVTUvFY6fN4ShUrO9pSirU4bn5SrK1OGTTtKSb6kzUxOKo4aOtWnGC3JvN+il1n3Ky32NzB4KvjZ6mHpyqO9m0urF5ePJ2hF2adm9ZrYmdDag/JIpx2amkazqyVn+jUG4Ut3m1KtlVqJPPyfM7kntK6cJxvSaTvHCw1Vs8JLOXbFeKsvO1uVmelaO6FxVqmNqa7WfgabtDZsnJpTkk81q+DT2SUo3T37obQdHD01SoUqdGnHJQpxUIq3Yks+3eQurWnWk51JSk3tbbb956PQw9LDwVOjCNOKyUYxSS7ErIvjCbAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABD646C/SsJicNu5+hVpX3f6sJQ7eJtYWt4CtCr5k4y/laZo47DLFYarh3sq0p0368XH8z87qtGUW4zTjODcJxe+M4NxlF9sZJxfaj3BNNXi7pq6fFPNNcms0fM9mspKzTcZR3qUXaUXbK8ZJp80eSpUAAAAGQ6ncn2Nx8tnCYedVXs6ltijDOz2qsrQurO8YuU8naL3GjisbQwqvWmo8I7ZPsSzz4u0eZ0MFo7E46WrhqUp8Z7ILOzvJ2jk1nGLc8sos6K1B+SZh6WzUx9R4maz5ineGHW7znlVqtW404O7ThLeQfG9Jak+rho+DXnuzn3fZj73waPTdHdDaNNqeMn4V/u43jTWzxvtzaz3xg07OD2m9tG6Lp0YRp0acKVOKtGFOKhGK7IxSSIdUqTqScpycm9rbbb9p6HSpQoxUKcYwilZRikklySyLoxmUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHOHyg+QCpVqSx+Ag5zm74nDRttTf7+isrzdvKU98/Oj0tpTnehNNRhFYfEOyXk6j3LzJcvNlu2Pq2cfLukvRupUm8Zg4uTk/pqKtdvZ4Wne3W/eQv1l1oddONTmScGm001JOzjJNSi11Si7NNcGkyf7c1nfY9z5rc1zPKt9ndNZNNNNPg07NPimrooVKmU6k8mOO0hJLC0JShezrz8nQje+bqSyla2caaqTWXRzOdi9IYfCL6WaT3QWcn3LZ2ysuZ1MBovFY92w9JyW+o+rTV756zylszVNSkrq6szozUP5KGEobM8dN4yqrPm1enhotO9nBPbqrcmqktiSWdNXaINjOklapeOHXgls1snP27I8tVay849N0f0Nw1K0sXJ15bdTONJWbyaT1pqztJVG4St4iu0bwwmEhTioQjGEIq0Ywioxil1KKSSXYkRCUnJ60m23tbd2+256DCEYJRilFLJJJJJcrZH2LS8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAxvWXk4wGMd8ThKFWVrbcoJVLdlSNprwll4m/h8fiMPlSqTiuCeXsd4+45eL0XhMW716NOb2KTitZdklaS7mQujOQbQ9GW1DA0W1ZrnXUrpW4RrTqRXwNuppnG1FZ1pL0dWPyKLOfR6OaNpPWjh4N7VruVSzW9eElNLuM7o0VFKMUoxSskkkkl1JLJI4zbbu8+ZI0klZKyWxI9lCoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB/9k="
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primary="ホロライブ"
                      primaryTypographyProps={{
                        color: 'textPrimary',
                        style: { fontSize: '1.05rem', fontWeight: 500 },
                      }}
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
                  aria-label="このサイトは何？"
                  style={{ marginLeft: 'auto' }}
                >
                  <HelpIcon />
                </IconButton>
              </CardActions>
            </Card>
          )}
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
            <Link href="/itsukara.ics">itsukara.ics</Link> と{' '}
            <Link href="/holodule.ics">holodule.ics</Link>{' '}
            を自動生成しています。 配信されている .ics は、お使いの PC
            やスマートフォンのアプリに読み込ませて自由にご利用ください。
            配信者個別のスケジュールが欲しい方は<a href="/nijisanji">こちら</a>
            からどうぞ。
          </Typography>
          <Divider style={{ marginTop: 10 }} />
          <List dense>
            <ListItem style={{ padding: 0 }}>
              <ListItemIcon>
                <CheckIcon color="primary" />
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
                <CheckIcon color="primary" />
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
                <CheckIcon color="primary" />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography style={{ fontSize: '0.85rem' }}>
                    iPhone をお使いの方は{' '}
                    <Link href="/itsukara.ics">itsukara.ics</Link> か{' '}
                    <Link href="/holodule.ics">holodule.ics</Link>{' '}
                    のリンクをタップするとカレンダーへ追加することができます
                  </Typography>
                }
              />
            </ListItem>
          </List>
          <Divider variant="inset" />
          <List dense>
            <ListItem style={{ padding: 0 }}>
              <ListItemIcon>
                <WarningIcon color="error" />
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
                <WarningIcon color="error" />
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
                <WarningIcon color="error" />
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
          </List>
          <Divider variant="inset" />
          <List dense>
            <ListItem style={{ padding: 0 }}>
              <ListItemIcon>
                <HelpIcon color="action" />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography style={{ fontSize: '0.85rem' }}>
                    何かありましたら{' '}
                    <Link href="https://twitter.com/k0sukey">@k0sukey</Link>{' '}
                    まで
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
