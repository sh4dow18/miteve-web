"use client";

import { useCallback, useEffect, useState } from "react";
import { API_HOST_IP } from "@/shared/config/env";
import { getMainProfile, getToken } from "@/shared/lib/auth";

export interface CommentResponse {
  id: number;
  message: string;
  rating: number;
  profileId: number;
  profileName: string;
  profileAvatar: string | null;
  commentedAt: string;
}

export function useComments(contentId: string) {
  const [comments, setComments] = useState<CommentResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editRating, setEditRating] = useState(0);
  const [editMessage, setEditMessage] = useState("");

  const profile = typeof window !== "undefined" ? getMainProfile() : null;

  const loadComments = useCallback(async () => {
    setLoading(true);
    try {
      const token = getToken();
      const res = await fetch(`${API_HOST_IP}/comments/content/${contentId}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.ok) setComments((await res.json()) as CommentResponse[]);
    } finally {
      setLoading(false);
    }
  }, [contentId]);

  useEffect(() => {
    void loadComments();
  }, [loadComments]);

  const myComment = profile
    ? comments.find((c) => String(c.profileId) === String(profile.id))
    : null;

  async function submit() {
    if (!profile || rating === 0 || message.trim().length === 0 || submitting) return;
    const token = getToken();
    if (!token) return;

    setSubmitting(true);
    try {
      const res = await fetch(`${API_HOST_IP}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          profileId: Number(profile.id),
          contentId,
          message: message.trim(),
          rating,
        }),
      });
      if (res.ok) {
        setMessage("");
        setRating(0);
        await loadComments();
      }
    } finally {
      setSubmitting(false);
    }
  }

  function startEdit(comment: CommentResponse) {
    setEditingId(comment.id);
    setEditRating(comment.rating);
    setEditMessage(comment.message);
  }

  function cancelEdit() {
    setEditingId(null);
  }

  async function saveEdit() {
    if (editingId === null || editRating === 0 || editMessage.trim().length === 0 || submitting) return;
    const token = getToken();
    if (!token) return;

    setSubmitting(true);
    try {
      const res = await fetch(`${API_HOST_IP}/comments/${editingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message: editMessage.trim(), rating: editRating }),
      });
      if (res.ok) {
        setEditingId(null);
        await loadComments();
      }
    } finally {
      setSubmitting(false);
    }
  }

  return {
    comments,
    loading,
    profile,
    myComment,
    rating,
    setRating,
    message,
    setMessage,
    submitting,
    submit,
    editingId,
    editRating,
    setEditRating,
    editMessage,
    setEditMessage,
    startEdit,
    cancelEdit,
    saveEdit,
  };
}
