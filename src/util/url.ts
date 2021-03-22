const abc = process.env.VUE_APP_api;
let currentOrigin = '';
let str = '';

if (process.env.API_ENV === 'prod') {
  currentOrigin = 'https://suyang.speiyou.com';
  str = '1001ad15f4ed7fefb196aff784d05c89';
} else if (process.env.API_ENV === 'test') {
  currentOrigin = 'https://test-suyang.speiyou.com';
  str = 'cb5bbfb7522753e41901dff6aebb4b18';
}

export {
  abc,
  currentOrigin,
  str,
};
