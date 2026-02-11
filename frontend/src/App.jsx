// import { useEffect, useMemo, useState } from 'react';
// import axios from 'axios';

// const initialForm = {
//   name: '',
//   email: '',
//   phone: '',
//   course: '',
//   status: 'Pending'
// };

// function App() {
//   const [students, setStudents] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   const [search, setSearch] = useState('');
//   const [filterCourse, setFilterCourse] = useState('');
//   const [filterStatus, setFilterStatus] = useState('');

//   const [form, setForm] = useState(initialForm);
//   const [editingId, setEditingId] = useState(null);

//   const [page, setPage] = useState(1);
//   const [pages, setPages] = useState(1);

//   const statusOptions = ['Pending', 'Enrolled', 'Completed', 'Cancelled'];

//   const api = axios.create({
//     baseURL: '/api'
//   });

//   async function loadStudents(pageToLoad = 1) {
//     try {
//       setLoading(true);
//       setError('');
//       const params = {
//         page: pageToLoad,
//         limit: 10
//       };
//       if (search) params.search = search;
//       if (filterCourse) params.course = filterCourse;
//       if (filterStatus) params.status = filterStatus;

//       const res = await api.get('/students', { params });
//       setStudents(res.data.items || []);
//       setPage(res.data.page || 1);
//       setPages(res.data.pages || 1);
//     } catch (err) {
//       console.error(err);
//       setError('Failed to load students');
//     } finally {
//       setLoading(false);
//     }
//   }

//   useEffect(() => {
//     loadStudents(1);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   const courses = useMemo(() => {
//     const unique = new Set(students.map((s) => s.course).filter(Boolean));
//     return Array.from(unique);
//   }, [students]);

//   function handleChange(e) {
//     const { name, value } = e.target;
//     setForm((prev) => ({ ...prev, [name]: value }));
//   }

//   function startEdit(student) {
//     setEditingId(student._id);
//     setForm({
//       name: student.name,
//       email: student.email,
//       phone: student.phone,
//       course: student.course,
//       status: student.status
//     });
//   }

//   function resetForm() {
//     setEditingId(null);
//     setForm(initialForm);
//   }

//   async function handleSubmit(e) {
//     e.preventDefault();
//     try {
//       setLoading(true);
//       setError('');
//       if (editingId) {
//         await api.put(`/students/${editingId}`, form);
//       } else {
//         await api.post('/students', form);
//       }
//       resetForm();
//       loadStudents(page);
//     } catch (err) {
//       console.error(err);
//       setError(err.response?.data?.message || 'Failed to save student');
//     } finally {
//       setLoading(false);
//     }
//   }

//   async function handleDelete(id) {
//     if (!window.confirm('Are you sure you want to delete this student?')) return;
//     try {
//       setLoading(true);
//       setError('');
//       await api.delete(`/students/${id}`);
//       loadStudents(page);
//     } catch (err) {
//       console.error(err);
//       setError('Failed to delete student');
//     } finally {
//       setLoading(false);
//     }
//   }

//   function statusClass(status) {
//     if (status === 'Pending') {
//       return 'bg-yellow-50 border-yellow-300';
//     }
//     if (status === 'Enrolled') {
//       return 'bg-green-50 border-green-300';
//     }
//     if (status === 'Completed') {
//       return 'bg-blue-50 border-blue-300';
//     }
//     if (status === 'Cancelled') {
//       return 'bg-red-50 border-red-300';
//     }
//     return '';
//   }

//   function statusBadge(status) {
//     const base = 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium';
//     if (status === 'Pending') {
//       return `${base} bg-yellow-100 text-yellow-800`;
//     }
//     if (status === 'Enrolled') {
//       return `${base} bg-green-100 text-green-800`;
//     }
//     if (status === 'Completed') {
//       return `${base} bg-blue-100 text-blue-800`;
//     }
//     if (status === 'Cancelled') {
//       return `${base} bg-red-100 text-red-800`;
//     }
//     return base;
//   }

//   return (
//     <div className="min-h-screen px-4 py-6 sm:px-8 lg:px-16">
//       <header className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
//         <div>
//           <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
//             Student Course Enrollment
//           </h1>
//           <p className="mt-1 text-sm text-gray-600">
//             Manage students, courses, and enrollment status with a simple dashboard.
//           </p>
//         </div>
//       </header>

//       <main className="grid gap-6 lg:grid-cols-[2fr,1.3fr]">
//         <section className="space-y-4">
//           <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-100">
//             <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
//               <div className="flex flex-1 gap-2">
//                 <div className="flex-1">
//                   <label className="block text-xs font-medium text-gray-700">
//                     Search by name
//                   </label>
//                   <input
//                     type="text"
//                     value={search}
//                     onChange={(e) => setSearch(e.target.value)}
//                     onBlur={() => loadStudents(1)}
//                     placeholder="e.g. John Doe"
//                     className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-xs font-medium text-gray-700">
//                     Course
//                   </label>
//                   <select
//                     value={filterCourse}
//                     onChange={(e) => {
//                       setFilterCourse(e.target.value);
//                       loadStudents(1);
//                     }}
//                     className="mt-1 w-32 rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
//                   >
//                     <option value="">All</option>
//                     {courses.map((c) => (
//                       <option key={c} value={c}>
//                         {c}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//                 <div>
//                   <label className="block text-xs font-medium text-gray-700">
//                     Status
//                   </label>
//                   <select
//                     value={filterStatus}
//                     onChange={(e) => {
//                       setFilterStatus(e.target.value);
//                       loadStudents(1);
//                     }}
//                     className="mt-1 w-32 rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
//                   >
//                     <option value="">All</option>
//                     {statusOptions.map((s) => (
//                       <option key={s} value={s}>
//                         {s}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//               </div>
//               <button
//                 type="button"
//                 onClick={() => {
//                   setSearch('');
//                   setFilterCourse('');
//                   setFilterStatus('');
//                   loadStudents(1);
//                 }}
//                 className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
//               >
//                 Clear filters
//               </button>
//             </div>
//           </div>

//           <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-100">
//             <div className="border-b border-gray-100 px-4 py-3">
//               <div className="flex items-center justify-between">
//                 <h2 className="text-sm font-semibold text-gray-900">
//                   Students ({students.length})
//                 </h2>
//                 {loading && (
//                   <span className="text-xs text-gray-500">Loading...</span>
//                 )}
//               </div>
//             </div>
//             <div className="overflow-x-auto">
//               <table className="min-w-full divide-y divide-gray-100 text-sm">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
//                       Name
//                     </th>
//                     <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
//                       Email
//                     </th>
//                     <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
//                       Phone
//                     </th>
//                     <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
//                       Course
//                     </th>
//                     <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
//                       Status
//                     </th>
//                     <th className="px-4 py-2 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
//                       Actions
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-100 bg-white">
//                   {students.map((student) => (
//                     <tr
//                       key={student._id}
//                       className={`border-l-4 ${statusClass(student.status)}`}
//                     >
//                       <td className="whitespace-nowrap px-4 py-2 text-sm font-medium text-gray-900">
//                         {student.name}
//                       </td>
//                       <td className="whitespace-nowrap px-4 py-2 text-sm text-gray-600">
//                         {student.email}
//                       </td>
//                       <td className="whitespace-nowrap px-4 py-2 text-sm text-gray-600">
//                         {student.phone}
//                       </td>
//                       <td className="whitespace-nowrap px-4 py-2 text-sm text-gray-600">
//                         {student.course}
//                       </td>
//                       <td className="whitespace-nowrap px-4 py-2 text-sm">
//                         <span className={statusBadge(student.status)}>
//                           {student.status}
//                         </span>
//                       </td>
//                       <td className="whitespace-nowrap px-4 py-2 text-right text-sm">
//                         <button
//                           type="button"
//                           onClick={() => startEdit(student)}
//                           className="mr-2 inline-flex items-center rounded-md bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700 hover:bg-indigo-100"
//                         >
//                           Edit
//                         </button>
//                         <button
//                           type="button"
//                           onClick={() => handleDelete(student._id)}
//                           className="inline-flex items-center rounded-md bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700 hover:bg-red-100"
//                         >
//                           Delete
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                   {students.length === 0 && !loading && (
//                     <tr>
//                       <td
//                         colSpan={6}
//                         className="px-4 py-6 text-center text-sm text-gray-500"
//                       >
//                         No students found. Add a new student using the form on the
//                         right.
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>
//             <div className="flex items-center justify-between border-t border-gray-100 px-4 py-3 text-xs text-gray-600">
//               <div>
//                 Page {page} of {pages}
//               </div>
//               <div className="space-x-2">
//                 <button
//                   type="button"
//                   disabled={page <= 1}
//                   onClick={() => loadStudents(page - 1)}
//                   className="rounded-md border border-gray-300 bg-white px-2.5 py-1 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
//                 >
//                   Previous
//                 </button>
//                 <button
//                   type="button"
//                   disabled={page >= pages}
//                   onClick={() => loadStudents(page + 1)}
//                   className="rounded-md border border-gray-300 bg-white px-2.5 py-1 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
//                 >
//                   Next
//                 </button>
//               </div>
//             </div>
//           </div>
//         </section>

//         <section>
//           <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
//             <h2 className="text-sm font-semibold text-gray-900">
//               {editingId ? 'Edit Student' : 'Add Student'}
//             </h2>
//             <p className="mt-1 text-xs text-gray-500">
//               Email must be valid and phone should contain digits only.
//             </p>

//             {error && (
//               <div className="mt-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
//                 {error}
//               </div>
//             )}

//             <form onSubmit={handleSubmit} className="mt-4 space-y-3">
//               <div>
//                 <label className="block text-xs font-medium text-gray-700">
//                   Name
//                 </label>
//                 <input
//                   type="text"
//                   name="name"
//                   value={form.name}
//                   onChange={handleChange}
//                   required
//                   className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
//                 />
//               </div>
//               <div>
//                 <label className="block text-xs font-medium text-gray-700">
//                   Email
//                 </label>
//                 <input
//                   type="email"
//                   name="email"
//                   value={form.email}
//                   onChange={handleChange}
//                   required
//                   className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
//                 />
//               </div>
//               <div>
//                 <label className="block text-xs font-medium text-gray-700">
//                   Phone
//                 </label>
//                 <input
//                   type="tel"
//                   name="phone"
//                   value={form.phone}
//                   onChange={handleChange}
//                   pattern="[0-9]{7,15}"
//                   title="Digits only, 7-15 characters"
//                   required
//                   className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
//                 />
//               </div>
//               <div>
//                 <label className="block text-xs font-medium text-gray-700">
//                   Course
//                 </label>
//                 <input
//                   type="text"
//                   name="course"
//                   value={form.course}
//                   onChange={handleChange}
//                   required
//                   className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
//                 />
//               </div>
//               <div>
//                 <label className="block text-xs font-medium text-gray-700">
//                   Status
//                 </label>
//                 <select
//                   name="status"
//                   value={form.status}
//                   onChange={handleChange}
//                   className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
//                 >
//                   {statusOptions.map((s) => (
//                     <option key={s} value={s}>
//                       {s}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <div className="mt-4 flex items-center justify-between">
//                 <div className="space-x-2">
//                   <button
//                     type="submit"
//                     disabled={loading}
//                     className="inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
//                   >
//                     {editingId ? 'Update Student' : 'Add Student'}
//                   </button>
//                   {editingId && (
//                     <button
//                       type="button"
//                       onClick={resetForm}
//                       className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
//                     >
//                       Cancel
//                     </button>
//                   )}
//                 </div>
//               </div>
//             </form>
//           </div>
//         </section>
//       </main>
//     </div>
//   );
// }

// export default App;


// import { useEffect, useMemo, useState } from 'react';
// import axios from 'axios';

// const initialForm = {
//   name: '',
//   email: '',
//   phone: '',
//   course: '',
//   status: 'Pending'
// };

// function App() {
//   const [students, setStudents] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   const [search, setSearch] = useState('');
//   const [filterCourse, setFilterCourse] = useState('');
//   const [filterStatus, setFilterStatus] = useState('');

//   const [form, setForm] = useState(initialForm);
//   const [editingId, setEditingId] = useState(null);

//   const [page, setPage] = useState(1);
//   const [pages, setPages] = useState(1);

//   const statusOptions = ['Pending', 'Enrolled', 'Completed', 'Cancelled'];

//   const api = axios.create({
//     baseURL: '/api'
//   });

//   async function loadStudents(pageToLoad = 1) {
//     try {
//       setLoading(true);
//       setError('');
//       const params = {
//         page: pageToLoad,
//         limit: 10
//       };
//       if (search) params.search = search;
//       if (filterCourse) params.course = filterCourse;
//       if (filterStatus) params.status = filterStatus;

//       const res = await api.get('/students', { params });
//       setStudents(res.data.items || []);
//       setPage(res.data.page || 1);
//       setPages(res.data.pages || 1);
//     } catch (err) {
//       console.error(err);
//       setError('Failed to load students');
//     } finally {
//       setLoading(false);
//     }
//   }

//   useEffect(() => {
//     loadStudents(1);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   const courses = useMemo(() => {
//     const unique = new Set(students.map((s) => s.course).filter(Boolean));
//     return Array.from(unique);
//   }, [students]);

//   function handleChange(e) {
//     const { name, value } = e.target;
//     setForm((prev) => ({ ...prev, [name]: value }));
//   }

//   function startEdit(student) {
//     setEditingId(student._id);
//     setForm({
//       name: student.name,
//       email: student.email,
//       phone: student.phone,
//       course: student.course,
//       status: student.status
//     });
//   }

//   function resetForm() {
//     setEditingId(null);
//     setForm(initialForm);
//   }

//   async function handleSubmit(e) {
//     e.preventDefault();
//     try {
//       setLoading(true);
//       setError('');
//       if (editingId) {
//         await api.put(`/students/${editingId}`, form);
//       } else {
//         await api.post('/students', form);
//       }
//       resetForm();
//       loadStudents(page);
//     } catch (err) {
//       console.error(err);
//       setError(err.response?.data?.message || 'Failed to save student');
//     } finally {
//       setLoading(false);
//     }
//   }

//   async function handleDelete(id) {
//     if (!window.confirm('Are you sure you want to delete this student?')) return;
//     try {
//       setLoading(true);
//       setError('');
//       await api.delete(`/students/${id}`);
//       loadStudents(page);
//     } catch (err) {
//       console.error(err);
//       setError('Failed to delete student');
//     } finally {
//       setLoading(false);
//     }
//   }

//   function statusClass(status) {
//     if (status === 'Pending') {
//       return 'bg-amber-50/80 border-l-4 border-l-amber-400';
//     }
//     if (status === 'Enrolled') {
//       return 'bg-emerald-50/80 border-l-4 border-l-emerald-400';
//     }
//     if (status === 'Completed') {
//       return 'bg-sky-50/80 border-l-4 border-l-sky-400';
//     }
//     if (status === 'Cancelled') {
//       return 'bg-rose-50/80 border-l-4 border-l-rose-400';
//     }
//     return '';
//   }

//   function statusBadge(status) {
//     const base = 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset';
//     if (status === 'Pending') {
//       return `${base} bg-amber-50 text-amber-700 ring-amber-600/20`;
//     }
//     if (status === 'Enrolled') {
//       return `${base} bg-emerald-50 text-emerald-700 ring-emerald-600/20`;
//     }
//     if (status === 'Completed') {
//       return `${base} bg-sky-50 text-sky-700 ring-sky-600/20`;
//     }
//     if (status === 'Cancelled') {
//       return `${base} bg-rose-50 text-rose-700 ring-rose-600/20`;
//     }
//     return base;
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 px-4 py-8 sm:px-6 lg:px-8">
//       {/* Decorative background elements */}
//       <div className="absolute inset-0 -z-10 overflow-hidden">
//         <div className="absolute left-[40%] top-0 -ml-24 h-48 w-48 -translate-x-1/2 rounded-full bg-indigo-100/30 blur-3xl"></div>
//         <div className="absolute right-0 top-1/3 h-72 w-72 rounded-full bg-purple-100/30 blur-3xl"></div>
//         <div className="absolute bottom-0 left-20 h-60 w-60 rounded-full bg-emerald-100/30 blur-3xl"></div>
//       </div>

//       <div className="mx-auto max-w-7xl">
//         <header className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
//           <div className="relative">
//             <div className="absolute -left-3 -top-3 h-12 w-12 rounded-full bg-indigo-200/50 blur-md"></div>
//             <h1 className="relative text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
//               Student Course
//               <span className="bg-gradient-to-r from-indigo-600 to-indigo-400 bg-clip-text text-transparent"> Enrollment</span>
//             </h1>
//             <p className="mt-2 text-sm leading-6 text-gray-600">
//               Manage students, courses, and enrollment status with a clean, modern dashboard.
//             </p>
//           </div>
          
//           {/* Status summary chips */}
//           <div className="flex flex-wrap gap-2">
//             {statusOptions.map((status) => (
//               <div key={status} className="flex items-center gap-1.5 rounded-full bg-white/80 px-3 py-1.5 text-xs font-medium shadow-sm ring-1 ring-gray-200/50 backdrop-blur-sm">
//                 <span className={`h-2 w-2 rounded-full ${
//                   status === 'Pending' ? 'bg-amber-400' :
//                   status === 'Enrolled' ? 'bg-emerald-400' :
//                   status === 'Completed' ? 'bg-sky-400' : 'bg-rose-400'
//                 }`}></span>
//                 <span className="text-gray-700">{status}</span>
//               </div>
//             ))}
//           </div>
//         </header>

//         <main className="grid gap-8 lg:grid-cols-[2.2fr,1.3fr]">
//           <section className="space-y-5">
//             {/* Enhanced filter section */}
//             <div className="group rounded-2xl bg-white/90 p-5 shadow-lg shadow-indigo-100/20 ring-1 ring-gray-200/60 backdrop-blur-sm transition-all hover:shadow-xl hover:ring-gray-300/60">
//               <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
//                 <div className="grid flex-1 grid-cols-1 gap-4 sm:grid-cols-4">
//                   <div className="sm:col-span-1">
//                     <label className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-gray-600">
//                       <svg className="h-3.5 w-3.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//                       </svg>
//                       Search
//                     </label>
//                     <input
//                       type="text"
//                       value={search}
//                       onChange={(e) => setSearch(e.target.value)}
//                       onBlur={() => loadStudents(1)}
//                       placeholder="John Doe..."
//                       className="mt-1.5 w-full rounded-xl border-0 bg-gray-50/80 px-4 py-2.5 text-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500"
//                     />
//                   </div>
//                   <div>
//                     <label className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-gray-600">
//                       <svg className="h-3.5 w-3.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
//                       </svg>
//                       Course
//                     </label>
//                     <select
//                       value={filterCourse}
//                       onChange={(e) => {
//                         setFilterCourse(e.target.value);
//                         loadStudents(1);
//                       }}
//                       className="mt-1.5 w-full rounded-xl border-0 bg-gray-50/80 px-4 py-2.5 text-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-500"
//                     >
//                       <option value="">All courses</option>
//                       {courses.map((c) => (
//                         <option key={c} value={c}>{c}</option>
//                       ))}
//                     </select>
//                   </div>
//                   <div>
//                     <label className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-gray-600">
//                       <svg className="h-3.5 w-3.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-5m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
//                       </svg>
//                       Status
//                     </label>
//                     <select
//                       value={filterStatus}
//                       onChange={(e) => {
//                         setFilterStatus(e.target.value);
//                         loadStudents(1);
//                       }}
//                       className="mt-1.5 w-full rounded-xl border-0 bg-gray-50/80 px-4 py-2.5 text-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-500"
//                     >
//                       <option value="">All status</option>
//                       {statusOptions.map((s) => (
//                         <option key={s} value={s}>{s}</option>
//                       ))}
//                     </select>
//                   </div>
//                   <div className="flex items-end">
//                     <button
//                       type="button"
//                       onClick={() => {
//                         setSearch('');
//                         setFilterCourse('');
//                         setFilterStatus('');
//                         loadStudents(1);
//                       }}
//                       className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-50 hover:shadow-md focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
//                     >
//                       <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                       </svg>
//                       Clear
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Students table with modern styling */}
//             <div className="overflow-hidden rounded-2xl bg-white/90 shadow-lg shadow-indigo-100/20 ring-1 ring-gray-200/60 backdrop-blur-sm">
//               <div className="border-b border-gray-200/60 bg-gradient-to-r from-gray-50 to-white px-5 py-4">
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center gap-2">
//                     <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700">
//                       <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
//                       </svg>
//                     </div>
//                     <h2 className="text-sm font-semibold text-gray-900">
//                       Student Directory
//                     </h2>
//                     <span className="ml-2 rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-medium text-indigo-800">
//                       {students.length} enrolled
//                     </span>
//                   </div>
//                   {loading && (
//                     <div className="flex items-center gap-2">
//                       <svg className="h-4 w-4 animate-spin text-indigo-600" fill="none" viewBox="0 0 24 24">
//                         <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                         <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                       </svg>
//                       <span className="text-xs text-gray-500">Loading...</span>
//                     </div>
//                   )}
//                 </div>
//               </div>
//               <div className="overflow-x-auto">
//                 <table className="min-w-full divide-y divide-gray-200/80 text-sm">
//                   <thead>
//                     <tr className="bg-gradient-to-r from-gray-50/80 to-white/80">
//                       {['Name', 'Email', 'Phone', 'Course', 'Status', 'Actions'].map((header) => (
//                         <th key={header} className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
//                           {header}
//                         </th>
//                       ))}
//                     </tr>
//                   </thead>
//                   <tbody className="divide-y divide-gray-200/80 bg-white">
//                     {students.map((student) => (
//                       <tr
//                         key={student._id}
//                         className={`${statusClass(student.status)} transition-all hover:bg-gray-50/80`}
//                       >
//                         <td className="whitespace-nowrap px-5 py-4">
//                           <div className="flex items-center">
//                             <div className="h-8 w-8 flex-shrink-0 rounded-full bg-gradient-to-br from-indigo-100 to-indigo-200 flex items-center justify-center text-indigo-700 font-semibold text-xs">
//                               {student.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
//                             </div>
//                             <div className="ml-3">
//                               <div className="font-medium text-gray-900">{student.name}</div>
//                             </div>
//                           </div>
//                         </td>
//                         <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-600">
//                           <div className="flex items-center gap-1.5">
//                             <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
//                             </svg>
//                             {student.email}
//                           </div>
//                         </td>
//                         <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-600">
//                           <div className="flex items-center gap-1.5">
//                             <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
//                             </svg>
//                             {student.phone}
//                           </div>
//                         </td>
//                         <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-600">
//                           <span className="inline-flex items-center rounded-md bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700 ring-1 ring-inset ring-gray-300/30">
//                             {student.course}
//                           </span>
//                         </td>
//                         <td className="whitespace-nowrap px-5 py-4 text-sm">
//                           <span className={statusBadge(student.status)}>
//                             {student.status}
//                           </span>
//                         </td>
//                         <td className="whitespace-nowrap px-5 py-4 text-right text-sm">
//                           <button
//                             type="button"
//                             onClick={() => startEdit(student)}
//                             className="mr-2 inline-flex items-center gap-1 rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-200 transition-all hover:bg-indigo-100 hover:ring-indigo-300"
//                           >
//                             <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
//                             </svg>
//                             Edit
//                           </button>
//                           <button
//                             type="button"
//                             onClick={() => handleDelete(student._id)}
//                             className="inline-flex items-center gap-1 rounded-lg bg-rose-50 px-3 py-1.5 text-xs font-medium text-rose-700 ring-1 ring-inset ring-rose-200 transition-all hover:bg-rose-100 hover:ring-rose-300"
//                           >
//                             <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
//                             </svg>
//                             Delete
//                           </button>
//                         </td>
//                       </tr>
//                     ))}
//                     {students.length === 0 && !loading && (
//                       <tr>
//                         <td colSpan={6} className="px-5 py-12 text-center">
//                           <div className="flex flex-col items-center justify-center">
//                             <div className="rounded-full bg-gray-100 p-3">
//                               <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
//                               </svg>
//                             </div>
//                             <p className="mt-4 text-sm font-medium text-gray-900">No students found</p>
//                             <p className="mt-1 text-xs text-gray-500">Add a new student using the enrollment form.</p>
//                           </div>
//                         </td>
//                       </tr>
//                     )}
//                   </tbody>
//                 </table>
//               </div>
              
//               {/* Modern pagination */}
//               <div className="border-t border-gray-200/60 bg-gradient-to-r from-gray-50/80 to-white/80 px-5 py-4">
//                 <div className="flex items-center justify-between">
//                   <p className="text-xs text-gray-600">
//                     Showing <span className="font-medium">{students.length}</span> results • Page{' '}
//                     <span className="font-medium">{page}</span> of <span className="font-medium">{pages}</span>
//                   </p>
//                   <div className="flex gap-2">
//                     <button
//                       type="button"
//                       disabled={page <= 1}
//                       onClick={() => loadStudents(page - 1)}
//                       className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-xs font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-50 hover:shadow disabled:cursor-not-allowed disabled:opacity-50"
//                     >
//                       <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
//                       </svg>
//                       Previous
//                     </button>
//                     <button
//                       type="button"
//                       disabled={page >= pages}
//                       onClick={() => loadStudents(page + 1)}
//                       className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-xs font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-50 hover:shadow disabled:cursor-not-allowed disabled:opacity-50"
//                     >
//                       Next
//                       <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//                       </svg>
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </section>

//           {/* Enhanced enrollment form */}
//           <section>
//             <div className="sticky top-6 rounded-2xl bg-white/90 p-6 shadow-lg shadow-indigo-100/20 ring-1 ring-gray-200/60 backdrop-blur-sm transition-all hover:shadow-xl">
//               <div className="absolute -top-2 -right-2 h-20 w-20 rounded-full bg-indigo-100/40 blur-xl"></div>
//               <div className="relative">
//                 <div className="flex items-center gap-3">
//                   <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-indigo-500 text-white shadow-md">
//                     {editingId ? (
//                       <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
//                       </svg>
//                     ) : (
//                       <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
//                       </svg>
//                     )}
//                   </div>
//                   <div>
//                     <h2 className="text-base font-semibold text-gray-900">
//                       {editingId ? 'Edit Enrollment' : 'New Enrollment'}
//                     </h2>
//                     <p className="text-xs text-gray-500">
//                       {editingId ? 'Update student information' : 'Enter student details below'}
//                     </p>
//                   </div>
//                 </div>

//                 {error && (
//                   <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50/90 px-4 py-3 text-xs text-rose-700 backdrop-blur-sm">
//                     <div className="flex items-center gap-2">
//                       <svg className="h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                       </svg>
//                       {error}
//                     </div>
//                   </div>
//                 )}

//                 <form onSubmit={handleSubmit} className="mt-6 space-y-4">
//                   <div className="group relative">
//                     <label className="block text-xs font-medium text-gray-700">
//                       Full Name <span className="text-rose-500">*</span>
//                     </label>
//                     <div className="relative mt-1.5">
//                       <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
//                         <svg className="h-4 w-4 text-gray-400 group-focus-within:text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
//                         </svg>
//                       </div>
//                       <input
//                         type="text"
//                         name="name"
//                         value={form.name}
//                         onChange={handleChange}
//                         required
//                         className="w-full rounded-xl border-0 bg-gray-50/80 py-2.5 pl-10 pr-4 text-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500"
//                         placeholder="e.g. John Smith"
//                       />
//                     </div>
//                   </div>

//                   <div className="group relative">
//                     <label className="block text-xs font-medium text-gray-700">
//                       Email Address <span className="text-rose-500">*</span>
//                     </label>
//                     <div className="relative mt-1.5">
//                       <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
//                         <svg className="h-4 w-4 text-gray-400 group-focus-within:text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
//                         </svg>
//                       </div>
//                       <input
//                         type="email"
//                         name="email"
//                         value={form.email}
//                         onChange={handleChange}
//                         required
//                         className="w-full rounded-xl border-0 bg-gray-50/80 py-2.5 pl-10 pr-4 text-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500"
//                         placeholder="john@example.com"
//                       />
//                     </div>
//                   </div>

//                   <div className="group relative">
//                     <label className="block text-xs font-medium text-gray-700">
//                       Phone Number <span className="text-rose-500">*</span>
//                     </label>
//                     <div className="relative mt-1.5">
//                       <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
//                         <svg className="h-4 w-4 text-gray-400 group-focus-within:text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
//                         </svg>
//                       </div>
//                       <input
//                         type="tel"
//                         name="phone"
//                         value={form.phone}
//                         onChange={handleChange}
//                         pattern="[0-9]{7,15}"
//                         title="Digits only, 7-15 characters"
//                         required
//                         className="w-full rounded-xl border-0 bg-gray-50/80 py-2.5 pl-10 pr-4 text-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500"
//                         placeholder="e.g. 1234567890"
//                       />
//                     </div>
//                     <p className="mt-1.5 text-xs text-gray-500">Digits only, 7-15 characters</p>
//                   </div>

//                   <div className="group relative">
//                     <label className="block text-xs font-medium text-gray-700">
//                       Course Name <span className="text-rose-500">*</span>
//                     </label>
//                     <div className="relative mt-1.5">
//                       <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
//                         <svg className="h-4 w-4 text-gray-400 group-focus-within:text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
//                         </svg>
//                       </div>
//                       <input
//                         type="text"
//                         name="course"
//                         value={form.course}
//                         onChange={handleChange}
//                         required
//                         className="w-full rounded-xl border-0 bg-gray-50/80 py-2.5 pl-10 pr-4 text-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500"
//                         placeholder="e.g. Web Development"
//                       />
//                     </div>
//                   </div>

//                   <div className="group relative">
//                     <label className="block text-xs font-medium text-gray-700">
//                       Enrollment Status
//                     </label>
//                     <div className="relative mt-1.5">
//                       <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
//                         <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-5m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
//                         </svg>
//                       </div>
//                       <select
//                         name="status"
//                         value={form.status}
//                         onChange={handleChange}
//                         className="w-full rounded-xl border-0 bg-gray-50/80 py-2.5 pl-10 pr-8 text-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-500"
//                       >
//                         {statusOptions.map((s) => (
//                           <option key={s} value={s}>{s}</option>
//                         ))}
//                       </select>
//                     </div>
//                   </div>

//                   <div className="mt-6 flex items-center gap-3">
//                     <button
//                       type="submit"
//                       disabled={loading}
//                       className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:from-indigo-700 hover:to-indigo-600 hover:shadow-lg focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-60"
//                     >
//                       {loading ? (
//                         <>
//                           <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
//                             <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                             <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                           </svg>
//                           Processing...
//                         </>
//                       ) : (
//                         <>
//                           {editingId ? 'Update Student' : 'Add Student'}
//                           <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
//                           </svg>
//                         </>
//                       )}
//                     </button>
//                     {editingId && (
//                       <button
//                         type="button"
//                         onClick={resetForm}
//                         className="inline-flex items-center gap-1.5 rounded-xl border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-50 hover:shadow-md"
//                       >
//                         Cancel
//                         <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                         </svg>
//                       </button>
//                     )}
//                   </div>
//                 </form>
//               </div>
//             </div>
//           </section>
//         </main>
//       </div>
//     </div>
//   );
// }

// export default App;


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
  
  // Mobile menu state
  const [showFilters, setShowFilters] = useState(false);
  const [showMobileForm, setShowMobileForm] = useState(false);

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

  // Trigger load when filters change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadStudents(1);
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [search, filterCourse, filterStatus]);

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
    // On mobile, show form when editing
    setShowMobileForm(true);
  }

  function resetForm() {
    setEditingId(null);
    setForm(initialForm);
    setShowMobileForm(false);
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
      return 'bg-amber-50/80 border-l-4 border-l-amber-400';
    }
    if (status === 'Enrolled') {
      return 'bg-emerald-50/80 border-l-4 border-l-emerald-400';
    }
    if (status === 'Completed') {
      return 'bg-sky-50/80 border-l-4 border-l-sky-400';
    }
    if (status === 'Cancelled') {
      return 'bg-rose-50/80 border-l-4 border-l-rose-400';
    }
    return '';
  }

  function statusBadge(status) {
    const base = 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset';
    if (status === 'Pending') {
      return `${base} bg-amber-50 text-amber-700 ring-amber-600/20`;
    }
    if (status === 'Enrolled') {
      return `${base} bg-emerald-50 text-emerald-700 ring-emerald-600/20`;
    }
    if (status === 'Completed') {
      return `${base} bg-sky-50 text-sky-700 ring-sky-600/20`;
    }
    if (status === 'Cancelled') {
      return `${base} bg-rose-50 text-rose-700 ring-rose-600/20`;
    }
    return base;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 px-3 py-4 sm:px-4 sm:py-6 md:px-6 lg:px-8">
      {/* Decorative background elements - hidden on mobile for performance */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-[40%] top-0 -ml-24 h-48 w-48 -translate-x-1/2 rounded-full bg-indigo-100/30 blur-3xl max-md:hidden"></div>
        <div className="absolute right-0 top-1/3 h-72 w-72 rounded-full bg-purple-100/30 blur-3xl max-md:hidden"></div>
        <div className="absolute bottom-0 left-20 h-60 w-60 rounded-full bg-emerald-100/30 blur-3xl max-md:hidden"></div>
      </div>

      <div className="mx-auto max-w-7xl">
        {/* Mobile-optimized header */}
        <header className="mb-6 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative">
            <div className="absolute -left-3 -top-3 h-8 w-8 rounded-full bg-indigo-200/50 blur-md sm:h-12 sm:w-12"></div>
            <h1 className="relative text-xl font-bold tracking-tight text-gray-900 sm:text-2xl md:text-3xl lg:text-4xl">
              Student<span className="block text-sm font-normal text-indigo-600 sm:inline sm:text-base md:text-lg lg:text-xl"> Course Enrollment</span>
            </h1>
            <p className="mt-1 text-xs leading-5 text-gray-600 sm:mt-2 sm:text-sm">
              Manage students, courses, and enrollment status.
            </p>
          </div>
          
          {/* Mobile action buttons */}
          <div className="flex items-center gap-2 sm:hidden">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-white px-3 py-2 text-xs font-medium text-gray-700 shadow-sm ring-1 ring-gray-200"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Filters
              {(filterCourse || filterStatus || search) && (
                <span className="ml-1 h-2 w-2 rounded-full bg-indigo-600"></span>
              )}
            </button>
            <button
              onClick={() => {
                resetForm();
                setShowMobileForm(true);
              }}
              className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 px-3 py-2 text-xs font-medium text-white shadow-sm"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add
            </button>
          </div>

          {/* Status summary chips - horizontal scroll on mobile */}
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {statusOptions.map((status) => (
              <div 
                key={status} 
                onClick={() => {
                  setFilterStatus(filterStatus === status ? '' : status);
                  setShowFilters(true);
                }}
                className={`flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium shadow-sm ring-1 backdrop-blur-sm sm:gap-1.5 sm:px-3 sm:py-1.5 cursor-pointer transition-all ${
                  filterStatus === status 
                    ? 'bg-indigo-100 text-indigo-700 ring-indigo-300' 
                    : 'bg-white/80 text-gray-700 ring-gray-200/50 hover:bg-gray-100'
                }`}
              >
                <span className={`h-1.5 w-1.5 rounded-full sm:h-2 sm:w-2 ${
                  status === 'Pending' ? 'bg-amber-400' :
                  status === 'Enrolled' ? 'bg-emerald-400' :
                  status === 'Completed' ? 'bg-sky-400' : 'bg-rose-400'
                }`}></span>
                <span>{status}</span>
              </div>
            ))}
          </div>
        </header>

        <main className="grid gap-6 lg:grid-cols-3">
          {/* Left column - Students list (2/3 width on desktop) */}
          <section className="space-y-4 sm:space-y-5 lg:col-span-2">
            {/* Mobile filters dropdown */}
            <div className={`${showFilters ? 'block' : 'hidden'} sm:block`}>
              {/* Enhanced filter section - mobile optimized */}
              <div className="group rounded-xl bg-white/90 p-4 shadow-lg shadow-indigo-100/20 ring-1 ring-gray-200/60 backdrop-blur-sm transition-all hover:shadow-xl hover:ring-gray-300/60 sm:rounded-2xl sm:p-5">
                <div className="flex flex-col gap-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div>
                      <label className="flex items-center gap-1 text-xs font-medium text-gray-700">
                        <svg className="h-3.5 w-3.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        Search
                      </label>
                      <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Name, email, phone..."
                        className="mt-1.5 w-full rounded-lg border-0 bg-gray-50 px-4 py-2.5 text-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="flex items-center gap-1 text-xs font-medium text-gray-700">
                        <svg className="h-3.5 w-3.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        Course
                      </label>
                      <select
                        value={filterCourse}
                        onChange={(e) => {
                          setFilterCourse(e.target.value);
                          setPage(1);
                        }}
                        className="mt-1.5 w-full rounded-lg border-0 bg-gray-50 px-4 py-2.5 text-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="">All Courses</option>
                        {courses.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="flex items-center gap-1 text-xs font-medium text-gray-700">
                        <svg className="h-3.5 w-3.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-5m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Status
                      </label>
                      <select
                        value={filterStatus}
                        onChange={(e) => {
                          setFilterStatus(e.target.value);
                          setPage(1);
                        }}
                        className="mt-1.5 w-full rounded-lg border-0 bg-gray-50 px-4 py-2.5 text-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="">All Status</option>
                        {statusOptions.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex items-end">
                      <button
                        type="button"
                        onClick={() => {
                          setSearch('');
                          setFilterCourse('');
                          setFilterStatus('');
                          setPage(1);
                          setShowFilters(false);
                        }}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-50 hover:shadow-md"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Clear
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Students table with mobile card view */}
            <div className="overflow-hidden rounded-xl bg-white/90 shadow-lg shadow-indigo-100/20 ring-1 ring-gray-200/60 backdrop-blur-sm sm:rounded-2xl">
              <div className="border-b border-gray-200/60 bg-gradient-to-r from-gray-50 to-white px-5 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-sm font-semibold text-gray-900">
                        Student Directory
                      </h2>
                      <p className="text-xs text-gray-500">
                        {students.length} student{students.length !== 1 ? 's' : ''} enrolled
                      </p>
                    </div>
                  </div>
                  {loading && (
                    <div className="flex items-center gap-2">
                      <svg className="h-4 w-4 animate-spin text-indigo-600" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span className="text-xs text-gray-500">Loading...</span>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Mobile card view - visible on small screens */}
              <div className="block sm:hidden">
                {students.length === 0 && !loading ? (
                  <div className="px-4 py-12 text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                      <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>
                    <p className="mt-4 text-sm font-medium text-gray-900">No students found</p>
                    <p className="mt-1 text-xs text-gray-500">Try adjusting your filters or add a new student.</p>
                    <button
                      onClick={() => {
                        resetForm();
                        setShowMobileForm(true);
                      }}
                      className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-medium text-white shadow-sm hover:bg-indigo-700"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Add Student
                    </button>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200/80">
                    {students.map((student) => (
                      <div key={student._id} className={`${statusClass(student.status)} p-4 transition-all hover:bg-gray-50/80`}>
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gradient-to-br from-indigo-100 to-indigo-200 flex items-center justify-center text-indigo-700 font-semibold text-sm">
                              {student.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">{student.name}</div>
                              <div className="flex items-center gap-2 mt-1">
                                <span className={statusBadge(student.status)}>
                                  {student.status}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {student.course}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <button
                              onClick={() => startEdit(student)}
                              className="rounded-lg bg-indigo-50 p-2 text-indigo-700 ring-1 ring-inset ring-indigo-200 hover:bg-indigo-100"
                            >
                              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDelete(student._id)}
                              className="rounded-lg bg-rose-50 p-2 text-rose-700 ring-1 ring-inset ring-rose-200 hover:bg-rose-100"
                            >
                              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </div>
                        <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                          <div className="flex items-center gap-1.5 text-gray-600">
                            <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            <span className="truncate">{student.email}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-gray-600">
                            <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            <span>{student.phone}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Desktop table - hidden on mobile */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200/80">
                  <thead className="bg-gray-50/80">
                    <tr>
                      <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Student</th>
                      <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Email</th>
                      <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Phone</th>
                      <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Course</th>
                      <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Status</th>
                      <th className="px-6 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200/80 bg-white">
                    {students.map((student) => (
                      <tr
                        key={student._id}
                        className={`${statusClass(student.status)} transition-all hover:bg-gray-50/80`}
                      >
                        <td className="whitespace-nowrap px-6 py-4">
                          <div className="flex items-center">
                            <div className="h-9 w-9 flex-shrink-0 rounded-full bg-gradient-to-br from-indigo-100 to-indigo-200 flex items-center justify-center text-indigo-700 font-semibold text-sm">
                              {student.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                            </div>
                            <div className="ml-3">
                              <div className="font-medium text-gray-900">{student.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1.5">
                            <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            {student.email}
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1.5">
                            <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            {student.phone}
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <span className="inline-flex items-center rounded-md bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 ring-1 ring-inset ring-gray-300/30">
                            {student.course}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <span className={statusBadge(student.status)}>
                            {student.status}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-right text-sm">
                          <button
                            type="button"
                            onClick={() => startEdit(student)}
                            className="mr-2 inline-flex items-center gap-1.5 rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-200 transition-all hover:bg-indigo-100 hover:ring-indigo-300"
                          >
                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(student._id)}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-rose-50 px-3 py-1.5 text-xs font-medium text-rose-700 ring-1 ring-inset ring-rose-200 transition-all hover:bg-rose-100 hover:ring-rose-300"
                          >
                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                    {students.length === 0 && !loading && (
                      <tr>
                        <td colSpan={6} className="px-6 py-12 text-center">
                          <div className="flex flex-col items-center justify-center">
                            <div className="rounded-full bg-gray-100 p-3">
                              <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                              </svg>
                            </div>
                            <p className="mt-4 text-sm font-medium text-gray-900">No students found</p>
                            <p className="mt-1 text-xs text-gray-500">Try adjusting your filters or add a new student.</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              
              {/* Pagination */}
              {students.length > 0 && (
                <div className="border-t border-gray-200/60 bg-gradient-to-r from-gray-50/80 to-white/80 px-6 py-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600">
                      Page <span className="font-medium">{page}</span> of <span className="font-medium">{pages}</span>
                    </p>
                    <div className="flex gap-3">
                      <button
                        type="button"
                        disabled={page <= 1}
                        onClick={() => loadStudents(page - 1)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-50 hover:shadow disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Previous
                      </button>
                      <button
                        type="button"
                        disabled={page >= pages}
                        onClick={() => loadStudents(page + 1)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-50 hover:shadow disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Next
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Right column - Form (1/3 width on desktop, full width modal on mobile) */}
          <section className="lg:col-span-1">
            {/* Desktop form - always visible */}
            <div className="hidden lg:block sticky top-6">
              <div className="rounded-2xl bg-white/90 p-6 shadow-lg shadow-indigo-100/20 ring-1 ring-gray-200/60 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-indigo-500 text-white shadow-md">
                    {editingId ? (
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      {editingId ? 'Edit Student' : 'Add New Student'}
                    </h2>
                    <p className="text-xs text-gray-500">
                      {editingId ? 'Update student information' : 'Enter student details'}
                    </p>
                  </div>
                </div>

                {error && (
                  <div className="mb-6 rounded-xl border border-rose-200 bg-rose-50/90 px-4 py-3 text-sm text-rose-700">
                    <div className="flex items-center gap-2">
                      <svg className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {error}
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Full Name <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                        <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                        className="w-full rounded-lg border-0 bg-gray-50 py-3 pl-11 pr-4 text-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500"
                        placeholder="John Smith"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Email Address <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                        <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        className="w-full rounded-lg border-0 bg-gray-50 py-3 pl-11 pr-4 text-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Phone Number <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                        <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </div>
                      <input
                        type="tel"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        pattern="[0-9]{7,15}"
                        title="Digits only, 7-15 characters"
                        required
                        className="w-full rounded-lg border-0 bg-gray-50 py-3 pl-11 pr-4 text-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500"
                        placeholder="1234567890"
                      />
                    </div>
                    <p className="mt-1.5 text-xs text-gray-500">Digits only, 7-15 characters</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Course Name <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                        <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                      </div>
                      <input
                        type="text"
                        name="course"
                        value={form.course}
                        onChange={handleChange}
                        required
                        className="w-full rounded-lg border-0 bg-gray-50 py-3 pl-11 pr-4 text-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500"
                        placeholder="Web Development"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Enrollment Status
                    </label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                        <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-5m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <select
                        name="status"
                        value={form.status}
                        onChange={handleChange}
                        className="w-full rounded-lg border-0 bg-gray-50 py-3 pl-11 pr-10 text-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-500"
                      >
                        {statusOptions.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-500 px-5 py-3 text-sm font-semibold text-white shadow-md transition-all hover:from-indigo-700 hover:to-indigo-600 hover:shadow-lg disabled:opacity-60"
                    >
                      {loading ? (
                        <>
                          <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing...
                        </>
                      ) : (
                        <>
                          {editingId ? 'Update Student' : 'Add Student'}
                        </>
                      )}
                    </button>
                    {editingId && (
                      <button
                        type="button"
                        onClick={resetForm}
                        className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-5 py-3 text-sm font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-50 hover:shadow-md"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>

            {/* Mobile form modal/drawer */}
            {showMobileForm && (
              <div className="fixed inset-0 z-50 flex items-end sm:hidden">
                <div 
                  className="fixed inset-0 bg-black/20 backdrop-blur-sm" 
                  onClick={() => setShowMobileForm(false)}
                />
                <div className="relative w-full bg-white rounded-t-2xl shadow-2xl animate-slide-up">
                  <div className="p-6">
                    <div className="flex justify-center mb-4">
                      <div className="h-1 w-12 rounded-full bg-gray-300"></div>
                    </div>
                    
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-indigo-500 text-white shadow-md">
                          {editingId ? (
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                          ) : (
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                            </svg>
                          )}
                        </div>
                        <div>
                          <h2 className="text-lg font-semibold text-gray-900">
                            {editingId ? 'Edit Student' : 'Add New Student'}
                          </h2>
                          <p className="text-xs text-gray-500">
                            {editingId ? 'Update student information' : 'Enter student details'}
                          </p>
                        </div>
                      </div>
                      <button 
                        onClick={() => setShowMobileForm(false)}
                        className="rounded-lg p-2 text-gray-400 hover:bg-gray-100"
                      >
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>

                    {error && (
                      <div className="mb-6 rounded-xl border border-rose-200 bg-rose-50/90 px-4 py-3 text-sm text-rose-700">
                        <div className="flex items-center gap-2">
                          <svg className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {error}
                        </div>
                      </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          Full Name <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative">
                          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                          <input
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            required
                            className="w-full rounded-lg border-0 bg-gray-50 py-3 pl-11 pr-4 text-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500"
                            placeholder="John Smith"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          Email Address <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative">
                          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            required
                            className="w-full rounded-lg border-0 bg-gray-50 py-3 pl-11 pr-4 text-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500"
                            placeholder="john@example.com"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          Phone Number <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative">
                          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                          </div>
                          <input
                            type="tel"
                            name="phone"
                            value={form.phone}
                            onChange={handleChange}
                            pattern="[0-9]{7,15}"
                            title="Digits only, 7-15 characters"
                            required
                            className="w-full rounded-lg border-0 bg-gray-50 py-3 pl-11 pr-4 text-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500"
                            placeholder="1234567890"
                          />
                        </div>
                        <p className="mt-1.5 text-xs text-gray-500">Digits only, 7-15 characters</p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          Course Name <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative">
                          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                          </div>
                          <input
                            type="text"
                            name="course"
                            value={form.course}
                            onChange={handleChange}
                            required
                            className="w-full rounded-lg border-0 bg-gray-50 py-3 pl-11 pr-4 text-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500"
                            placeholder="Web Development"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          Enrollment Status
                        </label>
                        <div className="relative">
                          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-5m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <select
                            name="status"
                            value={form.status}
                            onChange={handleChange}
                            className="w-full rounded-lg border-0 bg-gray-50 py-3 pl-11 pr-10 text-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-500"
                          >
                            {statusOptions.map((s) => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 pt-4">
                        <button
                          type="submit"
                          disabled={loading}
                          className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-500 px-5 py-3 text-sm font-semibold text-white shadow-md transition-all hover:from-indigo-700 hover:to-indigo-600 hover:shadow-lg disabled:opacity-60"
                        >
                          {loading ? (
                            <>
                              <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Processing...
                            </>
                          ) : (
                            <>
                              {editingId ? 'Update Student' : 'Add Student'}
                            </>
                          )}
                        </button>
                        {editingId && (
                          <button
                            type="button"
                            onClick={resetForm}
                            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-5 py-3 text-sm font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-50 hover:shadow-md"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            )}
          </section>
        </main>
      </div>

      <style jsx>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

export default App;
