export interface RuntimeRepository<T> {

  create(
    payload: T
  ): Promise<T>

  update(
    id: string,
    payload: Partial<T>
  ): Promise<T>

  findById(
    id: string
  ): Promise<T | null>

  list(): Promise<T[]>
}
