
// // textNode.js
// import React, { useState, useEffect } from "react";
// import { Handle, Position } from "reactflow";
// import { useStore } from "../store";

// import BaseNode from "./BaseNode";

// export const TextNode = ({ id, data }) => {
//   const updateNodeField = useStore((s) => s.updateNodeField);

//   const [currText, setCurrText] = useState(data?.text ?? "{{input}}");
//   const [showHandles, setShowHandles] = useState(false);

//   const extractVariables = (text) => {
//     const re = /{{\s*([\w_]+)\s*}}/g;
//     const matches = [];
//     let m;
//     while ((m = re.exec(text)) !== null) {
//       matches.push(m[1]);
//     }
//     return Array.from(new Set(matches));
//   };

//   const variables = extractVariables(currText);

//   useEffect(() => {
//     updateNodeField(id, "text", currText);
//   }, [id, currText, updateNodeField]);

//   const computeWidth = () => {
//     const len = currText.length;
//     return Math.min(Math.max(200, len * 7 + 120), 520);
//   };

//   const computeHeight = () => {
//     const lines = currText.split("\n").length;
//     return Math.min(Math.max(70, lines * 24 + 20), 320);
//   };

//   const handleKeyDown = (e) => {
//     if (e.key === "Enter") {
//       e.preventDefault(); // remove this line if you want multiline textarea
//       setShowHandles(true);
//     }
//   };

//   return (
//     <div
//       style={{
//         width: computeWidth(),
//         padding: 8,
//         borderRadius: 8,
//         background: "#fff",
//         border: "1px solid #ddd",
//         boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
//         position: "relative",
//         fontFamily: "sans-serif",
//       }}
//     >
//       {/* Left handles always in DOM, but visible only if showHandles is true */}
//       {variables.map((v, idx) => (
//         <Handle
//           key={v}
//           type="target"
//           position={Position.Left}
//           id={`${id}-${v}`}
          // style={{
          //   // top: 25 + idx * 18,
            
          //   position: "absolute",
          //   left: 0,
          //   transform: "translate(-50%, -50%)",
          //   opacity: showHandles ? 1 : 0,
          //   pointerEvents: showHandles ? "auto" : "none",
          
          // }}
//         />
//       ))}

//       <div style={{ fontWeight: 600, marginBottom: 6 }}>Text</div>

//       <textarea
//         value={currText}
//         onChange={(e) => {
//           setCurrText(e.target.value);
//           setShowHandles(false);
//         }}
//         onBlur={() => setShowHandles(true)}
//         onKeyDown={handleKeyDown}
//         rows={3}
//         placeholder="{{input}}"
//         style={{
//           width: "100%",
//           height: computeHeight(),
//           resize: "none",
//           padding: 8,
//           fontSize: 14,
//           borderRadius: 6,
//           border: "1px solid #ccc",
//           boxSizing: "border-box",
//           fontFamily: "inherit",
//         }}
//       />

//       {/* Right handle always visible */}
//       <Handle
//         type="source"
//         position={Position.Right}
//         id={`${id}-output`}
        
//       />
//     </div>
//   );
// };


// export default  TextNode;




/**
 * TextNode component allows users to enter text with embedded variables.
 * - The textarea auto-resizes as user types more lines for better visibility.
 * - Variables enclosed in double curly braces {{variable}} are detected dynamically.
 * - For each detected variable, an input handle is created on the left side of the node.
 * - A fixed output handle is shown on the right.
 *
 * Example usage:
 * User types: "Hello {{name}}, today is {{day}}."
 * This will create two input handles: one for "name" and one for "day".
 */











import React, { useState, useEffect } from "react";
import { useStore } from "../store";
import BaseNode from "./BaseNode";

export const TextNode = ({ id, data }) => {
  const updateNodeField = useStore((s) => s.updateNodeField);
  
  const [currText, setCurrText] = useState(data?.text ?? "{{input}}");
  const [showHandles, setShowHandles] = useState(false);
  
  const extractVariables = (text) => {
    const re = /{{\s*([\w_]+)\s*}}/g;
    const matches = [];
    let m;
    while ((m = re.exec(text)) !== null) {
      matches.push(m[1]);
    }
    return Array.from(new Set(matches));
  };
  
  const variables = extractVariables(currText);
  
  useEffect(() => {
    updateNodeField(id, "text", currText);
  }, [id, currText, updateNodeField]);
  
  const computeWidth = () => {
    const len = currText.length;
    return Math.min(Math.max(200, len * 7 + 120), 520);
  };
  
  const computeHeight = () => {
    const lines = currText.split("\n").length;
    return Math.min(Math.max(70, lines * 24 + 20), 320);
  };
  
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // remove this line if you want multiline textarea
      setShowHandles(true);
    }
  };
  
  const handleTextChange = (value) => {
    setCurrText(value);
    setShowHandles(false);
  };
  
  const handleBlur = () => {
    setShowHandles(true);
  };
  
  // Create dynamic input handles based on extracted variables
  const dynamicInputHandles = variables.map((v, idx) => ({
    id: `${id}-${v}`,
    top: 50 + idx * 18,
    style: {
      opacity: showHandles ? 1 : 0,
      pointerEvents: showHandles ? "auto" : "none",
    }
  }));

  return (
    <BaseNode
      id={id}
      data={data}
      title="Text"
      // Custom styling for dynamic sizing
      customStyle={{
        width: computeWidth(),
        height: 'auto', // Let content determine height
        padding: 8,
        borderRadius: 8,
        background: "#fff",
        border: "1px solid #ddd",
        boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
        fontFamily: "sans-serif",
      }}
      fields={[
        {
          name: 'text',
          label: '',
          type: 'custom', // Special type for custom rendering
          defaultValue: currText,
          onChange: handleTextChange,
          customRender: () => (
            <textarea
              value={currText}
              onChange={(e) => handleTextChange(e.target.value)}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              rows={3}
              placeholder="{{input}}"
              className="w-full resize-none p-2 text-gray-900 placeholder-gray-400 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 font-sans text-sm box-border"
              style={{ height: computeHeight() }}
            />
          )
        }
      ]}
      handles={{
        inputs: dynamicInputHandles,
        outputs: [{ id: `${id}-output` }]
      }}
    />
  );
};

export default TextNode;
