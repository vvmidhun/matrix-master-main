import type { ButtonHTMLAttributes, ReactNode } from 'react'

export interface ChunkyButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  selected?: boolean
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'default' | 'primary' | 'cyan' | 'fuchsia' | 'success' | 'danger' | 'ghost'
}

const SIZE_CLASSES: Record<NonNullable<ChunkyButtonProps['size']>, string> = {
  sm: 'text-sm px-3.5 py-2',
  md: 'text-base px-4 py-2.5',
  lg: 'text-lg px-5 py-3',
  xl: 'text-xl px-6 py-3.5',
}

export function ChunkyButton({
  children,
  selected = false,
  size = 'md',
  variant = 'default',
  className = '',
  disabled,
  ...rest
}: ChunkyButtonProps) {
  const sizeCls = SIZE_CLASSES[size]

  let variantCls = ''
  if (selected) {
    variantCls = 'bg-post text-white ring-2 ring-post-deep'
  } else {
    switch (variant) {
      case 'primary':
        variantCls =
          'bg-post text-white ring-2 ring-post-deep active:shadow-neon-fuchsia'
        break
      case 'cyan':
        variantCls =
          'bg-neon-cyan text-paper ring-2 ring-post shadow-neon-cyan'
        break
      case 'fuchsia':
        variantCls =
          'bg-neon-fuchsia text-paper ring-2 ring-post shadow-neon-fuchsia'
        break
      case 'success':
        variantCls = 'bg-neon-lime text-paper ring-2 ring-post shadow-neon-lime'
        break
      case 'danger':
        variantCls = 'bg-bad text-paper ring-2 ring-post'
        break
      case 'ghost':
        variantCls = 'bg-glass-bg text-ink ring-2 ring-glass-ring'
        break
      case 'default':
      default:
        variantCls = 'bg-glass-bg text-ink ring-2 ring-glass-ring'
        break
    }
  }

  return (
    <button
      {...rest}
      disabled={disabled}
      className={[
        'inline-flex items-center justify-center gap-2 rounded-2xl',
        'font-display font-bold',
        'active:scale-[0.97] shadow-press',
        'transition-all duration-150 ease-out',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100',
        sizeCls,
        variantCls,
        className,
      ].join(' ')}
    >
      {children}
    </button>
  )
}
