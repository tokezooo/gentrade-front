"use server";

import axios, { AxiosInstance } from "axios";
import { auth } from "@clerk/nextjs/server";

export const getInstance = async (): Promise<AxiosInstance> => {
  const { getToken } = await auth();
  const token = await getToken();

  return axios.create({
    baseURL: process.env.GENTRADE_API_URL,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};
