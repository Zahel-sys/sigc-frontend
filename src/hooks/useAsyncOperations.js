import { useState, useCallback } from 'react';

// Custom hook for handling async operations with loading states
export const useAsyncOperation = (initialLoading = false) => {
  const [loading, setLoading] = useState(initialLoading);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const execute = useCallback(async (asyncFunction, ...args) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await asyncFunction(...args);
      setData(result);
      return result;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
    setData(null);
  }, []);

  return {
    loading,
    error,
    data,
    execute,
    reset,
    setLoading,
    setError,
    setData
  };
};

// Custom hook for retry logic
export const useRetry = (maxRetries = 3, delay = 1000) => {
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);

  const retry = useCallback(async (asyncFunction, ...args) => {
    if (retryCount >= maxRetries) {
      throw new Error(`Failed after ${maxRetries} attempts`);
    }

    setIsRetrying(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, retryCount)));
      const result = await asyncFunction(...args);
      setRetryCount(0); // Reset on success
      return result;
    } catch (error) {
      setRetryCount(prev => prev + 1);
      throw error;
    } finally {
      setIsRetrying(false);
    }
  }, [retryCount, maxRetries, delay]);

  const resetRetry = useCallback(() => {
    setRetryCount(0);
    setIsRetrying(false);
  }, []);

  return {
    retry,
    retryCount,
    isRetrying,
    canRetry: retryCount < maxRetries,
    resetRetry
  };
};

// Custom hook for debounced operations
export const useDebounce = (callback, delay = 300) => {
  const [debounceTimer, setDebounceTimer] = useState(null);

  const debouncedCallback = useCallback((...args) => {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    const newTimer = setTimeout(() => {
      callback(...args);
    }, delay);

    setDebounceTimer(newTimer);
  }, [callback, delay, debounceTimer]);

  return debouncedCallback;
};

// Custom hook for handling form loading states
export const useFormSubmit = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleSubmit = useCallback(async (submitFunction, ...args) => {
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      const result = await submitFunction(...args);
      setSubmitSuccess(true);
      return result;
    } catch (error) {
      setSubmitError(error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const resetForm = useCallback(() => {
    setIsSubmitting(false);
    setSubmitError(null);
    setSubmitSuccess(false);
  }, []);

  return {
    isSubmitting,
    submitError,
    submitSuccess,
    handleSubmit,
    resetForm
  };
};

// Custom hook for pagination with loading
export const usePaginatedData = (fetchFunction, initialPage = 1, itemsPerPage = 10) => {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const { loading, error, data, execute } = useAsyncOperation();

  const fetchPage = useCallback(async (page = currentPage) => {
    const result = await execute(fetchFunction, page, itemsPerPage);
    
    if (result) {
      setTotalPages(Math.ceil(result.total / itemsPerPage));
      setTotalItems(result.total);
      setCurrentPage(page);
    }
    
    return result;
  }, [currentPage, itemsPerPage, execute, fetchFunction]);

  const nextPage = useCallback(() => {
    if (currentPage < totalPages) {
      fetchPage(currentPage + 1);
    }
  }, [currentPage, totalPages, fetchPage]);

  const prevPage = useCallback(() => {
    if (currentPage > 1) {
      fetchPage(currentPage - 1);
    }
  }, [currentPage, fetchPage]);

  const goToPage = useCallback((page) => {
    if (page >= 1 && page <= totalPages) {
      fetchPage(page);
    }
  }, [totalPages, fetchPage]);

  return {
    data,
    loading,
    error,
    currentPage,
    totalPages,
    totalItems,
    fetchPage,
    nextPage,
    prevPage,
    goToPage,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1
  };
};