import React from "react";
import Overlay from "@/components/Overlay";

const BestTestsModal = ({ isActive, setIsActive, tests, modeName }) => {
  return (
    <Overlay isActive={isActive} setIsActive={setIsActive}>
      <div
        className="bg-bgColor w-[90%] max-w-[800px] p-4 sm:p-6 lg:p-8 rounded-lg max-h-[90vh] flex overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-full overflow-auto">
          <table className="w-full text-right">
            <thead>
              <tr className="text-primary text-xs">
                <td className="p-2">{modeName}</td>
                <td className="p-2">wpm</td>
                <td className="p-2">raw</td>
                <td className="p-2">accuracy</td>
                <td className="p-2">language</td>
                <td className="p-2">date</td>
              </tr>
            </thead>
            <tbody>
              {tests
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .map((test, index) => (
                  <TableRow key={index} {...test} index={index} />
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </Overlay>
  );
};

export default BestTestsModal;

const TableRow = (test) => {
  return (
    <tr
      className={`text-tertiary text-sm sm:text-base ${
        test.index % 2 === 0 ? "bg-bgSecondary" : "bg-transparent"
      }`}
    >
      <td className="p-2 text-xl sm:text-2xl">{test.mode.category}</td>
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
