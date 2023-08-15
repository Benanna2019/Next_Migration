"use client";
import { Customer } from "@prisma/client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function CustomerLink({
  children,
  customer,
}: {
  children: React.ReactNode;
  customer: Pick<Customer, "id">;
}) {
  const pathname = usePathname();

  const individualCustomerPathisActive =
    pathname === `/sales/customers/[customerId]`;
  return (
    <Link
      key={customer.id}
      href={`/sales/customers/${customer.id}`}
      className={
        "block border-b border-gray-50 py-3 px-4 hover:bg-gray-50" +
        " " +
        (individualCustomerPathisActive ? "bg-gray-50" : "")
      }
    >
      {children}
    </Link>
  );
}
