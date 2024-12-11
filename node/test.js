
// const message = {
//         text: "Hello, is the problem fixed?",
//         timestamp: "2024-12-01T12:40:00Z"
//     };

// async function pushData(url, message, bugReportID) {
//     try{
//     const payload = {
//         data: {
//             text: message.text,
//             bug_report: bugReportID,
//             timestamp: message.timestamp,
//         },
//         };
//       const response = await fetch(url,       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(payload),
//       });
//       if (!response.ok) {
//         throw new Error(`Response status: ${response.status}`);
//       }
  
//       const json = await response.json();
//       console.log(json);
//     } catch (error) {
//       console.error(error.message);
//     }
//   }


//   async function getData(url, id) {
//     try {
//       const response = await fetch(`${url}/${id}?populate=*`);
//       if (!response.ok) {
//         throw new Error(`Response status: ${response.status}`);
//       }
  
//       const json = await response.json();
//       console.log(json);
//     } catch (error) {
//       console.error(error.message);
//     }
//   }

//   let id = "odbuynd1of8diu34x9ptfm4c";
//     pushData("http://localhost:1337/api/messages", message, 116);
//     // getData("http://localhost:1337/api/bug-reports", id);

async function getUser(name){
  try{
    const response = await fetch(`http://localhost:1337/api/ticket-users?filters[name][$eq]=${name}`);
    if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
    const result = await response.json();
    console.log(result?.data[0]?.id);
    return result?.data?.length ? result?.data[0]?.id : null;
  } catch(error) {
    console.log(`Error: ${error}`);
    return null;
  }
}

async function pushUser(name) {
  try {
      const payload = {
        data: {
          name: name,
        },
      };
      const response = await fetch(`http://localhost:1337/api/ticket-users`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      const result = await response.json();
      console.log(result);
      return result?.data ? result.data.id : null;
  } catch (error) {
    console.log(`Error: ${error}`);
    return null
  }
}

async function checkUser(name) {
  try {
    const userID = await getUser(name);
    if (userID) {
      console.log(`User exists with ID: ${userID}`);
      return userID;
    } else {
      const newUser = await pushUser(name);
      console.log(`New userID: ${newUser}`);
      return newUser?.id || null;
    }
  } catch (error) {
    console.log(`Error: ${error}`);
    return null;
  }
}
checkUser("Maxim4ik1245678");
