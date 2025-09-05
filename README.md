# TON Crypto Key Generator

A React Native application that generates cryptographic key pairs from mnemonic phrases using the `@ton/crypto` package from TON Foundation.

## Features

- Generate new 24-word mnemonic phrases
- Generate key pairs from existing mnemonic phrases
- Validate mnemonic phrases
- Display public and secret keys in hexadecimal format
- Copy keys to clipboard (simulated)
- Dark/light mode support

## Installation

1. Make sure you have Node.js and React Native development environment set up
2. Install dependencies:
   ```bash
   npm install
   ```

3. For iOS:
   ```bash
   cd ios && pod install && cd ..
   ```

## Running the App

### Android
```bash
npx react-native run-android
```

### iOS
```bash
npx react-native run-ios
```

### Metro Bundler
```bash
npm run start
```

## Usage

1. **Generate New Mnemonic**: Tap the "Generate New Mnemonic" button to create a new 24-word mnemonic phrase
2. **Enter Existing Mnemonic**: Type or paste an existing 24-word mnemonic phrase in the text input
3. **Generate Key Pair**: Tap "Generate Key Pair" to create a public/secret key pair from the mnemonic
4. **Copy Keys**: Use the copy buttons to copy the generated keys (simulated in this demo)

## Technical Details

- Uses `@ton/crypto` package for cryptographic operations
- Supports 24-word mnemonic phrases (256-bit entropy)
- Generates ED25519 key pairs
- All operations are asynchronous and include proper error handling

## Security Note

This is a demonstration app. In production applications:
- Never store private keys in plain text
- Use secure storage solutions
- Implement proper key management practices
- Consider using hardware security modules for sensitive operations

## Dependencies

- React Native 0.81.1
- @ton/crypto (TON Foundation's cryptographic library)
- TypeScript support