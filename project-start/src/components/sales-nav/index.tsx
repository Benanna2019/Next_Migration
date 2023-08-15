import Link from 'next/link'
import { useRouter } from 'next/router'

const linkClassName = ({ isActive }: { isActive: boolean }) =>
  isActive ? 'font-bold text-black' : ''

export default function SalesNav({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  if (!router.pathname) {
    throw new Error(
      'You should never reach this error but if you do, pathname is undefined. Contact site owner'
    )
  }
  const invoiceMatches = router.pathname.includes('/sales/invoices')

  const customerMatches = router.pathname.includes('/sales/customers')

  return (
    <div className="relative h-full p-10">
      <h1 className="font-display text-d-h3 text-black">Sales</h1>
      <div className="h-6" />
      <div className="flex gap-4 border-b border-gray-100 pb-4 text-[length:14px] font-medium text-gray-400">
        <Link
          href="."
          className={linkClassName({ isActive: router.pathname === '/' })}
        >
          Overview
        </Link>
        <Link
          href="/sales/subscriptions"
          className={linkClassName({
            isActive: router.pathname === '/sales/subscriptions',
          })}
        >
          Subscriptions
        </Link>
        <Link
          href="/sales/invoices"
          className={linkClassName({ isActive: invoiceMatches })}
        >
          Invoices
        </Link>
        <Link
          href={'/sales/customers'}
          // data.firstCustomerId ? `/sales/customers/${data.firstCustomerId}`:
          className={linkClassName({ isActive: customerMatches })}
        >
          Customers
        </Link>
        <Link
          href="/sales/deposits"
          className={linkClassName({
            isActive: router.pathname === '/sales/deposits',
          })}
        >
          Deposits
        </Link>
      </div>
      <div className="h-4" />
      {children}
    </div>
  )
}
