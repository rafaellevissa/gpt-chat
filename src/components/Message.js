import ReactMarkdown from "react-markdown";

const Assistent = ({ text, createdAt }) => (
  <div className="d-flex flex-row justify-content-start">
    <div>
      <p
        className="small p-2 ms-3 mb-1 rounded-3"
        style={{ backgroundColor: "#f5f6f7" }}
      >
        <ReactMarkdown>{text}</ReactMarkdown>
      </p>
      <p className="small ms-3 mb-3 rounded-3 text-muted float-end">
        {createdAt.toLocaleString("pt-BR", {
          dateStyle: "full",
          timeStyle: "short",
        })}
      </p>
    </div>
  </div>
);

const User = ({ text, createdAt }) => (
  <div className="d-flex flex-row justify-content-end">
    <div>
      <p className="small p-2 me-3 mb-1 text-white rounded-3 bg-primary">
        <ReactMarkdown>{text}</ReactMarkdown>
      </p>
      <p className="small me-3 mb-3 rounded-3 text-muted">
        {createdAt.toLocaleString("pt-BR", {
          dateStyle: "full",
          timeStyle: "short",
        })}
      </p>
    </div>
  </div>
);

const Message = ({ role, content, createdAt }) => {
  const { text } = content.find((item) => item.type === "text");

  if (role === "assistant") {
    return <Assistent text={text.value} createdAt={createdAt} />;
  }

  return <User text={text.value} createdAt={createdAt} />;
};

export default Message;
