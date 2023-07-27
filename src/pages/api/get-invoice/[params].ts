import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]'
import { getInvoiceDetails, getInvoiceListItems } from '@/models/invoiceserver'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerSession(req, res, authOptions)
  if (!session) {
    return res.status(401).send('Unauthorized')
  }
  const invoiceId = req.query.params as string

  if (typeof invoiceId !== 'string') {
    throw new Error('This should be impossible.')
  }
  const invoiceDetails = await getInvoiceDetails(invoiceId)
  if (!invoiceDetails) {
    throw new Response('not found', { status: 404 })
  }
  const invoiceData = {
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

  res.status(200).json({ invoiceData })
}
