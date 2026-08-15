import { AwilixContainer } from 'awilix';
import { registerMarketplaceDependencies } from './dependencies';

export const registerMarketplaceModule = (container: AwilixContainer): void => {
  registerMarketplaceDependencies(container);
};
