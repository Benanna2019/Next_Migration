import { inputClasses, LabelText, submitButtonClasses } from '..'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import * as React from 'react'

const newCustomerSchema = z.object({
  name: z.string().nonempty({ message: 'Name is required' }),
  email: z.string().email({ message: 'Invalid email' }),
})

type NewCustomerFormData = z.infer<typeof newCustomerSchema>

export default function AddCustomerForm() {
  const [loading, setLoading] = React.useState<boolean>(false)
  const [error, setError] = React.useState<string | null>(null)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<NewCustomerFormData>({
    resolver: zodResolver(newCustomerSchema),
  })
  const router = useRouter()

  async function _addCustomerAction(data: NewCustomerFormData) {
    await new Promise((resolve) => setTimeout(resolve, 200))
    setLoading(true)
    const response = await fetch('/api/add-customer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    const result = await response.json()
    if (result.status !== 200) {
      setError(null)
    }
    router.push(`/sales/customers/${result.id}`)
  }

  return (
    <div className="relative p-10">
      <h2 className="font-display mb-4">New Customer</h2>
      <form
        onSubmit={handleSubmit(_addCustomerAction)}
        className="flex flex-col gap-4"
      >
        <div>
          <label htmlFor="name">
            <LabelText>Name</LabelText>
          </label>
          <input
            id="name"
            className={inputClasses}
            type="text"
            {...register('name')}
          />
        </div>
        <div>
          <label htmlFor="email">
            <LabelText>Email</LabelText>
          </label>
          <input
            id="email"
            className={inputClasses}
            type="email"
            {...register('email')}
          />
        </div>
        <input type="submit" />
      </form>
    </div>
  )
}
