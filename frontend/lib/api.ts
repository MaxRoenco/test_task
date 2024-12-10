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
    // const waiting = await new Promise((resolve) => setTimeout(resolve, 3000));
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

export async function uploadImage(file : File){
  if (!file) {
    console.error('No file provided');
    return;
  }
  const formData = new FormData();
  formData.append('files', file);
  try{
    const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL_API}/upload`, {
      method: 'POST',
      body: formData
    })
    if (!response.ok) {
      throw new Error(`Failed to upload image: ${response.statusText}`);
    }
    const data = await response.json();
    console.log('Uploaded image successfully:', data);
    return data[0]?.id || null;
  } catch(error:any){
    console.log(`Error: ${error}`);
  }
}

export async function pushUser(name : string){
  const payload = {
    data: {
      name: name,
    },
  };
  try{
    const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL_API}/ticket-users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
    if (!response.ok) {
      throw new Error(`Failed to upload user: ${response.statusText}`);
    }
    const result = await response.json();
    console.log('Uploaded user successfully:', result);
    return result.data.id
  } catch (error : any){
    console.log(`Error: ${error}`);
  }
}

export async function pushBugReport(filteredData: any, userId : any, files: any) {
  console.log(files);
  const payload = {
    data: {
      text: filteredData.text,
      bugType: filteredData.bugType,
      subject: filteredData.subject,
      priority: ["High", "Medium", "Low"][Math.floor(Math.random()*3)],
      statusBug: ["Open", "In Work", "Closed"][Math.floor(Math.random()*3)],
      images: filteredData.images,
      ticket_user: userId
    },
  };
  let response = await fetch(
    `${process.env.NEXT_PUBLIC_STRAPI_URL_API}/bug-reports`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  );

  if (!response.ok) {
    const errorDetails = await response.json();
    console.error("Strapi error response:", errorDetails);
    throw new Error(`Failed to post data: ${response.statusText}`);
  }

  const result = await response.json();
  console.log("Successfully submitted data:", result);
  console.log(result.data.id);
  return result.data.id;
}