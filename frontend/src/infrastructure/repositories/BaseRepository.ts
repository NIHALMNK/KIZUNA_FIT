import { httpClient } from '../api/HttpClient';

export abstract class BaseRepository<TEntity, TDto> {
  protected constructor(protected readonly basePath: string) {}

  protected abstract mapToEntity(dto: TDto): TEntity;
  protected abstract mapToDto(entity: TEntity): TDto;

  protected async get(path: string = '', config?: Record<string, unknown>): Promise<TEntity> {
    const dto = await httpClient.get<TDto>(`${this.basePath}${path}`, config);
    return this.mapToEntity(dto);
  }

  protected async getList(path: string = '', config?: Record<string, unknown>): Promise<TEntity[]> {
    const dtos = await httpClient.get<TDto[]>(`${this.basePath}${path}`, config);
    return dtos.map(this.mapToEntity.bind(this));
  }

  protected async post(data: Partial<TEntity>, path: string = '', config?: Record<string, unknown>): Promise<TEntity> {
    // Map partial entity payload to DTO format before sending if necessary
    const dto = await httpClient.post<TDto>(`${this.basePath}${path}`, data, config);
    return this.mapToEntity(dto);
  }

  protected async put(data: Partial<TEntity>, path: string = '', config?: Record<string, unknown>): Promise<TEntity> {
    const dto = await httpClient.put<TDto>(`${this.basePath}${path}`, data, config);
    return this.mapToEntity(dto);
  }

  protected async delete(path: string = '', config?: Record<string, unknown>): Promise<void> {
    return httpClient.delete<void>(`${this.basePath}${path}`, config);
  }
}
