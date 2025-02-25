import { useTranslation } from "react-i18next"
import { useAuth } from "../../hooks/useAuth";
import { useTheme } from "../../context/ThemeContext";

export default function Register() {
    const { t } = useTranslation(['en']);
    const {theme} = useTheme();

    return (
        <div className={`
            min-h-screen flex flex-col justify-center py-12
        `} >
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className={`
                text-center text-3xl font-extrabold text-${theme.colors.text.primary}
                    `} >
                    {t('register.title')}
                </h2>
            </div>
        </div>
    )
}