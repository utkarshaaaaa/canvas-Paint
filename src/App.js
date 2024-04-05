
import React, { Component ,useEffect,useState} from 'react';
import { render } from 'react-dom';
import io from 'socket.io-client'
import Canvas from './pages/Canvas';
import { Stage, Layer, Rect, Text } from 'react-konva';
import Konva from 'konva';

function App() {
  const [image, setImage] = useState("")
  const[arr,setarr]=useState([])
  const[img_count,set_img_count]=useState(-1)
 
  const[room,setroom]=useState("")
  const socket=io.connect("http://localhost:3001")

  
  const handleImageChange = async(e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async() => {
        setImage(reader.result);
        const data={
          room:room,
          image:image,
          time:
            new Date(Date.now()).getHours()+
            ":" +
            new Date (Date.now()).getMinutes()
        }
        await socket.emit("send_image",data)
      };
      reader.readAsDataURL(file);
      
     
      
    }
    
  };
  useEffect(()=>{
    
      socket.on("recieve",(data)=>{
        setarr((img)=>[...img,data])
        
      })
      set_img_count(img_count+1)
      

    
    
  },[socket])
  const join=()=>{
    if(room!==""){
      socket.emit("join_room",room)
     
    }
    else{
      console.log("fill the form")
    }
    
  }
  


  
  return (
    <div className="App">
      {/* <div>
      <h2>Image Upload</h2>
      <input type="file" onChange={handleImageChange} />
      {(
        <div>
          <h3>Preview:</h3>
          {arr.map((e)=>{
            return <div>
              {e.time}
              <img src={e.image} alt="Uploaded" style={{ width: '300px', height: '300px' }} />
            </div>
          })}
        </div>
      )}
    </div>
       <div>
        Enter the room code
        <input value={room} onChange={(e)=>{setroom(e.target.value)}}/>
       </div>
       <div>
        <button onClick={join}>Enter </button>
       </div> */}
       <Canvas/>
    </div>
  );
}


export default App;
