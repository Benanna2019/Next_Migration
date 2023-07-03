import { currencyFormatter } from '../../utils'
import Link from 'next/link'
import { CustomerSkeleton } from '../customer-layout'
import { useSpinDelay } from 'spin-delay'

const lineItemClassName = 'border-t border-gray-100 text-[14px] h-[56px]'

export default function CustomerIdPage({
  customerData,
}: {
  customerData: any
}) {
  const { data, isLoading, isError, isSuccess } = customerData

  const showSkeleton = useSpinDelay(Boolean(isLoading))

  return (
    <>
      {isLoading && <CustomerSkeleton />}
      {isSuccess && data && (
        <div className="relative p-10">
          <div className="text-[length:14px] font-bold leading-6">
            {data.customerInfo.email}
          </div>
          <div className="text-[length:32px] font-bold leading-[40px]">
            {data.customerInfo.name}
          </div>
          <div className="h-4" />
          <div className="text-m-h3 font-bold leading-8">Invoices</div>
          <div className="h-4" />
          <table className="w-full">
            <tbody>
              {data.customerDetails?.invoiceDetails.map((details: any) => (
                <tr key={details.id} className={lineItemClassName}>
                  <td>
                    <Link
                      className="text-blue-600 underline"
                      href={`/sales/invoices/${details.id}`}
                    >
                      {details.number}
                    </Link>
                  </td>
                  <td
                    className={
                      'text-center uppercase' +
                      ' ' +
                      (details.dueStatus === 'paid'
                        ? 'text-green-brand'
                        : details.dueStatus === 'overdue'
                        ? 'text-red-brand'
                        : '')
                    }
                  >
                    {details.dueStatusDisplay}
                  </td>
                  <td className="text-right">
                    {currencyFormatter.format(details.totalAmount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}
