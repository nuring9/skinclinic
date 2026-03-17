import { useEffect, useRef, useState } from "react";
import { getChatbotWelcome, sendChatbotMessage } from "@/api/chatbotApi";
import "./chatbot.css";

export default function ChatbotPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [initialized, setInitialized] = useState(false);
  const [showOptions, setShowOptions] = useState(true);

  const messageListRef = useRef(null);

  useEffect(() => {
    if (!isOpen || initialized) return;

    const init = async () => {
      try {
        setLoading(true);
        setErrorMessage("");

        const data = await getChatbotWelcome();

        setMessages([
          {
            role: "bot",
            title: data.answerTitle,
            text: data.answerBody,
            handoff: data.handoffRecommended,
            aiEnhanced: data.aiEnhanced,
          },
        ]);
        setOptions(data.suggestedOptions || []);
        setShowOptions(true);
        setInitialized(true);
      } catch (error) {
        console.error(error);
        setErrorMessage("챗봇 상담 정보를 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [isOpen, initialized]);

  useEffect(() => {
    if (!isOpen) return;

    const timer = setTimeout(() => {
      if (messageListRef.current) {
        messageListRef.current.scrollTo({
          top: messageListRef.current.scrollHeight,
          behavior: "smooth",
        });
      }
    }, 80);

    return () => clearTimeout(timer);
  }, [messages, isOpen]);

  const handleClick = async (option) => {
    try {
      setSending(true);
      setErrorMessage("");
      setShowOptions(false);

      setMessages((prev) => [...prev, { role: "user", text: option.label }]);

      const data = await sendChatbotMessage(option.code);

      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          title: data.answerTitle,
          text: data.answerBody,
          handoff: data.handoffRecommended,
          aiEnhanced: data.aiEnhanced,
        },
      ]);

      setOptions(data.suggestedOptions || []);
      setShowOptions(true);
    } catch (error) {
      console.error(error);
      setErrorMessage("상담 응답을 불러오지 못했습니다.");
      setShowOptions(true);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="chatbot-floating-wrap">
      {isOpen && (
        <div className="chatbot-panel">
          <div className="chatbot-header">
            <div>
              <p className="chatbot-header__label">SKIN CHATBOT</p>
              <h2>챗봇 상담</h2>
            </div>
            <button
              type="button"
              className="chatbot-close-btn"
              onClick={() => setIsOpen(false)}
            >
              ×
            </button>
          </div>

          <div className="chatbot-body">
            {loading ? (
              <div className="chatbot-empty-state">
                챗봇 상담을 불러오는 중입니다.
              </div>
            ) : (
              <>
                <div className="chatbot-message-list" ref={messageListRef}>
                  {messages.map((msg, idx) => (
                    <div key={idx} className={`chatbot-bubble ${msg.role}`}>
                      {msg.title ? (
                        <div className="chatbot-bubble__top">
                          <strong>{msg.title}</strong>
                          {msg.role === "bot" ? (
                            <span>{msg.aiEnhanced ? "Gemini" : "Basic"}</span>
                          ) : null}
                        </div>
                      ) : null}

                      <p>{msg.text}</p>

                      {msg.handoff ? (
                        <div className="chatbot-handoff-box">
                          더 자세한 문의는 관리자 1:1 상담으로 연결해주세요.
                        </div>
                      ) : null}
                    </div>
                  ))}
                </div>

                {errorMessage ? (
                  <p className="chatbot-error">{errorMessage}</p>
                ) : null}

                {showOptions && options.length > 0 ? (
                  <div className="chatbot-option-list">
                    {options.map((option) => (
                      <button
                        key={option.code}
                        type="button"
                        className="chatbot-option-button"
                        onClick={() => handleClick(option)}
                        disabled={sending}
                      >
                        <strong>{option.label}</strong>
                        <span>{option.description}</span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="chatbot-option-collapsed">
                    {sending
                      ? "답변을 불러오는 중입니다..."
                      : "선택지가 접혀 있습니다."}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}

      <button
        type="button"
        className="chatbot-floating-btn"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        챗봇 상담
      </button>
    </div>
  );
}
