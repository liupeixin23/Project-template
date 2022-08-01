/**
 *
 * @param max  结束最大值
 * @param min  其实开始
 * @param type 类型 even | odd |  undefined
 * @returns {{}}
 */
const getStyleMapping = (max, min, type) => {
  if (!max) {
    console.log('请传入max值');
    return;
  }
  const style = {};
  let maxArray = [...Array(max + 1).keys()];
  if (min) {
    maxArray = maxArray.filter(item => item >= min);
  }
  maxArray.forEach(item => {
    if (!type) {
      style[item] = `${item}px`;
    } else if (type === 'even') {
      item % 2 === 0 && (style[item] = `${item}px`);
    } else if (type === 'odd') {
      item % 2 !== 0 && (style[item] = `${item}px`);
    } else {
      // console.log('你传的type到底是个啥');
    }
  });
  return style;
};
module.exports = {
  purge: ['./src/**/*.vue'],
  darkMode: false, // or 'media' or 'class'
  important: true,
  theme: {
    fontSize: {
      ...getStyleMapping(160, 12, 'even'),
    },
    textColor: {
      primary: '#777777',
      secondary: '#D4917F',
      danger: '#e3342f',
      timeNam: '#cccccc',
      fff: '#fff',
      black: '#000000',
      '18A0FB': ' #18A0FB',
    },
    colors: {
      fff: '#fff',
      color8a: '#8a8a8a',
      colorfa: '#faf9f8',
      e5: '#e5e5e5',
      b3: '#b3b3b3',
      fa: '#fafafa',
      black: '#000000',
      color0091: '#0091FF',
    },
    padding: {
      ...getStyleMapping(600, 0),
    },
    margin: {
      center: '0 auto',
      auto: 'auto',
      ...getStyleMapping(200, 0),
    },
    borderRadius: {
      ...getStyleMapping(100, 1),
      full: '100%',
    },
    minWidth: {
      ...getStyleMapping(1000, 20),
    },
    minHeight: {
      ...getStyleMapping(1000, 20),
    },
    backgroundColor: theme => ({
      ...theme('colors'),
      primary: '#3490dc',
      secondary: '#ffed4a',
      danger: '#e3342f',
      white: '#FFFFFF',
      headerFunction: '#498ADF',
      previewSelect: '#ecf7ff',
      FF2: '#FF2C2C',
      '18A0FB': ' #18A0FB',
    }),
    extend: {
      lineHeight: {
        ...getStyleMapping(200, 0),
      },
      width: {
        ...getStyleMapping(1000, 0),
      },
      height: {
        ...getStyleMapping(1000, 0),
      },
      opacity: {
        85: '0.85',
      },
      inset: {
        ...getStyleMapping(400, 0),
      },
    },
    borderColor: theme => ({
      ...theme('colors'),
      E5: '#E5E5E5',
    }),
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
