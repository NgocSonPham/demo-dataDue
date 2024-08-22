// @ts-ignore
import Header from '@editorjs/header';
// @ts-ignore
import Checklist from '@editorjs/checklist'
// @ts-ignore
import List from "@editorjs/list";
// @ts-ignore
import Quote from '@editorjs/quote';
// @ts-ignore
import Table from '@editorjs/table';
// @ts-ignore
import ImageTool from '@editorjs/image';
import uploadService from "../../../../services/uploadService";

export const EditorTools = {
    header: Header,
    quote: Quote,
    table: {
      class: Table,
      inlineToolbar: true,
      config: {
        rows: 2,
        cols: 3,
      },
    },
    image: {
      class: ImageTool,
      config: {
        uploader: {
          uploadByFile(file: any){
            const formData = new FormData();
            formData.append('files', file);
            return uploadService.upload(formData).then((res) => {
              return {
                success: 1,
                file: {
                  url: `${import.meta.env.VITE_IMAGE_URL}/${res.data.data[0].url}`
                }
              }
              
            })
          },
          // uploadByUrl(url){
          //   return ajax.upload(file).then(() => {
          //     return {
          //       success: 1,
          //       file: {
          //         url: '{imageUrl}',,
          //         // any other image data you want to store, such as width, height, color, extension, etc
          //       }
          //     }
          //   })
          // }
        }
      }
    },
    checklist: {
        class: Checklist,
        inlineToolbar: true,
    },
    list: {
        class: List,
        inlineToolbar: true,
        config: {
          defaultStyle: 'unordered'
        }
    },
}