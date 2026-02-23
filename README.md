# 🩺 SACN - Anemia Detection System

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Expo](https://img.shields.io/badge/Expo-~54.0-000020.svg?style=flat&logo=expo)
![React Native](https://img.shields.io/badge/React_Native-0.81.4-61DAFB.svg?style=flat&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6.svg?style=flat&logo=typescript)
![License](https://img.shields.io/badge/license-MIT-green.svg)

_An intelligent mobile application for non-invasive anemia detection using AI-powered image analysis_

[🇪🇸 Español](./README.es.md) | [Features](#-features) | [Installation](#-installation) | [Usage](#-usage)

</div>

---

## 📋 Table of Contents

- [About](#-about)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Usage](#-usage)
- [Project Structure](#-project-structure)
- [API Integration](#-api-integration)
- [Contributing](#-contributing)
- [License](#-license)

## 🎯 About

**SACN (Sistema de Detección de Anemia)** is a cutting-edge mobile application that leverages artificial intelligence and computer vision to detect anemia through conjunctival image analysis. The app provides a quick, non-invasive, and accessible method for preliminary anemia screening, making healthcare more accessible to everyone.

### Why SACN?

- 🏥 **Non-invasive**: No blood tests required
- 🚀 **Fast Results**: Get predictions in seconds
- 📱 **Mobile-first**: Available anywhere, anytime
- 🧠 **AI-Powered**: Uses machine learning for accurate detection
- 📊 **Tracking**: Monitor health progress over time
- 👥 **Multi-Profile**: Manage multiple family members

## ✨ Features

### Core Functionality

- 🔐 **Secure Authentication**: User registration, login, and password recovery
- 📸 **Image Capture**: High-quality conjunctival image capture with guidance
- 🤖 **AI Detection**: Machine learning-based anemia prediction
- ✂️ **Smart Cropping**: Automatic region of interest extraction
- 📈 **Results Visualization**: Interactive charts and anemia level indicators

### User Experience

- 👤 **Profile Management**: Create and manage multiple user profiles
- 📜 **Medical History**: Track all anemia screenings over time
- 📄 **PDF Export**: Generate professional medical reports
- 💬 **AI Chatbot**: Educational assistant for anemia-related questions
- 🎓 **Educational Content**: Video resources about anemia prevention and treatment
- 🌓 **Theme Support**: Dark and light mode

### Health Monitoring

- 📊 **Progress Tracking**: Visualize hemoglobin trends over time
- 🎯 **Personalized Recommendations**: Get tailored health advice
- 📱 **Notifications**: Reminders for regular checkups

## 🛠 Tech Stack

### Frontend

- **Framework**: [React Native](https://reactnative.dev/) (0.81.4)
- **Platform**: [Expo](https://expo.dev/) (~54.0)
- **Language**: TypeScript (5.x)
- **Navigation**: Expo Router (file-based routing)
- **UI Components**: Custom themed components
- **Charts**: react-native-chart-kit
- **Animations**: react-native-reanimated, react-native-animatable

### Key Libraries

- `@react-native-picker/picker`: Date and option selection
- `expo-image-picker`: Camera and gallery integration
- `expo-image-manipulator`: Image processing
- `expo-print`: PDF generation
- `react-native-view-shot`: Screen capture
- `moment`: Date manipulation
- `@google/genai`: AI chatbot integration

### Backend Integration

- RESTful API communication
- Image upload with multipart/form-data
- JWT authentication (if applicable)

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: v18 or higher ([Download](https://nodejs.org/))
- **npm** or **yarn**: Package manager
- **Expo CLI**: Install globally
  ```bash
  npm install -g expo-cli
  ```
- **Expo Go App**: Install on your mobile device ([iOS](https://apps.apple.com/app/expo-go/id982107779) | [Android](https://play.google.com/store/apps/details?id=host.exp.exponent))
- **Backend Server**: SACN backend API running (see [API Integration](#-api-integration))

### Optional (for native builds)

- **Android Studio**: For Android development
- **Xcode**: For iOS development (macOS only)

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd SACN-TESIS-FRONTEND
```

### 2. Install Dependencies

```bash
npm install
```

or using yarn:

```bash
yarn install
```

### 3. Configure Environment

Create your API configuration file:

```bash
cp apis/apis.example.tsx apis/apis.tsx
```

Edit `apis/apis.tsx` and set your backend server IP:

```typescript
const ip = "YOUR_BACKEND_IP"; // e.g., "192.168.1.100" or "api.yourserver.com"
```

## ⚙️ Configuration

### API Endpoints

The application communicates with the following backend services:

- `/users/register` - User registration
- `/users/login` - User authentication
- `/users/forgot_password_recuperar` - Password recovery
- `/predict/` - Anemia prediction
- `/validate/validate` - Conjunctival image validation
- `/profiles/*` - Profile management
- `/crop/crop` - Image cropping

### Environment Variables

For production builds, consider using environment variables:

```bash
# .env (add this to .gitignore)
API_BASE_URL=http://your-api-url.com
API_PORT=3000
```

## 🎮 Usage

### Development Mode

Start the Expo development server:

```bash
npm start
```

or

```bash
npx expo start
```

### Running on Devices

**Option 1: Expo Go (Easiest)**

1. Open Expo Go app on your device
2. Scan the QR code from the terminal
3. App will load automatically

**Option 2: Android Emulator**

```bash
npm run android
```

**Option 3: iOS Simulator (macOS only)**

```bash
npm run ios
```

**Option 4: Web Browser**

```bash
npm run web
```

### Building for Production

Create a production build:

```bash
expo build:android
expo build:ios
```

For modern EAS Build:

```bash
eas build --platform android
eas build --platform ios
```

## 📁 Project Structure

```
SACN-TESIS-FRONTEND/
├── 📱 app/                          # Main application screens
│   ├── _layout.tsx                  # Root layout with navigation
│   ├── index.tsx                    # Landing/splash screen
│   ├── Login.tsx                    # Authentication screen
│   ├── Registrer.tsx                # User registration
│   ├── profiles.tsx                 # Profile selection
│   ├── prediction.tsx               # Image capture & prediction
│   ├── result.tsx                   # Prediction results
│   ├── detalle.tsx                  # Result details
│   ├── AppContext.tsx               # Global state management
│   └── (tabs)/                      # Tab navigation screens
│       ├── homeScreen.tsx           # Dashboard
│       ├── historial.tsx            # Medical history
│       ├── chatbot.tsx              # AI assistant
│       ├── education.tsx            # Educational content
│       └── perfil.tsx               # User profile
│
├── 🔌 apis/                         # Backend API integration
│   └── apis.tsx                     # API service functions
│
├── 🎨 components/                   # Reusable components
│   ├── Button.tsx                   # Custom button component
│   ├── FormInput.tsx                # Input field component
│   ├── DateInput.tsx                # Date picker component
│   ├── SelectedInput.tsx            # Dropdown component
│   ├── AnemiaChart.tsx              # Chart visualization
│   ├── ExportToPDF.tsx              # PDF generation
│   ├── ProgressBar.tsx              # Progress indicator
│   ├── Videos.tsx                   # Video player
│   ├── Camara/                      # Camera components
│   │   ├── ImagePickerButton.tsx
│   │   └── DraggableImage.tsx
│   ├── Modals/                      # Modal dialogs
│   │   ├── CustomModal.tsx
│   │   ├── ModalForms.tsx
│   │   ├── ModalProfiles.tsx
│   │   └── RecommendationOverlay.tsx
│   └── ui/                          # UI utilities
│
├── 🎨 styles/                       # Screen-specific styles
├── 🎭 constants/                    # App constants & themes
├── 🪝 hooks/                        # Custom React hooks
├── 📚 lib/                          # Utility libraries
├── 🖼️ assets/                       # Images, fonts, icons
└── 📄 Configuration files
    ├── package.json
    ├── tsconfig.json
    ├── app.json
    └── eslint.config.js
```

## 🔗 API Integration

### Backend Requirements

This frontend application requires the SACN backend server to be running. The backend should provide:

1. **User Authentication API**
   - Registration with email verification
   - Login/Logout
   - Password recovery

2. **Prediction API**
   - Image validation (is it a valid conjunctival image?)
   - Anemia prediction using ML model
   - Control/screening storage

3. **Profile Management API**
   - Create, read, update, delete user profiles
   - Retrieve historical data per profile

4. **Image Processing API**
   - Automatic cropping of region of interest
   - Image preprocessing

### Example Backend Setup

Ensure your backend is running and accessible:

```bash
# Backend should be running on:
http://<YOUR_IP>:3000
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Use meaningful component and variable names
- Add comments for complex logic
- Test on both iOS and Android
- Update documentation when needed

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Authors

**Juan Chiscol** - _Thesis Project_

## 🙏 Acknowledgments

- Medical advisors and healthcare professionals
- Machine Learning model contributors
- Expo and React Native communities
- Beta testers and early adopters

## 📞 Support

For questions, issues, or suggestions:

- 📧 Email: [your-email@example.com]
- 🐛 Issues: [GitHub Issues](link-to-issues)
- 💬 Discussions: [GitHub Discussions](link-to-discussions)

---

<div align="center">

**Made with ❤️ for better healthcare accessibility**

⭐ Star this repo if you find it helpful!

</div>
