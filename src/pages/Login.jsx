import { component } from '@dark-engine/core'
import { useTranslation } from '@wareme/translations'

import Theme from '../styles/Theme'
import SetTitle from '../components/SetTitle'
import { styled } from '@dark-engine/styled'

const Wrapper = styled.div`
  position: absolute;
  inset: 0;
  align-content: center;
`

const LogoContainer = styled.div`
  width: 80px;
  height: 80px;
  margin: auto;
  background: cyan;
`

const H1 = styled.h1`
  text-align: center;
  line-height: 1.2;
  font-size: 120%;
  letter-spacing: -0.01em;
`

const InputWrapper = styled.div`
  position: relative;
  width: 300px;
  margin: auto;
  border: 1px solid #ababab; // TODO color
  border-radius: 10px;
  background-color: #fff; // TODO color
  overflow: hidden;
`

const InputEmail = styled.input`
  box-sizing: border-box;
  width: 100%;
  padding: .8rem;
  border: none;
  background-color: #e9e9e9; // TODO color
`

const InputPassword = styled.input`
  box-sizing: border-box;
  width: 80%;
  padding: .8rem;
  border: none;
  background-color: #e9e9e9; // TODO color: ;
`

const PasswordButton = styled.button`
  position: absolute;
  inset: 0 0 0 80%;
  padding: 0 1rem;
  border: none;
  background-color: transparent;
`

const Button = styled.button`
  display: block;
  width: 240px;
  margin: auto;
  background-color: #fff;
  border-width: 1px;
  border-radius: 8px;
  cursor: pointer;
`

const Login = component(() => {
  const { t } = useTranslation('login')

  return (
    <Theme>
      <SetTitle title={t('title')} />

      <Wrapper>
        <LogoContainer>
          {/* TODO SVG */}
        </LogoContainer>
        <form>
          <H1>login to peony</H1>
          <InputWrapper>
            <InputEmail
              type='text'
              name='email'
              placeholder='email'
              autocomplete='email'
            />
          </InputWrapper>
          <InputWrapper>
            <InputPassword
              type='password'
              name='password'
              placeholder='Password'
              autocomplete='current-password'
            />
            <PasswordButton type='button'>h</PasswordButton>
          </InputWrapper>
          <Button type='button'>continue</Button>
        </form>
      </Wrapper>

    </Theme>
  )
})

export default Login
