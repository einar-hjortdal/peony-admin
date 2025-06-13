import { component, detectIsEmpty } from '@dark-engine/core'
import { useTranslation } from '@wareme/translations'

import Theme from '../styles/Theme'
import SetTitle from '../components/SetTitle'
import { styled } from '@dark-engine/styled'
import { useUserLoginMutation } from '../data'
import Navigate from '../components/Navigate'

const Error = styled.p`
  text-align: center;
`

const DisplayError = component(({ error }) => {
  if (detectIsEmpty(error)) {
    return null
  }

  return <Error>{error}</Error>
})

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

const Input = styled.input`
  box-sizing: border-box;
  width: 100%;
  padding: .8rem;
  border: none;
  background-color: #e9e9e9; // TODO color
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
  const [userLogin, { isFetching, data, error }] = useUserLoginMutation()

  const handleSubmit = (event) => {
    event.preventDefault()
    const email = event.target.elements.email.value
    const password = event.target.elements.password.value
    userLogin(email, password)
  }

  if (data) {
    return <Navigate to='/dashboard' />
  }

  return (
    <Theme>
      <SetTitle title={t('title')} />

      <Wrapper>
        <LogoContainer>
          {/* TODO SVG */}
        </LogoContainer>
        <form onSubmit={handleSubmit}>
          <H1>{t('heading')}</H1>
          <InputWrapper>
            <Input
              type='text'
              name='email'
              placeholder='email'
              autocomplete='email'
              required
            />
          </InputWrapper>
          <InputWrapper>
            <Input
              type='password'
              name='password'
              placeholder='Password'
              autocomplete='current-password'
              required
            />
          </InputWrapper>
          <Button
            type='submit'
            disabled={isFetching}
          >{t('continue')}
          </Button>
          <DisplayError error={error} />
        </form>
      </Wrapper>

    </Theme>
  )
})

export default Login
