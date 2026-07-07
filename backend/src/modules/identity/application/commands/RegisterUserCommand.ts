export interface RegisterUserCommand {
  email: string;
  plaintextPassword?: string; // Optional if supporting OAuth later, but typical for standard reg
}
