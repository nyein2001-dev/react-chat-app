import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useEffect } from "react";
import LoadingSpinner from "../common/LoadingSpinner";
import { ROUTES } from "../../constants/routes";

export default function PublicGuard({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, isLoading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoading && isAuthenticated) {
            navigate(ROUTES.ROOT, { replace: true });
        }
    }, [isAuthenticated, isLoading, navigate]);

    if (isLoading) {
        return <LoadingSpinner />;
    }

    return !isAuthenticated ? <>{children}</> : null;
} 