// submit.js
// Submit button component for pipeline analysis - Updated for VectorShift Assessment

import { useStore } from './store';
import { shallow } from 'zustand/shallow';

const selector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
});

export const SubmitButton = () => {
  const { nodes, edges } = useStore(selector, shallow);

  const handleSubmit = async () => {
    try {
      // Comprehensive validation with proper defaults
      const validNodes = nodes && Array.isArray(nodes) ? nodes : [];
      const validEdges = edges && Array.isArray(edges) ? edges : [];

      // Log current pipeline state for debugging
      console.log('Current pipeline state:', {
        nodesCount: validNodes.length,
        edgesCount: validEdges.length,
        nodes: validNodes,
        edges: validEdges
      });

      // Prepare data for backend - ensure proper structure
      const pipelineData = {
        nodes: validNodes.map(node => ({
          id: node.id || `node_${Math.random().toString(36).substr(2, 9)}`,
          type: node.type || 'unknown',
          position: node.position || { x: 0, y: 0 },
          data: node.data || {},
          ...node
        })),
        edges: validEdges.map(edge => ({
          id: edge.id || `edge_${Math.random().toString(36).substr(2, 9)}`,
          source: edge.source || '',
          target: edge.target || '',
          sourceHandle: edge.sourceHandle || null,
          targetHandle: edge.targetHandle || null,
          ...edge
        }))
      };

      console.log('Submitting sanitized pipeline:', pipelineData);

      // Send POST request to backend with error handling
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

      const response = await fetch('http://localhost:8000/pipelines/parse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pipelineData),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      // Handle different response scenarios
      if (!response.ok) {
        let errorMessage = `Server error ${response.status}`;
        try {
          const errorText = await response.text();
          errorMessage += `: ${errorText}`;
        } catch (e) {
          errorMessage += ': Unknown server error';
        }
        throw new Error(errorMessage);
      }

      // Parse and validate response
      const result = await response.json();
      console.log('Backend response:', result);

      // Validate response structure
      if (typeof result !== 'object' || result === null) {
        throw new Error('Invalid response format from server');
      }

      const numNodes = typeof result.num_nodes === 'number' ? result.num_nodes : 0;
      const numEdges = typeof result.num_edges === 'number' ? result.num_edges : 0;
      const isDag = typeof result.is_dag === 'boolean' ? result.is_dag : false;

      // Show comprehensive user-friendly alert
      const dagStatus = isDag ? 'Yes ✓' : 'No ✗';
      const dagEmoji = isDag ? '✅' : '⚠️';
      
      let alertMessage = `${dagEmoji} Pipeline Analysis Results:\n\n`;
      alertMessage += `📊 Number of Nodes: ${numNodes}\n`;
      alertMessage += `🔗 Number of Edges: ${numEdges}\n`;
      alertMessage += `📈 Is Valid DAG: ${dagStatus}\n\n`;

      // Detailed feedback based on pipeline state
      if (numNodes === 0) {
        alertMessage += '💡 Your pipeline is empty. Try adding some nodes!';
      } else if (numEdges === 0) {
        alertMessage += '💡 You have nodes but no connections. Consider linking them together!';
      } else if (isDag) {
        alertMessage += '🎉 Great! Your pipeline is properly structured and ready to use.';
      } else {
        alertMessage += '⚠️  Warning: Your pipeline contains cycles. Please check your connections.';
      }

      alert(alertMessage);

    } catch (error) {
      console.error('Submit failed:', error);
      
      // User-friendly error messages
      let userMessage = 'Failed to analyze pipeline: ';
      
      if (error.name === 'AbortError') {
        userMessage += 'Request timed out. Please try again.';
      } else if (error.message.includes('fetch')) {
        userMessage += 'Cannot connect to server. Please ensure the backend is running on http://localhost:8000';
      } else if (error.message.includes('JSON')) {
        userMessage += 'Server returned invalid data. Please try again.';
      } else {
        userMessage += error.message;
      }
      
      alert(userMessage);
    }
  };

  // Enhanced styling with better UX
  const containerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
    // backgroundColor: '
    // borderTop: '1px solid #dee2e6',
    minHeight: '50px'
  };

  const buttonStyle = {
    padding: '12px 24px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 2px 4px rgba(0,123,255,0.2)',
    minWidth: '160px'
  };

  const handleMouseEnter = (e) => {
    e.target.style.backgroundColor = '#0056b3';
    e.target.style.transform = 'translateY(-1px)';
    e.target.style.boxShadow = '0 4px 8px rgba(0,123,255,0.3)';
  };

  const handleMouseLeave = (e) => {
    e.target.style.backgroundColor = '#090a0cff';
    e.target.style.transform = 'translateY(0)';
    e.target.style.boxShadow = '0 2px 4px rgba(0,123,255,0.2)';
  };

  return (
    <div style={containerStyle}>
      <button
        type="button"
        onClick={handleSubmit}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={buttonStyle}
      >
        Submit Pipeline
      </button>
    </div>
  );
};