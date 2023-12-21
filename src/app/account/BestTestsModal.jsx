import { AnimatePresence, motion } from "framer-motion";
import React from "react";

const BestTestsModal = ({ isActive, setIsActive, tests, mode }) => {
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
          <div
            className="bg-bgColor w-[90%] max-w-[800px] p-8 rounded-lg overflow-auto max-h-[89vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <table className="w-full text-right">
              <thead>
                <tr className="text-primary text-xs">
                  <td className="p-2">{mode}</td>
                  <td className="p-2">wpm</td>
                  <td className="p-2">raw</td>
                  <td className="p-2">accuracy</td>
                  <td className="p-2">language</td>
                  <td className="p-2">date</td>
                </tr>
              </thead>
              <tbody>
                {tests.map((test, index) => (
                  <TableRow key={index} {...test} index={index} />
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BestTestsModal;

const TableRow = (test) => {
  return (
    <tr
      className={`text-tertiary ${
        test.index % 2 === 0 ? "bg-bgSecondary" : "bg-transparent"
      }`}
    >
      <td className="p-2 text-2xl">{test.mode.category}</td>
      <td className="p-2">{test.wpm}</td>
      <td className="p-2">{test.raw}</td>
      <td className="p-2">{test.accuracy}%</td>
      <td className="p-2">{test.language}</td>
      <td className="p-2">
        {" "}
        <div className="leading-[125%]">{test.date}</div>
        <div className="opacity-50 leading-[125%]">{test.time}</div>
      </td>
    </tr>
  );
};
