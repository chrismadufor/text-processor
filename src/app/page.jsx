"use client";

import MainTextBox from "@/components/MainTextBox";
import SummaryTextBox from "@/components/SummaryTextBox";
import TranslationTextBox from "@/components/TranslationTextBox";
import { options } from "@/data/data";
import ArrowUp from "@/icons/ArrowUp";
import { getLanguageFromCode, scrollToBottom } from "@/utils/utils";
import { faRobot, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";

export default function Home() {
  const [toast, setToast] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [translationLoading, setTranslationLoading] = useState(false);

  const initialObj = {
    id: 1,
    text: "",
    summary: "",
    translation: [],
    detected_language: "",
  };

  const [pageData, setPageData] = useState([]);
  const [userText, setUserText] = useState("");

  const onChangeText = (value) => {
    setUserText(value);
  };

  const keyDown = (val) => {
    if (val === "Enter") addText();
  };

  const addText = async () => {
    let data = { ...initialObj };
    data.text = userText;
    data.id = pageData.length + 1;

    // detected language check
    data.detected_language = await detectLang(userText);
    setPageData([...pageData, data]);
    setUserText("");
  };

  const detectLang = async (str) => {
    if ("ai" in self && "languageDetector" in self.ai) {
      const detector = await self.ai.languageDetector.create();
      try {
        const results = await detector.detect(str);
        let lang = results[0].detectedLanguage;
        let result = options.filter((item) => item.code === lang);
        return result[0]?.name || lang;
      } catch (err) {
        setToast("error");
        setToastMessage(err);
      }
    } else {
      setToast("error");
      setToastMessage("Language Detector API not supported.");
    }
  };

  const translateText = async (text, current, target, id) => {
    if ("ai" in self && "translator" in self.ai) {
      const translator = await self.ai.translator.create({
        sourceLanguage: current,
        targetLanguage: target,
      });
      try {
        setTranslationLoading(true);
        let result = await translator.translate(text);
        let translatedData = {
          text: result,
          language: getLanguageFromCode(target),
        };
        let temp = [...pageData];
        let selectedTextData = temp.filter((item) => item.id === id);
        selectedTextData = selectedTextData[0];
        selectedTextData.translation.push(translatedData);
        temp[id - 1] = selectedTextData;

        setPageData(temp);
      } catch (err) {
        setToast("error");
        setToastMessage(err);
      } finally {
        setTranslationLoading(false);
      }
    } else {
      setToast("error");
      setToastMessage("Translator API not supported.");
    }
  };

  const summarizeText = async (text, id) => {
    if ("ai" in self && "summarizer" in self.ai) {
      try {
        setSummaryLoading(true);
        const summarizer = await self.ai.summarizer.create({
          task: "summarization",
          format: "plain-text",
          length: "short",
        });

        const result = await summarizer.summarize(text);
        let temp = [...pageData];
        let selectedTextData = temp.filter((item) => item.id === id);
        selectedTextData = selectedTextData[0];
        selectedTextData.summary = result;
        temp[id - 1] = selectedTextData;
        setPageData(temp);
      } catch (err) {
        setToast("error");
        setToastMessage(err);
      } finally {
        setSummaryLoading(false);
      }
    } else {
      setToast("error");
      setToastMessage("Summarizer API not supported.");
    }
  };

  const checkAIEnabled = async () => {
    if ("ai" in self) {
    } else {
      setToast("error");
      setToastMessage("Chrome AI is not supported on this browser!");
    }
  };

  // language detection API check
  useEffect(() => {
    checkAIEnabled();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [pageData]);

  useEffect(() => {
    if (toast) {
      setTimeout(() => {
        setToast(null);
        setToastMessage("");
      }, 3500);
    }
  }, [toast]);

  return (
    <main className="relative min-h-screen">
      {/* header */}
      <div className="fixed h-14 w-full flex items-center gap-2 bg-background px-[5%]">
        <FontAwesomeIcon icon={faRobot} className="h-6" />
        <p className="text-lg font-semibold">Summary.ai</p>
      </div>
      {/* prelim textbox like chat-gpt */}
      <div></div>
      <div>
        {/* main area */}
        <section className="pt-16 pb-[180px] px-[5%]">
          <div className="w-full max-w-3xl mx-auto">
            {pageData.map((item, index) => (
              <div className="flex flex-col gap-6 md:mb-7" key={index}>
                {/* main text */}
                <MainTextBox
                  id={item.id}
                  translations={item.translation}
                  translate={translateText}
                  translationLoading={translationLoading}
                  summarize={summarizeText}
                  summaryLoading={summaryLoading}
                  text={item.text}
                  lang={item.detected_language}
                />
                {/* summary */}
                {item.summary && <SummaryTextBox text={item.summary} />}
                {/* translations */}
                {item.translation.map((item, index) => (
                  <div key={index}>
                    <TranslationTextBox text={item.text} lang={item.language} />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </section>
        {/* text box */}
        <section className="pt-3 fixed bg-background bottom-0 left-0 w-full h-[160px] px-[5%]">
          <div className="relative rounded-3xl bg-gray-1 border border-gray-3 w-full max-w-3xl mx-auto py-5 pl-5 pr-12">
            <textarea
              name="textbox"
              value={userText}
              onChange={(e) => onChangeText(e.target.value)}
              onKeyDown={(e) => keyDown(e.code)}
              id="textbox"
              className="bg-gray-1 w-full min-h-[80px] focus:outline-none"
              placeholder="Enter text"
            ></textarea>
            {userText && (
              <div
                onClick={addText}
                className="cursor-pointer absolute bottom-2 right-2 w-9 h-9 rounded-full bg-white flex items-center justify-center"
              >
                <ArrowUp />
              </div>
            )}
          </div>
        </section>
      </div>
      {/* toast */}
      <div>
        {toast && (
          <div
            id="toast-top-right"
            className={`fixed flex items-center min-w-[250px] max-w-xs py-3 px-4 space-x-4 text-white divide-x rtl:divide-x-reverse divide-gray-200 rounded-sm shadow top-5 right-5 ${
              toast === "success" ? "bg-green-600 text-white" : "bg-red-500"
            }`}
            role="alert"
          >
            <div className="flex w-full justify-between gap-3">
              <p className="text-sm font-medium">{toastMessage}</p>
              <div
                className="link_el cursor-pointer"
                onClick={() => setToast(null)}
              >
                <FontAwesomeIcon icon={faTimes} size="sm" />
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
