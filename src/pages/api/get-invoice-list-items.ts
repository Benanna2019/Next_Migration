import { getInvoiceListItems } from '@/models/invoiceserver'
import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from './auth/[...nextauth]'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerSession(req, res, authOptions)
  if (!session) {
    return res.status(401).send('Unauthorized')
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
  const allInvoicesData = {
    invoiceListItems,
    overdueAmount,
    dueSoonAmount,
  }

  const hundo = allInvoicesData.dueSoonAmount + allInvoicesData.overdueAmount
  const dueSoonPercent = Math.floor(
    (allInvoicesData.dueSoonAmount / hundo) * 100
  )
  res.status(200).json({ allInvoicesData, dueSoonPercent })
}
