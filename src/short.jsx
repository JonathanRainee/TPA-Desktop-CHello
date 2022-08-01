import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export function Shortcutt({ children }) {
const navigate = useNavigate();

const handleKey = useCallback((event) => {
    console.log(event.altKey);
    if (event.altKey === true) {
        if (event.key === "w") {
            navigate("/workspaces");
        }
        if (event.key === "n") {
            navigate("/notification");
        }
    }
}, []);

useEffect(() => {
    document.addEventListener("keydown", handleKey);

    return () => {
    document.removeEventListener("keydown", handleKey);
    };
}, [handleKey]);

return (
    <>
        {children}
    </>
)
}