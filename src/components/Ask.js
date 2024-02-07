import { MDBIcon } from "mdb-react-ui-kit";
import { useState } from "react";

const Ask = ({ onSubmit, loading }) => {
  const [message, setMessage] = useState("");

  const canSubmitMessage = () => message.length > 0 && !loading;

  return (
    <div className="text-muted d-flex justify-content-start align-items-center pe-3 pt-3 mt-2">
      <input
        type="text"
        className="form-control form-control-lg"
        placeholder="Type message"
        onChange={({ target: { value } }) => setMessage(value)}
        value={message}
      />
      <a
        className="ms-3"
        href="#!"
        onClick={() => {
          if (canSubmitMessage()) {
            onSubmit(message);
            setMessage("");
          }
        }}
      >
        <MDBIcon
          fas
          icon="paper-plane"
          color={canSubmitMessage() ? "primary" : "secondary"}
        />
      </a>
    </div>
  );
};

export default Ask;
