import { SignUpForm } from "~/components/auth/signup-form";

export const metadata = {
  title: "Cadastro - T3 App",
};

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-blue-50 to-blue-100">
      <SignUpForm />
    </div>
  );
}
