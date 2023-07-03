import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]'
import {
  getCustomerDetails,
  getCustomerInfo,
  getCustomerListItems,
} from '@/models/customerserver'
import invariant from 'tiny-invariant'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerSession(req, res, authOptions)
  if (!session) {
    return res.status(401).send('Unauthorized')
  }
  const customerId = req.query.params as string

  invariant(
    typeof customerId === 'string',
    'params.customerId is not available'
  )
  const customerInfo = await getCustomerInfo(customerId)
  if (!customerInfo) {
    throw new Response('not found', { status: 404 })
  }
  const customerDetails = await getCustomerDetails(customerId)
  const customers = await getCustomerListItems()

  const data = { customers, customerInfo, customerDetails }

  res.status(200).json(data)
}
