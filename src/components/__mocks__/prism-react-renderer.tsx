import React from 'react'

export const Prism = ({ children, ...props }: any) => (
  <pre {...props} role="code">
    <code>{children}</code>
  </pre>
)

export default Prism

export const oneDark = {}
export const oneLight = {}