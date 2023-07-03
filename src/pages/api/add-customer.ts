import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from './auth/[...nextauth]'
import { createCustomer } from '@/models/customerserver'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerSession(req, res, authOptions)
  if (!session) {
    res.status(401).send('Unauthorized')
  }

  const { name, email } = req.body
  const customer = await createCustomer({ name, email })
  res.status(200).json(customer)
}
