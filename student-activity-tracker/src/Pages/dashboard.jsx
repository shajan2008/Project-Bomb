import React,{useState} from "react";
export default function Dashboard(){
    const [reqId, setReqId] = useState(() =>{
        const currentYear = new Date().getFullYear();
        const randomNum = Math.floor(Math.random() * 999) + 1;
        const formattedNum = String(randomNum).padStart(3, '0');
        const finalId = `OD-${currentYear}-${formattedNum}`;
        return(finalId);
    });
    const [user, setUser] = useState({
        Name : "Dineshram G",
        randomId : reqId,
        date : new Date(),
        status : "Pending"
    });

    return(
        
    );
}