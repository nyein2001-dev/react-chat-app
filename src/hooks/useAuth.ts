import { useCallback } from "react";
import { useUser } from "../context/UserContext";
import { auth } from "../utils/auth";

export function useAuth() {
    const { data: user, isLoading, register: userRegister } = useUser();

    const isAuthenticated = useCallback(() => {
        return !!user && auth.isAuthenticated();
    }, [user]);

    return {
        user,
        isLoading,
        isAuthenticated: isAuthenticated(),
        register: userRegister,
    };
}