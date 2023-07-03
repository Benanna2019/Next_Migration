import { currencyFormatter } from '../../utils'
import Link from 'next/link'
import CreateDepositForm from '../forms/create-deposit-form'

interface DepositFormControlsCollection extends HTMLFormControlsCollection {
  amount?: HTMLInputElement
  depositDate?: HTMLInputElement
  note?: HTMLInputElement
  intent?: HTMLButtonElement
}

interface DepositData {
  customerName: string
  customerId: string
  totalAmount: number
  dueStatus: 'paid' | 'overpaid' | 'overdue' | 'due'
  dueDisplay: string
  invoiceDateDisplay: string
  lineItems: {
    id: string
    description: string
    quantity: number
    unitPrice: number
  }[]
  deposits: {
    id: string
    amount: number
    depositDateFormatted: string
  }[]
  invoiceId: string
}

const lineItemClassName =
  'flex justify-between border-t border-gray-100 py-4 text-[14px] leading-[24px]'

export function Deposits({ data }: { data: DepositData }) {
  // this is purely for helping the user have a better experience.

  //   if (newDepositFetcher.submission) {
  //     const amount = Number(newDepositFetcher.submission.formData.get('amount'))
  //     const depositDateVal =
  //       newDepositFetcher.submission.formData.get('depositDate')
  //     const depositDate =
  //       typeof depositDateVal === 'string' ? parseDate(depositDateVal) : null
  //     if (
  //       !validateAmount(amount) &&
  //       depositDate &&
  //       !validateDepositDate(depositDate)
  //     ) {
  //       deposits.push({
  //         id: 'new',
  //         amount,
  //         depositDateFormatted: depositDate.toLocaleDateString(),
  //       })
  //     }
  //   }

  return (
    <div>
      <div className="font-bold leading-8">Deposits</div>
      {data.deposits.length > 0 ? (
        data.deposits.map((deposit) => (
          <div key={deposit.id} className={lineItemClassName}>
            <Link
              href={`/sales/deposits/${deposit.id}`}
              className="text-blue-600 underline"
            >
              {deposit.depositDateFormatted}
            </Link>
            <div>{currencyFormatter.format(deposit.amount)}</div>
          </div>
        ))
      ) : (
        <div>None yet</div>
      )}
      <CreateDepositForm data={data} />
    </div>
  )
}

export function LineItemDisplay({
  description,
  quantity,
  unitPrice,
}: {
  description: string
  quantity: number
  unitPrice: number
}) {
  return (
    <div className={lineItemClassName}>
      <div>{description}</div>
      {quantity === 1 ? null : <div className="text-[10px]">({quantity}x)</div>}
      <div>{currencyFormatter.format(unitPrice)}</div>
    </div>
  )
}
