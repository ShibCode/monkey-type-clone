import { AnimatePresence, motion } from "framer-motion";
import React from "react";

const Overlay = ({ isActive, setIsActive, children }) => {
  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.125 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-20 grid place-items-center"
          onClick={() => setIsActive(false)}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Overlay;
