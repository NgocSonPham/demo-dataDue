import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n.use(initReactI18next).init({
    lng: "vi",
    fallbackLng: "vi",
    interpolation: {
        escapeValue: false,
    },
    resources: {
        en: {
            translation: {
                test: 'Hello',
                auth: {
                    welcome: "Welcome!",
                    userOrEmail: "Username or Email",
                    rememberMe: "Remember Me",
                    forgotPassword: "Forgot Password?",
                    signUpNow: "Sign up now",
                    notHaveAccountYet: "Not have an account yet?",
                    signUpTitle: "Sign up your new account",
                    signUpBtn: "Sign Up",
                    email: "Email",
                    userName: "User name",
                    password: "Password",
                    rePassowrd: "Re-type your Password",
                    advertise: "Create account to enjoy all of our cool",
                    feature: "features",
                    alreadySignUp: "Sign up already?",
                    login: "Login"
                }
            },
        },
        vi: {
            translation: {
                test: 'Xin chào',
                auth: {
                    welcome: "Chào mừng bạn!",
                    userOrEmail: "Tên người dùng hoặc Email",
                    rememberMe: "Lưu đăng nhập",
                    forgotPassword: "Quên mật khẩu?",
                    signUpNow: "Đăng ký ngay",
                    notHaveAccountYet: "Chưa có tài khoản?",
                    signUpTitle: "Đăng ký",
                    signUpBtn: "Đăng ký",
                    email: "Email",
                    userName: "Tên người dùng",
                    password: "Password",
                    rePassowrd: "Xác nhận Password",
                    advertise: "Hãy tạo một tài khoản để trải nghiệm đâỳ đủ",
                    feature: "các tính năng",
                    alreadySignUp: "Đã có tài khoản?",
                    login: "Đăng nhập"
                }
            },
        }
    },
});

export default i18n;