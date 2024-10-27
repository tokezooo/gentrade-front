"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { Message } from "ai";
import axios from "axios";

export async function addUser() {
  const { userId } = auth();

  if (userId) {
    const user = await currentUser();
    const response = await axios.post(`${process.env.GENTRADE_API_URL}/users`, {
      clerk_id: userId,
      name: user?.firstName,
    });

    if (response.status !== 200 && response.status !== 201) {
      throw new Error("Failed to add user");
    }

    return response.data;
  }
}
