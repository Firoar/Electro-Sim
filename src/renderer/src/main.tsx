import './css/main.css'

import ReactDOM from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router'
import OpenDirectory from './components/OpenDir/OpenDirectory'
import App from './App'
import { Provider } from 'react-redux'
import store from './store/store'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <>
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<OpenDirectory />} />
          <Route path="/app" element={<App />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  </>
)
