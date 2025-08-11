// DraggableNode component: represents a draggable UI block for different node types (Input, Output, etc.)

export const DraggableNode = ({ type, label }) => {

  // This function triggers when the user starts dragging the node with the mouse
  // Parameters:
  // - event: the mouse drag event
  // - nodeType: the type of node being dragged (passed as prop)
  const onDragStart = (event, nodeType) => {
    // 1. Create a small data object containing the node type
    const appData = { nodeType };

    // 2. Log the data for debugging to verify drag start info
    console.log("App_Data,", appData);

    // 3. Change the cursor style to 'grabbing' to visually indicate dragging
    event.target.style.cursor = 'grabbing';

    // 4. Use DataTransfer API to store the node data in JSON format
    // This data will be accessible when the node is dropped
    event.dataTransfer.setData('application/reactflow', JSON.stringify(appData));

    // 5. Set allowed drag effect to 'move' to indicate we are moving the element
    event.dataTransfer.effectAllowed = 'move';
  };

  // Render the draggable div with styles and handlers
  return (
    <div
      className={type}  // CSS class for styling based on node type
      draggable          // Make this div draggable by default
      onDragStart={(event) => onDragStart(event, type)}  // Attach drag start handler
      onDragEnd={(event) => (event.target.style.cursor = 'grab')} // Reset cursor on drag end
      style={{
        cursor: 'grab',            // Cursor looks like hand grab when hovering
        minWidth: '80px',          // Minimum width for better UX
        height: '60px',            // Fixed height for uniformity
        display: 'flex',           // Flexbox for centering content
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        borderRadius: '8px',       // Rounded corners for a modern look
        backgroundColor: '#1C2536' // Dark blue/gray background color
      }}
    >
      {/* Label text displayed inside the draggable box */}
      <span style={{ color: '#fff' }}>{label}</span>
    </div>
  );
};
