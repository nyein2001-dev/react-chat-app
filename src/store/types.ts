export interface StoreState<T> {
    isLoading: boolean;
    error: string | null;
    data: T | null;
}

export interface Action<T = any> {
    type: string;
    payload?: T;
}