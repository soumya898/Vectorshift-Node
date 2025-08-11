// inputNode.js
import { useState } from 'react';
import BaseNode from './BaseNode';

export function InputNode({ id, data }) {
  // Use existing inputName or generate one from id
  const [currName, setCurrName] = useState(
    data?.inputName || id.replace('customInput-', 'input_')
  );
  
  // Input type can be 'Text' or 'File', default to 'Text'
  const [inputType, setInputType] = useState(data?.inputType || 'Text');

  return (
    <BaseNode
      id={id}
      data={data}
      title="Input"
      fields={[
        {
          name: 'inputName',
          label: 'Name',
          type: 'text',
          defaultValue: currName,
          onChange: (val) => setCurrName(val),
        },
        {
          name: 'inputType',
          label: 'Type',
          type: 'select',
          defaultValue: inputType,
          options: ['Text', 'File'],
          onChange: (val) => setInputType(val),
        },
      ]}
      handles={{
        outputs: [{ id: `${id}-value` }],  // Output handle on the right side
      }}
    />
  );
}

export default InputNode;
