import { AwilixContainer } from 'awilix';
import { registerConsultationDependencies } from './dependencies';

export const registerConsultationModule = (container: AwilixContainer): void => {
  registerConsultationDependencies(container);
};
