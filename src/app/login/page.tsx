import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { LoginForm } from "./login-form";
import { LoginRedirect } from "./login-redirect";

export default async function LoginPage() {
  const session = await auth();

  if (session?.user) {
    redirect("/home");
  }

  return (
    <>
      <LoginRedirect />
      <LoginForm />
    </>
  );
}
