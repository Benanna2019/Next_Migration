import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getUserByEmail } from "@/models/userserver";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { Suspense } from "react";
import { FullFakebooksLogo, FullUserLogo, SpinnerIcon } from "..";
import Navigation from "./navigation";

export default function Navbar({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex h-screen rounded-lg bg-white text-gray-600">
      <div className="border-r border-gray-100 bg-gray-50">
        <div className="p-4">
          <Suspense fallback={<SpinnerIcon />}>
            {/* @ts-expect-error */}
            <LogoRenderer />
          </Suspense>
          <div className="h-7" />
          <Navigation />
        </div>
      </div>
      <div className="flex-1">{children}</div>
    </div>
  );
}

async function LogoRenderer() {
  const session = await getServerSession(authOptions);
  console.log(session);
  if (!session) {
    return (
      <div className="flex flex-wrap items-center gap-1">
        <Link href=".">
          <FullFakebooksLogo size="sm" position="left" />
        </Link>
      </div>
    );
  }

  const user = await getUserByEmail(session?.user?.email as string);

  return (
    <div className="flex flex-wrap items-center gap-1">
      {user?.logoUrl ? (
        <Link href="/">
          <FullUserLogo size="lg" position="left" url={user.logoUrl} />
        </Link>
      ) : (
        <Link href=".">
          <FullFakebooksLogo size="sm" position="left" />
        </Link>
      )}
    </div>
  );
}
