const httpClient = async (url, options = {}) => {
  const {
    method = "GET",
    timeout = 10000,
    retries = 3,
    retryDelay = 1000,
    headers = {},
    body = null,
    cache = "no-store",
    credentials = "same-origin",
    queryParams = {},
  } = options;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  // Prepare URL with query parameters
  const urlObj = new URL(url);
  Object.entries(queryParams).forEach(([key, value]) =>
    urlObj.searchParams.append(key, value)
  );
  const fullUrl = urlObj.toString();

  // Only cache GET requests
  const shouldCache = method === "GET";
  const cacheKey = shouldCache ? `${fullUrl}-${JSON.stringify(options)}` : null;

  if (shouldCache) {
    const cachedResponse = sessionStorage.getItem(cacheKey);
    if (cachedResponse) {
      return JSON.parse(cachedResponse);
    }
  }

  const fetchWithRetry = async (retryCount = 0) => {
    try {
      const response = await fetch(fullUrl, {
        method,
        headers: {
          "Content-Type": "application/json",
          ...headers,
        },
        body: body ? JSON.stringify(body) : null,
        cache,
        credentials,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          JSON.stringify({
            status: response.status,
            statusText: response.statusText,
            message: errorData.message || "An error occurred",
            url: response.url,
          })
        );
      }

      let data;
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      if (shouldCache) {
        sessionStorage.setItem(cacheKey, JSON.stringify(data));
      }

      return data;
    } catch (error) {
      if (error.name === "AbortError") {
        throw new Error(
          JSON.stringify({
            status: "TIMEOUT",
            message: `Request timed out after ${timeout}ms`,
            url: fullUrl,
          })
        );
      }

      if (
        retryCount < retries &&
        ["GET", "HEAD"].includes(method.toUpperCase())
      ) {
        console.warn(
          `Retrying request to ${fullUrl}. Attempt ${
            retryCount + 1
          } of ${retries}`
        );
        await new Promise((resolve) =>
          setTimeout(resolve, retryDelay * Math.pow(2, retryCount))
        );
        return fetchWithRetry(retryCount + 1);
      }

      throw error;
    }
  };

  try {
    return await fetchWithRetry();
  } catch (error) {
    console.error("Request failed:", error);
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
};

export default httpClient;
