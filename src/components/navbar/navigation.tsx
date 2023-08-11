"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignOut } from "../login";
import { UploadCompanyLogo } from "../modal/upload-logo-dialog";

export default function Navigation() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col font-bold text-gray-800">
      <NavItem to="/dashboard" isActive={pathname === "/dashboard"}>
        Dashboard
      </NavItem>
      <NavItem to="/accounts" isActive={pathname === "/accounts"}>
        Accounts
      </NavItem>
      <NavItem to="/sales" isActive={pathname === "/salse"}>
        Sales
      </NavItem>
      <NavItem to="/expenses" isActive={pathname === "/expenses"}>
        Expenses
      </NavItem>
      <NavItem to="/reports" isActive={pathname === "/reports"}>
        Reports
      </NavItem>
      <div>
        <UploadCompanyLogo
          trigger={
            <span className="my-1 flex gap-1 py-1 px-2 pr-6 text-[length:14px]">
              Upload Logo
            </span>
          }
        />
      </div>
      <a
        href="https://github.com/benanna2019/Next_Migration"
        className="my-1 flex justify-between py-1 px-2 pr-6 text-[length:14px]"
      >
        Github Repo
      </a>
      <div>
        <SignOut />
      </div>
    </div>
  );
}

function NavItem({
  to,
  children,
  isActive,
}: {
  to: string;
  children: React.ReactNode;
  isActive: boolean;
}) {
  return (
    <Link
      href={to}
      className={`my-1 py-1 px-2 pr-16 text-[length:14px] ${
        isActive ? "rounded-md bg-gray-100" : ""
      }`}
    >
      {children}
    </Link>
  );
}
