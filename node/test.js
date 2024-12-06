const messages = [
    {
        "id": 1,
        "user": {
            "id": 1,
            "name": "Nick"
        },
        "text": "Hello, is the problem fixed?",
        "timestamp": "2024-12-01T12:40:00Z"
    },
    {
        "id": 2,
        "user": {
            "id": 2,
            "name": "Alice Johnson",
            "role": "Frontend Developer"
        },
        "text": "We're looking into this issue and will update shortly.",
        "timestamp": "2024-12-01T14:00:00Z"
    }
]

async function pushData(url, data) {
    try {
      const response = await fetch(url, {
        method: "POST",
        body: data.stringify(),
      });
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
  
      const json = await response.json();
      console.log(json);
    } catch (error) {
      console.error(error.message);
    }
  }

  async function getData(url) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
  
      const json = await response.json();
      console.log(json);
    } catch (error) {
      console.error(error.message);
    }
  }

  messages.forEach( message => {
    pushData("http://localhost:1337/api/messages", message);
    getData("http://localhost:1337/api/messages");
  })