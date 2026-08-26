/*
 * Direção visual: Arquivo Editorial.
 * Interface de acervo com papel marfim, tinta azul-marinho, Coral de Lombada,
 * tipografia DM Serif Display + Manrope, assimetria funcional e motion curto.
 */
import { useEffect, useMemo, useState } from "react";
import {
  ArrowUpRight,
  BookOpen,
  BookOpenCheck,
  ChevronDown,
  CircleHelp,
  Database,
  Edit3,
  FilePlus2,
  Filter,
  Library,
  Menu,
  MoreHorizontal,
  Plus,
  Search,
  Settings2,
  Sparkles,
  Trash2,
  UserRound,
  UsersRound,
  X,
} from "lucide-react";
import { toast } from "sonner";

type Author = {
  id_autor: number;
  nome: string;
};

type Book = {
  id_livro: number;
  titulo: string;
  id_autor: number;
  editora: string;
  ano_publicacao: number;
  paginas: number;
};

type ModalState =
  | { type: "book"; mode: "create" | "edit"; item?: Book }
  | { type: "author"; mode: "create" | "edit"; item?: Author }
  | null;

type View = "overview" | "books" | "authors";

const API_BASE = "/php/api";
const isGitHubPages = typeof window !== "undefined" && window.location.hostname.endsWith("github.io");
const heroImage = "/manus-storage/biblioteca-hero_78a24b6b.jpg";
const detailImage = "/manus-storage/biblioteca-detail_f3a0e618.jpg";
const patternImage = "/manus-storage/biblioteca-pattern_ff9cf27f.jpg";
const fallbackMark = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 40'%3E%3Crect x='6' y='5' width='11' height='30' rx='2' fill='%23112736'/%3E%3Crect x='23' y='5' width='11' height='30' rx='2' fill='%23112736'/%3E%3Cpath d='M20 10v18' stroke='%23D96C4B' stroke-width='4' stroke-linecap='round'/%3E%3C/svg%3E";
const markImage = isGitHubPages ? fallbackMark : "/manus-storage/biblioteca-mark_6078166d.png";
const heroBackground = isGitHubPages
  ? "linear-gradient(90deg, rgba(17, 39, 54, 0.98) 0%, rgba(17, 39, 54, 0.86) 53%, rgba(17, 39, 54, 0.58) 100%), linear-gradient(135deg, #112736 0%, #234354 58%, #d96c4b 150%)"
  : `linear-gradient(90deg, rgba(17, 39, 54, 0.97) 0%, rgba(17, 39, 54, 0.84) 42%, rgba(17, 39, 54, 0.18) 100%), url(${heroImage})`;
const noteBackground = isGitHubPages
  ? "linear-gradient(135deg, rgba(246, 241, 231, 0.96), rgba(237, 228, 214, 0.98))"
  : `linear-gradient(180deg, rgba(246, 241, 231, 0.52), rgba(246, 241, 231, 0.94)), url(${patternImage})`;

const demoAuthors: Author[] = [
  { id_autor: 1, nome: "Conceição Evaristo" },
  { id_autor: 2, nome: "Italo Calvino" },
  { id_autor: 3, nome: "Clarice Lispector" },
  { id_autor: 4, nome: "Ailton Krenak" },
  { id_autor: 5, nome: "Ursula K. Le Guin" },
];

const demoBooks: Book[] = [
  { id_livro: 1, titulo: "Olhos d'água", id_autor: 1, editora: "Pallas", ano_publicacao: 2014, paginas: 116 },
  { id_livro: 2, titulo: "As cidades invisíveis", id_autor: 2, editora: "Companhia das Letras", ano_publicacao: 1990, paginas: 152 },
  { id_livro: 3, titulo: "A paixão segundo G.H.", id_autor: 3, editora: "Rocco", ano_publicacao: 1964, paginas: 192 },
  { id_livro: 4, titulo: "Ideias para adiar o fim do mundo", id_autor: 4, editora: "Companhia das Letras", ano_publicacao: 2019, paginas: 104 },
  { id_livro: 5, titulo: "A mão esquerda da escuridão", id_autor: 5, editora: "Aleph", ano_publicacao: 1969, paginas: 304 },
  { id_livro: 6, titulo: "Um sopro de vida", id_autor: 3, editora: "Rocco", ano_publicacao: 1978, paginas: 200 },
];

async function requestJson<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}/${path}`, {
    headers: { "Content-Type": "application/json", ...(options?.headers || {}) },
    ...options,
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) throw new Error("Resposta não JSON");
  return response.json();
}

function getAuthorName(id: number, authors: Author[]) {
  return authors.find((author) => author.id_autor === id)?.nome || "Autor não identificado";
}

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("pt-BR").format(value);
}

function AppMark({ small = false }: { small?: boolean }) {
  return (
    <div className={`app-mark ${small ? "app-mark--small" : ""}`} aria-hidden="true">
      <img src={markImage} alt="" />
    </div>
  );
}

function StatCard({ label, value, detail, icon: Icon, tone }: { label: string; value: string; detail: string; icon: typeof BookOpen; tone: string }) {
  return (
    <article className={`stat-card stat-card--${tone}`}>
      <div className="stat-card__topline">
        <span className="eyebrow">{label}</span>
        <span className="stat-icon"><Icon size={17} strokeWidth={1.8} /></span>
      </div>
      <strong>{value}</strong>
      <span className="stat-card__detail">{detail}</span>
    </article>
  );
}

function BookRow({ book, authors, onEdit, onDelete }: { book: Book; authors: Author[]; onEdit: () => void; onDelete: () => void }) {
  const author = getAuthorName(book.id_autor, authors);
  return (
    <div className="book-row">
      <div className="book-cover" aria-hidden="true"><span>{initials(book.titulo)}</span></div>
      <div className="book-main">
        <strong>{book.titulo}</strong>
        <span>{author}</span>
      </div>
      <div className="book-publisher">{book.editora}</div>
      <div className="book-meta"><b>{book.ano_publicacao}</b><span>{formatNumber(book.paginas)} págs.</span></div>
      <div className="row-actions">
        <button className="icon-button" onClick={onEdit} aria-label={`Editar ${book.titulo}`} title="Editar"><Edit3 size={16} /></button>
        <button className="icon-button icon-button--danger" onClick={onDelete} aria-label={`Excluir ${book.titulo}`} title="Excluir"><Trash2 size={16} /></button>
      </div>
    </div>
  );
}

function AuthorRow({ author, bookCount, onEdit, onDelete }: { author: Author; bookCount: number; onEdit: () => void; onDelete: () => void }) {
  return (
    <div className="author-row">
      <div className="author-avatar">{initials(author.nome)}</div>
      <div className="author-main"><strong>{author.nome}</strong><span>Registro #{String(author.id_autor).padStart(3, "0")}</span></div>
      <span className="author-count">{bookCount} {bookCount === 1 ? "livro" : "livros"}</span>
      <div className="row-actions">
        <button className="icon-button" onClick={onEdit} aria-label={`Editar ${author.nome}`} title="Editar"><Edit3 size={16} /></button>
        <button className="icon-button icon-button--danger" onClick={onDelete} aria-label={`Excluir ${author.nome}`} title="Excluir"><Trash2 size={16} /></button>
      </div>
    </div>
  );
}

function RecordModal({ modal, authors, onClose, onSave }: { modal: NonNullable<ModalState>; authors: Author[]; onClose: () => void; onSave: (type: "book" | "author", payload: Record<string, unknown>, mode: "create" | "edit", id?: number) => Promise<void> }) {
  const isBook = modal.type === "book";
  const isEdit = modal.mode === "edit";
  const [form, setForm] = useState<Record<string, string | undefined>>(() => isBook
    ? {
      titulo: (modal.item as Book | undefined)?.titulo || "",
      id_autor: String((modal.item as Book | undefined)?.id_autor || authors[0]?.id_autor || ""),
      editora: (modal.item as Book | undefined)?.editora || "",
      ano_publicacao: String((modal.item as Book | undefined)?.ano_publicacao || ""),
      paginas: String((modal.item as Book | undefined)?.paginas || ""),
    }
    : {       nome: String((modal.item as Author | undefined)?.nome ?? "") });
  const [saving, setSaving] = useState(false);

  const change = (key: string, value: string) => setForm((previous) => ({ ...previous, [key]: value }));
  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    try {
      await onSave(modal.type, isBook ? {
        titulo: form.titulo,
        id_autor: Number(form.id_autor),
        editora: form.editora,
        ano_publicacao: Number(form.ano_publicacao),
        paginas: Number(form.paginas),
      } : { nome: form.nome }, modal.mode, modal.item ? (isBook ? (modal.item as Book).id_livro : (modal.item as Author).id_autor) : undefined);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section className="record-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div className="modal-header">
          <div><span className="eyebrow">{isEdit ? "Atualização de registro" : "Novo registro"}</span><h2 id="modal-title">{isBook ? (isEdit ? "Editar livro" : "Adicionar livro") : (isEdit ? "Editar autor" : "Adicionar autor")}</h2></div>
          <button className="icon-button" onClick={onClose} aria-label="Fechar"><X size={18} /></button>
        </div>
        <form onSubmit={submit}>
          {isBook ? (
            <div className="form-grid">
              <label className="field field--wide"><span>Título do livro</span><input autoFocus required value={form.titulo} onChange={(event) => change("titulo", event.target.value)} placeholder="Ex.: O livro do desassossego" /></label>
              <label className="field"><span>Autor</span><select required value={form.id_autor} onChange={(event) => change("id_autor", event.target.value)}>{authors.map((author) => <option key={author.id_autor} value={author.id_autor}>{author.nome}</option>)}</select></label>
              <label className="field"><span>Editora</span><input required value={form.editora} onChange={(event) => change("editora", event.target.value)} placeholder="Ex.: Companhia das Letras" /></label>
              <label className="field"><span>Ano de publicação</span><input required type="number" min="1000" max="2100" value={form.ano_publicacao} onChange={(event) => change("ano_publicacao", event.target.value)} placeholder="2024" /></label>
              <label className="field"><span>Páginas</span><input required type="number" min="1" value={form.paginas} onChange={(event) => change("paginas", event.target.value)} placeholder="240" /></label>
            </div>
          ) : (
            <label className="field"><span>Nome completo</span><input autoFocus required value={form.nome} onChange={(event) => change("nome", event.target.value)} placeholder="Ex.: Lygia Fagundes Telles" /></label>
          )}
          <div className="modal-footer"><button type="button" className="button button--ghost" onClick={onClose}>Cancelar</button><button type="submit" className="button button--primary" disabled={saving}>{saving ? "Salvando…" : isEdit ? "Salvar alterações" : "Adicionar à estante"}<ArrowUpRight size={16} /></button></div>
        </form>
      </section>
    </div>
  );
}

export default function Home() {
  const [view, setView] = useState<View>("overview");
  const [authors, setAuthors] = useState<Author[]>(demoAuthors);
  const [books, setBooks] = useState<Book[]>(demoBooks);
  const [query, setQuery] = useState("");
  const [authorFilter, setAuthorFilter] = useState("all");
  const [modal, setModal] = useState<ModalState>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDemo, setIsDemo] = useState(true);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const [remoteAuthors, remoteBooks] = await Promise.all([
          requestJson<Author[]>("autores.php"),
          requestJson<Book[]>("livros.php"),
        ]);
        if (!active) return;
        setAuthors(Array.isArray(remoteAuthors) ? remoteAuthors : []);
        setBooks(Array.isArray(remoteBooks) ? remoteBooks : []);
        setIsDemo(false);
      } catch {
        if (active) setIsDemo(true);
      }
    };
    load();
    return () => { active = false; };
  }, []);

  const filteredBooks = useMemo(() => books.filter((book) => {
    const author = getAuthorName(book.id_autor, authors);
    const matchesQuery = `${book.titulo} ${author} ${book.editora}`.toLowerCase().includes(query.toLowerCase());
    const matchesAuthor = authorFilter === "all" || String(book.id_autor) === authorFilter;
    return matchesQuery && matchesAuthor;
  }), [authors, authorFilter, books, query]);

  const filteredAuthors = useMemo(() => authors.filter((author) => author.nome.toLowerCase().includes(query.toLowerCase())), [authors, query]);
  const recentBooks = books.slice(0, 4);
  const totalPages = books.reduce((sum, book) => sum + book.paginas, 0);
  const averagePages = books.length ? Math.round(totalPages / books.length) : 0;

  const navigate = (nextView: View) => { setView(nextView); setQuery(""); setSidebarOpen(false); };
  const openCreate = (type: "book" | "author") => setModal({ type, mode: "create" });
  const openEdit = (type: "book" | "author", item: Book | Author) => setModal({ type, mode: "edit", item } as ModalState);

  const saveRecord = async (type: "book" | "author", payload: Record<string, unknown>, mode: "create" | "edit", id?: number) => {
    const endpoint = type === "book" ? "livros.php" : "autores.php";
    try {
      if (isDemo) throw new Error("demo");
      await requestJson(endpoint, { method: mode === "create" ? "POST" : "PUT", body: JSON.stringify({ ...payload, ...(id ? { [type === "book" ? "id_livro" : "id_autor"]: id } : {}) }) });
    } catch {
      if (type === "book") {
        const record = { ...(payload as Omit<Book, "id_livro">), id_livro: id || Math.max(0, ...books.map((item) => item.id_livro)) + 1 } as Book;
        setBooks((current) => mode === "create" ? [record, ...current] : current.map((item) => item.id_livro === id ? record : item));
      } else {
        const record = { ...(payload as Omit<Author, "id_autor">), id_autor: id || Math.max(0, ...authors.map((item) => item.id_autor)) + 1 } as Author;
        setAuthors((current) => mode === "create" ? [record, ...current] : current.map((item) => item.id_autor === id ? record : item));
      }
    }
    toast.success(mode === "create" ? "Registro adicionado à estante." : "Registro atualizado com sucesso.", { description: isDemo ? "Modo demonstração: a alteração foi mantida nesta sessão." : "O acervo foi sincronizado." });
  };

  const deleteRecord = async (type: "book" | "author", item: Book | Author) => {
    const label = type === "book" ? (item as Book).titulo : (item as Author).nome;
    if (!window.confirm(`Excluir “${label}”? Esta ação não pode ser desfeita.`)) return;
    const endpoint = type === "book" ? "livros.php" : "autores.php";
    const idKey = type === "book" ? "id_livro" : "id_autor";
    const itemId = type === "book" ? (item as Book).id_livro : (item as Author).id_autor;
    try {
      if (isDemo) throw new Error("demo");
      await requestJson(endpoint, { method: "DELETE", body: JSON.stringify({ [idKey]: itemId }) });
    } catch {
      if (type === "book") setBooks((current) => current.filter((book) => book.id_livro !== (item as Book).id_livro));
      else {
        setAuthors((current) => current.filter((author) => author.id_autor !== (item as Author).id_autor));
        setBooks((current) => current.filter((book) => book.id_autor !== (item as Author).id_autor));
      }
    }
    toast.success("Registro removido.", { description: isDemo ? "Modo demonstração: a alteração foi mantida nesta sessão." : "O acervo foi sincronizado." });
  };

  const navItems: { id: View; label: string; icon: typeof Library; count?: number }[] = [
    { id: "overview", label: "Visão geral", icon: Library },
    { id: "books", label: "Livros", icon: BookOpen, count: books.length },
    { id: "authors", label: "Autores", icon: UsersRound, count: authors.length },
  ];

  return (
    <div className="app-shell">
      <aside className={`sidebar ${sidebarOpen ? "sidebar--open" : ""}`}>
        <div className="brand"><AppMark /><div><strong>Estante</strong><span>arquivo digital</span></div></div>
        <div className="sidebar-rule" />
        <div className="sidebar-label">Navegação</div>
        <nav className="main-nav" aria-label="Navegação principal">
          {navItems.map((item) => <button key={item.id} className={`nav-item ${view === item.id ? "nav-item--active" : ""}`} onClick={() => navigate(item.id)}><item.icon size={18} strokeWidth={1.8} /><span>{item.label}</span>{item.count !== undefined && <small>{item.count}</small>}</button>)}
        </nav>
        <div className="sidebar-footer">
          <div className="catalog-card"><span className="catalog-card__dot" /><div><span>Catálogo conectado</span><small>MySQL · biblioteca</small></div><ChevronDown size={14} /></div>
          <button className="nav-item nav-item--muted"><Settings2 size={18} strokeWidth={1.8} /><span>Preferências</span></button>
          <button className="nav-item nav-item--muted"><CircleHelp size={18} strokeWidth={1.8} /><span>Ajuda</span></button>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <button className="mobile-menu" onClick={() => setSidebarOpen((open) => !open)} aria-label="Abrir menu"><Menu size={20} /></button>
          <div className="breadcrumb"><span>Acervo</span><span>/</span><strong>{view === "overview" ? "Visão geral" : view === "books" ? "Livros" : "Autores"}</strong></div>
          <div className="topbar-actions"><button className="help-button"><CircleHelp size={17} /><span>Atalhos</span></button><div className="user-avatar">AB</div></div>
        </header>

        <div className="content-wrap">
          {view === "overview" && <>
            <section className="page-intro page-intro--overview"><div><div className="overline"><span className="overline-line" /> TERÇA-FEIRA, 26 DE AGOSTO</div><h1>Seu acervo,<br /><em>em ordem de leitura.</em></h1><p>Uma visão tranquila para cuidar dos títulos, autores e histórias que formam sua biblioteca.</p></div><div className="intro-actions"><button className="button button--primary" onClick={() => openCreate("book")}><Plus size={17} /> Adicionar livro</button><button className="button button--text" onClick={() => openCreate("author")}>Novo autor <ArrowUpRight size={16} /></button></div></section>
            <section className="feature-banner" style={{ backgroundImage: heroBackground }}><div className="feature-copy"><span className="eyebrow eyebrow--light"><Sparkles size={13} /> Caderno do acervo</span><h2>O prazer de encontrar<br /><i>o que já é seu.</i></h2><p>Cadastre, organize e revisite suas leituras com clareza.</p></div><div className="feature-index"><span>01</span><div className="feature-index__line" /><span>04</span></div></section>
            <section className="overview-tools"><span className="overview-tools__label">Consulta rápida</span><div className="search-field"><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Pesquisar no acervo" aria-label="Pesquisar no acervo" />{query && <button onClick={() => setQuery("")} aria-label="Limpar busca"><X size={14} /></button>}</div><button className="link-button" onClick={() => navigate("books")}>Abrir catálogo <ArrowUpRight size={15} /></button></section><section className="stats-grid"><StatCard label="Livros catalogados" value={formatNumber(books.length)} detail="títulos no acervo" icon={BookOpenCheck} tone="coral" /><StatCard label="Autores" value={formatNumber(authors.length)} detail="vozes registradas" icon={UserRound} tone="moss" /><StatCard label="Páginas" value={formatNumber(totalPages)} detail={`média de ${formatNumber(averagePages)} por livro`} icon={Database} tone="navy" /></section>
            <section className="overview-grid"><div className="panel panel--recent"><div className="panel-heading"><div><span className="eyebrow">Movimento recente</span><h2>Últimas adições</h2></div><button className="link-button" onClick={() => navigate("books")}>Ver todos <ArrowUpRight size={15} /></button></div><div className="book-list">{recentBooks.map((book) => <BookRow key={book.id_livro} book={book} authors={authors} onEdit={() => openEdit("book", book)} onDelete={() => deleteRecord("book", book)} />)}</div></div><aside className="panel panel--note" style={{ backgroundImage: noteBackground }}><span className="eyebrow">Nota de curadoria</span><div className="note-mark">“</div><blockquote>Uma biblioteca é uma porta para muitos mundos — mantenha as portas visíveis.</blockquote><div className="note-footer"><span>Estante · método 01</span><div className={`note-thumb ${isGitHubPages ? "note-thumb--fallback" : ""}`}>{isGitHubPages ? <span>ARQ<br />01</span> : <img src={detailImage} alt="Detalhe de fichas e livros em uma mesa de arquivo" />}</div></div></aside></section>
          </>}

          {view === "books" && <section className="records-page"><div className="page-intro page-intro--records"><div><div className="overline"><span className="overline-line" /> REGISTRO DE TÍTULOS</div><h1>Livros <em>catalogados.</em></h1><p>Todos os títulos guardados na sua estante digital.</p></div><button className="button button--primary" onClick={() => openCreate("book")}><Plus size={17} /> Adicionar livro</button></div><div className="toolbar"><div className="search-field"><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar por título, autor ou editora" aria-label="Buscar livros" />{query && <button onClick={() => setQuery("")} aria-label="Limpar busca"><X size={15} /></button>}</div><div className="select-field"><Filter size={15} /><select value={authorFilter} onChange={(event) => setAuthorFilter(event.target.value)} aria-label="Filtrar por autor"><option value="all">Todos os autores</option>{authors.map((author) => <option key={author.id_autor} value={author.id_autor}>{author.nome}</option>)}</select><ChevronDown size={14} /></div><div className="toolbar-count">{filteredBooks.length} de {books.length} títulos</div></div><div className="panel records-panel"><div className="list-heading"><span>Título / autor</span><span>Editora</span><span>Edição</span><span>Ações</span></div>{filteredBooks.length ? <div className="book-list">{filteredBooks.map((book) => <BookRow key={book.id_livro} book={book} authors={authors} onEdit={() => openEdit("book", book)} onDelete={() => deleteRecord("book", book)} />)}</div> : <EmptyState label="Nenhum livro encontrado" detail="Tente ajustar sua busca ou cadastre um novo título." onAction={() => openCreate("book")} action="Adicionar livro" />}</div></section>}

          {view === "authors" && <section className="records-page"><div className="page-intro page-intro--records"><div><div className="overline"><span className="overline-line" /> ÍNDICE DE AUTORES</div><h1>Autores <em>da estante.</em></h1><p>As vozes que dão forma ao seu acervo.</p></div><button className="button button--primary" onClick={() => openCreate("author")}><Plus size={17} /> Novo autor</button></div><div className="toolbar"><div className="search-field"><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar autor" aria-label="Buscar autores" />{query && <button onClick={() => setQuery("")} aria-label="Limpar busca"><X size={15} /></button>}</div><div className="toolbar-count">{filteredAuthors.length} de {authors.length} autores</div></div><div className="panel records-panel"><div className="list-heading list-heading--authors"><span>Autor</span><span>Livros catalogados</span><span>Ações</span></div><div className="author-list">{filteredAuthors.length ? filteredAuthors.map((author) => <AuthorRow key={author.id_autor} author={author} bookCount={books.filter((book) => book.id_autor === author.id_autor).length} onEdit={() => openEdit("author", author)} onDelete={() => deleteRecord("author", author)} />) : <EmptyState label="Nenhum autor encontrado" detail="Tente outra busca ou adicione uma nova voz ao índice." onAction={() => openCreate("author")} action="Novo autor" />}</div></div></section>}

          <footer className="page-footer"><span><AppMark small /> Estante / arquivo digital</span><span>{isDemo ? "Modo demonstração · conecte seu PHP para sincronizar" : "Sincronizado com o catálogo"}</span><button className="footer-more" onClick={() => setMenuOpen((open) => !open)} aria-label="Mais opções"><MoreHorizontal size={18} />{menuOpen && <span className="footer-menu">Versão 1.0 · MySQL</span>}</button></footer>
        </div>
      </main>
      {modal && <RecordModal modal={modal} authors={authors} onClose={() => setModal(null)} onSave={saveRecord} />}
    </div>
  );
}

function EmptyState({ label, detail, action, onAction }: { label: string; detail: string; action: string; onAction: () => void }) {
  return <div className="empty-state"><FilePlus2 size={26} strokeWidth={1.4} /><h3>{label}</h3><p>{detail}</p><button className="button button--secondary" onClick={onAction}><Plus size={16} /> {action}</button></div>;
}
