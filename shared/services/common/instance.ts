"use server";

import axios, { AxiosInstance } from "axios";
import { auth } from "@clerk/nextjs/server";

let axiosInstance: AxiosInstance | null = null;

export const getInstance = async (): Promise<AxiosInstance> => {
  if (!axiosInstance) {
    const { getToken } = auth();
    const token = await getToken();

    axiosInstance = axios.create({
      baseURL: process.env.GENTRADE_API_URL,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
  }

  return axiosInstance;
};

export const resetInstance = async (): Promise<void> => {
  axiosInstance = null;
};
