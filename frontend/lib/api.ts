export async function fetcher(url: string, options = {}) {
    let response;
    try {
      response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(`Error fetching data from ${url}:`, error.message);
        throw error;
      } else {
        console.error(`Unknown error occurred while fetching data from ${url}:`, error);
        throw new Error('Unknown error occurred.');
      }
    }
  }
