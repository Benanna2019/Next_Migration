import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from './auth/[...nextauth]'
import { createCustomer } from '@/models/customerserver'
import { getUserByEmail } from '@/models/userserver'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerSession(req, res, authOptions)
  if (!session) {
    res.status(401).send('Unauthorized')
  }

  if (!session?.user?.email) {
    res.status(401).send({
      message:
        'please add an email to your github profile & logout out and signin again',
    })
  }

  const user = await getUserByEmail(session?.user?.email as string)

  if (!user) {
    res.status(401).send({
      message: 'There is a server error and you shouldnt be getting this error',
    })
  }

  const { name, email } = JSON.parse(req.body)
  const customer = await createCustomer({
    name,
    email,
    user_email: user?.email as string,
  })
  console.log('customer', customer)
  res.status(200).json(customer)
}
