import { createGlobalStyle } from '@dark-engine/styled'

const GlobalStyle = createGlobalStyle`
  // reset
  body {
    margin: 0;
    -webkit-tap-highlight-color: transparent; /* Disable tap highlights */
  }

  html {
    font-size: 100%;
  }

  body {
    font-family: sans-serif;
    text-rendering: optimizeLegibility;
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

  // app styles
  #dark-root {
    isolation: isolate;
    min-height: 100vh;
    background-color: ${p => p.theme.bg};
    color: ${p => p.theme.fg};
  }

  a {
    text-decoration: none;
    color: ${p => p.theme.fg};
  }

  ul {
    list-style: none;
    margin: unset;
    padding: unset;
  }

  button {
    border: none;
  }

  dialog {
    background-color: unset;
    border: none;
    max-width: unset;
    max-height: unset;
    padding: 0;
  }
  
  dialog:focus{
    outline: none;
  }
`

export default GlobalStyle
