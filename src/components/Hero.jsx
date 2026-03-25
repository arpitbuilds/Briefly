import React, { useState, useEffect } from 'react'
import { logo } from '../../assets'

function Hero() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDarkMode(true);
    }
  };

  return (
    <header className='flex flex-col w-full gap-4 mb-3'>
        <nav className='flex flex-row justify-end pt-4 items-center w-full'>
            <div className="flex gap-3">
                <button 
                  onClick={toggleDarkMode} 
                  className='p-2 bg-gray-200 dark:bg-gray-700 dark:text-white rounded-full hover:scale-110 transition-all font-medium'
                >
                  {isDarkMode ? '☀️ Light' : '🌙 Dark'}
                </button>
            </div>
        </nav>
        <h1 className='mt-8 text-5xl font-extrabold leading-[1.15] text-center sm:text-6xl'>
            Summarize Articles <br className="max-md:hidden" />
            <span className='bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent'>Using AI</span>
        </h1>
        <h2 className='mt-5 text-lg text-gray-600 dark:text-gray-300 sm:text-xl text-center max-w-2xl mx-auto'>
            Transform lengthy articles into clear and concise summaries instantly. Free and open-source text summarizer.
        </h2>
    </header>
  )
}

export default Hero
