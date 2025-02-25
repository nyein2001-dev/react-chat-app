import { useContext, createContext, useReducer, useCallback } from "react";
import { RegisterData } from "../models/auth/types";
import { StoreState } from "../store/types";
import { User } from "../models/user/types";
import { initialState, userReducer } from "../store/user/userReducer";

interface UserContextType extends StoreState<User | null> {
    register: (data: RegisterData) => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
    const [state, dispatch] = useReducer(userReducer, initialState);

    const register = useCallback(async (data: RegisterData) => {

    }, []);

    return (
        <UserContext.Provider value={{ ...state, register }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
}