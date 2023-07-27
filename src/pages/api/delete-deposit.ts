import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from './auth/[...nextauth]'
import { deleteDeposit } from '@/models/depositserver'

import invariant from 'tiny-invariant'
import { findInvoiceByDepositId } from '@/models/invoiceserver'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerSession(req, res, authOptions)
  if (!session) {
    return res.status(401).send('Unauthorized')
  }
  let {
    query: { params },
  } = req
  let { intent, depositId } = req.body

  invariant(typeof depositId === 'string', 'params.depositId is not available')
  invariant(typeof intent === 'string', 'intent must be a string')

  let redirect
  const associatedInvoiceId = await findInvoiceByDepositId(depositId)

  if (!associatedInvoiceId) {
    redirect = '/sales/invoices'
  } else {
    redirect = `/sales/invoices/${associatedInvoiceId.id}`
  }

  switch (intent) {
    case 'delete': {
      await deleteDeposit(depositId)
      res.status(200).json(redirect)
    }
    default: {
      throw new Error(`Unsupported intent: ${intent}`)
    }
  }
}
