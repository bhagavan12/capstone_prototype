// Defining types using JSDoc for better IDE support and runtime documentation

/**
 * @typedef {Object} DataSizes
 * @property {number} plaintext - Size of plaintext data in bytes.
 * @property {number} encryptedBeforeCompression - Size of data encrypted before compression in bytes.
 * @property {number} compressed - Size of compressed data in bytes.
 * @property {number} encryptedAfterCompression - Size of data encrypted after compression in bytes.
 */

/**
 * @typedef {Object} ProcessingResult
 * @property {boolean} success - Whether the processing was successful.
 * @property {string} message - A message describing the result.
 * @property {string} [data] - Optional data resulting from the process.
 */

/**
 * @typedef {'text' | 'file'} InputMode - Mode of input, either text or file.
 */

/**
 * @typedef {'pdf' | 'docx' | 'txt'} FileType - Accepted file types.
 */

/**
 * @typedef {Object} FileData
 * @property {string} content - The content of the file.
 * @property {string} name - The name of the file.
 * @property {FileType} type - The type of the file (pdf, docx, or txt).
 */
