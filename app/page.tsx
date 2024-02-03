import Link from "next/link";

export default function Home() {
  return (
    <main className=" flex min-h-screen flex-col items-center justify-between bg-white p-24 text-black dark:bg-black dark:text-white">
      <div className=" z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <Link
          className=" fixed left-0 top-0 flex w-full justify-center border-b pb-6 pt-8 hover:border-gray-500 lg:static lg:w-auto lg:rounded-xl lg:border lg:p-4 dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:dark:bg-zinc-800/30"
          href="https://www.langchain.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Ollama &&nbsp;
          <code className="font-mono font-bold">LangChain</code>
        </Link>
        <div className=" fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white lg:static lg:h-auto lg:w-auto lg:bg-none dark:from-black dark:via-black">
          <a
            className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0"
            href="https://github.com/TSHOGX"
            target="_blank"
            rel="noopener noreferrer"
          >
            TSHOGX | TX
          </a>
        </div>
      </div>

      <div className=" mb-32 flex flex-col text-center lg:mb-0 lg:w-full lg:max-w-5xl lg:text-left">
        <a
          href={`/Ollama`}
          className=" group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
        >
          <h2 className={`mb-3 text-2xl font-semibold`}>
            Chat With Ollama{" "}
            <span className=" inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className={`m-0 text-sm opacity-50 lg:max-w-[30ch]`}>
            Local Ollama server needed.
          </p>
        </a>
      </div>
    </main>
  );
}
