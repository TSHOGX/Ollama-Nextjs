"use client";

import React, { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "react-toastify";

export default function FilesBox() {
  const [tableList, setTableList] = useState<{ name: string }[]>();

  const handleDrop = async (files: File[]) => {
    console.log(files.toString());
    // for (const file of files) {
    //   try {
    //     toast
    //     // agent file
    //       .promise(createTableFromFile(file, duckConn), {
    //         pending: "Creating Table...",
    //         success: "Table created 👌",
    //         error: "Creation failed 🤯",
    //       })
    //       .then(() => {
    //         fetchData();
    //       });
    //   } catch (e) {
    //     console.log(e);
    //   }
    // }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: handleDrop,
    accept: {
      "text/csv": [".csv", ".CSV"],
    },
  });

  return (
    <div className=" flex min-h-full flex-col items-center justify-between gap-6 border p-2 dark:border-white">
      <div className=" text-lg">FilesBox</div>
      <div
        {...getRootProps({
          className: "dropzone border border-dashed min-w-full p-2",
        })}
      >
        <input {...getInputProps()} />
        <p className=" text-gray-500 dark:text-gray-400">
          Click / Drop to add files
        </p>
        <p className=" text-sm text-gray-400 dark:text-gray-400">
          Support: csv
        </p>
      </div>
      <div className=" min-w-full grow border border-dashed p-2">
        <div className=" pb-4 text-center">Imported Table List</div>
        <ul className=" flex flex-col gap-2 text-gray-500 dark:text-gray-400">
          {tableList?.map((tbl) => (
            <li key={tbl.name}>{tbl.name}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
