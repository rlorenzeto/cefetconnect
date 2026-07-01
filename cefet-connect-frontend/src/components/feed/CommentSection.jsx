import { useEffect, useState } from "react";
import CommentItem from "./CommentItem";
import {
  createComment,
  listPostComments,
} from "../../services/commentService";

const COMMENTS_PER_PAGE = 5;
const COMMENT_MAX = 255;

export default function CommentSection({
  postId,
  currentUser,
  onCountChange,
  onRankingChanged,
}) {
  const [comments, setComments] = useState([]);
  const [commentsTotal, setCommentsTotal] = useState(0);
  const [previewPagination, setPreviewPagination] = useState(null);

  const [texto, setTexto] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");

  const [isCommentsModalOpen, setIsCommentsModalOpen] = useState(false);
  const [modalComments, setModalComments] = useState([]);
  const [modalPage, setModalPage] = useState(1);
  const [hasMoreModalComments, setHasMoreModalComments] = useState(false);
  const [isLoadingModalComments, setIsLoadingModalComments] = useState(false);

  async function loadPreviewComments() {
    try {
      setIsLoading(true);
      setError("");

      const response = await listPostComments(postId, 1);
      const dados = response?.dados || [];
      const paginacao = response?.paginacao;

      const comentarios = Array.isArray(dados) ? dados : [];

      setComments(comentarios.slice(0, COMMENTS_PER_PAGE));
      setPreviewPagination(paginacao || null);

      const total = Number(paginacao?.total ?? comentarios.length ?? 0);

      setCommentsTotal(total);
      onCountChange?.(total);
    } catch (error) {
      setError(error.message || "Não foi possível carregar os comentários.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadPreviewComments();
  }, [postId]);

  async function loadModalComments(page = 1, replace = false) {
    try {
      setIsLoadingModalComments(true);
      setError("");

      const response = await listPostComments(postId, page);
      const dados = response?.dados || [];
      const paginacao = response?.paginacao;

      const novosComentarios = Array.isArray(dados) ? dados : [];

      setModalComments((prev) => {
        const commentsMap = new Map();

        const base = replace ? novosComentarios : [...prev, ...novosComentarios];

        base.forEach((comment) => {
          if (comment?.idComentario) {
            commentsMap.set(comment.idComentario, comment);
          }
        });

        return Array.from(commentsMap.values());
      });

      setModalPage(page + 1);

      setHasMoreModalComments(
        paginacao
          ? Number(paginacao.pagina) < Number(paginacao.totalPaginas)
          : novosComentarios.length >= COMMENTS_PER_PAGE
      );

      const total = Number(paginacao?.total ?? novosComentarios.length ?? 0);

      setCommentsTotal(total);
      onCountChange?.(total);
    } catch (error) {
      setError(error.message || "Não foi possível carregar mais comentários.");
    } finally {
      setIsLoadingModalComments(false);
    }
  }

  async function handleOpenAllComments() {
    setIsCommentsModalOpen(true);
    setModalComments([]);
    setModalPage(1);
    setHasMoreModalComments(false);

    await loadModalComments(1, true);
  }

  async function handleLoadMoreModalComments() {
    if (isLoadingModalComments || !hasMoreModalComments) return;

    await loadModalComments(modalPage, false);
  }

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

      const comentarioNormalizado = {
        ...novoComentario,
        totalCurtidas: 0,
        jaCurtiu: false,
      };

      setComments((prev) => {
        const next = [comentarioNormalizado, ...prev].slice(0, COMMENTS_PER_PAGE);
        return next;
      });

      setModalComments((prev) => {
        if (!isCommentsModalOpen) return prev;

        const exists = prev.some(
          (comment) => comment.idComentario === comentarioNormalizado.idComentario
        );

        if (exists) return prev;

        return [comentarioNormalizado, ...prev];
      });

      setCommentsTotal((prev) => {
        const next = prev + 1;
        onCountChange?.(next);
        return next;
      });

      setPreviewPagination((prev) =>
        prev
          ? {
              ...prev,
              total: Number(prev.total || 0) + 1,
              totalPaginas: Math.ceil(
                (Number(prev.total || 0) + 1) / COMMENTS_PER_PAGE
              ),
            }
          : prev
      );

      onRankingChanged?.();
      setTexto("");
    } catch (error) {
      setError(error.message || "Não foi possível comentar.");
    } finally {
      setIsSending(false);
    }
  }

  async function handleDeleted(idComentario) {
    setComments((prev) =>
      prev.filter((comment) => comment.idComentario !== idComentario)
    );

    setModalComments((prev) =>
      prev.filter((comment) => comment.idComentario !== idComentario)
    );

    setCommentsTotal((prev) => {
      const next = Math.max(prev - 1, 0);
      onCountChange?.(next);
      return next;
    });

    onRankingChanged?.();

    await loadPreviewComments();

    if (isCommentsModalOpen) {
      await loadModalComments(1, true);
    }
  }

  const hasMorePreviewComments =
    previewPagination &&
    Number(previewPagination.total) > comments.length;

  return (
    <>
      <section className="mt-5 border-t border-[#eeeeee] pt-4">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={texto}
            onChange={(event) => {
              setTexto(event.target.value.slice(0, COMMENT_MAX));
              setError("");
            }}
            maxLength={COMMENT_MAX}
            placeholder="Escreva um comentário..."
            className="h-10 min-w-0 flex-1 rounded-full border border-[#d9d9d9] bg-[#f7f7f7] px-4 text-sm outline-none focus:border-[#089464]"
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
                onRankingChanged={onRankingChanged}
              />
            ))}

            {comments.length === 0 && (
              <p className="text-sm text-[#777]">
                Seja a primeira pessoa a comentar.
              </p>
            )}

            {hasMorePreviewComments && (
              <button
                type="button"
                onClick={handleOpenAllComments}
                className="rounded-full bg-[#f1f1f1] px-4 py-2 text-sm font-bold text-[#343434] transition hover:bg-[#e5e5e5]"
              >
                Ver todos os comentários ({commentsTotal})
              </button>
            )}
          </div>
        )}
      </section>

      {isCommentsModalOpen && (
        <div
          className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/55 px-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="flex max-h-[86vh] w-full max-w-[620px] flex-col rounded-[26px] bg-white p-5 shadow-xl">
            <div className="flex items-center justify-between gap-4 border-b border-[#eeeeee] pb-4">
              <div>
                <h2 className="text-lg font-bold text-[#202020]">
                  Comentários
                </h2>
                <p className="text-sm text-[#777]">
                  {commentsTotal === 1
                    ? "1 comentário"
                    : `${commentsTotal} comentários`}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsCommentsModalOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full text-2xl text-[#555] transition hover:bg-[#f1f1f1]"
                aria-label="Fechar comentários"
              >
                ×
              </button>
            </div>

            <div className="mt-4 min-h-0 flex-1 space-y-3 overflow-y-auto pr-1">
              {modalComments.map((comment) => (
                <CommentItem
                  key={comment.idComentario}
                  comment={comment}
                  currentUser={currentUser}
                  onDeleted={handleDeleted}
                  onRankingChanged={onRankingChanged}
                />
              ))}

              {modalComments.length === 0 && !isLoadingModalComments && (
                <p className="text-sm text-[#777]">
                  Ainda não há comentários.
                </p>
              )}

              {isLoadingModalComments && (
                <p className="text-sm text-[#777]">
                  Carregando comentários...
                </p>
              )}
            </div>

            {hasMoreModalComments && (
              <div className="mt-4 flex justify-center border-t border-[#eeeeee] pt-4">
                <button
                  type="button"
                  onClick={handleLoadMoreModalComments}
                  disabled={isLoadingModalComments}
                  className="rounded-full border border-[#d9e2ef] bg-white px-5 py-2 text-sm font-bold text-[#1f4f82] shadow-sm transition hover:bg-[#f3f7fb] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isLoadingModalComments
                    ? "Carregando..."
                    : "Ver mais comentários"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}