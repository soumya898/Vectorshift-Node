import React, { useState, useEffect } from "react";
import BaseNode from "./BaseNode";
import { useStore } from "../store";

/*
  FileLoader node:
  - Simple text / config style node (you asked this one to be text-only)
  - Fields: description, file type selector
  - Outputs: "content" handle
*/

export function FileLoaderNode({ id, data }) {
  const updateNodeField = useStore((s) => s.updateNodeField);

  const [description, setDescription] = useState(data?.description ?? "Load file and parse content");
  const [fileType, setFileType] = useState(data?.fileType ?? "auto");

  useEffect(() => {
    // keep shared node data in sync
    updateNodeField(id, "description", description);
    updateNodeField(id, "fileType", fileType);
  }, [id, description, fileType, updateNodeField]);

  return (
    <BaseNode
      id={id}
      data={data}
      title="File Loader"
      customStyle={{
        width: 260,
        padding: 10,
        borderRadius: 8,
        background: "#fff",
        border: "1px solid #ddd",
        boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
        fontFamily: "sans-serif"
      }}
      fields={[
        {
          name: "description",
          label: "Description",
          type: "textarea",
          defaultValue: description,
          onChange: (v) => setDescription(v)
        },
        {
          name: "fileType",
          label: "File type",
          type: "select",
          options: ["auto", "pdf", "csv", "json", "txt"],
          defaultValue: fileType,
          onChange: (v) => setFileType(v)
        }
      ]}
      handles={{
        inputs: [{ id: `${id}-in`, top: "40%" }], // optional incoming file or trigger
        outputs: [{ id: `${id}-content`, top: "60%" }] // outgoing parsed content
      }}
    />
  );
}

export default FileLoaderNode;
