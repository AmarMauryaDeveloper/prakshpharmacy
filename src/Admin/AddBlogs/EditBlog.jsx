import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { db, storage } from "../../firebase"; 
import { doc, getDoc, updateDoc } from "firebase/firestore";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import MonacoEditor from "@monaco-editor/react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid"; // For unique image file names

const EditBlog = () => {
  const { blogId } = useParams();
  const navigate = useNavigate();

  const [blog, setBlog] = useState({
    title: "",
    content: "",
    link: "",
    image: null,
    fields: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogData = async () => {
      try {
        const blogDoc = await getDoc(doc(db, "blogs", blogId));
        if (blogDoc.exists()) {
          setBlog(blogDoc.data());
        }
      } catch (error) {
        console.error("Error fetching blog: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogData();
  }, [blogId]);

  const handleFieldChange = (index, fieldKey, value) => {
    const updatedFields = [...blog.fields];
    updatedFields[index][fieldKey] = value;
    setBlog({ ...blog, fields: updatedFields });
  };

  const handleAddField = (type) => {
    const newField = {
      type: type,
      value: "",
      language: "javascript", 
    };
    setBlog({ ...blog, fields: [...blog.fields, newField] });
  };

  const handleRemoveField = (index) => {
    const updatedFields = blog.fields.filter((_, i) => i !== index);
    setBlog({ ...blog, fields: updatedFields });
  };

  const handleImageUpload = async (file, index) => {
    if (!file) return;

    const imageRef = ref(storage, `images/${uuidv4()}_${file.name}`);
    const uploadTask = uploadBytesResumable(imageRef, file);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        null,
        (error) => reject(error),
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            handleFieldChange(index, "value", downloadURL);
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handlePublish = async () => {
    try {
      setLoading(true);

      const updatedBlog = { ...blog };
      for (let i = 0; i < updatedBlog.fields.length; i++) {
        const field = updatedBlog.fields[i];
        if (field.type === "image" && field.value instanceof File) {
          await handleImageUpload(field.value, i);
        }
      }

      await updateDoc(doc(db, "blogs", blogId), updatedBlog);
      navigate("/all-blogs");
    } catch (error) {
      console.error("Error updating blog: ", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 mx-auto text-white bg-black">
      {loading ? (
        <p>Loading blog...</p>
      ) : (
        <div>
          <h1 className="mb-6 text-3xl font-semibold text-center">Edit Blog</h1>

          {/* Blog Title */}
          <div className="mb-6">
            <label className="block text-lg">Title</label>
            <input
              type="text"
              value={blog.title}
              onChange={(e) => setBlog({ ...blog, title: e.target.value })}
              className="w-full p-2 mt-2 bg-black border border-gray-300 rounded-lg"
            />
          </div>

          {/* Blog Content */}
          <div className="mb-6">
            <label className="block text-lg">Content</label>
            <ReactQuill
              value={blog.content}
              onChange={(value) => setBlog({ ...blog, content: value })}
              className="w-full"
              modules={{
                toolbar: [
                  [{ 'header': '1' }, { 'header': '2' }, 'bold', 'italic', 'link'], // Adding 'header' for h1, h2 etc.
                  [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                  ['blockquote', 'code-block'],
                  ['link', 'image'],
                  ['clean']
                ],
              }}
            />
          </div>

          {/* Dynamic Fields */}
          {blog.fields.map((field, index) => (
            <div key={index} className="p-4 mb-6 border rounded-lg">
              <label className="block text-lg">{`Field ${index + 1}`}</label>

              {field.type === "heading" && (
                <div>
                  <label className="block text-lg">Heading</label>
                  <input
                    type="text"
                    value={field.value}
                    onChange={(e) => handleFieldChange(index, "value", e.target.value)}
                    placeholder="Enter Heading"
                    className="w-full p-2 mt-2"
                  />
                </div>
              )}

              {field.type === "description" && (
                <div>
                  <label className="block text-lg">Description</label>
                  <textarea
                    value={field.value}
                    onChange={(e) => handleFieldChange(index, "value", e.target.value)}
                    placeholder="Enter Description"
                    className="w-full p-2 mt-2 bg-black "
                  />
                </div>
              )}

              {field.type === "link" && (
                <div>
                  <label className="block text-lg">Link</label>
                  <input
                    type="url"
                    value={field.value}
                    onChange={(e) => handleFieldChange(index, "value", e.target.value)}
                    placeholder="Enter Link"
                    className="w-full p-2 mt-2 bg-black"
                  />
                </div>
              )}

              {field.type === "image" && (
                <div>
                  <label className="block text-lg">Image</label>
                  <input
                    type="file"
                    onChange={(e) => handleImageUpload(e.target.files[0], index)}
                    className="w-full p-2 mt-2 bg-black"
                  />
                  {field.value && (
                    <div className="mt-2">
                      <img
                        src={typeof field.value === "string" ? field.value : URL.createObjectURL(field.value)}
                        alt="Uploaded"
                        className="object-cover w-32 h-32"
                      />
                    </div>
                  )}
                </div>
              )}

              {field.type === "code" && (
                <div>
                  <label className="block text-lg">Code Block</label>
                  <select
                    value={field.language}
                    onChange={(e) => handleFieldChange(index, "language", e.target.value)}
                    className="w-full p-2 mt-2"
                  >
                    <option value="javascript">JavaScript</option>
                    <option value="python">Python</option>
                    <option value="java">Java</option>
                    <option value="cpp">C++</option>
                    <option value="html">HTML</option>
                    <option value="css">CSS</option>
                  </select>

                  <MonacoEditor
                    language={field.language}
                    value={field.value}
                    onChange={(value) => handleFieldChange(index, "value", value)}
                    height="200px"
                    theme="vs-dark"
                  />
                </div>
              )}

              {/* Remove Field Button */}
              <button
                onClick={() => handleRemoveField(index)}
                className="mt-2 text-white bg-red-500 rounded-lg"
              >
                Remove Field
              </button>
            </div>
          ))}

          {/* Buttons to Add Fields */}
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => handleAddField("heading")}
              className="w-full px-6 py-2 text-white bg-green-500 rounded-lg hover:bg-green-600"
            >
              Add Heading
            </button>
            <button
              onClick={() => handleAddField("description")}
              className="w-full px-6 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
            >
              Add Description
            </button>
            <button
              onClick={() => handleAddField("link")}
              className="w-full px-6 py-2 text-white bg-yellow-500 rounded-lg hover:bg-yellow-600"
            >
              Add Link
            </button>
            <button
              onClick={() => handleAddField("image")}
              className="w-full px-6 py-2 text-white bg-purple-500 rounded-lg hover:bg-purple-600"
            >
              Add Image
            </button>
            <button
              onClick={() => handleAddField("code")}
              className="w-full px-6 py-2 text-white bg-teal-500 rounded-lg hover:bg-teal-600"
            >
              Add Code Block
            </button>
          </div>

          {/* Save Changes Button */}
          <button
            onClick={handlePublish}
            className="px-6 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
          >
            Save Changes
          </button>
        </div>
      )}
    </div>
  );
};

export default EditBlog;
