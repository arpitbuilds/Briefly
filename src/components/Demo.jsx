import React, { useState, useEffect } from 'react';
import { clear, copy, enter, linkIcon, tick, loader } from '../../assets';
import { summarizeText } from '../services/rapidapi';

function Demo() {
    const [article, setArticle] = useState({
        url: "",
        summary: ""
    });

    const [allArticles, setAllArticles] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [copied, setCopied] = useState("");
    
    // New Features States
    const [language, setLanguage] = useState("en");
    const [summaryLength, setSummaryLength] = useState(3);
    const [isSpeaking, setIsSpeaking] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await summarizeText(article.url, language, summaryLength);
            if (response) {
                const recSummary = response.summary;
                const newArticle = { ...article, summary: recSummary };
                setArticle(newArticle);

                // Add to history if not already top
                const updatedArticles = [newArticle, ...allArticles.filter(a => a.url !== article.url)];
                setAllArticles(updatedArticles);
                localStorage.setItem("articles", JSON.stringify(updatedArticles));
            }
        } catch (error) {
            console.error("Error fetching summary:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const clearText = () => {
        setArticle({ ...article, url: "" });
    };

    const copyToClipboard = (text, type = 'link') => {
        navigator.clipboard.writeText(text);
        setCopied(text);
        setTimeout(() => setCopied(""), 2000);
    };

    const handleDeleteHistory = (urlToDelete) => {
        const updatedArticles = allArticles.filter(item => item.url !== urlToDelete);
        setAllArticles(updatedArticles);
        localStorage.setItem("articles", JSON.stringify(updatedArticles));
        if (article.url === urlToDelete) {
            setArticle({ url: "", summary: "" });
        }
    };

    const handleReadAloud = (text) => {
        if ('speechSynthesis' in window) {
            if (isSpeaking) {
                window.speechSynthesis.cancel();
                setIsSpeaking(false);
            } else {
                const utterance = new SpeechSynthesisUtterance(text);
                utterance.lang = language;
                utterance.onend = () => setIsSpeaking(false);
                window.speechSynthesis.speak(utterance);
                setIsSpeaking(true);
            }
        } else {
            alert('Your browser does not support text-to-speech.');
        }
    };

    const handleDownload = (text) => {
        const element = document.createElement("a");
        const file = new Blob([text], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = "summary.txt";
        document.body.appendChild(element); // Required for Firefox
        element.click();
        document.body.removeChild(element);
    };

    const handleShare = (text) => {
        const intro = 'Check out this AI-generated summary of:';
        const urlToShare = article.url;
        const availableSpace = 280 - intro.length - urlToShare.length - 15; // Buffer for spacing
        const summarySnippet = text.length > availableSpace ? text.slice(0, availableSpace) + '...' : text;
        const tweetText = `${intro}\n${urlToShare}\n\n${summarySnippet}`;
        const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;
        window.open(shareUrl, '_blank');
    };

    useEffect(() => {
        const storageData = localStorage.getItem("articles");
        if (storageData) {
            setAllArticles(JSON.parse(storageData));
        }

        return () => {
            if (window.speechSynthesis) window.speechSynthesis.cancel();
        };
    }, []);

    return (
        <section className="mt-6 flex flex-col items-center px-4 w-full">
            
            {/* Options Bar for Language & Length */}
            <div className="flex flex-wrap w-full max-w-2xl gap-4 mb-5 justify-center">
                <select 
                    value={language} 
                    onChange={(e) => setLanguage(e.target.value)}
                    className="p-2 border rounded-md focus:border-orange-500 outline-none dark:bg-gray-800 dark:text-white dark:border-gray-600 transition"
                >
                    <option value="en">🇬🇧 English</option>
                    <option value="es">🇪🇸 Spanish</option>
                    <option value="fr">🇫🇷 French</option>
                    <option value="de">🇩🇪 German</option>
                    <option value="zh">🇨🇳 Chinese</option>
                </select>

                <select 
                    value={summaryLength} 
                    onChange={(e) => setSummaryLength(parseInt(e.target.value))}
                    className="p-2 border rounded-md focus:border-orange-500 outline-none dark:bg-gray-800 dark:text-white dark:border-gray-600 transition"
                >
                    <option value={1}>⚡ Short Summary</option>
                    <option value={3}>⚖️ Medium Summary</option>
                    <option value={6}>📖 Detailed Summary</option>
                </select>
            </div>

            {/* URL Input */}
            <form
                onSubmit={handleSubmit}
                className="flex w-full max-w-2xl items-center justify-center relative shadow-sm rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden"
            >
                <img src={linkIcon} alt="link_icon" className="ml-4 mr-2 w-5 h-5 dark:invert opacity-70" />
                <input
                    value={article.url}
                    onChange={(e) => setArticle({ ...article, url: e.target.value })}
                    className="flex-1 py-3 px-2 outline-none bg-transparent dark:text-white"
                    type="url"
                    name="url"
                    placeholder="Enter your URL here"
                    required
                />
                <button type="submit" className="hover:bg-gray-100 dark:hover:bg-gray-700 transition p-3 border-l border-gray-200 dark:border-gray-700 h-full flex items-center justify-center">
                    <img src={enter} alt="submit" className="w-5 h-5 dark:invert opacity-80" />
                </button>
                <button type="button" onClick={clearText} className="hover:bg-gray-100 dark:hover:bg-gray-700 transition p-3 border-l border-gray-200 dark:border-gray-700 h-full flex items-center justify-center">
                    <img src={clear} alt="clear" className="w-5 h-5 dark:invert opacity-80" />
                </button>
            </form>

            {/* History */}
            <div className="history w-full max-w-2xl mt-6 max-h-60 overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
                {allArticles.map((ele, index) => (
                    <div
                        key={index}
                        onClick={() => setArticle(ele)}
                        className="flex items-center justify-between border rounded-lg p-3 hover:bg-gray-50 dark:hover:bg-gray-700 dark:border-gray-700 cursor-pointer transition shadow-sm bg-white dark:bg-gray-800"
                    >
                        <div className="flex items-center flex-1 min-w-0">
                            <img
                                onClick={(e) => {
                                    e.stopPropagation();
                                    copyToClipboard(ele.url);
                                }}
                                src={copied === ele.url ? tick : copy}
                                alt="copy"
                                className="w-5 h-5 mr-4 cursor-pointer dark:invert opacity-70 hover:opacity-100"
                                title="Copy Link"
                            />
                            <p className="text-blue-600 dark:text-blue-400 truncate text-sm font-medium">{ele.url}</p>
                        </div>
                        <button 
                            title="Delete History Item"
                            onClick={(e) => { e.stopPropagation(); handleDeleteHistory(ele.url); }}
                            className="ml-4 text-gray-400 hover:text-red-500 transition px-2"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>
                ))}
            </div>

            {/* Summary Section */}
            <div className="flex justify-center mt-10 w-full">
                {isLoading ? (
                    <div className="flex justify-center mt-4">
                        <img src={loader} alt="loading..." className="w-16 h-16 animate-spin dark:invert" />
                    </div>
                ) : article.summary ? (
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 p-8 w-full max-w-3xl transition-all">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 border-b border-gray-200 dark:border-gray-700 pb-4">
                            <h2 className="text-2xl sm:text-3xl font-extrabold dark:text-white">
                                Article <span className="text-orange-500">Summary</span>
                            </h2>
                            <div className="flex gap-2">
                                {/* Copy Summary Text */}
                                <button title="Copy Summary" onClick={() => copyToClipboard(article.summary, 'summary')} className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition">
                                    <svg className="w-5 h-5 text-gray-600 dark:text-gray-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                                </button>
                                {/* Read Aloud */}
                                <button title={isSpeaking ? "Stop Reading" : "Read Aloud"} onClick={() => handleReadAloud(article.summary)} className={`p-2 rounded-full transition ${isSpeaking ? 'bg-orange-500 text-white animate-pulse' : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'}`}>
                                    <svg className={`w-5 h-5 ${isSpeaking ? 'text-white' : 'text-gray-600 dark:text-gray-300'}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.863L5.586 15z" /></svg>
                                </button>
                                {/* Download */}
                                <button title="Download Summary" onClick={() => handleDownload(article.summary)} className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition">
                                    <svg className="w-5 h-5 text-gray-600 dark:text-gray-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                </button>
                                {/* Share */}
                                <button title="Share on Twitter/X" onClick={() => handleShare(article.summary)} className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition">
                                    <svg className="w-5 h-5 text-gray-600 dark:text-gray-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                                </button>
                            </div>
                        </div>

                        <ul className="list-disc list-outside ml-5 space-y-4 text-gray-700 dark:text-gray-300 text-lg">
                            {article.summary
                                .split(/\. |\n|•|-/)
                                .filter((sentence) => sentence.trim() !== "")
                                .map((point, idx) => (
                                    <li key={idx} className="leading-relaxed pl-1">{point.trim()}.</li>
                                ))}
                        </ul>
                    </div>
                ) : (
                    <p className="text-gray-500 dark:text-gray-400 italic mt-6 text-center max-w-sm">
                        Enter a URL above to generate its summarized points here.
                    </p>
                )}
            </div>
            
            {copied === 'summary' && (
                <div className="fixed bottom-6 right-6 bg-green-500 text-white px-5 py-3 rounded-lg shadow-2xl animate-pulse font-medium z-50">
                    Summary copied!
                </div>
            )}
        </section>
    );
}

export default Demo;
