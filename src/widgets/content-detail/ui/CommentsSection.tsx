"use client";

import { useState } from "react";
import Image from "next/image";
import { Edit2, Loader2, Send, Star, User } from "lucide-react";
import { Stars } from "@/shared/ui/Stars";
import { useComments } from "@/widgets/content-detail/model/useComments";

interface Props {
  contentId: string;
}

function Avatar({ name, avatar }: { name: string; avatar: string | null }) {
  if (avatar) {
    return (
      <Image
        src={avatar}
        alt={name}
        width={40}
        height={40}
        className="size-10 rounded-full object-cover shrink-0"
        unoptimized
      />
    );
  }
  return (
    <div className="size-10 rounded-full bg-gray-700 flex items-center justify-center shrink-0">
      <User className="w-5 h-5 text-gray-400" />
    </div>
  );
}

function RatingStars({
  value,
  onChange,
  hovered,
  setHovered,
}: {
  value: number;
  onChange: (n: number) => void;
  hovered: number;
  setHovered: (n: number) => void;
}) {
  const display = hovered > 0 ? hovered : value;
  return (
    <div className="flex gap-1">
      {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
        <Star
          key={n}
          className={`w-5 h-5 cursor-pointer transition-all hover:scale-110 ${
            n <= display ? "fill-yellow-500 text-yellow-500" : "text-gray-600 hover:text-yellow-500"
          }`}
          onClick={() => onChange(n)}
          onMouseEnter={() => setHovered(n)}
          onMouseLeave={() => setHovered(0)}
        />
      ))}
    </div>
  );
}

export function CommentsSection({ contentId }: Props) {
  const {
    comments,
    loading,
    profile,
    myComment,
    rating, setRating,
    message, setMessage,
    submitting,
    submit,
    editingId,
    editRating, setEditRating,
    editMessage, setEditMessage,
    startEdit,
    cancelEdit,
    saveEdit,
  } = useComments(contentId);

  // Local hover state for stars — separate for write form and edit form
  const [hovered, setHovered] = useState(0);
  const [editHovered, setEditHovered] = useState(0);

  return (
    <section className="px-4 sm:px-8 md:px-12 lg:px-16 py-10 bg-[#0a0a0a]">
      <h2
        className="text-white mb-8 tracking-widest uppercase"
        style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(1.8rem, 4vw, 2.8rem)" }}
      >
        Valoraciones y Comentarios
      </h2>

      {/* Write / Edit own comment */}
      {profile && (
        <div className="mb-10 bg-[#161b22] rounded-xl p-5 border border-white/5">
          <div className="flex items-center gap-3 mb-4">
            <Avatar name={profile.name} avatar={profile.avatar ?? null} />
            <div>
              <p className="font-semibold text-white">{profile.name}</p>
              {myComment && editingId === null && (
                <button
                  onClick={() => startEdit(myComment)}
                  className="flex items-center gap-1 text-xs text-gray-400 hover:text-white transition-colors mt-0.5"
                >
                  <Edit2 className="w-3 h-3" />
                  Editar comentario
                </button>
              )}
            </div>
          </div>

          {editingId !== null ? (
            /* ── Edit form ── */
            <div className="space-y-3">
              <p className="text-sm text-gray-400">Tu valoración:</p>
              <RatingStars
                value={editRating}
                onChange={setEditRating}
                hovered={editHovered}
                setHovered={setEditHovered}
              />
              <textarea
                value={editMessage}
                onChange={(e) => setEditMessage(e.target.value)}
                rows={4}
                maxLength={1000}
                disabled={submitting}
                className="w-full bg-[#0d1117] border border-white/10 rounded-lg px-4 py-3 text-white placeholder-slate-500 resize-none focus:outline-none focus:ring-2 focus:ring-red-500/40 transition disabled:opacity-50 text-sm"
              />
              <div className="flex gap-2 justify-end">
                <button
                  onClick={cancelEdit}
                  disabled={submitting}
                  className="px-4 py-2 text-sm rounded border border-white/10 hover:bg-white/5 transition-colors disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => void saveEdit()}
                  disabled={editRating === 0 || editMessage.trim().length === 0 || submitting}
                  className="flex items-center gap-2 px-5 py-2 text-sm rounded bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  Guardar
                </button>
              </div>
            </div>
          ) : myComment ? (
            /* ── Own existing comment (read mode) ── */
            <div className="space-y-2">
              <Stars rating={myComment.rating} />
              <p className="text-gray-300 text-sm leading-relaxed">{myComment.message}</p>
            </div>
          ) : (
            /* ── New comment form ── */
            <div className="space-y-3">
              <p className="text-sm text-gray-400">Tu valoración:</p>
              <RatingStars
                value={rating}
                onChange={setRating}
                hovered={hovered}
                setHovered={setHovered}
              />
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Escribe tu comentario..."
                rows={4}
                maxLength={1000}
                disabled={submitting}
                className="w-full bg-[#0d1117] border border-white/10 rounded-lg px-4 py-3 text-white placeholder-slate-500 resize-none focus:outline-none focus:ring-2 focus:ring-red-500/40 transition disabled:opacity-50 text-sm"
              />
              <button
                onClick={() => void submit()}
                disabled={rating === 0 || message.trim().length === 0 || submitting}
                className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed rounded transition-colors font-semibold"
              >
                {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                Publicar
              </button>
            </div>
          )}
        </div>
      )}

      {/* Comments list */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : comments.length === 0 ? (
        <p className="text-gray-500 text-center py-12">
          Sé el primero en comentar este contenido.
        </p>
      ) : (
        <div className="space-y-4">
          {comments
            .filter((c) => !profile || String(c.profileId) !== String(profile.id))
            .map((comment) => (
              <div
                key={comment.id}
                className="bg-[#161b22] rounded-xl p-5 border border-white/5 space-y-3"
              >
                <div className="flex items-center gap-3">
                  <Avatar name={comment.profileName} avatar={comment.profileAvatar} />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-white truncate">{comment.profileName}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(comment.commentedAt).toLocaleDateString("es-ES", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
                <Stars rating={comment.rating} />
                <p className="text-gray-300 text-sm leading-relaxed">{comment.message}</p>
              </div>
            ))}
        </div>
      )}
    </section>
  );
}
