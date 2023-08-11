import { FullFakebooksLogo } from "@/components";
import { SignIn } from "@/components/login";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

async function LoginPage() {
  const session = await getServerSession(authOptions);
  if (session) {
    redirect("/");
  }
  return (
    <div className="flex min-h-full flex-col items-center justify-center">
      <h1 className="mb-12">
        <FullFakebooksLogo size="lg" position="center" />
      </h1>
      <div className="items center mx-auto flex w-full max-w-md justify-center px-8">
        <SignIn />
      </div>
    </div>
  );
}

export default LoginPage;
