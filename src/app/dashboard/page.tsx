import Link from "next/link";

export default function DashboardPage() {
  return (
    <div>
      <h1>Hello Dashboard page</h1>
      <Link href="/dashboard/michael-scott">Michael Scott</Link>
    </div>
  );
}
