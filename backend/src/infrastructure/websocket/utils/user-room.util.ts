/**
 * Reusable utility for formatting standardized WebSocket room names.
 * Prevents raw string interpolation scattered across the codebase.
 */
export class UserRoom {
  public static forUser(userId: string): string {
    return `user:${userId}`;
  }

  public static forRole(role: string): string {
    return `role:${role.toLowerCase()}`;
  }

  public static forPipeline(pipelineId: string): string {
    return `pipeline:${pipelineId}`;
  }
}

export class TrainerProfileRoom {
  public static forProfile(profileId: string): string {
    return `trainer:profile:${profileId}`;
  }

  public static isValid(profileId: string): boolean {
    if (!profileId || typeof profileId !== 'string') return false;
    return /^[a-zA-Z0-9_-]{1,64}$/.test(profileId);
  }
}
