const API_BASE_URL = 'https://k7a701.p.ssafy.io/api';
const WINGSPAN_URL = 'http://k7a701.p.ssafy.io:8000/api/wingspan/';

const USER_URL = '/user';

const LOGIN_URL = '/login';
const LOGOUT_URL = '/logout';
const SIGNUP_URL = '/signup';

const EMAIL_URL = '/email';
const NICKNAME_URL = '/nickname';

const PROFILE_URL = '/profile';
const FOLLOW_URL = '/follow';

const api = {
  login: () => API_BASE_URL + USER_URL + LOGIN_URL,
  logout: () => API_BASE_URL + USER_URL + LOGOUT_URL,
  checkEmail: () => API_BASE_URL + USER_URL + EMAIL_URL,
  checkNickname: () => API_BASE_URL + USER_URL + NICKNAME_URL,
  signup: () => API_BASE_URL + USER_URL + SIGNUP_URL,
  profile: () => API_BASE_URL + USER_URL + PROFILE_URL,
  follow: nickname => API_BASE_URL + USER_URL + `${nickname}` + FOLLOW_URL,

  wingspan: () => WINGSPAN_URL,
};

export default api;
