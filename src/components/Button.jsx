import { styled } from '@dark-engine/styled'

const Button = styled.button`
  background-color: ${p => p.theme.button[p.$variant].bg};
  color: ${p => p.theme.button[p.$variant].fg};
  border-radius: .3125rem;
  padding: .5rem 1rem;
  cursor: pointer;
  transition: background-color .2s;
  &:hover {
    background-color: ${p => p.theme.button[p.$variant].hoverBg};
  }
`
export default Button
