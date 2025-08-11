import React, { useState, useEffect } from "react";
import BaseNode from "./BaseNode";
import { useStore } from "../store";

/**
 * VectorDBNode component represents a node that reads from a vector database.
 * 
 * Props:
 * - id: Unique node id (from React Flow)
 * - data: Initial node data including document source, DB name, and DB type
 * 
 * Functionality:
 * - Allows user to input or update the document source (textarea).
 * - Lets user specify the vector database name (text input).
 * - Provides a dropdown to select the type of vector database.
 * - Updates global state/store on any changes via updateNodeField.
 * - Displays input and output connection handles for linking nodes.
 */
export function VectorDBNode({ id, data }) {
  // Hook to update node fields in the global store
  const updateNodeField = useStore((s) => s.updateNodeField);

  // Local state for document source input, initialized from props or default
  const [docSource, setDocSource] = useState(data?.docSource ?? "Upload or link document");
  // Local state for vector database name
  const [dbName, setDbName] = useState(data?.dbName ?? "");
  // Local state for vector database type, defaulting to ElasticSearch
  const [dbType, setDbType] = useState(data?.dbType ?? "ElasticSearch");

  // Sync local state changes to global store whenever any of these change
  useEffect(() => {
    updateNodeField(id, "docSource", docSource);
    updateNodeField(id, "dbName", dbName);
    updateNodeField(id, "dbType", dbType);
  }, [id, docSource, dbName, dbType, updateNodeField]);

  return (
    <BaseNode
      id={id}
      data={data}
      title="Vector DB Reader"
      customStyle={{
        width: 280,
        padding: 12,
        borderRadius: 8,
        background: "#e0f7fa",               // Light cyan background for clarity
        border: "1px solid #26c6da",          // Border matching output shadow color
        boxShadow: "0 2px 8px rgba(38,198,218,0.3)", // Subtle shadow effect
        fontFamily: "Arial, sans-serif",
      }}
      fields={[
        {
          name: "docSource",
          label: "Document Source",
          type: "textarea",                  // Multi-line input for large content
          defaultValue: docSource,
          onChange: (v) => setDocSource(v),
        },
        {
          name: "dbName",
          label: "Vector DB Name",
          type: "text",                      // Simple text input
          defaultValue: dbName,
          onChange: (v) => setDbName(v),
        },
        {
          name: "dbType",
          label: "Vector DB Type",
          type: "select",                    // Dropdown selector for DB type
          options: ["ElasticSearch", "Pinecone", "Weaviate"],
          defaultValue: dbType,
          onChange: (v) => setDbType(v),
        },
      ]}
      handles={{
        // Input handle positioned near the top left (trigger input)
        inputs: [{ id: `${id}-trigger`, top: "20%" }],
        // Output handle positioned near bottom right (vector output)
        outputs: [{ id: `${id}-vectors`, top: "70%" }],
      }}
    />
  );
}

export default VectorDBNode;
