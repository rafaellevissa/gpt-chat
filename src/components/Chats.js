import React from "react";
import useThread from "../hooks/use-thread";

function Chats() {
  const { getThreads, setThreadId } = useThread();
  const threads = getThreads();

  return (
    <ul className="list-unstyled mb-0">
      <li className="p-2 border-bottom">
        <a href="#!" className="d-flex justify-content-between">
          <div className="d-flex flex-row">
            <div className="pt-1">
              {threads.map((thread, index) => (
                <p className="fw-bold mb-0" onClick={() => setThreadId(thread)}>
                  Chat {threads.length - index}
                </p>
              ))}
            </div>
          </div>
        </a>
      </li>
    </ul>
  );
}

export default Chats;
