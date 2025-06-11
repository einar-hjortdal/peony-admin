import { createRoot } from '@dark-engine/platform-browser'
import { Translator } from '@wareme/translations'

import { api } from './api'
import { getMessages, loadLanguage } from './translations'
import App from './components/App'

const language = loadLanguage()
const messages = await getMessages(language)
const translator = new Translator(language, messages)

createRoot(document.getElementById('dark-root')).render(<App translator={translator} api={api} />)
