# backend/main.py
# Enhanced FastAPI backend for VectorShift pipeline parsing

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import logging

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="VectorShift Pipeline Parser", version="1.0.0")

# CORS middleware - allow frontend to call backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000", 
        "http://127.0.0.1:3000",
        "http://localhost:3001"  # backup port
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

# Pydantic models for request/response validation
class Node(BaseModel):
    id: str
    type: Optional[str] = None
    position: Optional[Dict[str, Any]] = None
    data: Optional[Dict[str, Any]] = None

class Edge(BaseModel):
    id: Optional[str] = None
    source: str
    target: str
    sourceHandle: Optional[str] = None
    targetHandle: Optional[str] = None

class Pipeline(BaseModel):
    nodes: List[Node]
    edges: List[Edge]

class PipelineResponse(BaseModel):
    num_nodes: int
    num_edges: int
    is_dag: bool

@app.get("/")
def read_root():
    """Health check endpoint"""
    logger.info("Health check called")
    return {"ping": "pong", "status": "VectorShift API is running"}

@app.post("/pipelines/parse", response_model=PipelineResponse)
def parse_pipeline(pipeline: Pipeline):
    """
    Parse pipeline and return analysis
    
    Expected input:
    {
        "nodes": [{"id": "node-1", "type": "input", ...}, ...],
        "edges": [{"source": "node-1", "target": "node-2", ...}, ...]
    }
    
    Returns:
    {
        "num_nodes": int,
        "num_edges": int, 
        "is_dag": bool
    }
    """
    try:
        logger.info(f"Received pipeline with {len(pipeline.nodes)} nodes and {len(pipeline.edges)} edges")
        
        # Calculate basic metrics
        num_nodes = len(pipeline.nodes)
        num_edges = len(pipeline.edges)
        
        # Build adjacency list for DAG checking
        graph = {}
        
        # Initialize graph with all node IDs
        for node in pipeline.nodes:
            graph[node.id] = []
        
        # Add edges to graph
        for edge in pipeline.edges:
            # Ensure source and target nodes exist in graph
            if edge.source not in graph:
                graph[edge.source] = []
            if edge.target not in graph:
                graph[edge.target] = []
            
            # Add edge to adjacency list
            graph[edge.source].append(edge.target)
        
        # Check if graph is a Directed Acyclic Graph (DAG)
        is_dag_result = is_dag(graph)
        
        logger.info(f"Analysis complete - Nodes: {num_nodes}, Edges: {num_edges}, Is DAG: {is_dag_result}")
        
        return PipelineResponse(
            num_nodes=num_nodes,
            num_edges=num_edges,
            is_dag=is_dag_result
        )
        
    except Exception as e:
        logger.error(f"Error processing pipeline: {str(e)}")
        raise HTTPException(status_code=400, detail=f"Error processing pipeline: {str(e)}")

def is_dag(graph: Dict[str, List[str]]) -> bool:
    """
    Check if directed graph is acyclic using DFS with colors
    
    Args:
        graph: Adjacency list representation of graph
        
    Returns:
        bool: True if graph is a DAG, False if cycles detected
    """
    # Color coding: 0 = white (unvisited), 1 = gray (visiting), 2 = black (visited)
    color = {node: 0 for node in graph}
    
    def dfs_visit(node: str) -> bool:
        """
        DFS helper function
        Returns True if no cycle, False if cycle detected
        """
        if color[node] == 1:  # Gray node - back edge found (cycle)
            return False
        
        if color[node] == 2:  # Black node - already processed
            return True
        
        # Mark as gray (currently visiting)
        color[node] = 1
        
        # Visit all adjacent nodes
        for neighbor in graph.get(node, []):
            if not dfs_visit(neighbor):
                return False
        
        # Mark as black (finished processing)
        color[node] = 2
        return True
    
    # Check all nodes for cycles
    for node in graph:
        if color[node] == 0:  # Unvisited node
            if not dfs_visit(node):
                return False  # Cycle found
    
    return True  # No cycles found - it's a DAG

@app.get("/health")
def health_check():
    """Extended health check"""
    return {
        "service": "vectorshift-pipeline-parser",
        "status": "healthy",
        "version": "1.0.0"
    }

# For running directly with python
if __name__ == "__main__":
    import uvicorn
    logger.info("Starting VectorShift Pipeline Parser API...")
    uvicorn.run(app, host="0.0.0.0", port=8000, log_level="info")