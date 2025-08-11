// Features:

// Textarea for custom script or expression

// Mode select dropdown (simple transforms)

// Input handle for incoming data

// Output handle for transformed data



import React, { useState, useEffect } from "react";
import BaseNode from "./BaseNode";
import { useStore } from "../store";

export function WebScraperNode({ id, data }) {
  const updateNodeField = useStore((s) => s.updateNodeField);

  const [url, setUrl] = useState(data?.url ?? "");
  const [mode, setMode] = useState(data?.mode ?? "Full Page");

  useEffect(() => {
    updateNodeField(id, "url", url);
    updateNodeField(id, "mode", mode);
  }, [id, url, mode, updateNodeField]);

  return (
    <BaseNode
      id={id}
      data={data}
      title="Web Scraper"
      customStyle={{
        width: 280,
        padding: 10,
        borderRadius: 8,
        background: "#fff8e1",
        border: "1px solid #ffca28",
        fontFamily: "Arial, sans-serif",
      }}
      fields={[
        {
          name: "url",
          label: "URL",
          type: "text",
          defaultValue: url,
          onChange: (v) => setUrl(v),
        },
        {
          name: "mode",
          label: "Scrape Mode",
          type: "select",
          options: ["Full Page", "Article Only"],
          defaultValue: mode,
          onChange: (v) => setMode(v),
        },
      ]}
      handles={{
        inputs: [{ id: `${id}-trigger`, top: "30%" }],
        outputs: [{ id: `${id}-content`, top: "70%" }],
      }}
    />
  );
}

export default WebScraperNode;
