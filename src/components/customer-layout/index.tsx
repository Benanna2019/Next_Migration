import Link from 'next/link'
import { FilePlusIcon, InvoiceDetailsFallback } from '../index'
import { Customer } from '../../models/customerserver'
import { usePathname } from 'next/navigation'
import { AddCustomerDialog } from '../modal/add-customer-dialog'

export default function CustomerLayout({
  customers,
  children,
}: {
  customers: Pick<Customer, 'email' | 'id' | 'name'>[]
  children: React.ReactNode
}) {
  const pathname = usePathname()

  const newCustomerPathisActive = pathname === '/sales/customers/newCustomer'
  const individualCustomerPathisActive =
    pathname === `/sales/customers/[customerId]`

  return (
    <div className="flex overflow-hidden rounded-lg border border-gray-100">
      <div className="w-1/2 border-r border-gray-100">
        <div
          className={
            'block border-b-4 border-gray-100 py-3 px-4 hover:bg-gray-50' +
            ' ' +
            (newCustomerPathisActive ? 'bg-gray-50' : '')
          }
        >
          {
            <AddCustomerDialog
              trigger={
                <span className="flex gap-1">
                  <FilePlusIcon /> <span>Add Customer</span>
                </span>
              }
            />
          }
        </div>
        <div className="max-h-96 overflow-y-scroll">
          {customers.map((customer) => (
            <Link
              key={customer.id}
              href={`/sales/customers/${customer.id}`}
              className={
                'block border-b border-gray-50 py-3 px-4 hover:bg-gray-50' +
                ' ' +
                (individualCustomerPathisActive ? 'bg-gray-50' : '')
              }
            >
              <div className="flex justify-between text-[length:14px] font-bold leading-6">
                <div>{customer.name}</div>
              </div>
              <div className="flex justify-between text-[length:12px] font-medium leading-4 text-gray-400">
                <div>{customer.email}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <div className="flex w-1/2 flex-col justify-between">
        <>{children}</>
      </div>
    </div>
  )
}

export function CustomerSkeleton() {
  return (
    <div className="relative p-10">
      <InvoiceDetailsFallback />
    </div>
  )
}
