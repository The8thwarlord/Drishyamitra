import { useEffect, useState } from "react";
import axios from "axios";

function App() {

  const [message, setMessage] = useState("");

  useEffect(() => {
    axios.get(process.env.REACT_APP_API_URL)
      .then(res => {
        setMessage(res.data.message);
      })
      .catch(err => {
        console.log(err);
      });
  }, []);

  return (
    <div style={{textAlign: "center", marginTop: "100px"}}>
      <h1>Drishyamitra</h1>
      <p>{message}</p>
    </div>
  );
}

export default App;