import { SendTemplatePayload } from './IEmailProvider';

export interface IEmailDispatcher {
  dispatch(payload: SendTemplatePayload): Promise<void>;
}
