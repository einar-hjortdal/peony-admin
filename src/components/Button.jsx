import { styled } from '@dark-engine/styled'

const Button = styled.button`
  background-color: ${p => p.theme.button[p.$variant].bg};
  color: ${p => p.theme.button[p.$variant].fg};
  border: none;
  border-radius: .5rem;
  font-weight: 500;
  padding: .5rem 1rem;
  cursor: pointer;
  &:hover {
    background-color: ${p => p.theme.button[p.$variant].hoverBg};
  }
`
export default Button
