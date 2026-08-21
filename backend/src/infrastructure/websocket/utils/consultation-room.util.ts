/**
 * Reusable utility for formatting and validating Consultation WebRTC room names.
 */
export class ConsultationRoom {
  public static forConsultation(consultationId: string): string {
    return `consultation:${consultationId}`;
  }

  public static isValid(roomId: string): boolean {
    if (!roomId || typeof roomId !== 'string') return false;
    return (
      /^consultation:[a-zA-Z0-9_-]{1,64}$/.test(roomId) ||
      /^room_[a-zA-Z0-9_-]{1,64}$/.test(roomId) ||
      /^call_room_[a-zA-Z0-9_-]{1,64}$/.test(roomId)
    );
  }

  public static extractConsultationId(roomId: string): string | null {
    if (!roomId || typeof roomId !== 'string') return null;
    if (roomId.startsWith('consultation:')) {
      const id = roomId.slice(13).trim();
      return id.length > 0 ? id : null;
    }
    if (roomId.startsWith('room_')) {
      const id = roomId.slice(5).trim();
      return id.length > 0 ? id : null;
    }
    return roomId.trim().length > 0 ? roomId.trim() : null;
  }
}
