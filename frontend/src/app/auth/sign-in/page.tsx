import { SignInForm } from "~/components/auth/signin-form";

export const metadata = {
  title: "Login - T3 App",
};

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-blue-50 to-blue-100">
      <SignInForm />
    </div>
  );
}
