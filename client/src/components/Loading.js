import React, { useEffect, useState } from "react";
import classes from "../Styles/Loading.module.css";

function Loading() {
    const [value, setValue] = useState(0);
    const [progress, setProgress] = useState();

    useEffect(() => {
        let per = 0;
        let count = 0;
        let time = setInterval(animate, 40);
        function animate() {
            if(count === 100 && per === 400) {
                clearInterval(time);
            } else {
                per = per + 16;
                count = count + 4;
                setValue(count);
                setProgress(per);
            }
        }
        return () => {
            clearInterval(time);
        }
    }, [])
    
    return (
        <div className={classes.loading}>
            <h1>{value}%</h1>
            <p style={{width: `${progress}px`}}></p>
        </div>
    )
}

export default Loading;