import { Client, Account, Databases } from "appwrite";

const client = new Client();
client
  .setEndpoint("https://cloud.appwrite.io/v1") // Appwrite Cloud endpoint
  .setProject("neas"); // Replace with your Appwrite project ID

export const account = new Account(client);
export const databases = new Databases(client);