
const message = {
        text: "Hello, is the problem fixed?",
        timestamp: "2024-12-01T12:40:00Z"
    };

async function pushData(url, message, bugReportID) {
    try{
    const payload = {
        data: {
            text: message.text,
            bug_report: bugReportID,
            timestamp: message.timestamp,
        },
        };
      const response = await fetch(url,       {
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
      console.log(json);
    } catch (error) {
      console.error(error.message);
    }
  }


  async function getData(url, id) {
    try {
      const response = await fetch(`${url}/${id}?populate=*`);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
  
      const json = await response.json();
      console.log(json);
    } catch (error) {
      console.error(error.message);
    }
  }

  let id = "odbuynd1of8diu34x9ptfm4c";
    // pushData("http://localhost:1337/api/messages", message, 117);
    getData("http://localhost:1337/api/bug-reports", id);

