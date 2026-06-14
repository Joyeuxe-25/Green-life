import { Hono } from "hono";
import {
  findContactMessageById,
  listContactMessages,
  softDeleteContactMessage,
  updateContactMessageStatus
} from "../db/messages";
import { requireAdmin } from "../middleware/require-admin";
import type { AppBindings } from "../types";
import { notFound, success } from "../utils/http";

export const adminContactMessagesRoutes = new Hono<AppBindings>();

adminContactMessagesRoutes.use("*", requireAdmin());

adminContactMessagesRoutes.get("/", async (c) => {
  const messages = await listContactMessages(c);
  return success(c, { messages });
});

adminContactMessagesRoutes.get("/:id", async (c) => {
  const message = await findContactMessageById(c, c.req.param("id"));
  if (!message) {
    return notFound(c, "Contact message not found");
  }

  return success(c, { message });
});

adminContactMessagesRoutes.patch("/:id/read", async (c) => {
  const message = await updateContactMessageStatus(c, c.req.param("id"), "read");
  if (!message) {
    return notFound(c, "Contact message not found");
  }

  return success(c, { message });
});

adminContactMessagesRoutes.patch("/:id/unread", async (c) => {
  const message = await updateContactMessageStatus(c, c.req.param("id"), "new");
  if (!message) {
    return notFound(c, "Contact message not found");
  }

  return success(c, { message });
});

adminContactMessagesRoutes.delete("/:id", async (c) => {
  const deleted = await softDeleteContactMessage(c, c.req.param("id"));
  if (!deleted) {
    return notFound(c, "Contact message not found");
  }

  return success(c, { deleted: true });
});
