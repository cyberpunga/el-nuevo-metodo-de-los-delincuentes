import React from "react";

import "../styles.css";

export default function Index() {
  const [state, setState] = React.useState(false);
  const fetchData = async () => {
    const response = await fetch("/api");
    const json = await response.json();
    setState(json);
  };
  React.useEffect(() => fetchData(), []);
  return (
    <React.Fragment>
      {state ? (
        <p>
          {state.map((item, index) => (
            <a key={index} target="_blank" rel="noopener noreferrer" href={item.href}>
              {item.title}.{" "}
            </a>
          ))}
        </p>
      ) : (
        <p>
          el nuevo método de los delincuentes
          <br />
          <small>cargando...</small>
        </p>
      )}
    </React.Fragment>
  );
}
