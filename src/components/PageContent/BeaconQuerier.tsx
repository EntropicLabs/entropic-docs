/** @jsxImportSource preact */
import type { FunctionalComponent } from "preact";
import { useState, useEffect } from "preact/hooks";

const BeaconQuerier: FunctionalComponent<{ lcd: String }> = ({ lcd }) => {
  const [data, setData] = useState(null);
  const getData = async () => {
    const response = await fetch(`${lcd}`);
    const data = await response.json();
    setData(data);
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <pre class="astro-code">
      <code>{JSON.stringify(data, null, 2)}</code>
    </pre>
  );
};

export default BeaconQuerier;
