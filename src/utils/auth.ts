import { jwtDecode } from "jwt-decode";

interface TokenPayload {
    exp: number;
    user_id: number;
}

export const AUTH_TOKENS = {
    ACCESS: 'access_token',
    REFRESH: 'refresh_token',
};

export const auth = {

    getAccessToken() {
        return localStorage.getItem(AUTH_TOKENS.ACCESS);
    },

    isAuthenticated() {
        const token = this.getAccessToken();
        if (!token) return false;

        try {
            const decoded = jwtDecode<TokenPayload>(token);
            return decoded.exp * 1000 > Date.now();
        } catch (e) {
            return false;
        }
    }

}