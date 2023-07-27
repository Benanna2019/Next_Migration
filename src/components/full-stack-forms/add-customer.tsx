import { FilePlusIcon, inputClasses, LabelText } from '..'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import * as React from 'react'
import { useMutation } from '@tanstack/react-query'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../../shadui/ui/dialog'

const newCustomerSchema = z.object({
  name: z.string().nonempty({ message: 'Name is required' }),
  email: z.string().email({ message: 'Invalid email' }),
})

type NewCustomerFormData = z.infer<typeof newCustomerSchema>

export default function BetterAddCustomerForm() {
  const [open, setOpen] = React.useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<NewCustomerFormData>({
    resolver: zodResolver(newCustomerSchema),
  })

  const mutation = useMutation({
    mutationFn: (formData: any) => {
      return fetch('/api/add-customer', {
        method: 'POST',
        body: JSON.stringify(formData),
      })
    },
  })

  const router = useRouter()

  async function _addCustomerAction(data: NewCustomerFormData) {
    const result = await mutation.mutateAsync(data)
    const newCustomer = await result.json()
    setOpen(false)
    router.push(`/sales/customers/${newCustomer.id}`)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <span className="flex gap-1">
          <FilePlusIcon /> <span>Add Customer</span>
        </span>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a Customer</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
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
              {errors.name && (
                <p className="text-red-500">{errors.name.message}</p>
              )}
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
            {errors.email && (
              <p className="text-red-500">{errors.email.message}</p>
            )}
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
