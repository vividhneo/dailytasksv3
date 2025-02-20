import React from 'react';
import { motion } from 'framer-motion';

interface CheckboxProps {
  checked: boolean;
  onToggle: () => void;
}

export default function Checkbox({ checked, onToggle }: CheckboxProps) {
  return (
    <motion.div
      whileTap={{ scale: 0.9 }}
      onClick={(e) => {
        e.stopPropagation();
        onToggle();
      }}
      className={`w-6 h-6 rounded-[5px] flex items-center justify-center border ${
        checked 
          ? 'bg-[#F25B38] border-[#B64328]' 
          : 'bg-[#EAEDFD] border-[#809AF7]'
      }`}
      style={{ borderWidth: '1px' }}
    />
  );
}