export interface ICache {
  get<T>(key: string, fetcher: () => Promise<T>): Promise<T>;
  del(key: string): void;
  flush(): void;
}
