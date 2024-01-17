import React, { useState, useRef, useEffect, useMemo } from "react";
import ReactQuill, { Quill } from "react-quill";
import ImageResize from "quill-image-resize-module-react";
import "react-quill/dist/quill.snow.css";
import { Container } from "react-bootstrap";
import axios from "axios";

function Editor({ onQuillChange }) {
  const [quillValue, setQuillValue] = useState("");
  const quillRef = useRef();

  const handleQuillChange = (content, delta, source, editor) => {
    setQuillValue(editor.getContents());
    onQuillChange(content);
  };

  // 이미지 처리를 하는 핸들러
  const imageHandler = () => {
    // 이미지를 저장할 input type=file DOM을 만든다.
    const input = document.createElement("input");
    // 속성 써주기
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click(); // 에디터 이미지버튼을 클릭하면 이 input이 클릭된다.
    // input이 클릭되면 파일 선택창이 나타난다.

    // input에 변화가 생긴다면 = 이미지를 선택
    input.addEventListener("change", async () => {
      const file = input.files[0];
      // multer에 맞는 형식으로 데이터 만들어주기
      const formData = new FormData();
      formData.append("img", file); // formData는 키-밸류 구조

      try {
        const result = await axios.post("/spring/usecase/imgurl", formData);
        // 백엔드 multer라우터에 이미지를 보내기

        const editor = quillRef.current.getEditor(); // 에디터 객체 가져오기

        const filePath = result.data.messages[0];
        const imageUrl = `/spring/usecase/loadimg?filePath=${result.data.messages[0]}`;

        const range = editor.getSelection(); // 현재 에디터 커서 위치값을 가져오기

        // 이미지 삽입 시 크기 지정
        //const imgTag = `<img src="${imageUrl}" alt="Loaded Image" style="height: 300px;" />`;
        //editor.clipboard.dangerouslyPasteHTML(range.index, imgTag, "api");

        editor.insertEmbed(range.index, "image", imageUrl); // 가져온 위치에 이미지를 삽입한다
        editor.setSelection(range.index + 1);
      } catch (error) {
        console.log("실패했어요ㅠ");
      }
    });
  };

  // 사용하고 싶은 옵션, 나열 되었으면 하는 순서대로 나열
  const toolbarOptions = [
    [{ header: [1, 2, false] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
    ["link", "image"],
    [{ align: [] }, { color: [] }, { background: [] }], // dropdown with defaults from theme
    ["clean"],
  ];

  Quill.register("modules/imageResize", ImageResize);

  const modules = useMemo(() => {
    return {
      toolbar: {
        container: toolbarOptions,
        handlers: {
          image: imageHandler, //이미지 핸들러
        },
      },
      imageResize: {
        parchment: Quill.import("parchment"),
        modules: ["Resize", "DisplaySize", "Toolbar"],
      },
    };
  }, []);

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
    "align",
    "color",
    "background",
  ];

  return (
    <Container
      style={{
        padding: "0px",
        margin: "0px",
        height: "500px",
        width: "1296px",
      }}
    >
      <ReactQuill
        ref={quillRef}
        style={{ height: "500px" }}
        theme="snow"
        modules={modules}
        formats={formats}
        value={quillValue || ""}
        onChange={handleQuillChange}
      />
    </Container>
  );
}

export default Editor;
