import PropTypes from "prop-types";
import { Modal } from "flowbite-react";
import { modalTheme } from "../functions/CustomThemes";
import { useState } from "react";
import { useEffect } from "react";
import QRCode from "qrcode";
import { format } from "date-fns";

function ArticlePopup({ article, closeArticle }) {
  const [qrURL, setURL] = useState(null);
  useEffect(() => {
    const setup = async () => {
      if (!article) return;
      const url = await QRCode.toDataURL(article.url);
      setURL(url);
    };
    setup();
  }, [article]);
  return (
    <Modal
      position="center"
      show={article}
      dismissible
      onClose={() => {
        closeArticle();
      }}
      size="4xl"
      theme={modalTheme}
    >
      <Modal.Header>{article && article.title}</Modal.Header>
      <Modal.Body>
        {article && (
          <div className="relative whitespace-pre-wrap text-justify flex gap-4">
            <img
              src={article.image}
              alt=""
              className="float-left w-1/2 rounded-md"
            />
            <div className="flex flex-col">
              <p className="flex flex-col">
                <span className="font-semibold">{article.source.name}</span>
                <span className="text-xs">
                  {format(
                    new Date(article.publishedAt),
                    "MMM dd, yyy | hh:mm a"
                  )}
                </span>
              </p>
              <p className="indent-8 whitespace-normal">
                {article.content.split("[")[0]}
              </p>
              <div className="w-full flex justify-end items-end gap-2 mt-auto">
                <p>Scan the QR to read the full article</p>
                {/* <p>{viewAd.description}</p> */}
                <img src={qrURL} className="rounded-md max-w-[100px]" />
              </div>
            </div>
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
}

ArticlePopup.propTypes = {
  article: PropTypes.object,
  closeArticle: PropTypes.func,
};

export default ArticlePopup;
