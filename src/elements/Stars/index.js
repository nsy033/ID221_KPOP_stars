import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import dataset from '../../data/dataset_refined.csv';
import billboard_in from '../../data/billboard.csv';
import './index.css';
import round_num1 from '../../images/numbers/1.png';
import round_num2 from '../../images/numbers/2.png';
import round_num3 from '../../images/numbers/3.png';
import round_num4 from '../../images/numbers/4.png';
import round_num5 from '../../images/numbers/5.png';
import round_num6 from '../../images/numbers/6.png';
import round_num7 from '../../images/numbers/7.png';
import round_num8 from '../../images/numbers/8.png';
import round_num9 from '../../images/numbers/9.png';
import round_num10 from '../../images/numbers/10.png';
import round_num11 from '../../images/numbers/11.png';
import round_num12 from '../../images/numbers/12.png';
import round_num13 from '../../images/numbers/13.png';
import round_num14 from '../../images/numbers/14.png';
import nobody from '../../audio/nobody.mp4';
import gangnamStyle from '../../audio/gangnamStyle.mp4';
import gentleman from '../../audio/gentleman.mp4';
import ddudu from '../../audio/ddudu.mp4';
import howYouLikeThat from '../../audio/howYouLikeThat.mp4';
import lovesickGirls from '../../audio/lovesickGirls.mp4';
import thatThat from '../../audio/thatThat.mp4';
import dna from '../../audio/dna.mp4';
import fakeLove from '../../audio/fakeLove.mp4';
import boyWithLuv from '../../audio/boyWithLuv.mp4';
import onBTS from '../../audio/on.mp4';
import dynamite from '../../audio/dynamite.mp4';
import lifeGoesOn from '../../audio/lifeGoesOn.mp4';
import butter from '../../audio/butter.mp4';

function Stars() {
  // consts
  const columns = [
    'full_title',
    'singer',
    'date',
    'year',
    'genre_refined',
    'rank',
    'lyric_rat',
    'billboard_200',
    'billboard_hot100',
  ];
  const startYear = 1990;
  const radialRange = [0.2, 0.95];
  const chartSize = 2.1;

  const radian = (deg) => (deg * Math.PI) / 180;
  const sounds = [
    0,
    new Audio(nobody),
    new Audio(gangnamStyle),
    new Audio(gentleman),
    new Audio(ddudu),
    new Audio(howYouLikeThat),
    new Audio(lovesickGirls),
    new Audio(thatThat),
    new Audio(dna),
    new Audio(fakeLove),
    new Audio(boyWithLuv),
    new Audio(onBTS),
    new Audio(dynamite),
    new Audio(lifeGoesOn),
    new Audio(butter),
  ];

  // use state
  const chartRef = useRef();
  const billboardRef = useRef();
  const [songs, setSongs] = useState([]);
  const [songIndex, setSongIndex] = useState({});
  const [billboards, setBillboards] = useState([]);
  const [numImgs, setNumImgs] = useState([]);
  const [width, setWidth] = useState(window.innerWidth * 0.97);
  const [height, setHeight] = useState(window.innerHeight * 0.97);
  const [selected, setSelected] = useState(0);

  // handler
  const handleResize = () => {
    if (
      Math.abs(width - window.innerWidth) >= 30 ||
      Math.abs(height - window.innerHeight) >= 30
    ) {
      setWidth(window.innerWidth * 0.97);
      setHeight(window.innerHeight * 0.97);
    }
  };

  // making interactions (mouse hovering event) on billboard list
  const handleMouseEnter = (event) => {
    const id = event.target.id;
    if (id.length > 0 && Number(id.split('-')[1]) != selected) {
      const idNum = Number(id.split('-')[1]);
      const listElem = document.getElementById(id);
      listElem.style.background = 'rgba(255,255,255,0.2)';
      setSelected(idNum);

      sounds[Number(id.split('-')[1])].play();
    }
  };
  const handleMouseLeave = (event) => {
    const id = event.target.id;
    if (id.length > 0) {
      const listElem = document.getElementById(id);
      listElem.style.background = 'transparent';
      setSelected(0);

      sounds[Number(id.split('-')[1])].pause();
      sounds[Number(id.split('-')[1])].currentTime = 0;
    }
  };

  // use effect
  useEffect(() => {
    // add listener to window resize event
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    // get data from csv, the entire dataset
    d3.csv(dataset).then(function (rawData) {
      let updateSongs = [],
        alreadyAppended = [];
      let id = 0;
      for (let row of rawData) {
        let newSong = { id: id, count: 1, overlap: false };
        for (let col of columns) newSong[col] = row[col];
        id += 1;
        if (alreadyAppended.indexOf(newSong['full_title']) !== -1)
          newSong['overlap'] = true;
        updateSongs.push(newSong);
        alreadyAppended.push(newSong['full_title']);
      }

      let countUpdates = [];
      updateSongs.forEach(({ id, full_title, singer }) => {
        let sameSongs = updateSongs.filter((val) => {
          return val['full_title'] === full_title && val['singer'] === singer;
        });
        let counts = sameSongs.length;
        if (counts > 1) {
          sameSongs.forEach(({ id }) => {
            countUpdates.push([id, counts]);
          });
        }
      });

      for (let [i, c] of countUpdates) {
        updateSongs[i]['count'] = c;
      }
      setSongs(updateSongs);
    });
  }, []);
  useEffect(() => {
    // get data from csv, the additional dataset only for billboard songs
    d3.csv(billboard_in).then(function (rawData) {
      let updateBillboards = [],
        updateIndex = [];
      let id = 1,
        bts = 8,
        listid = 1;
      const bColumns = ['title', 'date', 'singer', 'lyric_rat'];
      for (let row of rawData) {
        let newSong = { id: listid };
        for (let col of bColumns) newSong[col] = row[col];
        if (row['singer'] === '방탄소년단') {
          newSong['hidden_id'] = bts;
          bts += 1;
        } else {
          newSong['hidden_id'] = id;
          id += 1;
        }
        updateBillboards.push(newSong);
        updateIndex[row['title']] = id;
        listid += 1;
      }
      setBillboards(updateBillboards);
      setSongIndex(updateIndex);
    });

    const updateNumImgs = [];
    updateNumImgs.push(round_num1);
    updateNumImgs.push(round_num2);
    updateNumImgs.push(round_num3);
    updateNumImgs.push(round_num4);
    updateNumImgs.push(round_num5);
    updateNumImgs.push(round_num6);
    updateNumImgs.push(round_num7);
    updateNumImgs.push(round_num8);
    updateNumImgs.push(round_num9);
    updateNumImgs.push(round_num10);
    updateNumImgs.push(round_num11);
    updateNumImgs.push(round_num12);
    updateNumImgs.push(round_num13);
    updateNumImgs.push(round_num14);
    setNumImgs(updateNumImgs);
  }, []);

  useEffect(() => {
    // draw billboard list
    const billboardList = d3
      .select(billboardRef.current)
      .attr('id', 'billboardList')
      .attr('width', width)
      .attr('height', height)
      .style('background-color', 'transparent');
    billboardList.selectAll('div').remove();

    const title = billboardList
      .append('div')
      .style('width', '65vh')
      .style('pointer-events', 'none')
      .style('font-size', '3.2vh')
      .style('position', 'absolute')
      .style('right', '6vh')
      .style('top', '6.5vh')
      .style('color', 'rgba(255,255,255,0.75)')
      .style('-webkit-text-stroke', '2px rgba(255,255,255,0.6)')
      .attr('text-anchor', 'end')
      .attr(
        'transform',
        `translate(${(height * chartSize) / 4}, ${height * 0.95})`
      );
    title.append('text').text('billboard hot 100');

    const songList = billboardList
      .append('div')
      .style('width', '66vh')
      .style('height', '30vh')
      .style('position', 'absolute')
      .style('display', 'flex')
      .style('justify-content', 'space-between')
      .style('right', '6vh')
      .style('top', '11.5vh')
      .style('color', 'rgba(255,255,255,0.85)');

    if (numImgs.length > 0 && billboards.length > 0) {
      const leftColumn = songList.append('div').style('margin-top', '1vh');
      let id = 0;
      for (let i = 0; i < 14; i++) {
        if (billboards[i]['singer'] === '방탄소년단') continue;
        const unitElem = leftColumn
          .append('div')
          .attr('id', `billboard-${id + 1}`)
          .style('font-size', '1.2vh')
          .style('width', '32vh')
          .style('display', 'flex')
          .style('padding-top', '1.2vh')
          .style('padding-bottom', '0.8vh')
          .style('border-bottom', 'rgba(255,255,255,0.3) solid 0.02vh');
        unitElem
          .append('img')
          .attr('src', numImgs[id])
          .style('width', '1.2vh')
          .style('height', '1.2vh')
          .style('margin-left', '1vh')
          .style('margin-right', '2vh');
        unitElem
          .append('text')
          .text(billboards[i]['title'])
          .style('display', 'inline-block')
          .style('width', '20vh');
        unitElem
          .append('text')
          .text(billboards[i]['singer'])
          .style('color', 'rgba(255,255,255,0.6)')
          .style('margin-right', '0.5vh');
        id += 1;

        unitElem.on('mouseenter', handleMouseEnter);
        unitElem.on('mouseleave', handleMouseLeave);
      }

      const rightColumn = songList.append('div').style('margin-top', '1vh');
      for (let i = 0; i < 14; i++) {
        if (billboards[i]['singer'] !== '방탄소년단') continue;
        const unitElem = rightColumn
          .append('div')
          .attr('id', `billboard-${id + 1}`)
          .style('font-size', '1.2vh')
          .style('width', '32vh')
          .style('display', 'flex')
          .style('padding-top', '1vh')
          .style('padding-bottom', '1vh')
          .style('border-bottom', 'rgba(255,255,255,0.3) solid 0.02vh');
        unitElem
          .append('img')
          .attr('src', numImgs[id])
          .style('width', '1.2vh')
          .style('height', '1.2vh')
          .style('margin-left', '1vh')
          .style('margin-right', '2vh');
        unitElem
          .append('text')
          .text(billboards[i]['title'])
          .style('display', 'inline-block')
          .style('width', '20vh');
        unitElem
          .append('text')
          .text(billboards[i]['singer'])
          .style('margin-right', '0.5vh');
        id += 1;

        unitElem.on('mouseenter', handleMouseEnter);
        unitElem.on('mouseleave', handleMouseLeave);
      }
    }
  }, [numImgs, billboards]);

  useEffect(() => {
    // draw chart grid
    const chart = d3
      .select(chartRef.current)
      .attr('width', width)
      .attr('height', height)
      .style('background-color', 'transparent');

    const gridScale = d3.scaleLinear().domain([1, 5]).range(radialRange);

    const lineGridLength = (year) => {
      if (year < 1995) return 2;
      if (year < 2000) return 3;
      if (year < 2007) return 4;
      if (year < 2009) return 5;
      if (year < 2017) return 4;
      return 5;
    };
    const arcGridAngle = (year) => {
      if (year < 1995) return { stepTo: 2, yearFrom: 1990, yearTo: 1995 };
      if (year < 2000) return { stepTo: 3, yearFrom: 1995, yearTo: 2000 };
      if (year < 2007) return { stepTo: 4, yearFrom: 2000, yearTo: 2007 };
      if (year < 2008) return { stepTo: 5, yearFrom: 2007, yearTo: 2008 };
      if (year < 2017) return { stepTo: 4, yearFrom: 2008, yearTo: 2017 };
      return { stepTo: 5, yearFrom: 2017, yearTo: 2022 };
    };

    chart.selectAll('.grid-tick-group').remove();
    const ticks = chart
      .append('g')
      .attr('class', 'grid-tick-group')
      .style('pointer-events', 'none')
      .style('font-size', '1.25vh')
      .attr('text-anchor', 'middle')
      .attr('fill', '#999999')
      .attr(
        'transform',
        `translate(${(height * chartSize) / 4}, ${height * 0.95})`
      );

    chart.selectAll('.grid-group').remove();
    const grids = chart
      .append('g')
      .attr('class', 'grid-group')
      .attr(
        'transform',
        `translate(${(height * chartSize) / 4}, ${height * 0.95})`
      );

    // draw arc grids
    let arcs = grids.append('g').attr('class', 'grid-arc-group');
    for (let year = startYear; year <= 2022; year += 1) {
      let pivot = arcGridAngle(year);
      for (let step = 1; step <= pivot['stepTo']; step += 1) {
        let r = gridScale(step);
        arcs
          .append('path')
          .attr('class', `arc-${r}`)
          .attr('d', () => {
            return d3.arc()({
              innerRadius: (height * 1.8 * r) / chartSize,
              outerRadius: (height * 1.8 * (r + 0.001)) / chartSize,
              startAngle: radian(
                (pivot['yearFrom'] - startYear) * (180 / (2022 - startYear)) -
                  90
              ),
              endAngle: radian(
                (pivot['yearTo'] - startYear) * (180 / (2022 - startYear)) - 90
              ),
            });
          })
          .attr('fill', '#444444');
      }

      if (
        (year === pivot['yearFrom'] && year !== 2008) ||
        year === 2012 ||
        year === 2022
      ) {
        let tickRadius =
          (height * 1.8 * gridScale(pivot['stepTo'])) / chartSize;
        let tickAngle = (year - startYear) * (180 / (2022 - startYear)) - 180;
        switch (year) {
          case 2022:
            tickRadius += height * 0.035;
            break;
          case 2007:
          case 2017:
            tickRadius -= height * 0.025;
            tickAngle -= 0.5;
            break;
          default:
            tickRadius += height * 0.025;
            break;
        }
        let tickX = tickRadius * Math.cos(radian(tickAngle));
        let tickY = tickRadius * Math.sin(radian(tickAngle));

        ticks
          .append('text')
          .text(year)
          .attr(
            'transform',
            `translate(${tickX}, ${tickY}), rotate(${
              tickAngle <= -90 ? tickAngle + 180 : tickAngle
            })`
          );
      }
    }

    // draw linear grids (radius)
    let lines = grids.append('g').attr('class', 'grid-line-group');
    for (
      let deg = 0, year = startYear;
      deg <= 180;
      deg += 180 / (2022 - startYear), year += 1
    ) {
      lines
        .append('line')
        .attr('class', `line-${deg}`)
        .attr(
          'x1',
          ((height * 1.8 * gridScale(1)) / chartSize) *
            Math.cos(radian(deg - 180))
        )
        .attr(
          'y1',
          ((height * 1.8 * gridScale(1)) / chartSize) *
            Math.sin(radian(deg - 180))
        )
        .attr(
          'x2',
          ((height * 1.8 * gridScale(lineGridLength(year))) / chartSize) *
            Math.cos(radian(deg - 180))
        )
        .attr(
          'y2',
          ((height * 1.8 * gridScale(lineGridLength(year))) / chartSize) *
            Math.sin(radian(deg - 180))
        )
        .style('stroke', '#444444');
    }

    const percents = ['0%', '25%', '50%', '75%', '100%'];
    for (let step = 1; step <= 5; step += 1) {
      ticks
        .append('text')
        .text(percents[step - 1])
        .attr('text-anchor', 'end')
        .attr(
          'transform',
          `translate(${
            (height * 1.8 * gridScale(step)) / chartSize - height * 0.01
          }, ${height * 0.02})`
        );
    }
  }, [width, height]);

  useEffect(() => {
    const chart = d3
      .select(chartRef.current)
      .attr('width', width)
      .attr('height', height)
      .style('background-color', 'transparent');

    // define definitions for the gradients, used to draw the tail of each star
    const defs = chart.append('defs');
    const grad = defs
      .append('linearGradient')
      .attr('id', 'traceGrad')
      .attr('r', '80%');
    grad.append('stop').attr('offset', '0%').attr('stop-color', 'transparent');
    grad
      .append('stop')
      .attr('offset', '47%')
      .attr('stop-color', 'rgba(128,240,255,0.25)');
    grad
      .append('stop')
      .attr('offset', '53%')
      .attr('stop-color', 'rgba(255,255,255,0.25)');
    grad
      .append('stop')
      .attr('offset', '100%')
      .attr('stop-color', 'rgba(255,255,255,0.8)');
    const gradTransparent = defs
      .append('linearGradient')
      .attr('id', 'traceGrad-transparent')
      .attr('r', '80%');
    gradTransparent
      .append('stop')
      .attr('offset', '0%')
      .attr('stop-color', 'transparent');
    gradTransparent
      .append('stop')
      .attr('offset', '47%')
      .attr('stop-color', 'rgba(128,240,255,0.1)');
    gradTransparent
      .append('stop')
      .attr('offset', '53%')
      .attr('stop-color', 'rgba(255,255,255,0.1)');
    gradTransparent
      .append('stop')
      .attr('offset', '100%')
      .attr('stop-color', 'rgba(255,255,255,0.4)');

    // for the glow effects
    const filter = defs.append('filter').attr('id', 'glow');
    filter
      .append('feGaussianBlur')
      .attr('stdDeviation', '2.5')
      .attr('result', 'coloredBlur');
    const feMerge = filter.append('feMerge');
    feMerge.append('feMergeNode').attr('in', 'coloredBlur');
    feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    chart.selectAll('.chart-contents').remove();
    const content = chart
      .append('g')
      .attr('class', 'chart-contents')
      .attr(
        'transform',
        `translate(${(height * chartSize) / 4}, ${height * 0.95})`
      );

    const unitDate = new Date(0, 1, 1);
    const startDate = new Date(startYear, 1, 1);
    const endDate = new Date(2022, 12, 31);
    const elapsedMSecMin = startDate.getTime() - unitDate.getTime();
    const elapsedMSecMax = endDate.getTime() - unitDate.getTime();

    const dayCountMin = elapsedMSecMin / 1000 / 60 / 60 / 2 / 4;
    const dayCountDiff = elapsedMSecMax / 1000 / 60 / 60 / 2 / 4 - dayCountMin;
    const rankedSongs = songs.filter(
      (song) => Number(song['rank']) <= 30 && song['overlap'] == false
    );
    let index = content.append('g').attr('class', `index-group`);
    for (let year = startYear; year <= 2022; year += 1) {
      const thisYear = rankedSongs.filter((song) => song['year'] === `${year}`);
      index.selectAll(`trace-group-${year}`).remove();
      index.selectAll(`head-group-${year}`).remove();
      let trace = content.append('g').attr('class', `trace-group-${year}`);
      let head = content.append('g').attr('class', `head-group-${year}`);

      for (let {
        id,
        date,
        full_title,
        singer,
        lyric_rat,
        billboard_200,
        billboard_hot100,
        count,
      } of thisYear) {
        if (Number(date.slice(0, 4)) < 1991) continue;

        const rat = Number(lyric_rat);
        const launch = [
          Number(date.slice(0, 4)),
          Number(date.slice(6, 8)),
          Number(date.slice(10, 12)),
        ];
        const thisDate = new Date(launch[0], launch[1], launch[2]);
        const elapsedMSec = thisDate.getTime() - unitDate.getTime();
        const dayCount = elapsedMSec / 1000 / 60 / 60 / 2 / 4 - dayCountMin;

        let unitDegree = -93 + (dayCount * 180) / dayCountDiff;
        const radiusScale = d3
          .scaleLinear()
          .domain([0, 100])
          .range(radialRange);
        let r = radiusScale(rat);

        const billboard =
          billboard_200 === 'TRUE' || billboard_hot100 === 'TRUE';
        const arcWidth = (height * 1.8) / 500000 / (billboard ? 0.8 : 4.5);

        const startRad = radian(
          unitDegree - (180 / (2022 - startYear)) * count
        );
        const endRad = radian(unitDegree + (180 / (2022 - startYear)) * count);

        const headSize = (height * 1.8) / 500 / (billboard ? 1 : 2);
        const dotDeg = radian(
          unitDegree + (180 / (2022 - startYear)) * count - 90
        );

        const myGrad = grad.clone(true);
        myGrad.attr('id', `myGrad-${id}`);
        const hiddenGrad = gradTransparent.clone(true);
        hiddenGrad.attr('id', `myHiddenGrad-${id}`);

        // draw each star trace
        if (selected > 0) {
          let selectedTitle = '',
            selectedSinger = '';
          for (let song of billboards)
            if (song['hidden_id'] === selected) {
              selectedTitle = song['title'];
              selectedSinger = song['singer'];
              break;
            }
          const drawPath = trace
            .append('path')
            .attr('class', `${year}-${full_title}-trace`)
            .attr(
              'd',
              d3
                .arc()
                .innerRadius((height * 1.8 * r) / chartSize)
                .outerRadius(
                  (height *
                    1.8 *
                    (r +
                      (full_title.includes(selectedTitle)
                        ? arcWidth * 2
                        : arcWidth))) /
                    chartSize
                )
                .cornerRadius(30)
                .startAngle(startRad)
                .endAngle(endRad)
            );

          if (full_title.includes(selectedTitle) && selectedSinger === singer) {
            console.log(full_title);
            drawPath.attr('fill', `url(#myGrad-${id})`);
            if (billboard) trace.style('filter', 'url(#glow)');
          } else {
            drawPath.attr('fill', `url(#myHiddenGrad-${id})`);
          }
        } else {
          const drawPath = trace
            .append('path')
            .attr('class', `${year}-${full_title}-trace`)
            .attr(
              'd',
              d3
                .arc()
                .innerRadius((height * 1.8 * r) / chartSize)
                .outerRadius((height * 1.8 * (r + arcWidth)) / chartSize)
                .cornerRadius(30)
                .startAngle(startRad)
                .endAngle(endRad)
            )
            .attr('fill', `url(#myGrad-${id})`);
          if (billboard) drawPath.style('filter', 'url(#glow)');

          head
            .append('circle')
            .attr('class', `${year}-${full_title}-head`)
            .attr('r', headSize)
            .attr(
              'cx',
              (Math.cos(dotDeg) * height * 1.8 * (r + arcWidth / chartSize)) /
                chartSize
            )
            .attr(
              'cy',
              (Math.sin(dotDeg) * height * 1.8 * (r + arcWidth / chartSize)) /
                chartSize
            )
            .style('fill', 'rgb(255,255,255)')
            .style('fill-opacity', billboard ? 0.6 : 0.25)
            .style('filter', 'url(#glow)');
        }

        if (Object.keys(songIndex).indexOf(full_title) == -1) continue;

        // draw index for billboard listed songs
        const thisSong = billboards.filter(
          ({ title }) => title === full_title
        )[0];
        const idMatch = {
          1: 1,
          2: 2,
          3: 3,
          4: 8,
          5: 9,
          6: 4,
          7: 10,
          8: 11,
          9: 5,
          10: 12,
          11: 6,
          12: 13,
          13: 14,
          14: 7,
        };
        const songId = idMatch[thisSong['id']];
        const unitMult =
          (height * 1.8 * (r + arcWidth / chartSize)) / chartSize;
        let posAdjustX = height * 0.016,
          posAdjustY = height * 0.017;
        switch (songId) {
          case 9:
            posAdjustX *= 0.95;
            posAdjustY = height * 0.005;
            break;
          case 4:
          case 14:
            posAdjustX *= -1.2;
            posAdjustY = 0;
            break;
          case 10:
            posAdjustX *= -0.5;
            posAdjustY = -height * 0.04;
            break;
          case 12:
            posAdjustY = -height * 0.005;
            break;
          default:
            break;
        }
        if (selected > 0)
          index
            .append('circle')
            .attr('class', `${full_title}-index-circle`)
            .attr('r', (height * 1.8) / 180)
            .attr('cx', Math.cos(dotDeg) * unitMult + posAdjustX * 1.2)
            .attr('cy', Math.sin(dotDeg) * unitMult - posAdjustY * 1.25)
            .style(
              'fill',
              selected === songId
                ? 'rgba(128,240,255,0.7)'
                : 'rgba(255,255,255,0.2)'
            )
            .style(
              'stroke',
              selected === songId ? 'white' : 'rgba(255,255,255,0.5)'
            );
        else
          index
            .append('circle')
            .attr('class', `${full_title}-index-circle`)
            .attr('r', (height * 1.8) / 180)
            .attr('cx', Math.cos(dotDeg) * unitMult + posAdjustX * 1.2)
            .attr('cy', Math.sin(dotDeg) * unitMult - posAdjustY * 1.25)
            .style('fill', 'rgba(255,255,255,0.3)')
            .style('stroke', 'white');

        posAdjustX *= 0.95;
        if (songId >= 10) posAdjustX *= 0.9;
        else if (songId === 4) {
          posAdjustX *= 1.5;
          posAdjustY = -height * 0.004;
        } else if (songId === 9) {
          posAdjustY = height * 0.002;
        }
        if (songId === 14) {
          posAdjustX *= 1.75;
          posAdjustY = -height * 0.004;
        } else if (songId === 12) {
          posAdjustX *= 0.9;
          posAdjustY = -height * 0.01;
        } else if (songId === 1) {
          posAdjustX *= 1.1;
        } else if (songId === 11) {
          posAdjustX *= 1.1;
        } else if (songId === 10) {
          posAdjustX *= 2.4;
          posAdjustY *= 1.35;
        }
        index
          .append('text')
          .text(songId)
          .attr('class', `${full_title}-index`)
          .style('font-size', '1.2vh')
          .style('text-anchor', 'center')
          .attr('x', Math.cos(dotDeg) * unitMult + posAdjustX)
          .attr('y', Math.sin(dotDeg) * unitMult - posAdjustY)
          .style('fill', 'white');
      }
    }
  }, [width, height, songs, selected]);

  // render
  return (
    <div>
      <div ref={billboardRef} />
      <svg ref={chartRef} />
    </div>
  );
}

export default Stars;
