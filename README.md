# AI Article Summarizer

An AI-powered Summarizer that transforms lengthy web articles into clear and concise summaries. Built with React, Vite, and Tailwind CSS, this application utilizes the RapidAPI Article Extractor & Summarizer to deliver accurate summaries instantly.

##  Features

- **Instant Summarization:** Paste any article URL and receive a concise, point-by-point summary.
- **Multilingual Support:** Summarize articles in English, Spanish, French, German, or Chinese!
- **Adjustable Length:** Choose between Short, Medium, and Detailed summaries based on your preference.
- **Text-to-Speech (Read Aloud):** Listen to the generated summary directly from your browser.
- **Dark Mode Support:** Easy on the eyes with native automatic dark mode integration.
- **History Management:** Your previous searches are saved in local storage. Easily copy links or delete old entries.
- **Download & Share:** Export your summaries as a `.txt` file or share them directly to Twitter/X with a quick intent link.

##  Technologies Used

- **Framework:** React.js powered by Vite for lightning-fast development
- **Styling:** Tailwind CSS
- **Network Requests:** Axios
- **External API:** [Article Extractor and Summarizer via RapidAPI](https://rapidapi.com/restyler/api/article-extractor-and-summarizer)

##  Getting Started

Follow these instructions to set up the project locally on your machine.

### Prerequisites

- Node.js installed on your machine
- npm (Node Package Manager)

### Installation

1. **Clone the repository:**
   ```bash
   git clone <your-repository-url>
   cd AI-Article-Summarizer-main
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Environment Variables:**
   Create a `.env` file in the root directory and add your RapidAPI key for the Article Extractor API:
   ```env
   VITE_RAPIDAPI_KEY="your_rapidapi_key_here"
   ```
   *Note: You can obtain a free API key from [RapidAPI](https://rapidapi.com/restyler/api/article-extractor-and-summarizer).*

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Open the application:**
   Navigate to `http://localhost:5173` in your web browser.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome. Feel free to fork the repository and submit pull requests to help improve the application.
