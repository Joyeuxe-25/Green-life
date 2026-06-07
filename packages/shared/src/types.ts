import type {
  CONTENT_MODULES,
  EVENT_STATUSES,
  MEDIA_ENTITY_TYPES,
  MESSAGE_STATUSES,
  PROJECT_STATUSES,
  PUBLICATION_STATUSES,
  VISIBILITY_STATUSES
} from "./constants";

export type ContentModule = (typeof CONTENT_MODULES)[number];

export type MediaEntityType = (typeof MEDIA_ENTITY_TYPES)[number];

export type PublicationStatus = (typeof PUBLICATION_STATUSES)[number];

export type MessageStatus = (typeof MESSAGE_STATUSES)[number];

export type ProjectStatus = (typeof PROJECT_STATUSES)[number];

export type EventStatus = (typeof EVENT_STATUSES)[number];

export type VisibilityStatus = (typeof VISIBILITY_STATUSES)[number];

export type BaseEntity = {
  id: string;
  createdAt: string;
  updatedAt: string;
};

export type MediaFile = BaseEntity & {
  entityType: MediaEntityType;
  entityId: string;
  fileType: "image" | "video" | "logo" | "document";
  r2Key: string;
  fileUrl: string;
  altText?: string;
  caption?: string;
  isCover: boolean;
  sortOrder: number;
};

export type NewsItem = BaseEntity & {
  title: string;
  slug: string;
  status: PublicationStatus;
};

export type EventItem = BaseEntity & {
  title: string;
  slug: string;
  status: PublicationStatus;
};

export type ProjectItem = BaseEntity & {
  title: string;
  slug: string;
  status: PublicationStatus;
};

export type StaffMember = BaseEntity & {
  name: string;
  role: string;
  isActive: boolean;
};

export type Partner = BaseEntity & {
  name: string;
  slug: string;
  isActive: boolean;
};

export type ContactMessage = BaseEntity & {
  name: string;
  email: string;
  status: MessageStatus;
};

export type DonationMessage = BaseEntity & {
  name: string;
  email: string;
  status: MessageStatus;
};
