import { useEffect, useRef, useState } from "react";
import { IoSend } from "react-icons/io5";
import { IoMdClose } from "react-icons/io";
import { Button } from "flowbite-react";
import { BsReplyFill } from "react-icons/bs";
import classNames from "classnames";
import PageHeader from "../fragments/PageHeader";
import { mainButton } from "../context/CustomThemes";
function SampleConversation() {
  const [conversation, setConversation] = useState(null);
  const [replyToMessage, setReplyMessage] = useState(null);
  const [highlightedMessage, highlightMessage] = useState(null);
  const textInput = useRef();
  const convoRef = useRef();
  const onSend = () => {
    if (textInput.current) {
      const message = textInput.current.innerHTML;

      if (message) {
        const newMessage = {
          message: message,
          replyTo: replyToMessage ? replyToMessage.message : "",
        };
        setConversation((messages) => {
          if (messages) {
            return [...messages, newMessage];
          } else {
            return [newMessage];
          }
        });
        convoRef.current.scrollTop = convoRef.current.scrollHeight;
        setReplyMessage(null);
        textInput.current.innerText = "";
      }
    }
  };
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Prevent the default behavior (e.g., new line)
      onSend(); // Replace this with your submit logic
    }
  };

  useEffect(() => {
    if (highlightedMessage) {
      setTimeout(() => {
        highlightMessage(null);
      }, 2000);
    }
  }, [highlightedMessage]);

  useEffect(() => {
    if (convoRef.current) {
      convoRef.current.scrollTop = convoRef.current.scrollHeight;
    }
  }, [conversation]);
  return (
    <>
      <PageHeader name="Sample Conversation Container" />
      <div className="border-t-2 flex flex-col gap-2 bg-slate-200">
        <div
          className="flex flex-col gap-2 p-2 pb-0 overflow-y-auto max-h-[500px] scrollbar-thin scrollbar-thumb-rounded-full scrollbar-thumb-slate-600"
          ref={convoRef}
        >
          {conversation ? (
            conversation.map((msg, index) => {
              const message = conversation.find(
                (message) => msg.replyTo === message.message
              );
              return (
                <div
                  key={index}
                  className="relative group flex items-center gap-4 "
                >
                  <div className="flex flex-col">
                    {msg.replyTo && (
                      <div
                        id={"reply_" + conversation.indexOf(message)}
                        dangerouslySetInnerHTML={{ __html: msg.replyTo }}
                        className={classNames(
                          "relative bg-main-100 p-2 w-fit rounded-t rounded-br text-xs text-main-500 max-h-[5rem] overflow-hidden cursor-pointer",
                          msg.replyTo.length > 150 &&
                            "before:absolute before:content-[''] before:bottom-0 before:left-0 before:h-1/3 before:w-full before:bg-gradient-to-t before:from-main-300 before:to-transparent"
                        )}
                        onClick={(e) => {
                          if (message) {
                            highlightMessage(message);
                            const mainMessage = document.querySelector(
                              `#message_${e.target.id.split("_")[1]}`
                            );
                            if (mainMessage) {
                              mainMessage.scrollIntoView();
                            }
                          }
                        }}
                      ></div>
                    )}
                    <div
                      id={"message_" + index}
                      dangerouslySetInnerHTML={{ __html: msg.message }}
                      className={classNames(
                        "p-1 px-2  w-fit rounded-t rounded-br border-2 transition-all duration-100",
                        msg.replyTo && "-translate-y-1",
                        highlightedMessage === msg
                          ? " bg-secondary border-secondary animate-pulse"
                          : "bg-secondary-300"
                      )}
                      onClick={() => {
                        setReplyMessage(msg);
                        textInput.current.focus();
                      }}
                    ></div>
                  </div>
                  <div
                    className={classNames(
                      "flex items-center text-main-500 opacity-0 pointer-events-none transition-all group-hover:opacity-100 group-hover:pointer-events-auto",
                      msg.replyTo && "translate-y-2"
                    )}
                  >
                    <button
                      onClick={() => {
                        setReplyMessage(msg);
                        textInput.current.focus();
                      }}
                    >
                      <BsReplyFill className="text-lg" />
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="font-semibold text-main-300 p-2 text-center">
              No messages yet!
            </p>
          )}
        </div>
        <div className="flex items-center gap-4 p-2">
          <div className="w-full rounded-md overflow-hidden">
            {replyToMessage && (
              <div
                className={classNames(
                  "flex items-center justify-between bg-slate-300 p-1 px-2",
                  replyToMessage.replyTo.length > 150 &&
                    "before:absolute before:content-[''] before:bottom-0 before:left-0 before:h-1/3 before:w-full before:bg-gradient-to-t before:from-main-300 before:to-transparent"
                )}
              >
                <div
                  dangerouslySetInnerHTML={{ __html: replyToMessage.message }}
                ></div>
                <button onClick={() => setReplyMessage(null)}>
                  <IoMdClose />
                </button>
              </div>
            )}
            <div
              contentEditable
              onKeyDown={handleKeyPress}
              className="min-h-6 bg-slate-50 outline-none p-1 px-1.5 selection:bg-secondary-100 selection:text-main-300"
              ref={textInput}
            ></div>
          </div>
          <Button theme={mainButton} color="light" onClick={onSend}>
            <IoSend />
          </Button>
        </div>
      </div>
    </>
  );
}

export default SampleConversation;
