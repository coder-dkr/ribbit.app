"use client";
import { usePost } from "@/hooks";
import { useEffect, useState, useRef } from "react";
import { IoMdClose } from "react-icons/io";
import { useAuth } from "@/hooks";
import Image from "next/image";
import { MdInsertPhoto } from "react-icons/md";
import { BsEmojiKiss } from "react-icons/bs";
import { FaCamera } from "react-icons/fa6";
import { useCamera } from "@/hooks/useCamera";
import EmojiPicker, { Theme, EmojiStyle } from "emoji-picker-react";
import PostType from "@/types/PostType";
import supabase from "@/supabase/supabase-client";
import { useMutation } from "@tanstack/react-query";

const createPost = async (post: PostType) => {
  let newPost = post
  if (post.upLoadFile) {
    
    const filepath = `ribbit-${Date.now()}-${post.upLoadFile?.name}`;

    const { error: uploadError } = await supabase.storage
      .from("post-images")
      .upload(filepath, post.upLoadFile!);

    if (uploadError) throw new Error(`ERROR UPLOADING FILE 111 ${uploadError.message}`);
    
    const { data: publicDataUrl } = await supabase.storage
      .from("post-images")
      .getPublicUrl(filepath);
      newPost = { ...post, image_url: publicDataUrl.publicUrl as string};
  }

  const { data, error } = await supabase.from("posts").insert([newPost]);
  if (error) throw new Error(error.message);
  
  return data;
};

const PostModal = () => {
  const { isModalOpen, setIsModalOpen } = usePost();
  const [text, setText] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [openEmojiPicker, setOpenEmojiPicker] = useState<boolean>(false);
  const textareaRef = useRef(null);
  const inputImageRef = useRef<HTMLInputElement>(null);

  const { startCamera, image_data_url: imgCaptureSrc , capturedFile} = useCamera();

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    setOpenEmojiPicker(false);
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isModalOpen]);

  const { user } = useAuth();

  const handleCloseModal = () => {
    setIsModalOpen((prev) => !prev);
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl);
      if (textareaRef.current)
        (textareaRef.current as HTMLTextAreaElement).focus();
    }
  };

  const handleClearPreview = () => {
    setImagePreview(null);
    if (textareaRef.current) {
      (textareaRef.current as HTMLTextAreaElement).focus();
    }
  };

  useEffect(() => {
    if (imgCaptureSrc) {
      setSelectedFile(capturedFile)
      setImagePreview(imgCaptureSrc);
      if (textareaRef.current) {
        (textareaRef.current as HTMLTextAreaElement).focus();
      }
    }
  }, [imgCaptureSrc,capturedFile]);

  const handleStartCamera = () => {
    setOpenEmojiPicker(false);
    startCamera();
  };

  const { mutate } = useMutation({ mutationFn: createPost });

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (text === "") {
      return;
    }
    const newPost: PostType = {
      content: text,
      upLoadFile: selectedFile,
      user_id: user!.id,
    };
    mutate(newPost);
    setText("");
    setImagePreview(null);
    handleCloseModal();
  };

  return (
    <>
      {isModalOpen && (
        <>
          <div
            onClick={() => {
              if (openEmojiPicker) setOpenEmojiPicker(false);
              else handleCloseModal();
            }}
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
              <select
                name="pets"
                id="pet-select"
                className="border p-1 px-2 rounded-full border-green-500 bg-[#64ff6422] text-sm outline-0"
              >
                <option value="dog">everyone</option>
                <hr></hr>
                <option value="cat">communities</option>
              </select>
            </span>
            <div className="ml-2 border-b border-gray-800">
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
                <div className="mt-2 relative">
                  <Image
                    layout="responsive"
                    width={800}
                    height={400}
                    className="w-full rounded-3xl object-cover"
                    src={imagePreview}
                    alt="Selected"
                  />
                  <button
                    onClick={handleClearPreview}
                    className="absolute -right-2 -top-2 p-2 bg-gray-800 rounded-full text-xl cursor-pointer"
                  >
                    <IoMdClose />
                  </button>
                </div>
              )}
            </div>
            <div className="flex items-center justify-between mt-2">
              <div className="relative">
                <div className="px-4 flex items-center gap-x-5">
                  <button
                    onClick={handleStartCamera}
                    className="relative group text-green-500 rounded-full text-[1.3rem] cursor-pointer"
                  >
                    <span className="absolute inset-0 hidden group-hover:inline blur-sm bg-green-300 m-0.5 duration-150 -z-[1]" />
                    <FaCamera />
                  </button>
                  <label
                    htmlFor="input-post-image"
                    onClick={() => setOpenEmojiPicker(false)}
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
                  <button
                    onClick={() => setOpenEmojiPicker((p) => !p)}
                    className="relative group text-green-500 rounded-full text-[1.3rem] cursor-pointer"
                  >
                    <span className="absolute inset-0 hidden group-hover:inline blur-sm bg-green-300 m-0.5 duration-150 -z-[1]" />
                    <BsEmojiKiss />
                  </button>
                </div>
              </div>
              <button
                onClick={handleCreatePost}
                className="px-8 py-2 rounded-full bg-gradient-to-b from-green-500 to-green-600 text-white focus:ring-2 focus:ring-green-400 hover:shadow-xl transition duration-200"
              >
                Post
              </button>
            </div>
            <div className="mt-1 absolute top-1/3 -left-1/2">
              <EmojiPicker
                open={openEmojiPicker}
                theme={"dark" as Theme}
                emojiStyle={"google" as EmojiStyle}
                onEmojiClick={(emoji) => {
                  setText((prev) => prev + emoji.emoji);
                }}
                width={"100%"}
              />
            </div>
          </section>
        </>
      )}
    </>
  );
};

export default PostModal;
