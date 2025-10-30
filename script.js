const noteList = document.getElementById("noteList");
const mainTitle = document.getElementById("mainTitle");
const addNoteBtn = document.getElementById("addNoteBtn");
const emptyTrashBtn = document.getElementById("emptyTrashBtn");
const langSelect = document.getElementById("langSelect");

let currentView = "all";
let notes = JSON.parse(localStorage.getItem("notes")) || [];

const langText = {
  vi: {
    notes: "Ghi chú",
    allNotes: "Tất cả ghi chú",
    favorites: "Yêu thích",
    trash: "Thùng rác",
    addNote: "＋ Thêm ghi chú",
    emptyTrash: "🧹 Dọn thùng rác",
  },
  en: {
    notes: "Notes",
    allNotes: "All Notes",
    favorites: "Favorites",
    trash: "Trash",
    addNote: "＋ Add Note",
    emptyTrash: "🧹 Empty Trash",
  },
};

function saveNotes() {
  localStorage.setItem("notes", JSON.stringify(notes));
}

function renderNotes() {
  noteList.innerHTML = "";

  // Ẩn nút "Dọn thùng rác" khi không ở view = trash
  emptyTrashBtn.classList.toggle("hidden", currentView !== "trash");

  // Ẩn nút "Thêm ghi chú" khi đang ở view = trash
  addNoteBtn.classList.toggle("hidden", currentView === "trash");

  let filteredNotes = [];

  if (currentView === "all") filteredNotes = notes.filter(n => !n.deleted);
  else if (currentView === "favorites") filteredNotes = notes.filter(n => n.favorite && !n.deleted);
  else if (currentView === "trash") filteredNotes = notes.filter(n => n.deleted);

  filteredNotes.forEach(note => {
    const noteEl = document.createElement("div");
    noteEl.className = "note";

    const textarea = document.createElement("textarea");
    textarea.value = note.content;
    textarea.oninput = e => {
      note.content = e.target.value;
      saveNotes();
    };

    const actions = document.createElement("div");
    actions.className = "actions";

    if (!note.deleted) {
      const favBtn = document.createElement("button");
      favBtn.textContent = note.favorite ? "⭐" : "☆";
      favBtn.onclick = () => {
        note.favorite = !note.favorite;
        saveNotes();
        renderNotes();
      };

      const delBtn = document.createElement("button");
      delBtn.textContent = "🗑️";
      delBtn.onclick = () => {
        note.deleted = true;
        note.favorite = false;
        saveNotes();
        renderNotes();
      };

      actions.append(favBtn, delBtn);
    } else {
      const restoreBtn = document.createElement("button");
      restoreBtn.textContent = "♻️";
      restoreBtn.onclick = () => {
        note.deleted = false;
        saveNotes();
        renderNotes();
      };

      const delForeverBtn = document.createElement("button");
      delForeverBtn.textContent = "❌";
      delForeverBtn.onclick = () => {
        notes = notes.filter(n => n.id !== note.id);
        saveNotes();
        renderNotes();
      };

      actions.append(restoreBtn, delForeverBtn);
    }

    noteEl.append(textarea, actions);
    noteList.appendChild(noteEl);
  });
}


document.querySelectorAll(".sidebar li").forEach(li => {
  li.onclick = () => {
    currentView = li.getAttribute("data-view");
    mainTitle.textContent = langText[langSelect.value][currentView];
    renderNotes();
  };
});

emptyTrashBtn.onclick = () => {
  if (confirm("Xóa vĩnh viễn toàn bộ ghi chú trong thùng rác?")) {
    notes = notes.filter(n => !n.deleted);
    saveNotes();
    renderNotes();
  }
};

langSelect.onchange = () => {
  const lang = langSelect.value;
  document.querySelectorAll("[data-lang]").forEach(el => {
    const key = el.getAttribute("data-lang");
    el.textContent = langText[lang][key];
  });
  addNoteBtn.textContent = langText[lang].addNote;
  emptyTrashBtn.textContent = langText[lang].emptyTrash;
  mainTitle.textContent = langText[lang][currentView];
};

renderNotes();
