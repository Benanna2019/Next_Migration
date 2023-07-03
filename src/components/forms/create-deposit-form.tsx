import { LabelText, inputClasses, submitButtonClasses } from '..'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import React from 'react'
import { useRouter } from 'next/router'

const createDepositSchema = z.object({
  formAmount: z.string(),
  formDepositDate: z.string(),
  invoiceId: z.string(),
  formNote: z.string(),
  intent: z.string(),
})

type CreateDepositFormData = z.infer<typeof createDepositSchema>

export default function CreateDepositForm({ data }: { data: any }) {
  const [loading, setLoading] = React.useState<boolean>(false)
  const [error, setError] = React.useState<string | null>(null)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateDepositFormData>({
    resolver: zodResolver(createDepositSchema),
  })

  const router = useRouter()

  async function _createDepositAction(data: CreateDepositFormData) {
    await new Promise((resolve) => setTimeout(resolve, 200))
    setLoading(true)
    const response = await fetch('/api/create-deposit', {
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
    reset()
    router.push(`/sales/invoices/${data.invoiceId}`)
  }

  return (
    <form
      onSubmit={handleSubmit(_createDepositAction)}
      className="grid grid-cols-1 gap-x-4 gap-y-2 lg:grid-cols-2"
    >
      <div className="min-w-[100px]">
        <div className="flex flex-wrap items-center gap-1">
          <LabelText>
            <label htmlFor="depositAmount">Amount</label>
          </LabelText>
        </div>
        <input
          id="depositAmount"
          {...register('formAmount')}
          type="number"
          className={inputClasses}
          min="0.01"
          step="any"
          required
        />
      </div>
      <div>
        <div className="flex flex-wrap items-center gap-1">
          <LabelText>
            <label htmlFor="depositDate">Date</label>
          </LabelText>
        </div>
        <input
          id="depositDate"
          {...register('formDepositDate')}
          type="date"
          className={`${inputClasses} h-[34px]`}
          required
        />
        <label htmlFor="invoiceId" className="sr-only" />
        <input
          id="invoiceId"
          {...register('invoiceId')}
          type="hidden"
          value={data.invoiceId}
        />
      </div>
      <div className="grid grid-cols-1 gap-4 lg:col-span-2 lg:flex">
        <div className="flex-1">
          <LabelText>
            <label htmlFor="depositNote">Note</label>
          </LabelText>
          <input
            id="depositNote"
            {...register('formNote')}
            type="text"
            className={inputClasses}
          />
        </div>
        <div className="flex items-end">
          <button
            type="submit"
            className={submitButtonClasses}
            {...register('intent')}
            value="create-deposit"
          >
            Create
          </button>
        </div>
      </div>
    </form>
  )
}
