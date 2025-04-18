"use client";

export default function Navbar({ activePage }: { activePage: string }) {
  return (
    <div className="bg-white p-5 shadow-md flex items-center justify-between">
      <div className="flex gap-2 items-center">
        {" "}
        <div className="md:hidden w-10 h-10 bg-black rounded-full flex items-center justify-center">
          <span className="text-white text-lg font-bold">B</span>
        </div>{" "}
        <h1 className="text-2xl text-black font-semibold">{activePage}</h1>
      </div>
    </div>
  );
}
