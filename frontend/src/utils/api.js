import axios from 'axios';

// バックエンドのURLを基本設定とするaxiosインスタンスを作成
const api = axios.create({
  baseURL: 'http://localhost:5001/api', // バックエンドのURL
  headers: {
    'Content-Type': 'application/json',
  },
});

/*
  重要:
  ログインに成功したら、localStorageからトークンを取得し、
  それ以降のすべてのAPIリクエストのヘッダーにトークンを付与する。
  これにより、バックエンドは「誰がリクエストを送ってきたか」を識別できる。
*/
export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['x-auth-token'] = token;
    localStorage.setItem('token', token);
  } else {
    delete api.defaults.headers.common['x-auth-token'];
    localStorage.removeItem('token');
  }
};

export default api;