import { fetchNotes } from "@/lib/api";
import NotesClient from "./Notes.client";

const NotesPage = async () => {
  const notes = await fetchNotes("", 1);

  return <NotesClient notes={notes} />;
};

export default NotesPage;
