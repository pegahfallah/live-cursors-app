import { Login } from './components/login'
import './App.css'
import { useState } from 'react'
import { Home } from './Home'

function App() {
  const [username, setUsername] = useState('')
  
  return username ? ( <Home username={username} />) :  <Login onSubmit={setUsername}/>

}

export default App
