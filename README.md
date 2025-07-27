


# AI Chat App

A beautiful, responsive AI-powered chat application built with React and Vite.

## Features

- Modern, mobile-friendly UI with avatars and animations
- AI chat powered by `window.puter.ai.chat`
- Message history saved to localStorage
- Clear chat button
- Timestamps for each message
- Animated message appearance
- Status indicator for AI readiness and loading
- Custom robot and user icons
- Responsive design for all devices
- **Modern glassmorphism loader with animated robot and fade-out**
- **Improved error handling for localStorage and AI errors**
- **UI polish and accessibility improvements**

## Deployment (Vercel)

You can easily deploy this app for free using [Vercel](https://vercel.com/):

1. Push your code to GitHub (already done).
2. Go to [vercel.com/import](https://vercel.com/import) and import your GitHub repository.
3. Follow the prompts (Vercel will auto-detect the Vite/React setup).
4. Set the build command to `npm run build` and the output directory to `dist` if not auto-detected.
5. Click "Deploy" and your app will be live on a Vercel URL!

You can also deploy manually with:
```sh
npm run build
# Then drag the contents of the dist/ folder to Vercel's dashboard for manual deployment
```

## Getting Started

### Prerequisites
- Node.js (v16+ recommended)
- npm or yarn

### Installation

1. Clone the repository:
   ```sh
   git clone <your-repo-url>
   cd ai-chat
   ```
2. Install dependencies:
   ```sh
   npm install
   # or
   yarn install
   ```
3. Start the development server:
   ```sh
   npm run dev
   # or
   yarn dev
   ```
4. Open [http://localhost:5173](http://localhost:5173) in your browser.

## Usage
- Type your message and press Enter or click Send.
- The AI will respond using the `window.puter.ai.chat` API.
- Clear the chat with the "Clear Chat" button.
- Your chat history is saved automatically in your browser.

## Customization
- Update the AI integration in `src/App.jsx` as needed.
- Tweak styles and layout using Tailwind CSS classes.

## License & Credits

This project is open source and licensed under the MIT License.

**Created by Yassine Samlali.**
# Ai-Chat-App
# Ai-Chat-App
