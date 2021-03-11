import axios from "axios";

export const get = async (url, config) => {
  const result = await axios.get(url, config);
  return result.data;
}

export const put = async (url, config) => {
  const result = await axios.put(url, config);
  return result.data;
}