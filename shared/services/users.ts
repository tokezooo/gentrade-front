"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { ApiEndpoints } from "./common/constants";
import { getInstance } from "./common/instance";
import { User } from "./types/user";

/**
 * Creates a new user in the database using Clerk user info.
 * Supposed to be called on every page load.
 * TODO: Refactor with using clerk auth hook.
 *
 * @returns The created user ID on null if the user already exists.
 */
export const createUser = async (): Promise<User | null> => {
  const { userId } = auth();
  if (userId) {
    const user = await currentUser();
    const axiosInstance = await getInstance();
    const response = await axiosInstance.post(ApiEndpoints.USERS, {
      clerk_id: userId,
      name: user?.firstName,
      email: user?.emailAddresses[0].emailAddress,
    });
    return response.data;
  }
  return null;
};
