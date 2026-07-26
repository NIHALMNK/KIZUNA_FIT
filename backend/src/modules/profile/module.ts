import { AwilixContainer } from 'awilix';
import { registerProfileDependencies } from './dependencies';

export const registerProfileModule = (container: AwilixContainer): void => {
  registerProfileDependencies(container);
};
