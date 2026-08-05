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
  height?: string;
  /** Accepted for call-site compatibility; not applied by SunEditor options. */
  hideLevel?: boolean;
  /** Accepted for call-site compatibility; not applied by SunEditor options. */
  disable?: boolean;
}

const RichTextEditor: React.FC<MYTextEditorProps> = ({
  name,
  label,
  required,
  content,
  onChangeHandler,
  height = "200px",
}) => {
  return (
    <div className="text-editor-container w-full min-w-0 max-w-full">
      <label
        htmlFor={name}
        className="text-muted-foreground mb-2 block text-sm font-medium"
      >
        {label} {required && <span className="text-destructive">*</span>}
      </label>

      <div className="w-full min-w-0 max-w-full overflow-hidden">
        <SunEditor
          setContents={content}
          onChange={(content) => onChangeHandler(content)}
          setOptions={{
            height,
            width: "100%",
            resizingBar: false,
            buttonList: [
              [
                "undo",
                "redo",
                "bold",
                "italic",
                "underline",
                "strike",
                "subscript",
                "superscript",
              ],
              ["list", "outdent", "indent"],
              ["align"],
              ["font", "fontSize", "formatBlock"],
              ["fontColor", "hiliteColor"],
              ["removeFormat"],
              [
                "link",
                "audio",
                "math",
                "table",
                "horizontalRule",
                "blockquote",
                "codeView",
              ],
              ["fullScreen", "showBlocks", "preview", "print"],
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
          placeholder="Enter description here..."
        />
      </div>
    </div>
  );
};

export default RichTextEditor;
