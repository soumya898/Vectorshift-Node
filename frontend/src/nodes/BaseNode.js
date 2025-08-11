
// //   BaseNode is a reusable node template for React Flow.
  
// //   Props passed:
// //     - id: the node's unique id (from React Flow)
// //     - data: any custom data you want stored in the node
// //     - title: label shown at the top of the node
// //     - fields: an array describing form inputs to render inside the node
// //     - handles: describes where input/output handles should be placed
// //     - customStyle: optional custom styles to override default styling

// BaseNode is a reusable box component used to build nodes in a React Flow
//  graph. It shows a title at the top, and inside the box, it displays form 
// fields like text inputs, dropdowns, or custom components based on what you pass in. 
// It also shows small connection points called handles on the left (for inputs) and right (for outputs) that let you connect nodes together. You can customize the fields, handles, and styles easily, making it flexible for different node types. 
// If you want, you can even provide your own custom content inside the node instead of the default form fields.




    
// //   Example for `fields` array:
// //   ------------------------------------
// //   [
// //     { name: 'name', label: 'Name', type: 'text', defaultValue: '', onChange: fn },
// //     { name: 'desc', label: 'Description', type: 'textarea', defaultValue: '', onChange: fn },
// //     { name: 'mode', label: 'Mode', type: 'select', options: ['Fast','Slow'], defaultValue: 'Fast', onChange: fn },
// //     { name: 'custom', label: 'Custom', type: 'custom', customRender: () => <CustomComponent /> }
// //   ]
  
// //   Example for `handles` object:
// //   {
// //     inputs: [{ id: 'in1', top: 30, style: { opacity: 0.5 } }],
// //     outputs: [{ id: 'out1', top: 50 }]
// //   }
// // */


import React from 'react';
import { Handle, Position } from 'reactflow';

// Mock reactflow components for demo
const MockHandle = ({ type, position, id, style, className }) => (
  <div 
    className={`absolute w-3 h-3 rounded-full ${className}`}
    style={style}
  />
);

const MockPosition = {
  Left: 'left',
  Right: 'right',
  Top: 'top',
  Bottom: 'bottom'
};

// Use mocks for demo, but keep original imports for actual use
const HandleComponent = typeof Handle !== 'undefined' ? Handle : MockHandle;
const PositionEnum = typeof Position !== 'undefined' ? Position : MockPosition;

function BaseNode({ 
  id, 
  data, 
  title, 
  fields = [], 
  handles = {}, 
  customStyle = {},
  children // Allow children to override the default content
}) {
  // If children are provided, use them (for custom nodes like LLM)
  if (children) {
    return (
      <div className="relative" style={customStyle}>
        {children}
        
        {/* Render handles even when using children */}
        {handles.inputs?.map((input, index) => (
          <HandleComponent
            key={input.id || `input-${index}`}
            type="target"
            position={PositionEnum.Left}
            id={input.id}
            className="bg-blue-500 border border-gray-300"
            style={{
              top: input.top || `${(index + 1) * (100 / (handles.inputs.length + 1))}%`,
              position: 'absolute',
              left: 0,
              transform: 'translate(-50%, -50%)',
              width: '10px',
              height: '10px',
              ...input.style,
            }}
          />
        ))}


     {/* // mapping  */}

        {handles.outputs?.map((output, index) => (
          <HandleComponent
            key={output.id || `output-${index}`}
            type="source"
            position={PositionEnum.Right}
            id={output.id}
            className="bg-green-500 border border-gray-300"
            style={{
              top: output.top || `${(index + 1) * (100 / (handles.outputs.length + 1))}%`,
              position: 'absolute',
              right: 0,
              transform: 'translate(50%, -50%)',
              width: '10px',
              height: '10px',
              ...output.style,
            }}
          />
        ))}
      </div>
    );
  }

  // Professional white box design for standard nodes
  return (
    <div
      className="relative bg-white border border-gray-400 rounded-md shadow-lg p-4 w-52 min-h-[80px]"
      style={customStyle}
    >
      {/* Title */}
      <div className="mb-3">
        <h3 className="font-semibold text-sm text-black select-none">
          {title}
        </h3>
      </div>
      
      {/* Form fields */}
      <div className="space-y-3">
        {fields.map((field, index) => {
          const value = field.defaultValue ?? '';

          if (field.type === 'custom' && field.customRender) {
            try {
              const customContent = field.customRender();
              return (
                <div key={field.name || index}>
                  {field.label && (
                    <label className="block text-xs text-black font-medium mb-1">
                      {field.label}:
                    </label>
                  )}
                  {customContent}
                </div>
              );
            } catch (error) {
              return (
                <div key={field.name || index}>
                  {field.label && (
                    <label className="block text-xs text-black font-medium mb-1">
                      {field.label}:
                    </label>
                  )}
                  <div className="text-xs text-red-600">Error rendering field</div>
                </div>
              );
            }
          }
          //  Select Field  matching with type 

          if (field.type === 'select') {
            return (
              <div key={field.name || index}>
                <label className="block text-xs text-black font-medium mb-1">
                  {field.label}:
                </label>
                <select
                  value={value}
                  onChange={(e) => field.onChange?.(e.target.value)}
                  className="w-full px-2 py-1 text-xs text-black border border-gray-400 rounded bg-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                >
                  {field.options?.map((opt, optIndex) => (
                    <option key={opt || optIndex} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
            );
          }
        
          if (field.type === 'textarea') {
            return (
              <div key={field.name || index}>
                <label className="block text-xs text-black font-medium mb-1">
                  {field.label}:
                </label>
                <textarea
                  value={value}
                  onChange={(e) => field.onChange?.(e.target.value)}
                  rows={2}
                  className="w-full px-2 py-1 text-xs text-black border border-gray-400 rounded resize-none focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder={field.placeholder || ''}
                />
              </div>
            );
          }

          // Default input
          return (
            <div key={field.name || index}>
              <label className="block text-xs text-black font-medium mb-1">
                {field.label}:
              </label>
              <input
                type={field.type || 'text'}
                value={value}
                onChange={(e) => field.onChange?.(e.target.value)}
                className="w-full px-2 py-1 text-xs text-black border border-gray-400 rounded focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder={field.placeholder || ''}
              />
            </div>
          );
        })}
      </div>

      {/* Connection handles */}
      {handles.inputs?.map((input, index) => (
        <HandleComponent
          key={input.id || `input-${index}`}
          type="target"
          position={PositionEnum.Left}
          id={input.id}
          className="bg-blue-500 border border-gray-300"
          style={{
            top: input.top || `${(index + 1) * (100 / (handles.inputs.length + 1))}%`,
            position: 'absolute',
            left: 0,
            transform: 'translate(-50%, -50%)',
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            ...input.style,
          }}
        />
      ))}

        

      {handles.outputs?.map((output, index) => (
        <HandleComponent
          key={output.id || `output-${index}`}
          type="source"
          position={PositionEnum.Right}
          id={output.id}
          className="bg-green-500 border border-gray-300"
          style={{
            top: output.top || `${(index + 1) * (100 / (handles.outputs.length + 1))}%`,
            position: 'absolute',
            right: 0,
            transform: 'translate(50%, -50%)',
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            ...output.style,
          }}
        />
      ))}

      {handles.top?.map((topHandle, index) => (
        <HandleComponent
          key={topHandle.id || `top-${index}`}
          type={topHandle.type || "target"}
          position={PositionEnum.Top}
          id={topHandle.id}
          className="bg-purple-500 border border-gray-300"
          style={{
            left: topHandle.left || `${(index + 1) * (100 / (handles.top.length + 1))}%`,
            position: 'absolute',
            top: 0,
            transform: 'translate(-50%, -50%)',
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            ...topHandle.style,
          }}
        />
      ))}

      {handles.bottom?.map((bottomHandle, index) => (
        <HandleComponent
          key={bottomHandle.id || `bottom-${index}`}
          type={bottomHandle.type || "source"}
          position={PositionEnum.Bottom}
          id={bottomHandle.id}
          className="bg-orange-500 border border-gray-300"
          style={{
            left: bottomHandle.left || `${(index + 1) * (100 / (handles.bottom.length + 1))}%`,
            position: 'absolute',
            bottom: 0,
            transform: 'translate(-50%, 50%)',
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            ...bottomHandle.style,
          }}
        />
      ))}
    </div>
  );
}

export default BaseNode;

// Simple demo showing clean white boxes
export function BaseNodeDemo() {
  const [inputValue, setInputValue] = React.useState('');
  const [selectValue, setSelectValue] = React.useState('option1');

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 text-center mb-8">Clean White Node Design</h1>
      
      <div className="flex gap-6 justify-center items-start flex-wrap">
        {/* Simple input node */}
        <BaseNode
          id="input-node"
          title="Input Node"
          fields={[
            {
              name: 'value',
              label: 'Value',
              type: 'text',
              placeholder: 'Enter value',
              defaultValue: inputValue,
              onChange: setInputValue
            }
          ]}
          handles={{
            outputs: [{ id: 'output', top: '50%' }]
          }}
        />

        {/* Processing node */}
        <BaseNode
          id="process-node"
          title="Process"
          fields={[
            {
              name: 'method',
              label: 'Method',
              type: 'select',
              options: ['Transform', 'Filter', 'Sort'],
              defaultValue: selectValue,
              onChange: setSelectValue
            }
          ]}
          handles={{
            inputs: [{ id: 'input', top: '50%' }],
            outputs: [{ id: 'output', top: '50%' }]
          }}
        />

        {/* Output node */}
        <BaseNode
          id="output-node"
          title="Output"
          handles={{
            inputs: [{ id: 'input', top: '50%' }]
          }}
        />
      </div>
    </div>
  );
}