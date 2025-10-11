const axios = require('axios');

const getIdByLanguage=(lang)=>{
   lang=lang.toLowerCase();
   const IDs={
    "c++":54,
    "java":62,
    "javascript":63
   }
   
   return IDs[lang];
}


const submitBatch= async (v)=>{

const options = {
  method: 'POST',
  url: 'https://judge0-ce.p.rapidapi.com/submissions',
  params: {
    base64_encoded: 'false',
    wait: 'false',
    fields: '*'
  },
  headers: {
    'x-rapidapi-key': "8772923e5bmsh1d0629e465d8a35p16a1a5jsn5fa7856431a1",//process.env.X_RAPIDAPI_KEY
    'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
    'Content-Type': 'application/json'
  },
  data: {
   ...v
  }
};

async function fetchData() {
	try {
		const response = await axios.request(options);
		return response.data;
	} catch (error) {
		console.error(error);
	}
}

return await fetchData();
}


const wait= async (time)=>{
  setTimeout(()=>{
    return 1;
  },time);
}

const getBatch= async(arr)=>{
  const options = {
    method: 'GET',
    url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
    params: {
      tokens: arr.join(","),
      base64_encoded: 'false',
      fields: '*'
    },
    headers: {
      'x-rapidapi-key': "8772923e5bmsh1d0629e465d8a35p16a1a5jsn5fa7856431a1",//process.env.X_RAPIDAPI_KEY    //the prblm is here change the key
      'x-rapidapi-host': 'judge0-ce.p.rapidapi.com'
    }
  };
  
  async function fetchData() {
    try {
      const response = await axios.request(options);
      return response.data;
    } catch (error) {
      console.log("the error is from here ",error);
    }
  }
 
  while(true){

    const r= await fetchData();

    // const r ={
    //   "submissions": [
    //     {
    //       "language_id": 46,
    //       "stdout": "hello from Bash\n",
    //       "status_id": 3,
    //       "stderr": null,
    //       "token": "db54881d-bcf5-4c7b-a2e3-d33fe7e25de7"
    //     },
    //     {
    //       "language_id": 71,
    //       "stdout": "hello from Python\n",
    //       "status_id": 3,
    //       "stderr": null,
    //       "token": "ecc52a9b-ea80-4a00-ad50-4ab6cc3bb2a1"
    //     }
    //   ]
    // }
    
    const isAllow= r.submissions.every(d=> d.status_id>2);

    if(isAllow)
       return r.submissions;

    
  
    await wait(1000);

    }
}

module.exports={getIdByLanguage,submitBatch,getBatch};