import React, { createContext, useContext, useState } from "react";

const FlowContext = createContext(null);

export function FlowProvider({ children }) {
  const [selectedRole, setSelectedRole] = useState("");
  const [resumeData, setResumeData] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(null);

  const resetFlow = () => {
    setSelectedRole("");
    setResumeData(null);
    setQuestions([]);
    setAnswers([]);
    setResult(null);
  };

  return (
    <FlowContext.Provider
      value={{
        selectedRole,
        setSelectedRole,
        resumeData,
        setResumeData,
        questions,
        setQuestions,
        answers,
        setAnswers,
        result,
        setResult,
        resetFlow,
      }}
    >
      {children}
    </FlowContext.Provider>
  );
}

export const useFlow = () => {
  const ctx = useContext(FlowContext);
  if (!ctx) throw new Error("useFlow must be used inside FlowProvider");
  return ctx;
};
