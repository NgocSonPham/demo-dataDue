import React, { ChangeEvent, HTMLProps, useCallback, useEffect, useMemo, useRef } from 'react'
import styles from './styles.module.scss'
import MarkSaved from '@/assets/icons/MarkSaved';
import clsx from 'clsx';
import LanguageIcon from '@/assets/icons/Language';
import { debounce } from '@/utils/helpers';
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
import { CharacterCount } from "@tiptap/extension-character-count";
import "reactjs-tiptap-editor/style.css";
import uploadService from "../services/uploadService";

type Props = HTMLProps<HTMLDivElement> & {
  content: string;
  type: "text" | "html" | "json";
  limit?: number;
  saved?: boolean;
  onChange: any;
}
const MAX_CHARACTER = 5000;

const CustomEditorWrapper = (props: Props) => {
  const { className, limit = MAX_CHARACTER, saved, onChange = () => { }, content, type, ...rest } = props;
  const editorRef = useRef<any>(null)

  const extensions = useMemo(() => [
    BaseKit.configure({
      placeholder: {
        showOnlyCurrent: true
      },
      characterCount: {
        limit: MAX_CHARACTER,
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
    Mention,
    // CharacterCount.configure({
    //   limit: MAX_CHARACTER,
    // }),
  ], [limit]);

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
    <div className={clsx(styles.editor, className)} {...rest}>
      <div className={styles.editorHeader}>
        <div className={styles.editorStatus}>
          <div className={styles.statusItem}>
            <MarkSaved isSaved={saved} />
            Đã lưu
          </div>
          <div className={styles.statusItem}>
            <MarkSaved isSaved={!saved} />
            Chưa lưu
          </div>
        </div>

        <div className={styles.wordCount}>
          {/* <div className={styles.wordCountItem}>
            {editorRef.current?.editor?.storage?.characterCount?.characters() || 0}/{limit}  Ký tự
          </div> */}
          <LanguageIcon />
        </div>
      </div>
      <RichTextEditor
        ref={editorRef}
        output={type}
        content={content as any}
        onChangeContent={onValueChange}
        extensions={extensions}
        dark={false}
      />
    </div>

  )
}

export default CustomEditorWrapper