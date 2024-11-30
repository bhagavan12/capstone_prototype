import React, { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { Moon, Sun, ShieldCheck } from 'lucide-react';
import { ProcessingForm } from './components/ProcessingForm';
import { DataMetrics } from './components/DataMetrics';
import { ResultDisplay } from './components/ResultDisplay';
import {
  compressData,
  decompressData,
  encryptData,
  decryptData,
  getSizeInBytes,
  rotateChunk,
  reverseRotateChunk,
} from './utils/cryptoUtils';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [isEncrypt, setIsEncrypt] = useState(true);
  const [inputText, setInputText] = useState('');
  const [aesKey, setAesKey] = useState('');
  const [encryptedText, setEncryptedText] = useState('');
  const [decryptedText, setDecryptedText] = useState('');
  const [rotatedEncryptedText, setRotatedEncryptedText] = useState('');
  const [sizes, setSizes] = useState({
    plaintext: 0,
    encryptedBeforeCompression: 0,
    compressed: 0,
    encryptedAfterCompression: 0,
  });

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  const handleSubmitEncryption = (e) => {
    e.preventDefault();

    if (!inputText || !aesKey) {
      toast.error('Please enter both text and AES key');
      return;
    }

    // Calculate plaintext size
    const plaintextSize = getSizeInBytes(inputText);

    // Encrypt before compression
    const encryptedBeforeCompression = encryptData(inputText, aesKey);
    if (!encryptedBeforeCompression.success) {
      toast.error(encryptedBeforeCompression.message);
      return;
    }

    // Compress the input text
    const compressed = compressData(inputText);
    if (!compressed.success || !compressed.data) {
      toast.error(compressed.message);
      return;
    }

    // Encrypt the compressed text
    const encryptedAfterCompression = encryptData(compressed.data, aesKey);
    if (!encryptedAfterCompression.success || !encryptedAfterCompression.data) {
      toast.error(encryptedAfterCompression.message);
      return;
    }

    // Rotate the encrypted data
    const rotated = Array.from(encryptedAfterCompression.data)
      .map(rotateChunk)
      .join('');

    setRotatedEncryptedText(rotated);
    setSizes({
      plaintext: plaintextSize,
      encryptedBeforeCompression: getSizeInBytes(encryptedBeforeCompression.data),
      compressed: getSizeInBytes(compressed.data),
      encryptedAfterCompression: getSizeInBytes(encryptedAfterCompression.data),
    });

    toast.success('Data processed successfully!');
  };

  const handleSubmitDecryption = (e) => {
    e.preventDefault();

    if (!encryptedText || !aesKey) {
      toast.error('Please enter both encrypted text and AES key');
      return;
    }

    try {
      // Reverse rotation
      const unrotated = Array.from(encryptedText)
        .map(reverseRotateChunk)
        .join('');

      // Decrypt the data
      const decrypted = decryptData(unrotated, aesKey);
      if (!decrypted.success || !decrypted.data) {
        toast.error(decrypted.message);
        return;
      }

      // Decompress the data
      const decompressed = decompressData(decrypted.data);
      if (!decompressed.success || !decompressed.data) {
        toast.error(decompressed.message);
        return;
      }

      setDecryptedText(decompressed.data);
      toast.success('Data decrypted successfully!');
    } catch (error) {
      toast.error('An error occurred during decryption');
    }
  };

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200 dark`}>
      <Toaster position="top-right" />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-3">
            <ShieldCheck className="w-8 h-8 text-blue-500" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Secure Data Processor
            </h1>
          </div>
          {/* <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            {darkMode ? (
              <Sun className="w-5 h-5 text-yellow-500" />
            ) : (
              <Moon className="w-5 h-5 text-gray-700" />
            )}
          </button> */}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="flex space-x-4 mb-6">
              <button
                onClick={() => setIsEncrypt(true)}
                className={`flex-1 py-2 px-4 rounded-lg transition-colors ${
                  isEncrypt
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                Encrypt Data
              </button>
              <button
                onClick={() => {
                  setIsEncrypt(false);
                  setAesKey('');
                }}
                className={`flex-1 py-2 px-4 rounded-lg transition-colors ${
                  !isEncrypt
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                Decrypt Data
              </button>
            </div>

            <ProcessingForm
              isEncrypt={isEncrypt}
              text={isEncrypt ? inputText : encryptedText}
              aesKey={aesKey}
              onTextChange={isEncrypt ? setInputText : setEncryptedText}
              onKeyChange={setAesKey}
              onSubmit={isEncrypt ? handleSubmitEncryption : handleSubmitDecryption}
            />

            {sizes.plaintext > 0 && isEncrypt && (
              <DataMetrics sizes={sizes} />
            )}
          </div>

          <div className="space-y-6">
            {isEncrypt && rotatedEncryptedText && (
              <ResultDisplay
                title="Encrypted and Rotated Text"
                text={rotatedEncryptedText}
              />
            )}
            {!isEncrypt && decryptedText && (
              <ResultDisplay
                title="Decrypted Text"
                text={decryptedText}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;