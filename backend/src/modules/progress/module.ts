import { AwilixContainer } from 'awilix';
import { registerProgressDependencies } from './dependencies';

export const registerProgressModule = (container: AwilixContainer): void => {
  registerProgressDependencies(container);
};
