export class ClientProfileAlreadyExistsException extends Error {
  constructor(userId: string) {
    super(`Client profile already exists for user ${userId}`);
    this.name = 'ClientProfileAlreadyExistsException';
  }
}

export class TrainerProfileAlreadyExistsException extends Error {
  constructor(userId: string) {
    super(`Trainer profile already exists for user ${userId}`);
    this.name = 'TrainerProfileAlreadyExistsException';
  }
}

export class ClientProfileNotFoundException extends Error {
  constructor(identifier: string) {
    super(`Client profile not found for identifier: ${identifier}`);
    this.name = 'ClientProfileNotFoundException';
  }
}

export class TrainerProfileNotFoundException extends Error {
  constructor(identifier: string) {
    super(`Trainer profile not found for identifier: ${identifier}`);
    this.name = 'TrainerProfileNotFoundException';
  }
}
