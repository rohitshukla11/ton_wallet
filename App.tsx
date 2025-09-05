// TON Wallet Key Generator
// Simple app to generate crypto keys from mnemonic phrases
// Using @ton/crypto library

import React, { useState, useCallback } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  useColorScheme,
} from 'react-native';
import { mnemonicNew, mnemonicToPrivateKey, mnemonicValidate } from '@ton/crypto';

type KeyPair = {
  publicKey: string;
  secretKey: string;
};

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const [mnemonic, setMnemonic] = useState('');
  const [keyPair, setKeyPair] = useState<KeyPair | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Dynamic styles based on theme
  const dynamicStyles = {
    backgroundColor: isDarkMode ? '#1a1a1a' : '#f5f5f5',
    textColor: isDarkMode ? '#ffffff' : '#333333',
  };

  // Generate a fresh mnemonic phrase
  const handleGenerateMnemonic = useCallback(async () => {
    setIsGenerating(true);
    try {
      const words = await mnemonicNew(24);
      setMnemonic(words.join(' '));
      setKeyPair(null); // Clear previous keys
    } catch (err) {
      console.log('Mnemonic generation failed:', err);
      Alert.alert('Oops!', 'Could not generate mnemonic. Try again.');
    } finally {
      setIsGenerating(false);
    }
  }, []);

  // Convert mnemonic to key pair
  const handleGenerateKeys = useCallback(async () => {
    if (!mnemonic.trim()) {
      Alert.alert('Missing input', 'Please enter a mnemonic phrase first');
      return;
    }

    setIsGenerating(true);
    try {
      const words = mnemonic.trim().split(/\s+/);
      
      // Check if mnemonic is valid
      const isValid = await mnemonicValidate(words);
      if (!isValid) {
        Alert.alert('Invalid mnemonic', 'The phrase you entered is not valid');
        return;
      }

      // Get the key pair
      const keys = await mnemonicToPrivateKey(words);
      
      setKeyPair({
        publicKey: keys.publicKey.toString('hex'),
        secretKey: keys.secretKey.toString('hex'),
      });
    } catch (err) {
      console.log('Key generation failed:', err);
      Alert.alert('Error', 'Failed to generate keys. Check your mnemonic.');
    } finally {
      setIsGenerating(false);
    }
  }, [mnemonic]);

  // Simple copy function (placeholder)
  const handleCopy = (text: string, type: string) => {
    // TODO: Implement actual clipboard functionality
    Alert.alert('Copied!', `${type} copied to clipboard`);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: dynamicStyles.backgroundColor }]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={dynamicStyles.backgroundColor}
      />
      <ScrollView 
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
        style={{ backgroundColor: dynamicStyles.backgroundColor }}
      >
        <View style={styles.wrapper}>
          <Text style={[styles.header, { color: dynamicStyles.textColor }]}>
            TON Wallet Key Generator
          </Text>
          <Text style={[styles.description, { color: dynamicStyles.textColor }]}>
            Create crypto keys from mnemonic phrases
          </Text>

          <View style={styles.inputSection}>
            <Text style={[styles.label, { color: dynamicStyles.textColor }]}>
              Mnemonic Phrase (24 words)
            </Text>
            <TextInput
              style={[
                styles.input,
                { 
                  color: dynamicStyles.textColor,
                  borderColor: isDarkMode ? '#444' : '#ddd',
                  backgroundColor: isDarkMode ? '#2a2a2a' : '#fff'
                }
              ]}
              value={mnemonic}
              onChangeText={setMnemonic}
              placeholder="Enter your 24-word mnemonic phrase here..."
              placeholderTextColor={isDarkMode ? '#888' : '#999'}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
            
            <TouchableOpacity
              style={[styles.btn, styles.secondaryBtn]}
              onPress={handleGenerateMnemonic}
              disabled={isGenerating}
            >
              <Text style={styles.btnText}>
                {isGenerating ? 'Creating...' : 'Generate New Mnemonic'}
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[
              styles.btn, 
              styles.primaryBtn,
              (!mnemonic.trim() || isGenerating) && styles.disabledBtn
            ]}
            onPress={handleGenerateKeys}
            disabled={isGenerating || !mnemonic.trim()}
          >
            <Text style={styles.btnText}>
              {isGenerating ? 'Processing...' : 'Generate Keys'}
            </Text>
          </TouchableOpacity>

          {keyPair && (
            <View style={styles.resultsSection}>
              <Text style={[styles.resultsTitle, { color: dynamicStyles.textColor }]}>
                Your Keys
              </Text>
              
              <View style={[styles.keyBox, { backgroundColor: isDarkMode ? '#333' : '#f8f9fa' }]}>
                <Text style={[styles.keyTitle, { color: dynamicStyles.textColor }]}>
                  Public Key
                </Text>
                <Text style={[styles.keyText, { color: dynamicStyles.textColor }]}>
                  {keyPair.publicKey}
                </Text>
                <TouchableOpacity
                  style={styles.copyBtn}
                  onPress={() => handleCopy(keyPair.publicKey, 'Public key')}
                >
                  <Text style={styles.copyBtnText}>Copy</Text>
                </TouchableOpacity>
              </View>

              <View style={[styles.keyBox, { backgroundColor: isDarkMode ? '#333' : '#f8f9fa' }]}>
                <Text style={[styles.keyTitle, { color: dynamicStyles.textColor }]}>
                  Secret Key
                </Text>
                <Text style={[styles.keyText, { color: dynamicStyles.textColor }]}>
                  {keyPair.secretKey}
                </Text>
                <TouchableOpacity
                  style={styles.copyBtn}
                  onPress={() => handleCopy(keyPair.secretKey, 'Secret key')}
                >
                  <Text style={styles.copyBtnText}>Copy</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  wrapper: {
    padding: 16,
    paddingTop: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
    opacity: 0.8,
    lineHeight: 22,
  },
  inputSection: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  input: {
    borderWidth: 1.5,
    borderRadius: 12,
    padding: 16,
    fontSize: 15,
    marginBottom: 16,
    minHeight: 100,
    fontFamily: 'monospace',
  },
  btn: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  primaryBtn: {
    backgroundColor: '#007AFF',
  },
  secondaryBtn: {
    backgroundColor: '#8E8E93',
  },
  disabledBtn: {
    backgroundColor: '#C7C7CC',
    opacity: 0.6,
  },
  btnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  resultsSection: {
    marginTop: 8,
  },
  resultsTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  keyBox: {
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  keyTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  keyText: {
    fontSize: 11,
    fontFamily: 'monospace',
    marginBottom: 12,
    lineHeight: 16,
    opacity: 0.9,
  },
  copyBtn: {
    backgroundColor: '#34C759',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  copyBtnText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
});

export default App;
