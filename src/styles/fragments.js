import { css } from '@dark-engine/styled'

export const fragmentContainerPadding = (props) => css`
  padding: 0 4vw;

  @media (min-width: ${props.theme.sm}) {
    && {padding: 0 2.5vw;} // https://github.com/atellmer/dark/issues/72#issuecomment-2135525554
  }
`

export const fragmentDisplayMd = (props) => css`
  text-transform: uppercase;
  font-size: 150%;
  line-height: .9;
  letter-spacing: -0.01em;

  @media (min-width: ${props.theme.sm}) {
    font-size: 300%;
  }
  @media (min-width: ${props.theme.xl}) {
    font-size: 350%;
  }
  @media (min-width: ${props.theme.xxxl}) {
    font-size: 600%;
  }
`

export const fragmentDisplayLg = (props) => css`
  text-transform: uppercase;
  line-height: 1;
  font-size: 200%;
  letter-spacing: -0.01em;

  @media (min-width: ${props.theme.sm}) {
    font-size: 350%;
  }
  @media (min-width: ${props.theme.xl}) {
    font-size: 500%;
  }
  @media (min-width: ${props.theme.xxxl}) {
    font-size: 800%;
  }
`

export const fragmentTitleLg = (props) => css`
  text-transform: uppercase;
  line-height: 1.2;
  font-size: 100%;
  letter-spacing: -0.01em;

  @media (min-width: ${props.theme.sm}) {
    font-size: 110%;
  }
  @media (min-width: ${props.theme.xl}) {
    font-size: 120%;
  }
  @media (min-width: ${props.theme.xxxl}) {
    font-size: 130%;
  }
`

export const fragmentSubtitle = (props) => css`
  text-transform: uppercase;
  line-height: 1.2;
  font-size: 110%;
  letter-spacing: -0.01em;

  @media (min-width: ${props.theme.sm}) {
    font-size: 130%;
  }
  @media (min-width: ${props.theme.xl}) {
    font-size: 140%;
  }
  @media (min-width: ${props.theme.xxxl}) {
    font-size: 150%;
  }
`

export const fragmentTextPadding = (props) => css`
  padding: 0 0 1rem;

  @media (min-width: ${props.theme.sm}) {
    padding: 0 0 2rem;
  }
`

export const fragmentParagraphMd = (props) => css`
  font-size: 100%;
  font-weight: 300;
  line-height: 1.2;
  @media (min-width: ${props.theme.xl}) {
    font-size: 120%;
  }
  @media (min-width: ${props.theme.xxxl}) {
    font-size: 140%;
  }
`
