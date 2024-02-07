import api from "./api";

class Thread {
  constructor(threadId) {
    this.id = threadId;
  }

  setId(threadId) {
    this.id = threadId;
  }

  async create() {
    try {
      const response = await api.post("threads");

      if (response.status !== 200) {
        throw response;
      }

      const { id, created_at: createdAt } = response.data;

      this.setId(id);

      return { id, createdAt };
    } catch (e) {
      throw e;
    }
  }

  async getMessages() {
    try {
      const response = await api.get(`threads/${this.id}/messages`);

      if (response.status !== 200) {
        throw response;
      }

      return response.data;
    } catch (e) {
      throw e;
    }
  }

  async sendMessage(text, role = "user") {
    try {
      const messageResponse = await api.post(
        `threads/${this.threadId}/messages`,
        {
          role,
          content: text,
        }
      );

      if (messageResponse.status !== 200) {
        throw new Error(
          `Failed to send message. Response status: ${messageResponse.status}`
        );
      }

      await this.waitForThreadCompletion();

      return messageResponse.data;
    } catch (e) {
      throw e;
    }
  }

  async waitForThreadCompletion() {
    try {
      const { runId } = await this.getThreadRuns();

      while (true) {
        const runStatus = await this.getRunStatus(runId);

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
  }

  async getThreadRuns() {
    try {
      const response = await api.post(`threads/${this.id}/runs`, {
        assistant_id: "asst_xeeLx1YB5GR1xJxmzIhj9oRN",
      });

      if (response.status !== 200) {
        throw response;
      }

      return response.data;
    } catch (e) {
      throw e;
    }
  }

  async getRunStatus(run_id) {
    try {
      const response = await api.post(`threads/${this.id}/runs/${run_id}`, {
        assistant_id: "asst_xeeLx1YB5GR1xJxmzIhj9oRN",
      });

      if (response.status !== 200) {
        throw response;
      }

      return response.data;
    } catch (e) {
      throw e;
    }
  }
}

export default Thread;
