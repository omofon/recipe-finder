# 🍳 Recipe Finder - AI-Powered Recipe Generator

A full-stack web application that generates creative recipes based on ingredients you have on hand. Built with React, Node.js, and powered by HuggingFace model.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.x-000000?logo=express&logoColor=white)
![HuggingFace](https://img.shields.io/badge/HuggingFace-AI-FFD21E?logo=huggingface&logoColor=black)

## ✨ Features

- 🥘 **AI-Generated Recipes** - Get creative, detailed recipes from the Llama 3 AI model
- 📝 **Ingredient Management** - Add and manage your available ingredients
- 🔄 **Auto-Retry Logic** - Resilient API calls with exponential backoff
- ⚡ **Real-time Loading States** - See exactly what's happening as your recipe generates
- 🎨 **Beautiful UI** - Clean, responsive design with Tailwind CSS
- 🛡️ **Error Handling** - Comprehensive error handling for a smooth user experience
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile devices

## 🏗️ Project Structure

```
recipe-finder/
├── backend/                    # Node.js + Express server
│   ├── server.js              # Main server file with API routes
│   ├── debug-hf.js            # HuggingFace API debugging script
│   ├── package.json           # Backend dependencies
│   └── .env                   # Environment variables (not in repo)
│
└── frontend/                   # React application
    ├── public/                # Static assets
    ├── src/
    │   ├── components/
    │   │   ├── ClaudeRecipe.jsx      # Recipe display component
    │   │   ├── Header.jsx            # App header
    │   │   ├── IngredientsList.jsx   # Ingredients list manager
    │   │   ├── Main.jsx              # Main app logic & state
    │   │   └── Navigation.jsx        # Navigation component
    │   ├── hooks/             # Custom React hooks
    │   ├── utils/
    │   │   └── ai.js          # API client for backend communication
    │   ├── App.jsx            # Root component
    │   ├── main.jsx           # React entry point
    │   └── index.css          # Tailwind CSS styles
    ├── package.json           # Frontend dependencies
    └── vite.config.js         # Vite configuration
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ ([Download here](https://nodejs.org/))
- **npm** (comes with Node.js)
- **HuggingFace Account** ([Sign up free](https://huggingface.co/join))

### Installation

#### 1. Clone the repository

```bash
git clone https://github.com/omofon/recipe-finder.git
cd recipe-finder
```

#### 2. Set up the Backend

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:

```env
HF_ACCESS_TOKEN=your_huggingface_token_here
PORT=5000
```

**Getting your HuggingFace token:**
1. Go to [HuggingFace Settings](https://huggingface.co/settings/tokens)
2. Click "New token"
3. Name it (e.g., "recipe-app-token")
4. Check these permissions:
   - ✅ Make calls to Inference Providers
   - ✅ Make calls to your Inference Endpoints
5. Copy the token (starts with `hf_...`)
6. Paste it into your `.env` file

#### 3. Set up the Frontend

```bash
cd ../frontend
npm install
```

### 🎮 Running the Application

You need **two terminal windows**:

**Terminal 1 - Backend:**
```bash
cd backend
node server.js
```

You should see:
```
✅ AI backend running on http://localhost:5000
✅ Using model: meta-llama/Meta-Llama-3-8B-Instruct
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

You should see:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

**Open your browser** and navigate to `http://localhost:5173`

## 📖 Usage

1. **Add Ingredients**
   - Type an ingredient in the input field
   - Click "+ Add" or press Enter
   - Repeat for all ingredients you have

2. **Generate Recipe**
   - After adding 4+ ingredients, click "Get a recipe"
   - Wait 5-10 seconds for AI generation
   - View your custom recipe!

3. **Manage Ingredients**
   - Click "Clear List" to start over
   - Add more ingredients and generate again

## 🧪 Testing the API

Test the backend independently:

```bash
# Test health endpoint
curl http://localhost:5000/api/health

# Test recipe generation
curl -X POST http://localhost:5000/api/recipe ^
  -H "Content-Type: application/json" ^
  -d "{\"ingredients\":[\"rice\",\"chicken\",\"onions\"]}"
```

**Debug script** (tests token and multiple AI models):
```bash
cd backend
node debug-hf.js
```

## 🔧 Configuration

### Backend Configuration

**Environment Variables** (`.env`):
```env
# Required
HF_ACCESS_TOKEN=hf_xxxxxxxxxxxxx

# Optional
PORT=5000
NODE_ENV=development
```

**AI Model Settings** (`server.js`):
```javascript
model: "meta-llama/Meta-Llama-3-8B-Instruct"  // Current model
max_tokens: 800                                // Response length
temperature: 0.7                               // Creativity (0.0-1.0)
maxRetries: 3                                  // Retry attempts
```

### Frontend Configuration

**API Endpoint** (`frontend/src/utils/ai.js`):
```javascript
const API_URL = "http://localhost:5000";  // Change for production
```

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI library with latest features (form actions, etc.)
- **Vite** - Lightning-fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Markdown** - Render AI-generated markdown recipes

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Minimal web framework
- **@huggingface/inference** - Official HuggingFace API client
- **dotenv** - Environment variable management
- **cors** - Cross-origin resource sharing

### AI
- **Meta Llama 3 8B Instruct** - Large language model for recipe generation
- **HuggingFace Inference API** - Serverless AI model hosting

## 🐛 Troubleshooting

### Backend Issues

**"Provider client API error"**
- ✅ Check your `.env` file exists and has valid token
- ✅ Verify token has both Inference permissions checked
- ✅ Try regenerating your HuggingFace token
- ✅ Run `node debug-hf.js` to test connection

**"Port 5000 already in use"**
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Change port in .env
PORT=5001
```

**"Module not found"**
```bash
cd backend
rm -rf node_modules package-lock.json
npm install
```

### Frontend Issues

**"Failed to fetch recipe"**
- ✅ Ensure backend is running on `http://localhost:5000`
- ✅ Check browser console for CORS errors
- ✅ Verify API endpoint in `frontend/src/utils/ai.js`

**Blank screen / React errors**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### AI Model Issues

**Model not responding**
- 🔄 HuggingFace free tier can be slow/rate-limited
- 🔄 Try again in a few minutes
- 🔄 Model may be "cold starting" (first request takes longer)
- 💡 Consider upgrading to HuggingFace Pro for reliability

**Poor recipe quality**
- Adjust `temperature` in `server.js` (0.5-0.9 recommended)
- Try different AI models (see Alternative Models below)
- Provide more specific ingredients

## 🔄 Alternative AI Models

You can swap models in `backend/server.js`:

```javascript
// Current (works reliably)
model: "meta-llama/Meta-Llama-3-8B-Instruct"

// Alternatives (if Llama is slow)
model: "mistralai/Mistral-7B-Instruct-v0.2"
model: "microsoft/Phi-3-mini-4k-instruct"
model: "HuggingFaceH4/zephyr-7b-beta"
```

**Note:** Free tier availability varies by model. Run `node debug-hf.js` to test.

## 📈 Future Enhancements

- [ ] User authentication & saved recipes
- [ ] Recipe ratings and favorites
- [ ] Dietary restrictions filter (vegan, gluten-free, etc.)
- [ ] Cooking time estimates
- [ ] Ingredient substitution suggestions
- [ ] Recipe sharing via URL
- [ ] Nutritional information
- [ ] Shopping list export
- [ ] Recipe image generation
- [ ] Multi-language support

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [HuggingFace](https://huggingface.co/) for providing free AI model inference
- [Meta](https://ai.meta.com/) for the Llama 3 model
- [React](https://react.dev/) for the amazing UI library
- [Tailwind CSS](https://tailwindcss.com/) for the styling framework

## 📧 Contact

**Your Name** - [@omofzzz](https://twitter.com/omofzzz)

Project Link: [https://github.com/omofon/recipe-finder](https://github.com/omofon/recipe-finder)

---

**Built with ❤️ by [Omofon]**

*Happy Cooking! 🍳*
