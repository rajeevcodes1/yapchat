import React, { Fragment, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { VscCheckAll } from "react-icons/vsc";
import { CgChevronDoubleDown } from "react-icons/cg";
import { motion } from "framer-motion";
import {
  SimpleDateAndTime,
  SimpleDateMonthDay,
  SimpleTime,
} from "../../utils/formateDateTime";

const AllMessages = ({ allMessage }) => {
  const chatBox = useRef();
  const adminId = useSelector((store) => store.auth?._id);
  const isTyping = useSelector((store) => store?.condition?.isTyping);
  const [scrollShow, setScrollShow] = useState(true);

  // Scroll to bottom
  const handleScrollDownChat = () => {
    if (chatBox.current) {
      chatBox.current.scrollTo({
        top: chatBox.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  // Scroll button visibility
  useEffect(() => {
    handleScrollDownChat();

    if (chatBox.current.scrollHeight === chatBox.current.clientHeight) {
      setScrollShow(false);
    }

    const handleScroll = () => {
      const currentScrollPos = chatBox.current.scrollTop;
      setScrollShow(
        currentScrollPos + chatBox.current.clientHeight <
          chatBox.current.scrollHeight - 30
      );
    };

    const chatBoxCurrent = chatBox.current;
    chatBoxCurrent.addEventListener("scroll", handleScroll);
    return () => chatBoxCurrent.removeEventListener("scroll", handleScroll);
  }, [allMessage, isTyping]);

  return (
    <>
      {/* Scroll to bottom button */}
      {scrollShow && (
        <div
          className="absolute bottom-16 right-4 cursor-pointer z-20 text-white 
            bg-gradient-to-br from-green-600 to-emerald-700 
            hover:scale-105 hover:shadow-lg transition-all duration-300 p-2 rounded-full shadow-md"
          onClick={handleScrollDownChat}
        >
          <CgChevronDoubleDown title="Scroll Down" fontSize={22} />
        </div>
      )}

      {/* Chat container */}
      <div
        className="flex flex-col w-full px-3 gap-2 py-2 overflow-y-auto scroll-style h-[66vh] bg-[#121212] rounded-md"
        ref={chatBox}
      >
        {allMessage?.map((message, idx) => (
          <Fragment key={message._id}>
            {/* Date separator */}
            <div className="sticky top-0 flex w-full justify-center z-10">
              {new Date(allMessage[idx - 1]?.updatedAt).toDateString() !==
                new Date(message?.updatedAt).toDateString() && (
                <span className="text-xs font-light mb-2 mt-1 text-gray-400 
                  bg-[#1f1f1f]/70 backdrop-blur-sm h-7 w-fit px-5 rounded-md 
                  flex items-center justify-center">
                  {SimpleDateMonthDay(message?.updatedAt)}
                </span>
              )}
            </div>

            {/* Message */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className={`flex items-start gap-1 ${
                message?.sender?._id === adminId
                  ? "flex-row-reverse text-white"
                  : "flex-row text-gray-100"
              }`}
            >
              {/* Sender avatar */}
              {message?.chat?.isGroupChat &&
                message?.sender?._id !== adminId &&
                (allMessage[idx + 1]?.sender?._id !== message?.sender?._id ? (
                  <img
                    src={message?.sender?.image}
                    alt=""
                    className="h-9 w-9 rounded-full object-cover border border-gray-700 shadow-sm"
                  />
                ) : (
                  <div className="h-9 w-9 rounded-full"></div>
                ))}

              {/* Message bubble */}
              <div
                className={`transition-all duration-200 shadow-md hover:scale-[1.02] hover:shadow-black/50 ${
                  message?.sender?._id === adminId
                    ? "bg-gradient-to-tr from-green-600 to-emerald-700 text-white rounded-2xl rounded-br-none"
                    : "bg-gradient-to-tr from-gray-700 to-gray-600 text-gray-100 rounded-2xl rounded-bl-none"
                } py-2 px-3 min-w-[50px] flex flex-col relative max-w-[75%]`}
              >
                {/* Sender name for group chat */}
                {message?.chat?.isGroupChat &&
                  message?.sender?._id !== adminId && (
                    <span className="text-xs font-semibold text-green-400 mb-0.5">
                      {message?.sender?.firstName}
                    </span>
                  )}

                {/* Message text */}
                <div
                  className={`mt-1 pb-1.5 ${
                    message?.sender?._id === adminId ? "pr-16" : "pr-12"
                  }`}
                >
                  <span className="text-sm leading-relaxed break-words">
                    {message?.message}
                  </span>

                  {/* Time + status */}
                  <span
                    className="text-[11px] font-light absolute bottom-1 right-2 flex items-end gap-1.5 text-gray-300"
                    title={SimpleDateAndTime(message?.updatedAt)}
                  >
                    {SimpleTime(message?.updatedAt)}
                    {message?.sender?._id === adminId && (
                      <VscCheckAll color="white" fontSize={14} className="ml-0.5" />
                    )}
                  </span>
                </div>
              </div>
            </motion.div>
          </Fragment>
        ))}

        {/* Typing animation */}
        {isTyping && (
          <div className="flex gap-1 items-center ml-3 mt-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
            <span className="w-2 h-2 bg-green-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
            <span className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></span>
          </div>
        )}
      </div>
    </>
  );
};

export default AllMessages;
