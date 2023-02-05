/**
 * Todo App buat latihan Flowbite
 * Website: https://flowbite.com/
 */

import clsx from "clsx";
import { m } from "framer-motion";
import { nanoid } from "nanoid";
import { useEffect, useState } from "react";

type IndexTargetValueProps = Record<string, string> & {
  kegiatan: string;
  deskripsi: string;
};

type EventProps = {
  target: {
    value: string;
    name: string;
  };
};

export default function App() {
  const [todos, setTodos] = useState([
    {
      id: nanoid(),
      kegiatan: "Tomodachi no Imouto",
      deskripsi: "Hmmm bolehlah",
    },
  ]);
  const [formData, setFormData] = useState({ kegiatan: "", deskripsi: "" });
  const [isUpdate, setIsUpdate] = useState({ id: "", status: false });
  const [archive, setArchive] = useState([
    {
      id: nanoid(),
      kegiatan: "Baca Manga Kaoru Hana Wa Rin To Saku",
      deskripsi: "Manga bagus nich bang",
    },
  ]);
  const [isDelete, setIsDelete] = useState(false);

  function saveData<T>(newData: T) {
    localStorage.setItem("todos", JSON.stringify(newData));
  }

  // TODOS
  function handleChange<T extends EventProps>(event: T) {
    const data: IndexTargetValueProps = { ...formData };

    data[event.target.name] = event.target.value;
    setFormData(data);
  }

  function handleDelete(id: string) {
    const data = [...todos];
    const filteredData = data.filter((value) => value.id !== id);

    setTodos(filteredData);
    saveData(filteredData);
    setIsDelete(true);
  }

  function handleSubmit(event: { preventDefault: () => void }) {
    event.preventDefault();
    const data = [...todos];

    if (isUpdate.status) {
      data.forEach((value) => {
        if (value.id === isUpdate.id) {
          value.kegiatan = formData.kegiatan;
          value.deskripsi = formData.deskripsi;
        }
      });
    } else {
      data.push({
        id: nanoid(),
        kegiatan: formData.kegiatan,
        deskripsi: formData.deskripsi,
      });
    }

    setTodos(data);
    saveData(data);
    setIsUpdate({ id: "", status: false });
  }

  function handleEdit(id: string) {
    const data = [...todos];
    const foundData = data.find((value) => value.id === id);

    setFormData({
      kegiatan: foundData?.kegiatan !== undefined ? foundData.kegiatan : "",
      deskripsi: foundData?.deskripsi !== undefined ? foundData.deskripsi : "",
    });
    setIsUpdate({ id: id, status: true });
  }

  // ARCHIVE
  function handleArchive(id: string) {
    const todosData = [...todos];
    const archiveData = [...archive];

    // find
    const foundTodo = todosData.find((value) => value.id === id);
    const filteredTodo = todosData.filter((value) => value.id !== id);

    archiveData.push({
      id: id,
      kegiatan: foundTodo?.kegiatan !== undefined ? foundTodo.kegiatan : "",
      deskripsi: foundTodo?.deskripsi !== undefined ? foundTodo.deskripsi : "",
    });
    setArchive(archiveData);
    setTodos(filteredTodo);
    saveData(archiveData);
  }

  function handleUndoArchive(id: string) {
    const archiveData = [...archive];

    const filteredArchive = archiveData.filter((value) => value.id !== id);
    setTodos(archiveData);
    setArchive(filteredArchive);
    saveData(archiveData);
    saveData(filteredArchive);
  }

  useEffect(() => {
    if (localStorage.getItem("todos"))
      setTodos(JSON.parse(localStorage.getItem("todos") || ""));
  }, []);

  return (
    <>
      <div className="max-w-full flex justify-center items-center w-full inset-0">
        <main className="max-w-5xl flex justify-center items-center w-full p-4">
          <section className="w-full max-w-2xl">
            <h1 className="font-bold text-center text-3xl">Todo App</h1>
            <form
              className="my-5 w-full space-y-5 flex justify-center items-center flex-col"
              onSubmit={handleSubmit}
            >
              <div className="w-full">
                <label
                  htmlFor="kegiatan"
                  className="block mb-2 text-sm font-semibold text-gray-900 dark:text-white"
                >
                  Kegiatan
                </label>
                <input
                  type="text"
                  placeholder="Masukkan kegiatan...."
                  onChange={handleChange}
                  required
                  className={clsx(
                    "border-2 w-full border-blue-500 outline-none transition-all ease-in-out",
                    "px-3 py-1 rounded-sm",
                    "focus:ring focus:ring-blue-600"
                  )}
                  name="kegiatan"
                  value={formData.kegiatan}
                />
              </div>
              <div className="w-full">
                <label
                  htmlFor="deskripsi"
                  className="block mb-2 text-sm font-semibold text-gray-900 dark:text-white"
                >
                  Deskripsi
                </label>
                <textarea
                  placeholder="Masukkan Deskripsi...."
                  onChange={handleChange}
                  className={clsx(
                    "border-2 w-full border-blue-500 outline-none transition-all ease-in-out",
                    "px-3 py-1 rounded-sm",
                    "focus:ring focus:ring-blue-600"
                  )}
                  name="deskripsi"
                  value={formData.deskripsi}
                  required
                />
              </div>
              <button
                type="submit"
                className={clsx(
                  "text-white bg-blue-700 font-bold rounded-lg text-sm px-5 py-2.5 mr-2 mb-2",
                  "dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800",
                  "focus:outline-none hover:bg-blue-800 focus:ring-4 focus:ring-blue-300"
                )}
              >
                Add Data
              </button>
            </form>
            <h2 className="text-center font-bold">Todos</h2>
            {todos.length ? (
              <>
                <div className="flex flex-col space-y-5">
                  {todos.map((todo) => (
                    <div
                      key={todo.id}
                      className={clsx(
                        "p-3 border-2 border-blue-500 transition-all ease-in-out",
                        "hover:bg-gray-50 rounded-sm"
                      )}
                    >
                      <h3 className="font-bold text-xl">{todo.kegiatan}</h3>
                      <p className="mt-2">{todo.deskripsi}</p>
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() => handleDelete(todo.id)}
                          className={clsx(
                            "focus:outline-none text-white bg-red-700 hover:bg-red-800",
                            "focus:ring-4 focus:ring-red-300",
                            "font-bold rounded-lg text-sm px-5 py-2.5 mr-2 mb-2",
                            "dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                          )}
                        >
                          Delete
                        </button>
                        <button
                          type="button"
                          onClick={() => handleEdit(todo.id)}
                          className={clsx(
                            "focus:outline-none text-white bg-yellow-400 hover:bg-yellow-500",
                            "focus:ring-4 focus:ring-yellow-300",
                            "font-bold rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:focus:ring-yellow-900"
                          )}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className={clsx(
                            "focus:outline-none text-white bg-green-700",
                            "hover:bg-green-800 focus:ring-4 focus:ring-green-300",
                            "font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2",
                            "dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                          )}
                          onClick={() => handleArchive(todo.id)}
                        >
                          Archive
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-center font-bold text-xl underline underline-offset-2 my-5">
                Todos belum ada!
              </p>
            )}
            {isDelete ? (
              <div className="fixed inset-0 flex rounded-md justify-center items-center">
                <m.div
                  initial={{ scale: 0.75, opacity: 0 }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    transition: { duration: 0.3, animation: "ease-out" },
                  }}
                  exit={{ scale: 0.75, opacity: 0 }}
                  className="bg-gray-200 p-3"
                >
                  <h2 className="font-bold text-2xl">Sudah dihapus!</h2>
                  <div className="w-full flex justify-center items-center mt-2">
                    <button
                      className={clsx(
                        "text-white bg-blue-700 hover:bg-blue-800",
                        "focus:ring-4 focus:ring-blue-300",
                        "font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2",
                        "dark:bg-blue-600 dark:hover:bg-blue-700",
                        "focus:outline-none dark:focus:ring-blue-800"
                      )}
                      onClick={() => setIsDelete(false)}
                    >
                      Close
                    </button>
                  </div>
                </m.div>
              </div>
            ) : null}
            <h2 className="text-center font-bold">Archive</h2>
            {archive.length ? (
              <>
                {archive.map((value) => (
                  <div
                    key={value.id}
                    className={clsx(
                      "p-3 border-2 border-blue-500 transition-all ease-in-out",
                      "hover:bg-gray-50 rounded-sm"
                    )}
                  >
                    <h3 className="font-bold text-xl">{value.kegiatan}</h3>
                    <p className="mt-2">{value.deskripsi}</p>
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => handleUndoArchive(value.id)}
                        className={clsx(
                          "focus:outline-none text-white bg-red-700 hover:bg-red-800",
                          "focus:ring-4 focus:ring-red-300",
                          "font-bold rounded-lg text-sm px-5 py-2.5 mr-2 mb-2",
                          "dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                        )}
                      >
                        Undo
                      </button>
                      <button
                        type="button"
                        onClick={() => handleEdit(value.id)}
                        className={clsx(
                          "focus:outline-none text-white bg-yellow-400 hover:bg-yellow-500",
                          "focus:ring-4 focus:ring-yellow-300",
                          "font-bold rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:focus:ring-yellow-900"
                        )}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className={clsx(
                          "focus:outline-none text-white bg-green-700",
                          "hover:bg-green-800 focus:ring-4 focus:ring-green-300",
                          "font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2",
                          "dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                        )}
                        onClick={() => handleArchive(value.id)}
                      >
                        Archive
                      </button>
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <p className="text-center font-bold text-xl underline underline-offset-2 my-5">
                Archive belum ada!
              </p>
            )}
          </section>
        </main>
      </div>
    </>
  );
}
