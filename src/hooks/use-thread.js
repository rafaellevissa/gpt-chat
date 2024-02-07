import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import api from "../services/api";

const ThreadContext = createContext();

export const useThread = () => useContext(ThreadContext);

function thread() {
  const [threadId, setThreadId] = useState();

  const loadThreads = useCallback(async () => {
    const threads = getThreads();

    if (!threads.at(0) && !threadId) {
      await createThread();
    } else {
      setThreadId(threads[0]);
    }
  }, []);

  useEffect(() => {
    loadThreads();
  }, [loadThreads]);

  const getThreads = () => {
    const threadsString = localStorage.getItem("chatgpt@threads");

    if (!threadsString) {
      return [];
    }

    return JSON.parse(threadsString);
  };

  const setThread = (thread) => {
    const threads = getThreads();

    threads.unshift(thread);

    localStorage.setItem("chatgpt@threads", JSON.stringify(threads));
  };

  const createThread = async () => {
    try {
      const response = await api.post("threads");

      if (response.status !== 200) {
        throw new Error(
          `Failed to create thread. Response status: ${response.status}`
        );
      }

      const { id } = response.data;
      setThreadId(id);
      setThread(id);

      return id;
    } catch (error) {
      throw new Error(`Error creating thread: ${error.message}`);
    }
  };

  const getMessages = async () => {
    try {
      if (!threadId) {
        throw new Error("Thread ID is not set.");
      }

      const response = await api.get(`threads/${threadId}/messages`);

      if (response.status !== 200) {
        throw new Error(
          `Failed to get messages. Response status: ${response.status}`
        );
      }

      return response.data;
    } catch (error) {
      throw new Error(`Error getting messages: ${error.message}`);
    }
  };

  const sendMessage = async (text, role = "user") => {
    try {
      if (!threadId) {
        throw new Error("Thread ID is not set.");
      }

      const messageResponse = await api.post(`threads/${threadId}/messages`, {
        role,
        content: text,
      });

      if (messageResponse.status !== 200) {
        throw new Error(
          `Failed to send message. Response status: ${messageResponse.status}`
        );
      }

      await waitForThreadCompletion();

      return messageResponse.data;
    } catch (error) {
      throw new Error(`Error sending message: ${error.message}`);
    }
  };

  const waitForThreadCompletion = async () => {
    try {
      if (!threadId) {
        throw new Error("Thread ID is not set.");
      }

      const { id: runId } = await getThreadRuns();

      while (true) {
        const runStatus = await getRunStatus(runId);

        if (["queued", "in_progress"].includes(runStatus.status)) {
          await new Promise((resolve) => setTimeout(resolve, 3000));
          continue;
        }

        if (runStatus.status === "completed") {
          return { runId };
        }

        throw new Error(`Unexpected run status: ${runStatus.status}`);
      }
    } catch (error) {
      throw new Error(`Error waiting for thread completion: ${error.message}`);
    }
  };

  const getThreadRuns = async () => {
    try {
      if (!threadId) {
        throw new Error("Thread ID is not set.");
      }

      const response = await api.post(`threads/${threadId}/runs`, {
        assistant_id: "asst_xeeLx1YB5GR1xJxmzIhj9oRN",
      });

      if (response.status !== 200) {
        throw new Error(
          `Failed to get thread runs. Response status: ${response.status}`
        );
      }

      return response.data;
    } catch (error) {
      throw new Error(`Error getting thread runs: ${error.message}`);
    }
  };

  const getRunStatus = async (runId) => {
    try {
      if (!threadId) {
        throw new Error("Thread ID is not set.");
      }

      const response = await api.get(`threads/${threadId}/runs/${runId}`);

      if (response.status !== 200) {
        throw new Error(
          `Failed to get run status. Response status: ${response.status}`
        );
      }

      return response.data;
    } catch (error) {
      throw new Error(`Error getting run status: ${error.message}`);
    }
  };

  return {
    threadId,
    setThreadId,
    createThread,
    getMessages,
    sendMessage,
    setThread,
    getThreads,
  };
}

export const ThreadProvider = ({ children }) => {
  const threadMethods = thread();
  return (
    <ThreadContext.Provider value={threadMethods}>
      {children}
    </ThreadContext.Provider>
  );
};

export default useThread;
