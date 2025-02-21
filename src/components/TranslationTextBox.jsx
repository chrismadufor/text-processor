import React from "react";

export default function TranslationTextBox({ text, lang }) {
  return (
    <div className="mb-">
      <h1 className="border-b border-gray-3 pb-1 mb-2 uppercase text-sm text-gray-300 font-semibold">{lang} translation</h1>
      <p>{text}</p>
    </div>
  );
}
