import React, { useState, useEffect, useRef } from "react";

import "react-quill-new/dist/quill.snow.css";
import ReactQuill from "react-quill-new";

const RichTextEditor = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (content: string) => void;
}) => {
  const [editorValue, setEditorValue] = useState(value || "");
  const quillRef = useRef(false);

  useEffect(() => {
    if (!quillRef.current) {
      quillRef.current = true;

      // Fix : ensure only one toolbar
      setTimeout(() => {
        document.querySelectorAll(".ql-toolbar").forEach((toolbar, index) => {
          if (index > 0) {
            toolbar.remove();
          }
        });
      }, 100);
    }
  }, []);
  return (
    <div className="relative">
      <ReactQuill
        value={editorValue}
        theme="snow"
        onChange={(content) => {
          setEditorValue(content);
          onChange(content);
        }}
        modules={{
          toolbar: [
            [{ font: [] }],
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            [{ size: ["small", false, "large", "huge"] }],
            ["bold", "italic", "underline", "strike"],
            [{ color: [] }, { background: [] }],
            [{ script: "sub" }, { script: "super" }],
            [{ list: "ordered" }, { list: "bullet" }],
            [{ indent: "-1" }, { indent: "+1" }],
            [{ direction: "rtl" }],
            [{ align: [] }],
            ["link", "image", "video", "formula"],
            ["clean"],
          ],
        }}
        placeholder="Write a detailed product description here..."
        className="bg-white border border-gray-300 text-black rounded-md shadow-sm"
        style={{
          minHeight: "250px",
        }}
      />
      <style>
        {`
    .ql-toolbar {
      background: #f9f9f9;
      border: 1px solid #ccc;
      border-bottom: none;
      border-radius: 8px 8px 0 0;
      padding: 8px;
    }

    .ql-container {
      background: #fff !important;
      border: 1px solid #ccc !important;
      border-radius: 0 0 8px 8px;
      color: #333;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    }

    .ql-editor {
      min-height: 200px;
      font-size: 16px;
      line-height: 1.6;
      padding: 12px;
    }

    .ql-picker, .ql-picker-label {
      color: #333 !important;
    }

    .ql-picker-options {
      background: #fff !important;
      border: 1px solid #ccc !important;
    }

    .ql-editor.ql-blank::before {
      color: #999 !important;
      font-style: italic;
    }

    .ql-snow .ql-stroke {
      stroke: #666;
    }

    .ql-snow .ql-fill {
      fill: #666;
    }

    .ql-snow .ql-picker {
      color: #333;
    }
  `}
      </style>
    </div>
  );
};

export default RichTextEditor;
