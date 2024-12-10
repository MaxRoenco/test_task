import { resolve } from "path";

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
    }
  }
}


export async function fetchTickets() {
  try {
<<<<<<< HEAD
=======
    // const waiting = await new Promise((resolve) => setTimeout(resolve, 3000));
>>>>>>> ef31322008c495c8a7e345fd18cb2b8200efa6c9
    const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL_API}/bug-reports?populate=*`);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data.data;
  } catch (err) {
    if (err instanceof Error) {
      console.log("Error: ", err);
    } else {
      console.log('An unexpected error occurred. check lib/api/');
    }
  }
}