import { createDeposit } from '@/models/depositserver'
import { parseDate } from '@/utils'
import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import invariant from 'tiny-invariant'
import {
  validateAmount,
  validateDepositDate,
} from '../sales/invoices/[invoiceId]'
import { authOptions } from './auth/[...nextauth]'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerSession(req, res, authOptions)
  if (!session) {
    return new Response('Unauthorized', { status: 401 })
  }

  const { invoiceId, intent, formAmount, formDepositDate, formNote } = req.body

  if (typeof invoiceId !== 'string') {
    throw new Error('This should be impossible.')
  }

  invariant(typeof intent === 'string', 'intent required')
  switch (intent) {
    case 'create-deposit': {
      const amount = Number(formAmount)
      const note = formNote
      invariant(!Number.isNaN(amount), 'amount must be a number')
      invariant(typeof formDepositDate === 'string', 'dueDate is required')
      invariant(typeof note === 'string', 'dueDate is required')
      const depositDate = parseDate(formDepositDate)

      const errors = {
        amount: validateAmount(amount),
        depositDate: validateDepositDate(depositDate),
      }
      const hasErrors = Object.values(errors).some(
        (errorMessage) => errorMessage
      )
      if (hasErrors) {
        return errors
      }

      const newDeposit = await createDeposit({
        invoiceId,
        amount,
        note,
        depositDate,
      })
      console.log('new deposit data', newDeposit)
      return res.status(200).json(newDeposit)
    }
    default: {
      throw new Error(`Unsupported intent: ${intent}`)
    }
  }
}
