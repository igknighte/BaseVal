import { useState, useEffect } from "react";
export default function Page() {
  const [page, setPage] = useState(1);
  const [select, setSelect] = useState(page);

  const handleBlur = (e) => {
    let val = select;
    val = Math.min(val, 30);
    val = Math.max(val, 1);
    setSelect(val);
    setPage(val);
  };

  useEffect(
    function () {
      setSelect(page);
    },
    [page],
  );

  useEffect(
    function () {
      if (select > 30) {
        setPage(30);
      }
      if (select < 1) {
        setPage(1);
      }
    },
    [select],
  );

  return (
    <>
      <div className="flex items-center gap-8">
        <button
          disabled={page == 1}
          className="relative h-8 max-h-[32px] w-8 max-w-[32px] select-none rounded-lg border border-gray-900 text-center align-middle font-sans text-xs font-medium uppercase text-gray-900 transition-all hover:opacity-75 focus:ring focus:ring-gray-300 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
          type="button"
          onClick={() => setPage((s) => Math.max(1, s - 1))}
        >
          <span className="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="2"
              stroke="currentColor"
              aria-hidden="true"
              className="w-4 h-4"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
              ></path>
            </svg>
          </span>
        </button>
        <p className="block font-sans text-base antialiased font-normal leading-relaxed text-gray-700">
          Page{" "}
          <input
            type="number"
            value={select}
            onChange={(e) => setSelect(e.target.value)}
            onBlur={handleBlur}
            className="w-10 font-bold text-gray-900 rounded-sm"
          />{" "}
          of
          <strong className="text-gray-900 pl-2">30</strong>
        </p>
        <button
          disabled={page == 30}
          className="relative h-8 max-h-[32px] w-8 max-w-[32px] select-none rounded-lg border border-gray-900 text-center align-middle font-sans text-xs font-medium uppercase text-gray-900 transition-all hover:opacity-75 focus:ring focus:ring-gray-300 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
          type="button"
          onClick={() => setPage((s) => Math.min(30, s + 1))}
        >
          <span className="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="2"
              stroke="currentColor"
              aria-hidden="true"
              className="w-4 h-4"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
              ></path>
            </svg>
          </span>
        </button>
      </div>
      <div className="bg-blue-500 text-white p-4 mb-1 border-cyan-50">
        {page}
      </div>
    </>
  );
}
