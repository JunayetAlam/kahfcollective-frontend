"use client";
import React from "react";
import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css";
import "katex/dist/katex.min.css";
import katex from "katex";

import "./RichTextEditorStyle.css";

interface MYTextEditorProps {
  name: string;
  label: string;
  required?: boolean;
  content: string;
  onChangeHandler: (content: string) => void;
  disable?: boolean
  hideLevel?: boolean
}

const RichTextEditor: React.FC<MYTextEditorProps> = ({
  name,
  label,
  hideLevel = false,
  required,
  content,
  onChangeHandler,
  disable = false
}) => {
  return (
    <div className="text-editor-container">
      {
        !hideLevel && <label htmlFor={name} className="block text-sm font-medium text-gray-700">
          {label} {required && <span style={{ color: "red" }}>*</span>}
        </label>
      }

      <div>
        <SunEditor
          setContents={content}
          onChange={(content) => onChangeHandler(content)}
          setOptions={{
            height: "400px",
            minHeight: '160px',
            width: "100%",
            buttonList: [
              [
                // "undo",
                // "redo",
                "bold",
                "italic",
                "underline",
                // "strike",
                // "subscript",
                // "superscript",
              ],
              ["list", "outdent", "indent"],
              ["align"],
              ["font", "fontSize", "formatBlock"],
              ["fontColor", "hiliteColor"],
              ["removeFormat"],
              [
                // "link",
                // "audio",
                // "math",
                "table",
                "horizontalRule",
                "blockquote",
                // "codeView",
              ],
              [
                "fullScreen",
                // "showBlocks",
                "preview",
                // "print"
              ],
              ["lineHeight", "paragraphStyle", "textStyle"],
              ["dir_ltr", "dir_rtl"],
            ],
            font: [
              "Arial",
              "Comic Sans MS",
              "Courier New",
              "Impact",
              "Georgia",
              "Tahoma",
              "Trebuchet MS",
              "Verdana",
              "Roboto",
            ],
            fontSize: [
              8, 10, 12, 14, 16, 18, 20, 22, 24, 28, 32, 36, 48, 64, 72,
            ],

            katex: katex,
          }}
          placeholder={label}
          disable={disable}

        />
      </div>
    </div>
  );
};

export default RichTextEditor;
