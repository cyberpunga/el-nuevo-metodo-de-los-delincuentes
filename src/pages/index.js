import React from "react";

export default function Index() {
  const [state, setState] = React.useState([
    "el",
    "nuevo",
    "método",
    "de",
    "los",
    "delincuentes",
  ]);
  const fetchData = async () => {
    const response = await fetch("/api");
    const json = await response.json();
    setState(json);
  };
  React.useEffect(() => fetchData(), []);
  return (
    <React.Fragment>
      {state.map((item, index) => (
        <h1 key={index}>{item}</h1>
      ))}
    </React.Fragment>
  );
}
