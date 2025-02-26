export interface StoreState<T> {
  isLoading: boolean;
  error: string | null;
  data: T;
}

export interface Action<T = any> {
  type: string;
  payload?: T;
}

export interface AsyncStore<T> extends StoreState<T> {
  fetch: () => Promise<void>;
  reset: () => void;
} 