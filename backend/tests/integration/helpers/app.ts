import express from 'express';
import { createApp } from '../../../src/bootstrap/http/app';
import { configureContainer } from '../../../src/bootstrap/dependency-injection/container';
import { registerIdentityModule } from '../../../src/modules/identity/module';

let appInstance: express.Application;
let containerInstance: any;

export const getApp = async () => {
  if (!appInstance) {
    containerInstance = configureContainer();
    registerIdentityModule(containerInstance);
    appInstance = createApp(containerInstance);
  }
  return appInstance;
};

export const getContainer = () => containerInstance;
