// toolbar.js

import { DraggableNode } from './draggableNode';

export const PipelineToolbar = () => {
    return (
        <div style={{ padding: '10px' }}>
            <div style={{ marginTop: '20px', display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
                {/* Original Nodes */}
                <DraggableNode type='customInput' label='Input' />
                <DraggableNode type='llm' label='LLM' />
                <DraggableNode type='customOutput' label='Output' />
                <DraggableNode type='text' label='Text' />




                {/*  5 new  nodes */}
                <DraggableNode type='fileLoader' label='File Loader' />
                 <DraggableNode type='chatMemory' label='Chat Memory' />

                  <DraggableNode type='vectorDB' label='VectorDB Loader' />
                      
                   
                    <DraggableNode type='webScraper' label='Web Scraper' />
                    <DraggableNode type='dataTransform' label='Data Transform' />                
                
            </div>
        </div>
    );
};