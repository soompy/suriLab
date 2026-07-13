import React from 'react'

type PrismProps = React.HTMLAttributes<HTMLPreElement>

export const Prism = ({ children, ...props }: PrismProps) => (
  <pre {...props} role="code">
    <code>{children}</code>
  </pre>
)

export default Prism

export const oneDark = {}
export const oneLight = {}
