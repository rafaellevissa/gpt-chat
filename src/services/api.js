import axios from "axios";

const openAIUrl = "https://api.openai.com/v1/";

const openAIToken = process.env.REACT_APP_OPEN_AI_TOKEN;

const api = axios.create({
  baseURL: openAIUrl,
  headers: {
    "OpenAI-Beta": "assistants=v1",
    Authorization: "Bearer " + openAIToken,
  },
});

export default api;
