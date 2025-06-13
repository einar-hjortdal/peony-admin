import { createGlobalStyle } from '@dark-engine/styled'

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    background-color: ${props => props.theme.backgroundPrimary};
    -webkit-tap-highlight-color: transparent; /* Disable tap highlights */
  }

  ::selection{
    background: ${props => props.theme.selection};
    color: ${props => props.theme.backgroundPrimary};
  }

  #dark-root {
    isolation: isolate;
  }

  html {
    font-size: 100%;
  }

  body {
    font-family: sans-serif;
    text-rendering: optimizeLegibility;
    color: ${props => props.theme.foregroundPrimary};
    line-height: 1.5;
  }

  select,
  textarea,
  input, 
  button {
    font: inherit;
    letter-spacing: inherit;
    word-spacing: inherit;
  }

  blockquote,
  dl,
  dd,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  hr,
  figure,
  p,
  pre {
    margin: 0;
    overflow-wrap: break-word;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    font-size: inherit;
    font-weight: inherit;
  }

  img,
  svg,
  video,
  canvas,
  audio,
  iframe,
  embed,
  object {
    display: block;
  }

  #dark-root {
    height: 100vh;
  }
`

export default GlobalStyle
