import { Editor } from "@tinymce/tinymce-react";
import dataServiceAxios from "../services/baseService";
import { AxiosResponse } from "axios";
import { useToast } from "@chakra-ui/react";

const EditorTinyMCE = ({
  value,
  onChange,
}: {
  value?: string;
  onChange?: (value: string) => void;
}) => {
  const toast = useToast();

  const handleEditorChange = (content: string, _editor: any) => {
    onChange && onChange(content);
  };

  const handleImageUpload = (blobInfo: any, progress: any) => {
    return new Promise<string>(() => {
      const formData = new FormData();
      formData.append("files", blobInfo.blob());

      dataServiceAxios
        .post("core/uploads", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response: AxiosResponse) => {
          if (response.status === 201) {
            const { data: { data: images } = {} } = response;
            const imageUrl = `${import.meta.env.VITE_BASE_URL}/${
              images[0].url
            }`;
            progress(imageUrl);
          }
        })
        .catch((error) => {
          progress("");
          toast({
            title: "Error",
            description: error.response.data.errors[0].message,
            status: "error",
            position: "top-right",
            duration: 5000,
            isClosable: true,
          });
        });
    });
  };

  return (
    <Editor
      apiKey="1rhj6182rxhsf36th7o1li89jyf5nj4d1o7iz4qjmcjufdhw"
      cloudChannel="5-stable"
      value={value || ""}
      init={{
        skin: "oxide-dark",
        content_css: "dark",
        width: "100%",
        height: 500,
        menubar: true,
        plugins: [
          "advlist autolink lists link image charmap preview",
          "searchreplace fullscreen",
          "insertdatetime media table paste code",
        ],
        statusbar: false,
        toolbar:
          "undo redo | formatselect | bold italic backcolor | \
          alignleft aligncenter alignright alignjustify | \
          bullist numlist outdent indent | removeformat",
        images_upload_handler: handleImageUpload,
      }}
      onEditorChange={handleEditorChange}
    />
  );
};

export default EditorTinyMCE;
