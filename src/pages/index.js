import React, { useState, useEffect } from "react";

export default function Index() {
  const [metodo, setMetodo] = useState("el nuevo método de los delincuentes".split(" "));
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api");
        const json = await response.json();
        console.log(json);
        setMetodo(json);
      } catch (error) {
        console.log("error", error);
      }
    };
    fetchData();
  }, []);
  return (
    <div>
      {metodo.map((item, index) => (
        <p key={index}>{item}</p>
      ))}
    </div>
  );
}
