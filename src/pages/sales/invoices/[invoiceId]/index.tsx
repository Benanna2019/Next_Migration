import Link from 'next/link'
import { LabelText } from '@/components'
import { getInvoiceDetails, getInvoiceListItems } from '@/models/invoiceserver'
import { currencyFormatter } from '@/utils'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import { Deposits, LineItemDisplay } from '@/components/deposit'
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next'
import InvoicesPage from '@/components/invoice-page'
import Layout from '@/components/layouts'
import SalesNav from '@/components/sales-nav'

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

export default function InvoiceRoute({
  data,
  dueSoonPercent,
  invoicePageData,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <Layout>
      <SalesNav>
        <InvoicesPage data={invoicePageData} dueSoonPercent={dueSoonPercent}>
          <div className="relative p-10">
            <Link
              href={`/sales/customers/${data.customerId}`}
              className="text-[length:14px] font-bold leading-6 text-blue-600 underline"
            >
              {data.customerName}
            </Link>
            <div className="text-[length:32px] font-bold leading-[40px]">
              {currencyFormatter.format(data.totalAmount)}
            </div>
            <LabelText>
              <span
                className={
                  data.dueStatus === 'paid'
                    ? 'text-green-brand'
                    : data.dueStatus === 'overdue'
                    ? 'text-red-brand'
                    : ''
                }
              >
                {data.dueDisplay}
              </span>
              {` • Invoiced ${data.invoiceDateDisplay}`}
            </LabelText>
            <div className="h-4" />
            {data.lineItems.map((item) => (
              <LineItemDisplay
                key={item.id}
                description={item.description}
                unitPrice={item.unitPrice}
                quantity={item.quantity}
              />
            ))}
            <div className={`${lineItemClassName} font-bold`}>
              <div>Net Total</div>
              <div>{currencyFormatter.format(data.totalAmount)}</div>
            </div>
            <div className="h-8" />
            <Deposits data={data} />
          </div>
        </InvoicesPage>
      </SalesNav>
    </Layout>
  )
}

export async function getServerSideProps(
  context: GetServerSidePropsContext & { params: { invoiceId: string } }
) {
  const user = await getServerSession(context.req, context.res, authOptions)
  if (!user) {
    redirect('/login')
  }

  const { invoiceId } = context.params

  if (typeof invoiceId !== 'string') {
    throw new Error('This should be impossible.')
  }
  const invoiceDetails = await getInvoiceDetails(invoiceId)
  if (!invoiceDetails) {
    throw new Response('not found', { status: 404 })
  }
  const data = {
    customerName: invoiceDetails.invoice.customer.name,
    customerId: invoiceDetails.invoice.customer.id,
    totalAmount: invoiceDetails.totalAmount,
    dueStatus: invoiceDetails.dueStatus,
    dueDisplay: invoiceDetails.dueStatusDisplay,
    invoiceDateDisplay: invoiceDetails.invoice.invoiceDate.toLocaleDateString(),
    lineItems: invoiceDetails.invoice.lineItems.map((li) => ({
      id: li.id,
      description: li.description,
      quantity: li.quantity,
      unitPrice: li.unitPrice,
    })),
    deposits: invoiceDetails.invoice.deposits.map((deposit) => ({
      id: deposit.id,
      amount: deposit.amount,
      depositDateFormatted: deposit.depositDate.toLocaleDateString(),
    })),
    invoiceId: invoiceId,
  }

  const invoiceListItems = await getInvoiceListItems()
  const dueSoonAmount = invoiceListItems.reduce((sum, li) => {
    if (li.dueStatus !== 'due') {
      return sum
    }
    const remainingBalance = li.totalAmount - li.totalDeposits
    return sum + remainingBalance
  }, 0)
  const overdueAmount = invoiceListItems.reduce((sum, li) => {
    if (li.dueStatus !== 'overdue') {
      return sum
    }
    const remainingBalance = li.totalAmount - li.totalDeposits
    return sum + remainingBalance
  }, 0)
  const invoicePageData = {
    invoiceListItems,
    overdueAmount,
    dueSoonAmount,
  }

  const hundo = invoicePageData.dueSoonAmount + invoicePageData.overdueAmount
  const dueSoonPercent = Math.floor(
    (invoicePageData.dueSoonAmount / hundo) * 100
  )

  return {
    props: {
      data,
      invoicePageData,
      dueSoonPercent,
    },
  }
}
