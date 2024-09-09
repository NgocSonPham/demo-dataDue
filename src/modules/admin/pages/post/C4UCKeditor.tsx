import { CKEditor } from "@ckeditor/ckeditor5-react";
// import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import Editor from 'ckeditor5-custom-build';

const C4UCKeditor = (
    {
        data,
        onDataChange
    }: {
        data: string,
        onDataChange: (e: any, editor: any) => void
    }
) => {
    return (
        <>
            <CKEditor
                editor={Editor}
                config={{
                    removePlugins: ['Title'],
                    toolbar: {
                        removeItems: ['textPartLanguage']
                    }
                }}
                data={data}
                onChange={onDataChange}
            />
        </>
    )
}

export default C4UCKeditor;