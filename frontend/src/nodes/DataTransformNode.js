import React, { useState, useEffect } from "react";
import BaseNode from "./BaseNode";
import { useStore } from "../store";

export function DataTransformNode({ id, data }) {
  const updateNodeField = useStore((s) => s.updateNodeField);

  const [mode, setMode] = useState(data?.mode ?? "Lowercase");
  const [customScript, setCustomScript] = useState(data?.customScript ?? "");

  useEffect(() => {
    updateNodeField(id, "mode", mode);
    updateNodeField(id, "customScript", customScript);
  }, [id, mode, customScript, updateNodeField]);

  return (
    <BaseNode
      id={id}
      data={data}
      title="Data Transform"
      customStyle={{
        width: 300,
        padding: 10,
        borderRadius: 8,
        background: "#e8f5e9",
        border: "1px solid #66bb6a",
        fontFamily: "Arial, sans-serif",
      }}
      fields={[
        {
          name: "mode",
          label: "Transform Mode",
          type: "select",
          options: ["Lowercase", "Uppercase", "Trim"],
          defaultValue: mode,
          onChange: (v) => setMode(v),
        },
        {
          name: "customScript",
          label: "Custom Script (JS)",
          type: "textarea",
          defaultValue: customScript,
          onChange: (v) => setCustomScript(v),
        },
      ]}
      handles={{
        inputs: [{ id: `${id}-input`, top: "30%" }],
        outputs: [{ id: `${id}-output`, top: "70%" }],
      }}
    />
  );
}

export default DataTransformNode;
