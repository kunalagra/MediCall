import React from "react";

const Failed = () => {
  return (
    <div className="min-h-[650px] flex items-center">
      <div>
        <div className="max-w-[600px] rounded-lg p-5 border border-black mx-auto flex flex-col">
          <div className="text-2xl font-bold">Payment failed!</div>
          <div className="text-base mt-5">
            For any product related query, drop an email to
          </div>
          <div className="underline">medicall@gmail.com</div>
        </div>
      </div>
    </div>
  );
};

export default Failed;
