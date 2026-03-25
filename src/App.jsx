import { useState } from 'react'
import './App.css'
import Hero from './components/Hero'
import Demo from './components/Demo'

function App() {
  const [url, seturl] = useState("")

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 transition-colors duration-300">
      <div className="max-w-7xl mx-auto sm:px-16 px-6">
        <Hero />
        <Demo />
      </div>
    </main>
  )
}

export default App
