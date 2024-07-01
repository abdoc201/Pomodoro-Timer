import './App.css';
import React, { useEffect, useState, useRef} from 'react';
import { MdNotStarted } from "react-icons/md";
import { LuTimerReset } from "react-icons/lu";


function Counter() {
  const [break1, setBreak] = useState(5)
  const [session, setSession] = useState(25)
  const [[m,s], setTime] = useState([session,0])
  const [startPause, setStartPause] = useState(true)
  const [flag, setFlag] = useState(0)
  const [text, setText] = useState('Session') 
  const beepRef = useRef(null)

  function increment(x){
    switch(x){
      case 'break1':
        if(break1===60)
          break;
        setBreak(break1 + 1);
        break;
      case 'session':
        if(session===60)
          break;
        setSession(session + 1);
        setTime([session+1,0])
        break;
      default:
        break;
    }
  }
  function decrement(x){
    switch(x){
      case 'break1':
        if(break1===1)
          break;
        setBreak(break1 - 1);
        break;
      case 'session':
        if(session===1)
          break;
        setSession(session - 1);
        setTime([session-1,0])
        break;
      default:
        break;
    }
  }
  function tick(){
    if(startPause)
      return
    if(m===0 && s===0){
      beepRef.current.play()
      setFlag(flag + 1)
    }else if(s===0){
      setTime([m-1,59])
    }else{
      setTime([m,s-1])
    }
  }
  function Start(){
    setStartPause(!startPause)
  }
  function Reset(){
    setStartPause(true)
    beepRef.current.pause()
    beepRef.current.currentTime = 0
    setBreak(5)
    setSession(25)
    setTime([session,0])
    setText('Session')
    setFlag(0)
  }
  useEffect(()=>{
    const intervalId = setTimeout(tick,1000)
    return ()=>{
      clearTimeout(intervalId)
    }
  })
  useEffect(()=>{
    const buttons = document.getElementsByTagName('button')
    for(let i=0;i<buttons.length;i++){
      if(!startPause){
        buttons[i].style.pointerEvents='none'
      }else{
        buttons[i].style.pointerEvents='auto'
      }
    }},[startPause])

    useEffect(()=>{
      if(flag%2==0){
        setText('Session')
        setTime([session,0])
      }else{
        setText('Break')
        setTime([break1,0])
      }
    },[flag])
  
  return (
    <div id='main'>
      <h1>25+5 Clock</h1> 
      <div id='container1'>
        <div>
          <p id="break-label">Break Length</p>
          <button id='break-increment' className='disabled' onClick={()=>increment('break1')}>+</button>
          <span id='break-length'>{break1}</span>
          <button id='break-decrement' className='disabled' onClick={()=>decrement('break1')}>-</button>
        </div>
        <div>
          <p id="session-label">Session Length</p>
          <button id='session-increment' className='disabled' onClick={()=>increment('session')}>+</button>
          <span id='session-length'>{session}</span>
          <button id='session-decrement' className='disabled' onClick={()=>decrement('session')}>-</button>
        </div>
      </div>
      <div id='container2'>
        <p id='timer-label'>{text}</p>
        <p id='time-left'>{session===m ? session.toString().padStart(2,'0'):m.toString().padStart(2,'0')}:{s.toString().padStart(2,'0')}</p>
      </div>
      <div id='controllers'>
        <a id='start_stop' onClick={Start} ><MdNotStarted size={30}/></a>
        <a id='reset' onClick={Reset} ><LuTimerReset size={30}/></a>
        <audio id='beep' ref={beepRef} src='/beep.mp3' hidden></audio>
      </div>

    </div>
  );
}

function App(){
  return (
    <Counter />
  )
}

export default App;
