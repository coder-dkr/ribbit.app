"use client";
import { usePost } from "@/hooks";
import { useEffect, useState, useRef } from "react";
import { IoMdClose } from "react-icons/io";

const PostModal = () => {
  const { isModalOpen, setIsModalOpen } = usePost();
  const [text, setText] = useState("");
  const textareaRef = useRef(null);
  useEffect(() => {}, [isModalOpen]);

  const handleCloseModal = () => {
    setIsModalOpen((prev) => !prev);
  };

  const handleInput = (e : React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    e.target.style.height = "auto"; 
    e.target.style.height = `${e.target.scrollHeight}px`; 
  };
  return (
    <>
      {isModalOpen && (
        <>
          <div
            //   onClick={handleCloseModal}
            className="absolute inset-0 z-50 bg-gray-700 opacity-50"
          ></div>
          <section className="absolute w-xl left-1/2 top-20 -translate-x-1/2 bg-black border border-gray-900 p-6 rounded-lg z-[99] flex flex-col gap-4">
            <button
              onClick={handleCloseModal}
              className="absolute right-3 top-3 p-2 hover:bg-white/20 rounded-full text-xl cursor-pointer"
            >
              <IoMdClose />
            </button>
            <h1>Create Post</h1>
            <textarea
              ref={textareaRef}
              value={text}
              onChange={handleInput}
              rows={4}
              placeholder="What's happening.."
              className="w-full text-xl outline-0 border border-gray-800 rounded-xl p-3 resize-none overflow-hidden"
              style={{ minHeight: "40px" }} 
            />
            <div className="flex items-center justify-between">
                <div className="">
                    options
                </div>
                <button className="px-8 py-2 rounded-full bg-gradient-to-b from-green-500 to-green-600 text-white focus:ring-2 focus:ring-green-400 hover:shadow-xl transition duration-200">
                Post
                </button>
            </div>
          </section>
        </>
      )}
    </>
  );
};

export default PostModal;
