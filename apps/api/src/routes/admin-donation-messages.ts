import { Hono } from "hono";
import {
  findDonationMessageById,
  listDonationMessages,
  softDeleteDonationMessage,
  updateDonationMessageStatus
} from "../db/messages";
import { requireAdmin } from "../middleware/require-admin";
import type { AppBindings } from "../types";
import { notFound, success } from "../utils/http";

export const adminDonationMessagesRoutes = new Hono<AppBindings>();

adminDonationMessagesRoutes.use("*", requireAdmin());

adminDonationMessagesRoutes.get("/", async (c) => {
  const messages = await listDonationMessages(c);
  return success(c, { messages });
});

adminDonationMessagesRoutes.get("/:id", async (c) => {
  const message = await findDonationMessageById(c, c.req.param("id"));
  if (!message) {
    return notFound(c, "Donation message not found");
  }

  return success(c, { message });
});

adminDonationMessagesRoutes.patch("/:id/read", async (c) => {
  const message = await updateDonationMessageStatus(c, c.req.param("id"), "read");
  if (!message) {
    return notFound(c, "Donation message not found");
  }

  return success(c, { message });
});

adminDonationMessagesRoutes.patch("/:id/unread", async (c) => {
  const message = await updateDonationMessageStatus(c, c.req.param("id"), "new");
  if (!message) {
    return notFound(c, "Donation message not found");
  }

  return success(c, { message });
});

adminDonationMessagesRoutes.delete("/:id", async (c) => {
  const deleted = await softDeleteDonationMessage(c, c.req.param("id"));
  if (!deleted) {
    return notFound(c, "Donation message not found");
  }

  return success(c, { deleted: true });
});
