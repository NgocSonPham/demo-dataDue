import { useCallback, useEffect, useRef } from "react";

import RichTextEditor, {
  BaseKit,
  Blockquote,
  Bold,
  BulletList,
  Clear,
  Code,
  CodeBlock,
  Color,
  ColumnActionButton,
  Emoji,
  FontFamily,
  FontSize,
  FormatPainter,
  Heading,
  Highlight,
  History,
  HorizontalRule,
  Image,
  ImageUpload,
  ImportWord,
  Indent,
  Italic,
  Katex,
  LineHeight,
  Link,
  Mention,
  MoreMark,
  OrderedList,
  SearchAndReplace,
  SlashCommand,
  Strike,
  Table,
  TableOfContents,
  TaskList,
  TextAlign,
  TextDirection,
  Underline,
  locale
} from "reactjs-tiptap-editor";
import "reactjs-tiptap-editor/style.css";
import uploadService from "../services/uploadService";

const extensions = [
  BaseKit.configure({
    placeholder: {
      showOnlyCurrent: true
    },
    characterCount: {
      limit: 50_000
    }
  }),
  History,
  SearchAndReplace,
  TableOfContents,
  FormatPainter.configure({ spacer: true }),
  Clear,
  FontFamily,
  Heading.configure({ spacer: true }),
  FontSize,
  Bold,
  Italic,
  Underline,
  Strike,
  MoreMark,
  Katex,
  Emoji,
  Color.configure({ spacer: true }),
  Highlight,
  BulletList,
  OrderedList,
  TextAlign.configure({ types: ["heading", "paragraph"], spacer: true }),
  Indent,
  LineHeight,
  TaskList.configure({
    spacer: true,
    taskItem: {
      nested: true
    }
  }),
  Link,
  Image,
  ImageUpload.configure({
    upload: (file: File) => {
      return new Promise((resolve, reject) => {
        const formData = new FormData();

        if (file.size > 5 * 1024 * 1024) {
          reject(new Error("File size must be less than 5MB."));
          return;
        }

        if (
          ![
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/webp",
            "image/gif",
            "image/heic",
            "image/svg",
            "image/heif"
          ].includes(file.type)
        ) {
          reject(new Error("File type must be png, jpg or jpeg."));
          return;
        }
        formData.append("files", file);

        uploadService
          .upload(formData)
          .then((res) => {
            const { data: { data: uploaded } = { data: {} } } = res;
            if (uploaded) {
              resolve(uploaded?.[0] ?? "");
            } else {
              reject(new Error("Upload failed! No data returned."));
            }
          })
          .catch((err) => {
            reject(err?.response?.data?.message ?? "Upload failed!");
          });
      });
    }
  }),
  Blockquote,
  SlashCommand,
  HorizontalRule,
  Code.configure({
    toolbar: false
  }),
  CodeBlock.configure({
    defaultTheme: "dracula",
    languages: ["dax", "sql", "python", "bash", "csv", "tsv", "json", "xml", "yaml", "mdx", "nginx"]
  }),
  ColumnActionButton,
  Table,
  ImportWord.configure({
    upload: (files: File[]) => {
      const f = files.map((file) => ({
        src: URL.createObjectURL(file),
        alt: file.name
      }));
      return Promise.resolve(f);
    }
  }),
  TextDirection,
  Mention
];

function debounce(func: any, wait: number) {
  let timeout: NodeJS.Timeout;
  return function (...args: any[]) {
    clearTimeout(timeout);
    // @ts-ignore
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

function ContentEditor({
  content,
  type,
  onChange
}: {
  content: string;
  type: "text" | "html" | "json";
  onChange: (value: string) => void;
}) {
  const editorRef = useRef<any>(null);
  locale.setLang("vi");

  const onValueChange = useCallback(
    debounce((value: any) => {
      onChange(value);
    }, 300),
    []
  );

  useEffect(() => {
    // Update editor content if `content` prop changes
    if (editorRef.current) {
      const currentContent = editorRef.current.editor.getHTML(); // Or appropriate method based on type
      if (currentContent !== content) {
        editorRef.current.editor.commands.setContent(content); // Set new content
      }
    }
  }, [content]);

  return (
    <RichTextEditor
      ref={editorRef}
      output={type}
      content={content as any}
      onChangeContent={onValueChange}
      extensions={extensions}
      dark={false}
    />
  );
}

export default ContentEditor;
