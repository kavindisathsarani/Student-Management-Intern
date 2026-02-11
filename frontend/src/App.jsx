import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';

const initialForm = {
  name: '',
  email: '',
  phone: '',
  course: '',
  status: 'Pending'
};

function App() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [search, setSearch] = useState('');
  const [filterCourse, setFilterCourse] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);

  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const statusOptions = ['Pending', 'Enrolled', 'Completed', 'Cancelled'];

  const api = axios.create({
    baseURL: '/api'
  });

  async function loadStudents(pageToLoad = 1) {
    try {
      setLoading(true);
      setError('');
      const params = {
        page: pageToLoad,
        limit: 10
      };
      if (search) params.search = search;
      if (filterCourse) params.course = filterCourse;
      if (filterStatus) params.status = filterStatus;

      const res = await api.get('/students', { params });
      setStudents(res.data.items || []);
      setPage(res.data.page || 1);
      setPages(res.data.pages || 1);
    } catch (err) {
      console.error(err);
      setError('Failed to load students');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadStudents(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const courses = useMemo(() => {
    const unique = new Set(students.map((s) => s.course).filter(Boolean));
    return Array.from(unique);
  }, [students]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function startEdit(student) {
    setEditingId(student._id);
    setForm({
      name: student.name,
      email: student.email,
      phone: student.phone,
      course: student.course,
      status: student.status
    });
  }

  function resetForm() {
    setEditingId(null);
    setForm(initialForm);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      if (editingId) {
        await api.put(`/students/${editingId}`, form);
      } else {
        await api.post('/students', form);
      }
      resetForm();
      loadStudents(page);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to save student');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Are you sure you want to delete this student?')) return;
    try {
      setLoading(true);
      setError('');
      await api.delete(`/students/${id}`);
      loadStudents(page);
    } catch (err) {
      console.error(err);
      setError('Failed to delete student');
    } finally {
      setLoading(false);
    }
  }

  function statusClass(status) {
    if (status === 'Pending') {
      return 'bg-yellow-50 border-yellow-300';
    }
    if (status === 'Enrolled') {
      return 'bg-green-50 border-green-300';
    }
    if (status === 'Completed') {
      return 'bg-blue-50 border-blue-300';
    }
    if (status === 'Cancelled') {
      return 'bg-red-50 border-red-300';
    }
    return '';
  }

  function statusBadge(status) {
    const base = 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium';
    if (status === 'Pending') {
      return `${base} bg-yellow-100 text-yellow-800`;
    }
    if (status === 'Enrolled') {
      return `${base} bg-green-100 text-green-800`;
    }
    if (status === 'Completed') {
      return `${base} bg-blue-100 text-blue-800`;
    }
    if (status === 'Cancelled') {
      return `${base} bg-red-100 text-red-800`;
    }
    return base;
  }

  return (
    <div className="min-h-screen px-4 py-6 sm:px-8 lg:px-16">
      <header className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            Student Course Enrollment
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage students, courses, and enrollment status with a simple dashboard.
          </p>
        </div>
      </header>

      <main className="grid gap-6 lg:grid-cols-[2fr,1.3fr]">
        <section className="space-y-4">
          <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-100">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-1 gap-2">
                <div className="flex-1">
                  <label className="block text-xs font-medium text-gray-700">
                    Search by name
                  </label>
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onBlur={() => loadStudents(1)}
                    placeholder="e.g. John Doe"
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700">
                    Course
                  </label>
                  <select
                    value={filterCourse}
                    onChange={(e) => {
                      setFilterCourse(e.target.value);
                      loadStudents(1);
                    }}
                    className="mt-1 w-32 rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="">All</option>
                    {courses.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700">
                    Status
                  </label>
                  <select
                    value={filterStatus}
                    onChange={(e) => {
                      setFilterStatus(e.target.value);
                      loadStudents(1);
                    }}
                    className="mt-1 w-32 rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="">All</option>
                    {statusOptions.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSearch('');
                  setFilterCourse('');
                  setFilterStatus('');
                  loadStudents(1);
                }}
                className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
              >
                Clear filters
              </button>
            </div>
          </div>

          <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-100">
            <div className="border-b border-gray-100 px-4 py-3">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-gray-900">
                  Students ({students.length})
                </h2>
                {loading && (
                  <span className="text-xs text-gray-500">Loading...</span>
                )}
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-100 text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Name
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Email
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Phone
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Course
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Status
                    </th>
                    <th className="px-4 py-2 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {students.map((student) => (
                    <tr
                      key={student._id}
                      className={`border-l-4 ${statusClass(student.status)}`}
                    >
                      <td className="whitespace-nowrap px-4 py-2 text-sm font-medium text-gray-900">
                        {student.name}
                      </td>
                      <td className="whitespace-nowrap px-4 py-2 text-sm text-gray-600">
                        {student.email}
                      </td>
                      <td className="whitespace-nowrap px-4 py-2 text-sm text-gray-600">
                        {student.phone}
                      </td>
                      <td className="whitespace-nowrap px-4 py-2 text-sm text-gray-600">
                        {student.course}
                      </td>
                      <td className="whitespace-nowrap px-4 py-2 text-sm">
                        <span className={statusBadge(student.status)}>
                          {student.status}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-4 py-2 text-right text-sm">
                        <button
                          type="button"
                          onClick={() => startEdit(student)}
                          className="mr-2 inline-flex items-center rounded-md bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700 hover:bg-indigo-100"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(student._id)}
                          className="inline-flex items-center rounded-md bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700 hover:bg-red-100"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                  {students.length === 0 && !loading && (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-4 py-6 text-center text-sm text-gray-500"
                      >
                        No students found. Add a new student using the form on the
                        right.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="flex items-center justify-between border-t border-gray-100 px-4 py-3 text-xs text-gray-600">
              <div>
                Page {page} of {pages}
              </div>
              <div className="space-x-2">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => loadStudents(page - 1)}
                  className="rounded-md border border-gray-300 bg-white px-2.5 py-1 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  type="button"
                  disabled={page >= pages}
                  onClick={() => loadStudents(page + 1)}
                  className="rounded-md border border-gray-300 bg-white px-2.5 py-1 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </section>

        <section>
          <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
            <h2 className="text-sm font-semibold text-gray-900">
              {editingId ? 'Edit Student' : 'Add Student'}
            </h2>
            <p className="mt-1 text-xs text-gray-500">
              Email must be valid and phone should contain digits only.
            </p>

            {error && (
              <div className="mt-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  pattern="[0-9]{7,15}"
                  title="Digits only, 7-15 characters"
                  required
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700">
                  Course
                </label>
                <input
                  type="text"
                  name="course"
                  value={form.course}
                  onChange={handleChange}
                  required
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700">
                  Status
                </label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  {statusOptions.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className="space-x-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {editingId ? 'Update Student' : 'Add Student'}
                  </button>
                  {editingId && (
                    <button
                      type="button"
                      onClick={resetForm}
                      className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;


