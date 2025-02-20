import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface TaskInputProps {
  onSubmit: (text: string) => void;
}

export default function TaskInput({ onSubmit }: TaskInputProps) {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onSubmit(text.trim());
      setText('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center space-x-3 p-3">
      <div 
        className="w-6 h-6 border-2 border-[#D9D9D9] bg-[#F5F5F5] rounded-[5px]"
        style={{
          flexShrink: 0
        }}
      />
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Add a task..."
        className="flex-1 bg-transparent border-none text-black dark:text-white placeholder:text-muted-foreground focus:outline-none"
        style={{
          backgroundImage: 'repeating-linear-gradient(to right, #A5A5A5 0, #A5A5A5 4px, transparent 4px, transparent 12px)',
          backgroundPosition: 'bottom',
          backgroundSize: '12px 1px',
          backgroundRepeat: 'repeat-x',
          paddingBottom: '4px'
        }}
      />
    </form>
  );
}