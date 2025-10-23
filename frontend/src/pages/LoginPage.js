import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const FormContainer = styled.div` /* RegisterPageと同じスタイルを再利用 */
  max-width: 400px;
  margin: 50px auto;
  padding: 30px;
  border: 2px solid #333;
  border-radius: 10px;
  background-color: #fff;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 2px solid #ccc;
  border-radius: 5px;
  font-family: 'DotGothic16', sans-serif;
  font-size: 16px;
`;

const LoginPage = () => {
  const [formData, setFormData] = useState({ username: '', pin: '' });
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    login(formData);
  };

  return (
    <FormContainer>
      <h2>ログイン</h2>
      <form onSubmit={onSubmit}>
        <FormGroup>
          <Label htmlFor="username">ID</Label>
          <Input type="text" name="username" value={formData.username} onChange={onChange} required />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="pin">4桁のあんしょうばんごう</Label>
          <Input type="password" name="pin" value={formData.pin} onChange={onChange} required minLength="4" maxLength="4" />
        </FormGroup>
        <button type="submit">ログインする</button>
      </form>
    </FormContainer>
  );
};

export default LoginPage;