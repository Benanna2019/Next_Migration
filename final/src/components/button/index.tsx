/* eslint-disable react/display-name */
import Link from 'next/link'
import * as React from 'react'

interface BaseButtonProps {
  [key: string]: unknown
  size: string
  disabled?: boolean
}

type ButtonAsButton = BaseButtonProps &
  React.ButtonHTMLAttributes<HTMLButtonElement>

type ButtonAsLink = BaseButtonProps &
  React.AnchorHTMLAttributes<HTMLAnchorElement>

type ButtonProps = ButtonAsButton | ButtonAsLink

function BaseButton({
  href = null,
  as = null,
  forwardedRef = null,
  type = null,
  ...rest
}) {
  if (href) {
    return (
      <Link href={href}>
        <div {...rest} />
      </Link>
    )
  }

  if (href) {
    // eslint-disable-next-line jsx-a11y/anchor-has-content
    return <a ref={forwardedRef} href={href} {...rest} />
  }

  return <button ref={forwardedRef} {...rest} />
}

type SIZE = string | null

const baseClasses =
  'flex space-x-2 flex-none items-center justify-center cursor-pointer leading-none transition-all font-semibold'

function getSize(size: SIZE = null) {
  switch (size) {
    case 'large': {
      return 'px-4 py-3 text-sm'
    }
    case 'small': {
      return 'px-2.5 py-1.5 text-xs'
    }
    case 'small-square': {
      return 'p-2 text-sm'
    }
    default: {
      return 'px-4 py-2 text-sm'
    }
  }
}

function getOpacity(disabled = false) {
  return disabled ? 'opacity-50 cursor-not-allowed' : 'opacity-100'
}

function getRadius(size: SIZE = null) {
  switch (size) {
    case 'large': {
      return 'rounded-lg'
    }
    case 'small': {
      return 'rounded'
    }
    default: {
      return 'rounded-md'
    }
  }
}

const composer = {
  getSize,
  getOpacity,
  getRadius,
}

export const Button = React.forwardRef((props: ButtonProps, ref) => {
  const classes = `text-gray-700 hover:text-gray-1000 shadow-xs bg-white border border-gray-400 border-opacity-30 dark:border-gray-700 dark:hover:border-gray-600 dark:bg-white dark:bg-opacity-10 dark:text-gray-200 dark:hover:text-white hover:border-opacity-50 hover:shadow-sm`
  const size = composer.getSize(props.size)
  const opacity = composer.getOpacity(props.disabled)
  const radius = composer.getRadius(props.size)
  const composed = `${baseClasses} ${size} ${opacity} ${radius} ${classes}`
  //@ts-ignore
  return <BaseButton forwardedRef={ref} className={composed} {...props} />
})

export default Button

export const PrimaryButton = React.forwardRef((props: ButtonProps, ref) => {
  const classes = `text-white hover:text-white shadow-xs bg-blue-500 border border-blue-600 dark:border-blue-400 dark:border-opacity-50 hover:shadow-sm`
  const size = composer.getSize(props.size)
  const opacity = composer.getOpacity(props.disabled)
  const radius = composer.getRadius(props.size)
  const composed = `${baseClasses} ${size} ${opacity} ${radius} ${classes}`
  //@ts-ignore
  return <BaseButton forwardedRef={ref} className={composed} {...props} />
})

export const DeleteButton = React.forwardRef((props: ButtonProps, ref) => {
  const classes = `bg-white border border-gray-200 dark:border-red-500 dark:hover:border-red-500  dark:bg-red-500 dark:border-opacity-20 dark:bg-opacity-10 text-red-500 hover:border-red-500 hover:text-white hover:bg-red-600 focus:bg-red-600 dark:focus:text-white`

  const size = composer.getSize(props.size)
  const opacity = composer.getOpacity(props.disabled)
  const radius = composer.getRadius(props.size)
  const composed = `${baseClasses} ${size} ${opacity} ${radius} ${classes}`
  //@ts-ignore
  return <BaseButton forwardedRef={ref} className={composed} {...props} />
})

export const RecordingButton = React.forwardRef((props: ButtonProps, ref) => {
  const classes = `bg-green-500 border border-green-600 dark:border-green-500 dark:hover:border-green-500 dark:bg-green-500 dark:border-opacity-20 dark:bg-opacity-10  text-white hover:bg-green-600`
  const size = composer.getSize(props.size)
  const opacity = composer.getOpacity(props.disabled)
  const radius = composer.getRadius(props.size)
  const composed = `${baseClasses} ${size} ${opacity} ${radius} ${classes}`
  //@ts-ignore
  return <BaseButton forwardedRef={ref} className={composed} {...props} />
})

export const GhostButton = React.forwardRef((props: ButtonProps, ref) => {
  const classes = `text-white hover:text-black bg-gray-100 bg-opacity-0 hover:bg-opacity-100 `
  const size = composer.getSize(props.size)
  const opacity = composer.getOpacity(props.disabled)
  const radius = composer.getRadius(props.size)
  const composed = `${baseClasses} ${size} ${opacity} ${radius} ${classes}`
  //@ts-ignore
  return <BaseButton forwardedRef={ref} className={composed} {...props} />
})

export const CommentButton = React.forwardRef((props: ButtonProps, ref) => {
  const classes = `${
    props.disabled
      ? 'text-gray-500 border-gray-400 bg-black'
      : 'border-blue-600 bg-blue-500 text-black hover:bg-blue-600'
  } shadow-xs bg-white border border-opacity-30 dark:bg-opacity-10 hover:border-opacity-50 hover:shadow-sm w-8 rounded`
  const size = composer.getSize(props.size)
  const opacity = composer.getOpacity(props.disabled)
  const radius = composer.getRadius(props.size)
  const composed = `${baseClasses} ${size} ${opacity} ${radius} ${classes}`
  //@ts-ignore
  return <BaseButton className={composed} forwardedRef={ref} {...props} />
})

export const CommentInputButton = React.forwardRef(
  (props: ButtonProps, ref) => {
    const classes = `${
      props.disabled
        ? 'text-gray-500 border-gray-400 bg-black'
        : 'border-blue-600 bg-blue-500 text-black hover:bg-blue-600'
    } shadow-xs bg-white border border-opacity-30 dark:bg-opacity-10 hover:border-opacity-50 hover:shadow-sm w-8 rounded`
    const size = composer.getSize(props.size)
    const opacity = composer.getOpacity(props.disabled)
    const radius = composer.getRadius(props.size)
    const composed = `${baseClasses} ${size} ${opacity} ${radius} ${classes}`
    //@ts-ignore
    return <input className={composed} type="submit" />
  }
)

export const TwitterButton = React.forwardRef((props: ButtonProps, ref) => {
  const classes = `bg-twitter text-white space-x-4 items-center`
  const size = composer.getSize(props.size)
  const opacity = composer.getOpacity(props.disabled)
  const radius = composer.getRadius(props.size)
  const composed = `${baseClasses} ${size} ${opacity} ${radius} ${classes}`
  //@ts-ignore
  return <BaseButton forwardedRef={ref} className={composed} {...props} />
})

export const GithubButton = React.forwardRef((props: ButtonProps, ref) => {
  const classes = `bg-slate-800 text-white space-x-4 items-center`
  const size = composer.getSize(props.size)
  const opacity = composer.getOpacity(props.disabled)
  const radius = composer.getRadius(props.size)
  const composed = `${baseClasses} ${size} ${opacity} ${radius} ${classes}`
  //@ts-ignore
  return <BaseButton forwardedRef={ref} className={composed} {...props} />
})
