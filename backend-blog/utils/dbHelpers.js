export const saveWithTimeout = async (document, timeoutMs = 5000) => {
    return Promise.race([
      document.save(),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Save operation timed out')), timeoutMs)
      )
    ]);
  };