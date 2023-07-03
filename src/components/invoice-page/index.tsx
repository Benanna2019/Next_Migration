import Link from 'next/link'
import { FilePlusIcon, LabelText } from '../index'
import { currencyFormatter } from '../../utils'
import { usePathname } from 'next/navigation'
import { AddInvoiceDialog } from '../modal/add-invoice-dialog'

export default function InvoicesPage({
  children,
  data,
  dueSoonPercent,
}: {
  children?: React.ReactNode
  data: InvoiceData
  dueSoonPercent: number
}) {
  return (
    <div className="relative">
      <div className="flex items-center justify-between gap-4">
        <InvoicesInfo label="Overdue" amount={data.overdueAmount} />
        <div className="flex h-4 flex-1 overflow-hidden rounded-full">
          <div className="bg-yellow-brand flex-1" />
          <div
            className="bg-green-brand"
            style={{ width: `${dueSoonPercent}%` }}
          />
        </div>
        <InvoicesInfo label="Due Soon" amount={data.dueSoonAmount} right />
      </div>
      <div className="h-4" />
      <LabelText>Invoice List</LabelText>
      <div className="h-2" />
      <InvoiceList invoiceListItems={data.invoiceListItems}>
        {children}
      </InvoiceList>
    </div>
  )
}

function InvoicesInfo({
  label,
  amount,
  right,
}: {
  label: string
  amount: number
  right?: boolean
}) {
  return (
    <div className={right ? 'text-right' : ''}>
      <LabelText>{label}</LabelText>
      <div className="text-[length:18px] text-black">
        {currencyFormatter.format(amount)}
      </div>
    </div>
  )
}

function InvoiceList({
  children,
  invoiceListItems,
}: {
  children: React.ReactNode
  invoiceListItems: InvoiceData['invoiceListItems']
}) {
  const pathname = usePathname()

  const newInvoiceRouteIsActive = pathname === '/sales/invoices/newInvoice'
  const singleInvoiceRouteIsActive = pathname === '/sales/invoices/[invoiceId]'

  return (
    <div className="flex overflow-hidden rounded-lg border border-gray-100">
      <div className="w-1/2 border-r border-gray-100">
        <div
          className={
            'block border-b-4 border-gray-100 py-3 px-4 hover:bg-gray-50' +
            ' ' +
            (newInvoiceRouteIsActive ? 'bg-gray-50' : '')
          }
        >
          {
            <AddInvoiceDialog
              trigger={
                <span className="flex gap-1">
                  <FilePlusIcon /> <span>Create new invoice</span>
                </span>
              }
            />
          }
        </div>

        <div className="max-h-96 overflow-y-scroll">
          {invoiceListItems.map((invoice) => (
            <Link
              key={invoice.id}
              href={`/sales/invoices/${invoice.id}`}
              className={
                'block border-b border-gray-50 py-3 px-4 hover:bg-gray-50' +
                ' ' +
                (singleInvoiceRouteIsActive ? 'bg-gray-50' : '')
              }
            >
              <div className="flex justify-between text-[length:14px] font-bold leading-6">
                <div>{invoice.name}</div>
                <div>{currencyFormatter.format(invoice.totalAmount)}</div>
              </div>
              <div className="flex justify-between text-[length:12px] font-medium leading-4 text-gray-400">
                <div>{invoice.number}</div>
                <div
                  className={
                    'uppercase' +
                    ' ' +
                    (invoice.dueStatus === 'paid'
                      ? 'text-green-brand'
                      : invoice.dueStatus === 'overdue'
                      ? 'text-red-brand'
                      : '')
                  }
                >
                  {invoice.dueStatusDisplay}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <div className="w-1/2">{children}</div>
    </div>
  )
}

interface InvoiceData {
  invoiceListItems: {
    totalAmount: number
    totalDeposits: number
    daysToDueDate: number
    dueStatus: 'paid' | 'overpaid' | 'overdue' | 'due'
    dueStatusDisplay: string
    id: string
    name: string
    number: number
  }[]
  overdueAmount: number
  dueSoonAmount: number
}
