import {Modal} from "antd";
import React, {useEffect, useRef} from "react";

const IframeModal=({iframeV,url,setV})=>{
    const iRef=useRef(null)
    useEffect(()=>{
        console.log(iRef.current)
    },[iRef])
    return (

    )
}

export default IframeModal
