import { AwilixContainer } from 'awilix';

/**
 * Registers all Identity module dependencies into the global Awilix container.
 * 
 * Rules:
 * - May ONLY register dependencies via DI.
 * - MUST NEVER create Express routes, instantiate services manually, or execute startup logic.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const registerIdentityModule = (_container: AwilixContainer): void => {
  // TODO: Register identity module dependencies in subsequent steps
};
