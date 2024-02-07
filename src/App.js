import React, { useEffect, useState } from "react";
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBIcon,
  MDBBtn,
  MDBSpinner,
} from "mdb-react-ui-kit";
import Message from "./components/Message";
import Ask from "./components/Ask";
import useThread from "./hooks/use-thread";
import Chats from "./components/Chats";

export default function App() {
  const { threadId, createThread, getMessages, sendMessage } = useThread();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (threadId) {
      setLoading(true);
      getMessages()
        .then(({ data }) => setMessages(data.reverse()))
        .finally(() => setLoading(false));
    }
  }, [threadId]);

  const handleSubmitMessage = async (message) => {
    setLoading(true);
    await sendMessage(message);
    const { data } = await getMessages();
    setMessages(data.reverse());
    setLoading(false);
  };

  return (
    <MDBContainer
      fluid
      className="py-5"
      style={{ backgroundColor: "rgb(232, 234, 237)", height: "100vh" }}
    >
      <MDBRow>
        <MDBCol md="12">
          <MDBCard id="chat3" style={{ borderRadius: "15px" }}>
            <MDBCardBody>
              <MDBRow>
                <MDBCol md="6" lg="5" xl="4" className="mb-4 mb-md-0">
                  <div className="p-3">
                    <MDBBtn
                      color="primary"
                      className="mb-4"
                      onClick={() => {
                        setLoading(true);
                        createThread().finally(() => setLoading(false));
                      }}
                    >
                      <MDBIcon fas icon="plus" className="me-2" />
                      New Chat
                    </MDBBtn>

                    <Chats />
                  </div>
                </MDBCol>
                <MDBCol md="6" lg="7" xl="8">
                  {messages?.map((msg) => (
                    <Message
                      role={msg.role}
                      content={msg.content}
                      createdAt={new Date(msg.created_at * 1000)}
                    />
                  ))}
                  {loading && (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        width: "100%",
                      }}
                    >
                      <MDBSpinner role="status">
                        <span className="visually-hidden">Loading...</span>
                      </MDBSpinner>
                    </div>
                  )}

                  <Ask onSubmit={handleSubmitMessage} loading={loading} />
                </MDBCol>
              </MDBRow>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
}
