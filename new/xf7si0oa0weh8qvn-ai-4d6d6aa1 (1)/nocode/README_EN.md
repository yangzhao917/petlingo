# 🐾 PetLingo - Intelligent Pet Language Translation System

## 🚀 Elevator Pitch

**"Making every meow and bark understood, bridging love across species boundaries"**

---

## 📖 Project Story

### 🌟 Inspiration

It all started with my little orange tabby and my grandfather's golden retriever. Every time I brought my cat to grandpa's house, we'd witness a chaotic scene - the cat would arch its back nervously while the dog wagged its tail excitedly, and we humans could only stand by helplessly, completely clueless about what they were "saying" to each other.

I often wondered: why can parrots learn human speech, while our most intimate companions - cats and dogs - cannot communicate directly with us? Until one day, I discovered videos online of people mimicking various animal sounds, which triggered strong reactions from pets. What truly amazed me was learning about linguist Christina Hunger, who taught her dog Stella to communicate with humans using buttons, opening a new era in animal language research.

These discoveries made me realize: **animals have been "talking" all along; we just haven't learned how to "listen"**. In this age of rapidly advancing AI technology, could we build a bridge to remove the species barrier from emotional communication between humans and pets?

### 🎯 What it does

PetLingo is an intelligent pet language translation system based on machine learning, featuring:

- **🎵 Pet Emotion Recognition**: Analyzes audio to identify 18 different emotional states in cats and dogs
- **🔄 Cross-Species Translation**: Translates cat language to corresponding dog language, or vice versa
- **🎧 Real-time Audio Processing**: Supports real-time recording and audio file upload analysis
- **📊 Emotion Visualization**: Intuitively displays pet emotional states and confidence levels
- **🎮 Interactive Learning**: Provides fun features for humans to learn animal languages
- **📱 Modern Interface**: Responsive design supporting multi-device access

### 🛠️ How we built it

We adopted a modern full-stack development architecture:

**Frontend Tech Stack:**
- **React 18** + **Vite** - Modern frontend framework and build tool
- **Tailwind CSS** - Atomic CSS framework for beautiful UI design
- **Framer Motion** - Smooth animation effects
- **Radix UI** - Accessible component library
- **React Router** - Single-page application routing

**Backend Tech Stack:**
- **FastAPI** - High-performance Python web framework
- **Scikit-learn** - Machine learning model training and prediction
- **Librosa** - Audio feature extraction and processing
- **NumPy & Pandas** - Data processing and analysis
- **Uvicorn** - ASGI server

**Development Process:**
1. **Data Collection**: Gathered audio samples of 18 cat emotions and 7 dog emotions
2. **Feature Engineering**: Used Librosa to extract audio features like MFCC and spectral centroid
3. **Model Training**: Trained emotion classification models using Random Forest algorithms
4. **API Development**: Built RESTful API interfaces supporting audio upload and prediction
5. **Frontend Development**: Created interactive user interfaces using React
6. **System Integration**: Frontend-backend integration for complete user experience

### 🚧 Challenges we ran into

**Technical Challenges:**
- **Audio Format Compatibility**: Different devices record audio in various formats, requiring unified processing
- **Feature Extraction Optimization**: How to extract the most effective emotional features from complex audio signals
- **Model Accuracy**: Improving emotion recognition accuracy with limited training data
- **Real-time Performance**: Ensuring audio processing and prediction response times meet user experience requirements

**Learning Challenges:**
- **Machine Learning Fundamentals**: Learning audio signal processing and machine learning algorithms from scratch
- **Cross-domain Knowledge Integration**: Mastering frontend development, backend APIs, and machine learning simultaneously
- **Debugging Complexity**: Audio processing errors are often difficult to locate and resolve

### 🏆 Accomplishments that we're proud of

- **🎯 High Accuracy**: Achieved over 85% accuracy in pet emotion recognition
- **⚡ Fast Response**: Controlled audio processing and prediction response time within 2 seconds
- **🎨 User Experience**: Designed intuitive and beautiful user interfaces with positive user feedback
- **🔧 Technical Innovation**: Successfully combined traditional machine learning with modern web technologies
- **📚 Knowledge Growth**: Team members significantly improved in AI, audio processing, and full-stack development

### 💡 What we learned

This project deeply impressed upon us the concept of **"technology serving emotion"**. The most memorable moment was during testing:

When we first successfully identified my orange cat's "hungry" meow and played the corresponding dog "hungry" audio, grandpa's golden retriever actually ran to the food bowl! At that moment, we realized this wasn't just a technical project, but truly contributing to improving human-pet relationships.

**Technical Learnings:**
- Mastered fundamental principles and practical methods of audio signal processing
- Learned how to design and train machine learning models
- Enhanced full-stack development capabilities, especially frontend-backend collaboration
- Understood the importance of user experience design

**More importantly, life insights:**
- **The Power of Empathy**: Technology must ultimately serve emotional needs
- **Interdisciplinary Thinking**: Complex problems often require knowledge fusion from multiple fields
- **Continuous Learning**: In rapidly evolving tech fields, learning ability matters more than knowledge itself

### 🚀 What's next for PetLingo

**Short-term Goals (3-6 months):**
- **Expand Language Library**: Add language recognition for more pet species (rabbits, birds, etc.)
- **Improve Accuracy**: Collect more training data and optimize model algorithms
- **Mobile Adaptation**: Develop native iOS and Android applications
- **Community Features**: Build user communities to share pet language learning experiences

**Medium-term Goals (6-12 months):**
- **Smart Hardware Integration**: Connect with smart collars, cameras, and other devices
- **Personalized Learning**: Personalized model training based on individual pet characteristics
- **Veterinary Collaboration**: Partner with professional veterinarians for health status analysis
- **Multi-language Support**: Support multiple human language interfaces

**Long-term Vision (1-3 years):**
- **AI Assistant Evolution**: Develop into a comprehensive pet AI assistant
- **Commercial Operations**: Establish sustainable business models
- **Research Collaboration**: Partner with animal behavior research institutions for academic advancement
- **Global Expansion**: Extend services to pet lovers worldwide

**Ultimate Vision:**
Make PetLingo a bridge connecting humans and the animal world, enabling every family to better understand and care for their pet companions, building a more harmonious human-pet coexistence world.

---

## 🚀 How to Run the Project

### 📋 Requirements

- **Node.js** >= 18.0.0
- **Python** >= 3.8
- **npm** or **yarn**
- **Git**

### 📥 Clone the Project

```bash
git clone <repository-url>
cd nocode
```

### 🔧 Frontend Setup

1. **Install Dependencies**
```bash
npm install
# or use yarn
yarn install
```

2. **Start Development Server**
```bash
npm run dev
# or
yarn dev
```

3. **Access Application**
Open browser and visit: `http://localhost:8080`

### 🐍 Backend Setup

1. **Navigate to Python API Directory**
```bash
cd python_api/python
```

2. **Create Virtual Environment (Recommended)**
```bash
python -m venv venv

# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate
```

3. **Install Python Dependencies**
```bash
pip install fastapi uvicorn python-multipart
pip install -r requirements.txt
```

4. **Start Backend Service**
```bash
python -m uvicorn main_api:app --host 0.0.0.0 --port 8000 --reload
```

5. **Verify Backend Service**
- API Documentation: `http://localhost:8000/docs`
- Health Check: `http://localhost:8000/health`

### 📁 Audio Files Setup

Ensure the following audio folder structure is correct:
```
voice(1)/
├── Catvoice/
│   ├── 猫_饿了.m4a
│   ├── 猫_撒娇.m4a
│   └── ... (other cat audio files)
└── Dogvoice/
    ├── 狗_饿了.m4a
    ├── 狗_撒娇.m4a
    └── ... (other dog audio files)
```

### 🎯 Complete Startup Process

1. **Start Backend Service** (in `python_api/python` directory)
```bash
python -m uvicorn main_api:app --host 0.0.0.0 --port 8000 --reload
```

2. **Start Frontend Service** (in project root directory)
```bash
npm run dev
```

3. **Access Application**
- Frontend Interface: `http://localhost:8080`
- Backend API: `http://localhost:8000`
- API Documentation: `http://localhost:8000/docs`

### 🔍 Feature Testing

1. **Visit Homepage**: Confirm all feature cards display properly
2. **Pet Communication Page**: Upload audio files to test emotion recognition
3. **Cat Image Analysis**: Upload images to test analysis functionality
4. **Human Language Learning**: Experience language learning features

### 🐛 Common Issues

**Q: Frontend cannot connect to backend?**
A: Confirm backend service is running normally on port 8000, check CORS settings

**Q: Audio upload fails?**
A: Check audio file format (supports .m4a, .wav), ensure file size doesn't exceed 20MB

**Q: Model prediction errors?**
A: Confirm model files are in `python_api/models/` directory, retrain model if necessary

**Q: Page styling issues?**
A: Clear browser cache, ensure Tailwind CSS loads correctly

### 📞 Technical Support

If you encounter issues, please check:
1. Console error messages
2. Network connection status
3. Service port usage
4. Dependency package version compatibility

---

## 🤝 Contributing

Welcome to submit Issues and Pull Requests to help improve PetLingo!

## 📄 License

MIT License - See [LICENSE](LICENSE) file for details

---

**Let's build a world that better understands pets together!** 🐾❤️