import { Timestamp } from 'firebase/firestore'

export type MessageStatus = 'scheduled' | 'sent'

export type User = {
  uid: string
  email: string | null
  displayName: string | null
}

export type Connection = {
  id: string
  userId: string
  name: string
  createdAt: Timestamp
}

export type Contact = {
  id: string
  userId: string
  connectionId: string
  name: string
  phone: string
  createdAt: Timestamp
}

export type Message = {
  id: string
  userId: string
  connectionId: string
  contactIds: string[]
  content: string
  status: MessageStatus
  scheduledAt: Timestamp | null
  sentAt: Timestamp | null
  createdAt: Timestamp
}

export type ConnectionFormData = {
  name: string
}

export type ContactFormData = {
  name: string
  phone: string
}

export type MessageFormData = {
  contactIds: string[]
  content: string
  scheduledAt: Date | null
}
