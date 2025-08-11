import React, { useState, useEffect, useRef } from 'react';
import BaseNode from './BaseNode';

// List of available variables that can be inserted in the prompt (autocomplete options)
const AVAILABLE_INPUTS = ['input_1', 'input_2', 'input_3'];

// Models available for selection in the node
const MODEL_OPTIONS = ['GPT', 'ChatGPT', 'Claude', 'Other AI'];

export default function LLMNode({ id, data }) {
  // Store the currently selected model, initialize from data or fallback to first option
  const [selectedModel, setSelectedModel] = useState(data?.model || MODEL_OPTIONS[0]);

  // Store current prompt text; initialize from data or empty string if nothing saved
  const [prompt, setPrompt] = useState(data?.prompt || '');

  // Whether or not to show the autocomplete suggestion list
  const [showSuggestions, setShowSuggestions] = useState(false);

  // The filtered list of suggestions based on what the user typed after '{{'
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);

  // Position of the '{{' in the prompt text, so we know where to insert selected suggestion
  const [autocompleteStartPos, setAutocompleteStartPos] = useState(null);

  // Reference to the textarea element, used to get/set cursor position and focus
  const textareaRef = useRef(null);

  // Notify parent/store whenever selected model or prompt changes
  useEffect(() => {
    if (data?.onChange) {
      data.onChange({ model: selectedModel, prompt });
    }
  }, [selectedModel, prompt, data]);

  // Called whenever user types in the prompt textarea
  // Checks if user just typed '{{' to trigger autocomplete suggestions
  const handlePromptChange = (value) => {
    setPrompt(value);

    // Current cursor position in the textarea
    const cursorPos = textareaRef.current.selectionStart;

    // Text before cursor position
    const textBeforeCursor = value.slice(0, cursorPos);

    // Find the last occurrence of '{{' before the cursor to start suggestions
    const lastOpenBraces = textBeforeCursor.lastIndexOf('{{');

    // If '{{' found and cursor is after it, filter suggestions
    if (lastOpenBraces !== -1 && cursorPos >= lastOpenBraces + 2) {
      // Get the text typed after '{{' (what user is typing for autocomplete)
      const typed = textBeforeCursor.slice(lastOpenBraces + 2).trim();

      // Filter inputs that start with typed text (case insensitive)
      const filtered = AVAILABLE_INPUTS.filter((input) =>
        input.toLowerCase().startsWith(typed.toLowerCase())
      );

      // Update suggestions and show dropdown if any match found
      setFilteredSuggestions(filtered);
      setAutocompleteStartPos(lastOpenBraces);
      setShowSuggestions(filtered.length > 0);
    } else {
      // If no '{{' or no match, hide suggestions
      setShowSuggestions(false);
      setAutocompleteStartPos(null);
    }
  };

  // Called when user clicks on one of the suggestions
  const handleSuggestionClick = (suggestion) => {
    if (autocompleteStartPos === null) return;

    // Get text before '{{' (keep the braces)
    const before = prompt.slice(0, autocompleteStartPos + 2);

    // Get text after current cursor position (to keep whatever user typed after the suggestion)
    const after = prompt.slice(textareaRef.current.selectionStart);

    // Insert selected suggestion plus closing braces '}}'
    const newPrompt = `${before}${suggestion}}}${after}`;

    // Update prompt state and hide suggestions list
    setPrompt(newPrompt);
    setShowSuggestions(false);

    // Move cursor to right after inserted suggestion so user can continue typing smoothly
    setTimeout(() => {
      const pos = before.length + suggestion.length + 2;
      textareaRef.current.focus();
      textareaRef.current.selectionStart = pos;
      textareaRef.current.selectionEnd = pos;
    }, 0);
  };

  // Detect clicks outside textarea or suggestions to close autocomplete list
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        textareaRef.current &&
        !textareaRef.current.contains(e.target) &&
        !e.target.classList.contains('suggestion-item')
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('click', handleClickOutside);

    // Clean up the event listener on unmount
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <BaseNode
      id={id}
      data={data}
      title="LLM"
      fields={[
        {
          name: 'modelSelect',
          label: 'Select Model',
          type: 'select',
          options: MODEL_OPTIONS,
          defaultValue: selectedModel,
          // When user changes model from dropdown, update state
          onChange: (value) => setSelectedModel(value),
        },
        {
          name: 'prompt',
          label: 'Prompt',
          type: 'custom',
          // Custom render to show textarea with autocomplete suggestions below it
          customRender: () => (
            <div style={{ position: 'relative' }}>
              <textarea
                ref={textareaRef}
                value={prompt}
                onChange={(e) => handlePromptChange(e.target.value)}
                rows={4}
                placeholder="Write prompt here, use {{input}} to insert variables"
                style={{
                  width: '100%',
                  borderRadius: 6,
                  border: '1px solid #ccc',
                  padding: 8,
                  fontSize: 14,
                  fontFamily: 'inherit',
                  resize: 'vertical',
                  color: 'black', // make sure prompt text is black
                }}
              />
              {/* Autocomplete suggestions dropdown */}
              {showSuggestions && (
                <ul
                  style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    backgroundColor: 'white',
                    border: '1px solid #ccc',
                    borderRadius: 4,
                    marginTop: 4,
                    maxHeight: 120,
                    overflowY: 'auto',
                    zIndex: 10,
                    listStyleType: 'none',
                    padding: 0,
                    boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                  }}
                >
                  {filteredSuggestions.map((item) => (
                    <li
                      key={item}
                      className="suggestion-item"
                      style={{
                        padding: '6px 12px',
                        cursor: 'pointer',
                        backgroundColor: '#0964cdab',  // light blue background
                        margin: '2px 6px',
                        borderRadius: 4,
                        fontSize: 13,
                        userSelect: 'none', // prevent accidental selection on click
                      }}
                      onClick={() => handleSuggestionClick(item)}
                      // Prevent textarea from losing focus when suggestion clicked
                      onMouseDown={(e) => e.preventDefault()}
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ),
        },
      ]}
      handles={{
        inputs: [
          { id: `${id}-system`, top: `${100 / 3}%` }, // input handle for system
          { id: `${id}-prompt`, top: `${200 / 3}%` }, // input handle for prompt
        ],
        outputs: [{ id: `${id}-response`, top: '50%' }], // output handle for response
      }}
    />
  );
}
