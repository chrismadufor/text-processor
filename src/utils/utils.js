import { options } from "@/data/data";

export const getLanguageFromCode = (code) => {
  let result = options.filter((item) => item.code === code);
  return result[0].name || code;
};

export const scrollToBottom = () => {
  const scrollHeight = Math.max(
    document.body.scrollHeight,
    document.documentElement.scrollHeight,
    document.body.offsetHeight,
    document.documentElement.offsetHeight,
    document.body.clientHeight,
    document.documentElement.clientHeight
  );

  window.scrollTo({
    top: scrollHeight,
    behavior: "smooth",
  });
};
