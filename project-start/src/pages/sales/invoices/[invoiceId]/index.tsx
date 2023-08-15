import Link from 'next/link'
import { LabelText } from '@/components'
import { currencyFormatter, fetcher } from '@/utils'
import { Deposits, LineItemDisplay } from '@/components/deposit'
import InvoicesPage from '@/components/invoice-page'
import Layout from '@/components/layouts'
import SalesNav from '@/components/sales-nav'
import { useRouter } from 'next/router'
import { useQuery } from '@tanstack/react-query'
import { CustomerSkeleton } from '@/components/customer-layout'
import { LineItem } from '@prisma/client'

export function validateAmount(amount: number) {
  if (amount <= 0) return 'Must be greater than 0'
  if (Number(amount.toFixed(2)) !== amount) {
    return 'Must only have two decimal places'
  }
  return null
}

export function validateDepositDate(date: Date) {
  if (Number.isNaN(date.getTime())) {
    return 'Please enter a valid date'
  }
  return null
}

export const lineItemClassName =
  'flex justify-between border-t border-gray-100 py-4 text-[14px] leading-[24px]'

function InvoiceRoute() {
  const router = useRouter()
  const invoiceId = router.query.invoiceId

  const { data, isLoading, isSuccess, isError } = useQuery(
    ['invoices', invoiceId],
    () => fetcher(`/api/get-invoice/${invoiceId}`)
  )

  return (
    <>
      {isLoading && <CustomerSkeleton />}
      {isSuccess && (
        <div className="relative p-10">
          <Link
            href={`/sales/customers/${data?.invoiceData.customerId}`}
            className="text-[length:14px] font-bold leading-6 text-blue-600 underline"
          >
            {data?.invoiceData.customerName}
          </Link>
          <div className="text-[length:32px] font-bold leading-[40px]">
            {currencyFormatter.format(data?.invoiceData.totalAmount)}
          </div>
          <LabelText>
            <span
              className={
                data?.invoiceData.dueStatus === 'paid'
                  ? 'text-green-brand'
                  : data?.invoiceData.dueStatus === 'overdue'
                  ? 'text-red-brand'
                  : ''
              }
            >
              {data?.invoiceData.dueDisplay}
            </span>
            {` • Invoiced ${data?.invoiceData.invoiceDateDisplay}`}
          </LabelText>
          <div className="h-4" />
          {data?.invoiceData.lineItems.map((item: LineItem) => (
            <LineItemDisplay
              key={item.id}
              description={item.description}
              unitPrice={item.unitPrice}
              quantity={item.quantity}
            />
          ))}
          <div className={`${lineItemClassName} font-bold`}>
            <div>Net Total</div>
            <div>{currencyFormatter.format(data?.invoiceData.totalAmount)}</div>
          </div>
          <div className="h-8" />
          <Deposits data={data?.invoiceData} />
        </div>
      )}
    </>
  )
}

InvoiceRoute.getLayout = function getLayout(page: React.ReactNode) {
  return (
    <Layout>
      <SalesNav>
        <InvoicesPage>{page}</InvoicesPage>
      </SalesNav>
    </Layout>
  )
}

export default InvoiceRoute
