import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
import api from '../api';
import getConfig from '../headers';

import {
  setAccessToken,
  removeAccessToken,
  setCurrentUser,
  removeCurrentUser,
} from '../Token';

const login = createAsyncThunk('login', async (data, {rejectWithValue}) => {
  console.log('로그인 요청', data);
  try {
    const res = await axios.post(api.login(), data, {});
    console.log('로그인 결과', res.data);
    setAccessToken(res.data.accessToken);
    setCurrentUser(res.data.user);
    return res.data;
  } catch (err) {
    console.log(err);
    return rejectWithValue(err.response.data);
  }
});

const logout = createAsyncThunk('logout', async (arg, {rejectWithValue}) => {
  console.log('로그아웃 시도');
  try {
    const res = await axios.post(api.logout(), {}, getConfig());
    console.log('로그아웃 성공');
    removeAccessToken();
    removeCurrentUser();
    return res.data;
  } catch (err) {
    console.log('로그아웃 실패', err.response);
    removeAccessToken();
    removeCurrentUser();
    return rejectWithValue(err.response.data);
  }
});

const checkEmail = createAsyncThunk(
  'checkEmail',
  async (data, {rejectWithValue}) => {
    console.log('이메일 확인', data);
    try {
      const res = await axios.post(api.checkEmail(), data, getConfig());
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  },
);

const checkNickname = createAsyncThunk(
  'checkNickname',
  async (data, {rejectWithValue}) => {
    console.log('닉네임 확인', data);
    try {
      const res = await axios.post(api.checkNickname(), data, {});
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  },
);

// 회원가입시에도 스토리지에 저장
const signup = createAsyncThunk('signup', async (data, {rejectWithValue}) => {
  console.log('회원가입 정보', data);
  try {
    const res = await axios.post(api.signup(), data, {});
    console.log(res.payload);
    setAccessToken(res.data.accessToken);
    setCurrentUser(res.data.user);
    return res.data;
  } catch (err) {
    console.log(err);
    return rejectWithValue(err.response.data);
  }
});

const profileCreate = createAsyncThunk(
  'profileCreate',
  async (formdata, {rejectWithValue}) => {
    console.log('회원가입 후 프로필, 자기소개 입력', formdata);

    const headers = {
      'Content-Type': 'multipart/form-data',
    };
    try {
      const res = await axios.post(api.profileCreate(), formdata, headers);
      console.log('프로필 입력 성공', res.data);
      return res.data;
    } catch (err) {
      console.log('프로필 입력 실패', err);
      return rejectWithValue(err.response.data);
    }
  },
);

const profileEdit = createAsyncThunk(
  'profileEdit',
  async (formdata, {rejectWithValue}) => {
    console.log('수정 신청', formdata);
    const header = {
      'Content-Type': 'multipart/form-data; boundary=someArbitraryUniqueString',
    };
    try {
      const res = await axios({
        method: 'post',
        url: api.profileEdit(),
        data: formdata,
        headers: header,
      });
      alert('수정 완료');
      console.log('프로필 입력 성공', res.data);
      return res.data;
    } catch (err) {
      console.log('수정 실패', err);
      return rejectWithValue(err.response.data);
    }
  },
);

const wingspan = createAsyncThunk(
  'wingspan',
  async (formData, {rejectWithValue}) => {
    console.log('측정 요청 감');
    const header = {
      'Content-Type': 'multipart/form-data',
    };
    try {
      const res = await axios({
        method: 'post',
        url: api.wingspan(),
        data: formData,
        headers: header,
      });
      console.log('측정 결과', res.data);
      return res.data;
    } catch (err) {
      console.log('측정 에러', err);
      return rejectWithValue(err.response.data);
    }
  },
);

const initialState = {
  loginState: false,
  currentUser: {},
  signupForm: {
    email: {
      value: '',
      type: 'textInput',
      rules: {},
      valid: false,
    },
    nickname: {
      value: '',
      type: 'textInput',
      rules: {},
      valid: false,
    },
    password: {
      value: '',
      type: 'textInput',
      rules: {},
      valid: false,
    },
    confirmPwd: {
      value: '',
      type: 'textInput',
      rules: {},
      valid: false,
    },
    gender: {
      value: 'M',
      type: 'radio',
    },
    height: {
      value: '',
      type: 'textInput',
      rules: {},
      valid: false,
    },
    shoeSize: {
      value: '',
      type: 'textInput',
      rules: {},
      valid: false,
    },
    wingspan: {
      value: '',
      type: 'textInput',
      rules: {},
      valid: false,
    },
  },
  editForm: {
    nickname: {
      value: '',
      type: 'textInput',
      valid: false,
    },
    password: {
      value: '',
      type: 'textInput',
    },
    intro: {
      value: '',
      type: 'textInput',
    },
    height: {
      value: '',
      type: 'textInput',
      rules: {},
      valid: false,
    },
    shoeSize: {
      value: '',
      type: 'textInput',
      rules: {},
      valid: false,
    },
    wingspan: {
      value: '',
      type: 'textInput',
      rules: {},
      valid: false,
    },
  },
  uploadImg: null,
  isCheckNickname: false,
  isCheckEmail: false,
  isCheckTerms: false,
};

export const AccountsSlice = createSlice({
  name: 'accounts',
  initialState,
  reducers: {
    fetchCurrentUser: (state, action) => {
      console.log('state에 붙이는 정보', action.payload);
      state.currentUser = action.payload;
      state.loginState = true;
    },
    changeSignupForm: (state, action) => {
      if (
        action.payload.name === 'height' ||
        action.payload.name === 'shoeSize' ||
        action.payload.name === 'wingspan'
      ) {
        state.signupForm[action.payload.name].value =
          action.payload.value.replace(/[^0-9]/g, '');
      } else {
        switch (action.payload.name) {
          case 'email':
            state.isCheckEmail = false;
            break;
          case 'nickname':
            state.isCheckNickname = false;
            break;
          default:
            break;
        }
        state.signupForm[action.payload.name].value = action.payload.value;
      }
    },
    changeEditForm: (state, action) => {
      state.editForm[action.payload.name].value = action.payload.value;
    },
    changeIsCheckTerms: (state, action) => {
      state.isCheckTerms = action.payload;
    },
    changeUploadImg: (state, action) => {
      state.uploadImg = action.payload;
    },
  },
  extraReducers: {
    [login.fulfilled]: (state, action) => {
      state.loginState = true;
      state.currentUser = action.payload.user;
    },
    [login.rejected]: state => {
      alert('이메일과 비밀번호를 확인해주세요.');
      state.loginState = false;
    },
    [signup.fulfilled]: (state, action) => {
      console.log('회원가입 성공');
    },
    [signup.rejected]: (state, action) => {
      console.log('회원가입 실패');
    },
    [checkEmail.fulfilled]: (state, action) => {
      console.log(action.payload);
      state.isCheckEmail = action.payload;
    },
    [checkEmail.rejected]: (state, action) => {
      alert('사용 불가능한 이메일입니다.');
      console.log(action.payload);
    },
    [checkNickname.fulfilled]: (state, action) => {
      state.isCheckNickname = action.payload;
    },
    [checkNickname.rejected]: (state, action) => {
      alert('사용 불가능한 닉네임입니다.');
      console.log(action.payload);
    },
    [logout.fulfilled]: state => {
      state.loginState = false;
    },
    [logout.rejected]: state => {
      state.loginState = false;
    },
  },
});

export {
  login,
  logout,
  wingspan,
  signup,
  profileCreate,
  checkEmail,
  checkNickname,
  profileEdit,
};

export const {
  changeSignupForm,
  changeIsCheckTerms,
  changeUploadImg,
  changeEditForm,
  fetchCurrentUser,
} = AccountsSlice.actions;

export default AccountsSlice.reducer;
