import Link from 'next/link'
import { InvoiceDetailsFallback } from '../index'
import { Customer } from '../../models/customerserver'
import { usePathname } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { fetcher } from '@/utils'
import BetterAddCustomerForm from '../full-stack-forms/add-customer'

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  const { data, isLoading, isError } = useQuery(['customers'], () =>
    fetcher('/api/get-customers-list')
  )

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (isError) {
    return <div>Error</div>
  }

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
          <BetterAddCustomerForm />
        </div>
        <div className="max-h-96 overflow-y-scroll">
          {data?.customers?.map(
            (customer: Pick<Customer, 'email' | 'id' | 'name'>) => (
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
            )
          )}
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
