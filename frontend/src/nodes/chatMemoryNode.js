import React, { useState, useCallback } from "react";
import BaseNode from "./BaseNode";
import { useStore } from "../store";

/*
  ChatMemoryNode
  - Allows users to upload files via drag & drop or by clicking to open file selector
  - Displays a scrollable list of uploaded files with name, size, and a remove button
  - Stores file metadata (name, size, type, lastModified) in local state and syncs to global store
  - Uses BaseNode for consistent node styling and handles for React Flow connections
*/

export function ChatMemoryNode({ id, data }) {
  // Zustand store updater to sync node data globally
  const updateNodeField = useStore((s) => s.updateNodeField);

  // Local state to hold files metadata; initialize from data if available
  const [files, setFiles] = useState(data?.files ?? []);

  // Handler for files added via drag-drop or file input
  const onFilesAdded = useCallback(
    (event) => {
      event.preventDefault();

      // Extract files from event - supports both drop and input change events
      let newFiles = [];
      if (event.dataTransfer) {
        newFiles = Array.from(event.dataTransfer.files);
      } else if (event.target.files) {
        newFiles = Array.from(event.target.files);
      }

      if (newFiles.length === 0) return;

      // Map files to metadata objects to store minimal info
      const newFileMeta = newFiles.map((file) => ({
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified,
      }));

      // Append new files to existing files
      const updatedFiles = [...files, ...newFileMeta];

      // Update local state and global store (important for React Flow node data sync)
      setFiles(updatedFiles);
      updateNodeField(id, "files", updatedFiles);
    },
    [files, id, updateNodeField]
  );

  // Remove a file from the list by index
  const removeFile = (index) => {
    const updated = files.filter((_, i) => i !== index);
    setFiles(updated);
    updateNodeField(id, "files", updated);
  };

  // Prevent default dragover to allow dropping files
  const onDragOver = (e) => e.preventDefault();

  return (
    <BaseNode
      id={id}
      data={data}
      title="Chat Memory"
      customStyle={{ width: 320, padding: 12, borderRadius: 10, background: "#f9fafb" }}
      fields={[
        {
          name: "fileUpload",
          label: "Upload Files",
          type: "custom",
          customRender: () => (
            // File drop zone - clicking triggers hidden file input
            <div
              onDrop={onFilesAdded}
              onDragOver={onDragOver}
              onClick={() => document.getElementById(`${id}-file-input`).click()}
              title="Drag & drop files here or click to upload"
              className="cursor-pointer rounded-md border-2 border-dashed border-violet-400 bg-white py-6 px-4 text-center text-violet-700 hover:border-violet-600 transition-colors select-none"
            >
              Drag & drop files here or click to upload

              {/* Hidden file input triggered by clicking drop zone */}
              <input
                type="file"
                multiple
                id={`${id}-file-input`}
                className="hidden"
                onChange={onFilesAdded}
                aria-label="Upload files"
              />
            </div>
          ),
        },
        {
          name: "fileList",
          label: "Files",
          type: "custom",
          customRender: () => (
            // Scrollable file list container
            <ul className="mt-3 max-h-30 overflow-y-auto rounded-md border border-gray-200 bg-white shadow-inner">
              {/* Show placeholder text when no files */}
              {files.length === 0 ? (
                <li className="p-3 text-center text-gray-500 select-none">No files uploaded</li>
              ) : (
                // List each uploaded file with name, size, and remove button
                files.map((file, idx) => (
                  <li
                    key={idx}
                    className="flex items-center justify-between border-b border-gray-100 px-4 py-2 last:border-b-0 hover:bg-violet-50"
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-xl select-none">📄</span>
                      {/* Truncate long file names, full name visible on hover */}
                      <span
                        className="text-violet-900 font-medium truncate max-w-[180px]"
                        title={file.name}
                      >
                        {file.name}
                      </span>
                      <span className="text-gray-500 text-xs select-none">
                        ({(file.size / 1024).toFixed(1)} KB)
                      </span>
                    </div>

                    {/* Remove file button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // prevent triggering parent clicks
                        removeFile(idx);
                      }}
                      title="Remove file"
                      className="text-red-600 hover:text-red-800 transition-colors text-lg font-bold select-none"
                      aria-label={`Remove ${file.name}`}
                    >
                      &times;
                    </button>
                  </li>
                ))
              )}
            </ul>
          ),
        },
      ]}
      // React Flow handles for input/output connections
      handles={{
        inputs: [{ id: `${id}-in`, top: "30%" }],
        outputs: [{ id: `${id}-out`, top: "70%" }],
      }}
    />
  );
}

export default ChatMemoryNode;
