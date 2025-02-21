"use client";

import { options } from "@/data/data";
import Summarize from "@/icons/Summarize";
import Translate from "@/icons/Translate";
import { faFileAlt } from "@fortawesome/free-regular-svg-icons";
import { faAngleDown, faLanguage } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useRef, useState } from "react";
import Spinner from "./Spinner";

export default function MainTextBox({
  id,
  text,
  lang,
  translations,
  translate,
  translationLoading,
  summarize,
  summaryLoading,
}) {
  const [formattedOptions, setFormattedOptions] = useState(options);

  const formatOptions = () => {
    let langArr = [];
    for (let item of translations) {
      langArr.push(item.language);
    }

    let temp = [];

    for (let option of options) {
      if (option.name === lang) continue;
      if (langArr.indexOf(option.name) !== -1) continue 
      else temp.push(option);
    }
    setFormattedOptions(temp);
  };

  let result = options.filter((item) => item.name === lang);
  let code = result[0]?.code;

  const checkWordsCount = () => {
    return text.trim().length > 150;
  };

  const canSummarize = checkWordsCount();

  const [isOpen, setIsOpen] = useState(false);
  const [showAbove, setShowAbove] = useState(false);
  const buttonRef = useRef(null);
  const optionsRef = useRef(null);

  const toggleOptions = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    formatOptions();
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isOpen &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target) &&
        optionsRef.current &&
        !optionsRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const optionsHeight = optionsRef.current?.offsetHeight || 0;

      setShowAbove(buttonRect.bottom + optionsHeight > windowHeight - 200);
    }
  }, [isOpen]);

  // add spinners for translate and summarize

  return (
    <div className="textbox bg-gray-2 self-end mb-5">
      <p>{text}</p>
      <div className="border-t border-gray-3 mt-3 pt-2 flex justify-between">
        <p className="capitalize text-xs font-semibold bg-gray-300 text-background px-2 py-1 rounded flex items-center">
          {lang}
        </p>
        <div className="flex items-center gap-5">
          {canSummarize && (
            <div>
              {summaryLoading ? (
                <Spinner />
              ) : (
                <div
                  onClick={() => summarize(text, id)}
                  className="relative text-icon flex items-center"
                >
                  <FontAwesomeIcon
                    className="text-2xl h-5 text-gray-400 hover:text-gray-100 cursor-pointer"
                    icon={faFileAlt}
                  />
                  <div className="tooltip absolute font-medium left-[50%] -translate-x-[50%] text-xs -bottom-10 bg-gray-800 text-white px-3 py-2 rounded-md">
                    Summarize
                  </div>
                </div>
              )}
            </div>
          )}
          <div ref={buttonRef} onClick={toggleOptions} className="relative">
            {translationLoading ? (
              <Spinner />
            ) : (
              <div className="text-icon flex items-center">
                <FontAwesomeIcon
                  className="h-7 text-gray-400 hover:text-gray-100 cursor-pointer"
                  icon={faLanguage}
                />
                <div className="tooltip absolute font-medium left-[50%] -translate-x-[50%] text-xs -bottom-10 bg-gray-800 text-white px-3 py-2 rounded-md">
                  Translate
                </div>
              </div>
            )}
            {isOpen && (
              <div
                ref={optionsRef}
                className={`origin-top-right absolute ${
                  showAbove ? "bottom-full mb-1" : "top-full mt-1"
                } -right-5 lg:left-[50%] lg:-translate-x-[50%] w-40 rounded-md shadow-lg bg-gray-1 ring-1 ring-black ring-opacity-5 focus:outline-none`}
              >
                {formattedOptions.length > 0 ? <div className="py-1" role="none">
                  {formattedOptions.map((option, index) => (
                    <button
                      key={index}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-gray-800"
                      onClick={() => {
                        translate(text, code, option.code, id);
                        setIsOpen(false);
                      }}
                    >
                      {option.name}
                    </button>
                  ))}
                </div> : <p className="px-3 py-2 text-xs">All languages have been translated</p>}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
