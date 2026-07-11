import request from 'supertest';
import mongoose from 'mongoose';
import { getApp } from './app';

export const registerUser = async (email: string, password: string = 'StrongPass123!') => {
  const app = await getApp();
  const response = await request(app)
    .post('/api/v1/identity/register')
    .send({ email, password });
    
  return response;
};

export const loginUser = async (email: string, password: string = 'StrongPass123!') => {
  const app = await getApp();
  const response = await request(app)
    .post('/api/v1/identity/login')
    .send({ email, password });
    
  return {
    accessToken: response.body.data?.accessToken,
    cookies: response.headers['set-cookie']
  };
};

export const verifyUser = async (email: string) => {
  const users = mongoose.connection.collection('users');
  await users.updateOne({ email }, { $set: { status: 'ACTIVE' } });
};

export const getAuthToken = async (email: string = 'test@example.com', password: string = 'StrongPass123!'): Promise<string> => {
  await registerUser(email, password);
  
  await verifyUser(email);
  
  const app = await getApp();
  const response = await request(app)
    .post('/api/v1/identity/login')
    .send({ email, password });
    
  return response.body.data?.accessToken;
};
