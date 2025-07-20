# SimTuma - Rwanda Mobile Money App

SimTuma is a modern, user-friendly mobile money application designed specifically for Rwanda. Built with React Native and Expo, it provides seamless integration with MTN Mobile Money services while offering an intuitive interface in both Kinyarwanda and English.

## Features

### 🏦 Core Financial Services
- **Send Money**: Transfer funds instantly to any MTN number in Rwanda
- **Receive Money**: Accept payments with QR codes and payment requests
- **Bill Payments**: Pay utilities (EUCL, WASAC) and mobile services
- **Balance Management**: Real-time balance updates with privacy controls

### 💬 Social Features
- **Chat Integration**: Send money through conversations
- **Contact Management**: Easy access to frequent recipients
- **Transaction History**: Detailed records with search and filters

### 🔒 Security & Privacy
- **Biometric Authentication**: Fingerprint and face recognition
- **PIN Protection**: Secure transaction authorization
- **Balance Privacy**: Hide/show balance with one tap
- **Secure API Integration**: Bank-level encryption

### 🌍 Rwanda Localization
- **Dual Language**: Kinyarwanda and English support
- **Local Currency**: Rwanda Franc (RWF) formatting
- **Cultural Design**: Rwanda flag colors and local imagery
- **Local Providers**: Integration with EUCL, WASAC, MTN Rwanda

### 📱 Modern UI/UX
- **Responsive Design**: Optimized for mobile and tablet
- **Dark/Light Themes**: Automatic theme switching
- **Smooth Animations**: Micro-interactions and transitions
- **Accessibility**: Screen reader support and high contrast

## Technical Architecture

### Frontend
- **React Native**: Cross-platform mobile development
- **Expo Router**: File-based navigation system
- **TypeScript**: Type-safe development
- **Lucide Icons**: Consistent iconography
- **Animated API**: Smooth animations and transitions

### Backend Integration
- **MTN Mobile Money API**: Official Rwanda MTN integration
- **RESTful Services**: Clean API architecture
- **Error Handling**: Comprehensive error management
- **Offline Support**: Local data caching

### State Management
- **Custom Hooks**: Reusable state logic
- **Context API**: Global state management
- **Local Storage**: Persistent user preferences
- **Real-time Updates**: Live balance and transaction updates

## Design System

### Color Palette
- **Primary**: Rwanda Blue (#1E40AF)
- **Secondary**: Rwanda Green (#059669)
- **Accent**: Golden Yellow (#F59E0B)
- **Success**: #059669
- **Warning**: #F59E0B
- **Error**: #DC2626

### Typography
- **Font Sizes**: 12px - 32px scale
- **Font Weights**: 400, 500, 600, 700
- **Line Heights**: 1.2x - 1.75x
- **Responsive**: Scales with device size

### Spacing System
- **Base Unit**: 4px
- **Scale**: 4, 8, 16, 24, 32, 40px
- **Consistent**: Applied across all components

## Getting Started

### Prerequisites
- Node.js 18+
- Expo CLI
- iOS Simulator or Android Emulator
- MTN Developer Account (for production)

### Installation
```bash
# Clone the repository
git clone https://github.com/your-org/simtuma-rwanda.git

# Install dependencies
cd simtuma-rwanda
npm install

# Start development server
npm run dev
```

### Environment Setup
Create a `.env` file with your MTN API credentials:
```env
EXPO_PUBLIC_MTN_RW_SUBSCRIPTION_KEY=your_subscription_key
EXPO_PUBLIC_MTN_RW_API_USER_ID=your_api_user_id
EXPO_PUBLIC_MTN_RW_API_KEY=your_api_key
```

## Project Structure

```
simtuma-rwanda/
├── app/                    # Expo Router pages
│   ├── (tabs)/            # Tab navigation screens
│   ├── auth/              # Authentication flows
│   └── index.tsx          # Welcome screen
├── components/            # Reusable UI components
│   └── ui/               # Design system components
├── constants/            # App constants and configuration
├── hooks/               # Custom React hooks
├── services/           # API and external services
├── utils/             # Utility functions
└── assets/           # Images, fonts, and static files
```

## Key Components

### ResponsiveContainer
Handles responsive layout across different screen sizes with automatic padding and max-width constraints.

### Button Component
Comprehensive button system with multiple variants, sizes, loading states, and accessibility features.

### LoadingState & ErrorState
Consistent loading and error handling components with localized messages.

### PhoneInput
Rwanda-specific phone number input with MTN validation and formatting.

## API Integration

### MTN Mobile Money
- **Sandbox Environment**: Development and testing
- **Production Ready**: Easy switch to live environment
- **Error Handling**: Comprehensive error management
- **Mock Data**: Fallback for development

### Transaction Types
- **Request to Pay**: Customer payment requests
- **Transfer**: Peer-to-peer money transfers
- **Bill Payments**: Utility and service payments
- **Balance Inquiry**: Real-time balance checks

## Localization

### Kinyarwanda Support
- **UI Text**: All interface elements translated
- **Error Messages**: Localized error handling
- **Success Messages**: Confirmation messages
- **Cultural Context**: Rwanda-specific terminology

### English Fallback
- **Dual Display**: Both languages shown where appropriate
- **Accessibility**: Screen reader support for both languages
- **User Preference**: Language switching capability

## Security Features

### Authentication
- **Phone Verification**: SMS-based verification
- **Biometric Login**: Fingerprint/Face ID
- **PIN Security**: Transaction authorization
- **Session Management**: Secure session handling

### Data Protection
- **Encryption**: All sensitive data encrypted
- **Secure Storage**: Local data protection
- **API Security**: Token-based authentication
- **Privacy Controls**: User data management

## Performance Optimization

### Responsive Design
- **Breakpoints**: Mobile (480px), Tablet (768px), Desktop (1024px)
- **Adaptive Layouts**: Components adjust to screen size
- **Touch Targets**: Minimum 44px touch areas
- **Performance**: Optimized for low-end devices

### State Management
- **Efficient Updates**: Minimal re-renders
- **Memory Management**: Proper cleanup
- **Caching**: Smart data caching
- **Offline Support**: Local data persistence

## Contributing

### Development Guidelines
1. Follow TypeScript best practices
2. Use the established design system
3. Write comprehensive tests
4. Document new features
5. Follow Git commit conventions

### Code Style
- **ESLint**: Automated code linting
- **Prettier**: Code formatting
- **TypeScript**: Strict type checking
- **Comments**: Clear documentation

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support and questions:
- **Email**: support@simtuma.rw
- **Documentation**: [docs.simtuma.rw](https://docs.simtuma.rw)
- **Community**: [community.simtuma.rw](https://community.simtuma.rw)

---

**SimTuma** - Simplifying mobile money in Rwanda 🇷🇼