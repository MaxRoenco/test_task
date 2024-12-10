import Message from "./types/Message";
import User from "./types/User";

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
    const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL_API}/bug-reports?populate=images`);

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

export async function fetchTicketsPagination(page : number, pageSize : number) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL_API}/bug-reports?pagination[page]=${page}&pagination[pageSize]=${pageSize}`);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data;
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

export async function fetchTicket(id : number) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL_API}/bug-reports/?filters[id][$eq]=${id}`);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    if(data.data.length < 1) console.error("No ticket with ID = " + id);
    return data.data[0];
  } catch (err) {
    if (err instanceof Error) {
      console.log("Error: ", err);
    } else {
      console.log('An unexpected error occurred. check lib/api/');
    }
  }
}

export async function fetchMessages(id : number) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL_API}/bug-reports/?filters[id][$eq]=${id}&populate=messages`);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    if(data.data.length < 1) console.error("No ticket with ID = " + id);
    return data.data[0].messages;
  } catch (err) {
    if (err instanceof Error) {
      console.log("Error: ", err);
    } else {
      console.log('An unexpected error occurred. check lib/api/');
    }
  }
}

export async function pushMessage(ticketId: number, text : string, user : User) {
  try {
    const timestamp = new Date().toISOString();
    const payload = {
      data: {
        text: text,
        bug_report: ticketId,
        timestamp: timestamp,
        userId: user.id,
        userName: user.name,
      },
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL_API}/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json();
  } catch (error : any) {
    console.error(error.message);
  }
}