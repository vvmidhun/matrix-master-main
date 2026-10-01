import { ChunkyButton } from './ChunkyButton'

export interface NumericInputPadProps {
  value: string
  onChange: (val: string) => void
  onSubmit?: () => void
  allowDecimal?: boolean
  allowNegative?: boolean
  disabled?: boolean
  variant?: 'cyan' | 'violet' | 'fuchsia'
}

export function NumericInputPad({
  value,
  onChange,
  onSubmit,
  allowDecimal = true,
  allowNegative = false,
  disabled = false,
  variant = 'cyan',
}: NumericInputPadProps) {
  const numVariant: NonNullable<Parameters<typeof ChunkyButton>[0]['variant']> =
    variant === 'cyan' ? 'cyan' : variant === 'fuchsia' ? 'fuchsia' : 'primary'
  const actionVariant: NonNullable<Parameters<typeof ChunkyButton>[0]['variant']> = 'ghost'

  const append = (s: string) => {
    if (disabled) return
    if (s === '.') {
      if (!allowDecimal) return
      if (value.includes('.')) return
      onChange(value === '' || value === '-' ? value + '0.' : value + '.')
    } else {
      onChange(value + s)
    }
  }

  const backspace = () => {
    if (disabled) return
    onChange(value.slice(0, -1))
  }

  const clear = () => {
    if (disabled) return
    onChange('')
  }

  const negate = () => {
    if (disabled || !allowNegative) return
    if (value === '') {
      onChange('-')
    } else if (value.startsWith('-')) {
      onChange(value.slice(1))
    } else {
      onChange('-' + value)
    }
  }

  return (
    <div
      role="group"
      aria-label="Number pad"
      className="grid grid-cols-4 gap-2 sm:gap-3"
    >
      <ChunkyButton
        variant={numVariant}
        size="xl"
        onClick={() => append('7')}
        disabled={disabled}
      >
        7
      </ChunkyButton>
      <ChunkyButton
        variant={numVariant}
        size="xl"
        onClick={() => append('8')}
        disabled={disabled}
      >
        8
      </ChunkyButton>
      <ChunkyButton
        variant={numVariant}
        size="xl"
        onClick={() => append('9')}
        disabled={disabled}
      >
        9
      </ChunkyButton>
      <ChunkyButton
        variant="danger"
        size="xl"
        onClick={backspace}
        disabled={disabled}
        aria-label="Backspace"
      >
        ⌫
      </ChunkyButton>

      <ChunkyButton
        variant={numVariant}
        size="xl"
        onClick={() => append('4')}
        disabled={disabled}
      >
        4
      </ChunkyButton>
      <ChunkyButton
        variant={numVariant}
        size="xl"
        onClick={() => append('5')}
        disabled={disabled}
      >
        5
      </ChunkyButton>
      <ChunkyButton
        variant={numVariant}
        size="xl"
        onClick={() => append('6')}
        disabled={disabled}
      >
        6
      </ChunkyButton>
      <ChunkyButton
        variant="danger"
        size="xl"
        onClick={clear}
        disabled={disabled}
        aria-label="Clear"
      >
        C
      </ChunkyButton>

      <ChunkyButton
        variant={numVariant}
        size="xl"
        onClick={() => append('1')}
        disabled={disabled}
      >
        1
      </ChunkyButton>
      <ChunkyButton
        variant={numVariant}
        size="xl"
        onClick={() => append('2')}
        disabled={disabled}
      >
        2
      </ChunkyButton>
      <ChunkyButton
        variant={numVariant}
        size="xl"
        onClick={() => append('3')}
        disabled={disabled}
      >
        3
      </ChunkyButton>
      {allowNegative ? (
        <ChunkyButton
          variant={actionVariant}
          size="xl"
          onClick={negate}
          disabled={disabled}
          aria-label="Negate"
        >
          ±
        </ChunkyButton>
      ) : (
        <div />
      )}

      <ChunkyButton
        variant={numVariant}
        size="xl"
        onClick={() => append('.')}
        disabled={disabled || !allowDecimal}
      >
        .
      </ChunkyButton>
      <ChunkyButton
        variant={numVariant}
        size="xl"
        onClick={() => append('0')}
        disabled={disabled}
      >
        0
      </ChunkyButton>
      <ChunkyButton
        variant={numVariant}
        size="xl"
        onClick={() => append('00')}
        disabled={disabled}
      >
        00
      </ChunkyButton>
      {onSubmit ? (
        <ChunkyButton
          variant="success"
          size="xl"
          onClick={onSubmit}
          disabled={disabled}
          aria-label="Submit"
        >
          ✓
        </ChunkyButton>
      ) : (
        <div />
      )}
    </div>
  )
}
