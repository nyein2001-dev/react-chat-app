import { User } from "../../models/user/types";
import { StoreState } from "../types";
import { UserAction, UserActions } from "./userActions";

export const initialState: StoreState<User | null> = {
    isLoading: false,
    error: null,
    data: null,
};

export function userReducer(
    state: StoreState<User | null>,
    action: UserAction
): StoreState<User | null> {
    switch (action.type) {
        case UserActions.SET_LOADING:
            return {
                ...state,
                isLoading: true,
                error: null,
            };
        case UserActions.SET_ERROR:
            return {
                ...state,
                isLoading: false,
                error: action.payload,
            };
        case UserActions.SET_USER:
            return {
                ...state,
                isLoading: false,
                error: null,
                data: action.payload,
            };
        case UserActions.CLEAR_USER:
            return {
                ...state,
                isLoading: false,
                error: null,
                data: null,
            };
        default:
            return state;
    }
}