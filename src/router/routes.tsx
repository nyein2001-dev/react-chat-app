import { Routes, Route } from "react-router-dom";
import PublicGuard from "../components/auth/PublicGuard";
import { ROUTES } from "../constants/routes";
import { lazy, Suspense } from "react";
import LoadingSpinner from "../components/common/LoadingSpinner";

const AuthLayout = lazy(() => import("../layouts/AuthLayout"));

const Register = lazy(() => import("../pages/auth/Register"));

export default function AppRoutes() {
    return (
        <Suspense fallback={<LoadingSpinner />}>
            <Routes>
                <Route element={<PublicGuard>{<AuthLayout />}</PublicGuard>} >
                    <Route path={ROUTES.AUTH.REGISTER} element={<Register />} />
                </Route>
                {/* <Route path="*" element={<NotFound />} /> */}
            </Routes>
        </Suspense>
    )
}