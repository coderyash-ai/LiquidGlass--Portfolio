import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react'

type Tone = 'light' | 'dark' | 'accent'
type Size = 'md' | 'lg'

type Common = {
  tone?: Tone
  size?: Size
  className?: string
  children: ReactNode
}

type ButtonProps = Common &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: undefined
  }

type LinkProps = Common &
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string
  }

export function GlassButton(props: ButtonProps | LinkProps) {
  const { tone = 'light', size = 'md', className = '', children } = props
  const cls = `glass-btn glass-btn--${tone} glass-btn--${size} ${className}`.trim()

  if ('href' in props && props.href) {
    const { href, target, rel, onClick } = props
    return (
      <a className={cls} href={href} target={target} rel={rel} onClick={onClick}>
        <span>{children}</span>
      </a>
    )
  }

  const buttonProps = props as ButtonProps
  return (
    <button
      className={cls}
      type={buttonProps.type ?? 'button'}
      onClick={buttonProps.onClick}
      disabled={buttonProps.disabled}
    >
      <span>{children}</span>
    </button>
  )
}
