"use client";
import { usePost } from "@/hooks";
import { useEffect, useState, useRef } from "react";
import { IoMdClose } from "react-icons/io";
import { useAuth } from "@/hooks";
import Image from "next/image";
import { MdInsertPhoto } from "react-icons/md";
import { FaCamera } from "react-icons/fa6";
import CameraProvider from "@/contexts/CameraContext";
import { useCamera } from "@/hooks/useCamera";

const PostModal = () => {
  const { isModalOpen, setIsModalOpen } = usePost();
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const textareaRef = useRef(null);
  const inputImageRef = useRef<HTMLInputElement>(null);

   const {startCamera} = useCamera()
   console.log(startCamera)


  useEffect(() => {}, [isModalOpen]);

  const { user } = useAuth();

  const handleCloseModal = () => {
    setImagePreview(null);
    setIsModalOpen((prev) => !prev);
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; // Get the selected file
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl);
      if(textareaRef.current)
      (textareaRef.current as HTMLTextAreaElement).focus() ;
    }
  };

  return (
    <CameraProvider>
      {isModalOpen && (
        <>
          <div
            //   onClick={handleCloseModal}
            className="absolute inset-0 z-50 bg-gray-700 opacity-50"
          ></div>
          <section className="absolute w-xl left-1/2 top-20 -translate-x-1/2 bg-black border border-gray-900 px-6 py-4 rounded-lg z-[99] flex flex-col gap-2">
            <button
              onClick={handleCloseModal}
              className="absolute right-3 top-3 p-2 hover:bg-white/20 rounded-full text-xl cursor-pointer"
            >
              <IoMdClose />
            </button>
            <span className="flex items-center gap-3">
              {user?.user_metadata.avatar_url && (
                <Image
                  width={45}
                  height={45}
                  src={user.user_metadata.avatar_url}
                  alt="user avatar"
                  className="rounded-full border border-slate-800"
                />
              )}
              <select name="pets" id="pet-select" className="border p-1 px-2 rounded-full border-green-500 bg-[#64ff6422] text-sm outline-0">
                <option value="dog">everyone</option>
                <hr></hr>
                <option value="cat">communities</option>
              </select>
            </span>
            <div className="ml-2">
              <textarea
                autoFocus
                ref={textareaRef}
                value={text}
                onChange={handleInput}
                rows={4}
                placeholder="What's happening.."
                className="w-full text-xl outline-0 p-3 resize-none overflow-hidden"
                style={{ minHeight: "40px" }}
              />
              {imagePreview && (
                <div className="mt-2">
                  <Image
                    layout="responsive"
                    width={800}
                    height={400}
                    className="w-full rounded-3xl object-cover"
                    src={imagePreview}
                    alt="Selected"
                  />
                </div>
              )}
            </div>
            <div className="flex items-center justify-between mt-2">
              <div className="relative">
                <div className="px-4 flex items-center gap-x-5">
                  <label
                    htmlFor="input-post-image"
                    className="relative group text-green-500 rounded-full text-2xl cursor-pointer"
                  >
                    <span className="absolute inset-0 hidden group-hover:inline blur-sm bg-green-300 m-1 duration-150 -z-[1]" />
                    <MdInsertPhoto />
                  </label>
                  <input
                    ref={inputImageRef}
                    id="input-post-image"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                  <button onClick={startCamera} className="relative group text-green-500 rounded-full text-[1.3rem] cursor-pointer">
                    <span className="absolute inset-0 hidden group-hover:inline blur-sm bg-green-300 m-0.5 duration-150 -z-[1]" />
                    <FaCamera/>
                  </button>
                </div>
              </div>
              <button className="px-8 py-2 rounded-full bg-gradient-to-b from-green-500 to-green-600 text-white focus:ring-2 focus:ring-green-400 hover:shadow-xl transition duration-200">
                Post
              </button>
            </div>
          </section>
        </>
      )}
    </CameraProvider>
  );
};

export default PostModal;
