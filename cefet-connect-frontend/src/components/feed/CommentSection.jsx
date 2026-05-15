import { useEffect, useState } from "react";
import CommentItem from "./CommentItem";
import {
  createComment,
  listPostComments,
} from "../../services/commentService";

export default function CommentSection({ postId, currentUser }) {
  const [comments, setComments] = useState([]);
  const [texto, setTexto] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");

  async function loadComments() {
    try {
      setIsLoading(true);
      setError("");

      const response = await listPostComments(postId);
      const dados = response?.dados || response;

      setComments(Array.isArray(dados) ? dados : []);
    } catch (error) {
      setError(error.message || "Não foi possível carregar os comentários.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadComments();
  }, [postId]);

  async function handleSubmit(event) {
    event.preventDefault();

    if (!texto.trim()) {
      setError("Digite um comentário antes de enviar.");
      return;
    }

    try {
      setIsSending(true);
      setError("");

      const response = await createComment(postId, texto.trim());
      const novoComentario = response?.dados || response;

      setComments((prev) => [...prev, novoComentario]);
      setTexto("");
    } catch (error) {
      setError(error.message || "Não foi possível comentar.");
    } finally {
      setIsSending(false);
    }
  }

  function handleDeleted(idComentario) {
    setComments((prev) =>
      prev.filter((comment) => comment.idComentario !== idComentario)
    );
  }

  return (
    <section className="mt-5 border-t border-[#eeeeee] pt-4">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={texto}
          onChange={(event) => {
            setTexto(event.target.value);
            setError("");
          }}
          maxLength={255}
          placeholder="Escreva um comentário..."
          className="h-10 flex-1 rounded-full border border-[#d9d9d9] bg-[#f7f7f7] px-4 text-sm outline-none focus:border-[#089464]"
        />

        <button
          type="submit"
          disabled={isSending}
          className="h-10 rounded-full bg-[#089464] px-5 text-sm font-semibold text-white disabled:opacity-60"
        >
          {isSending ? "Enviando..." : "Comentar"}
        </button>
      </form>

      {error && <p className="mt-3 text-sm text-red-500">{error}</p>}

      {isLoading ? (
        <p className="mt-4 text-sm text-[#777]">Carregando comentários...</p>
      ) : (
        <div className="mt-4 space-y-3">
          {comments.map((comment) => (
            <CommentItem
              key={comment.idComentario}
              comment={comment}
              currentUser={currentUser}
              onDeleted={handleDeleted}
            />
          ))}

          {comments.length === 0 && (
            <p className="text-sm text-[#777]">
              Seja a primeira pessoa a comentar.
            </p>
          )}
        </div>
      )}
    </section>
  );
}