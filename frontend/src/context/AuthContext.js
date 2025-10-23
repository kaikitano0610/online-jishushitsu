import React, { createContext, useContext, useReducer, useEffect } from 'react';
import api, { setAuthToken } from '../utils/api';

// 初期状態
const initialState = {
  token: localStorage.getItem('token'),
  isAuthenticated: null,
  loading: true,
  user: null,
};

// Contextを作成
const AuthContext = createContext();

// Reducer関数: stateとactionを元に新しいstateを返す
function authReducer(state, action) {
  const { type, payload } = action;

  switch (type) {
    case 'USER_LOADED':
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        user: payload,
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: payload,
      };
    case 'REGISTER_SUCCESS':
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        ...payload,
        isAuthenticated: true,
        loading: false,
      };
    case 'AUTH_ERROR':
    case 'LOGOUT':
      setAuthToken(null); // トークンを削除
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false,
        user: null,
      };
    default:
      return state;
  }
}

// Context Providerコンポーネント
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // トークンがある場合、ユーザー情報を読み込む
  useEffect(() => {
    loadUser();
  }, []);

  // ユーザー情報を読み込む関数
  const loadUser = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      setAuthToken(token);
      try {
        const res = await api.get('/auth/me');
        dispatch({ type: 'USER_LOADED', payload: res.data });
      } catch (err) {
        dispatch({ type: 'AUTH_ERROR' });
      }
    } else {
        dispatch({ type: 'AUTH_ERROR' });
    }
  };

// 登録
  const register = async (formData) => {
    try {
      const res = await api.post('/auth/register', formData);
      setAuthToken(res.data.token);
      dispatch({ type: 'REGISTER_SUCCESS', payload: res.data });
      await loadUser(); // ユーザー情報の読み込みを待つ
    } catch (err) {
      // エラーハンドリングを強化
      if (err.response) {
        // サーバーからエラーレスポンスが返ってきた場合
        console.error(err.response.data);
        alert(err.response.data.msg || '登録に失敗しました。');
      } else {
        // サーバーに接続できなかった場合など
        console.error('Error', err.message);
        alert('サーバーに接続できません。');
      }
    }
  };

// ログイン
  const login = async (formData) => {
    try {
      const res = await api.post('/auth/login', formData);
      setAuthToken(res.data.token);
      dispatch({ type: 'LOGIN_SUCCESS', payload: res.data });
      await loadUser(); // ユーザー情報の読み込みを待つ
    } catch (err) {
      // エラーハンドリングを強化
      if (err.response) {
        // サーバーからエラーレスポンスが返ってきた場合
        console.error(err.response.data);
        alert(err.response.data.msg || 'ログインに失敗しました。');
      } else {
        // サーバーに接続できなかった場合など
        console.error('Error', err.message);
        alert('サーバーに接続できません。');
      }
    }
  };  
  const updateUser = (userData) => { // ✅ この関数を追加
    dispatch({ type: 'UPDATE_USER', payload: userData });
  };
  // ログアウト
  const logout = () => dispatch({ type: 'LOGOUT' });

  return (
    <AuthContext.Provider value={{ ...state, register, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// Contextを簡単に使うためのカスタムフック
export const useAuth = () => {
  return useContext(AuthContext);
};