import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useVideos } from "../../functions/VideoFunctions";
import { Modal } from "flowbite-react";
import { modalTheme } from "../../functions/CustomThemes";
import QRCode from "qrcode";

function Popup({ viewAd, toggleAd }) {
  const { getFileURL } = useVideos();
  const [qrURL, setURL] = useState(null);

  useEffect(() => {
    const setup = async () => {
      if (!viewAd) return;
      const outURL = "https://out.tapmediacorp.com/?id=";
      const url = await QRCode.toDataURL(outURL + viewAd._id);
      setURL(url);
    };
    setup();
  }, [viewAd]);
  return (
    viewAd && (
      <Modal
        position="center"
        show={viewAd}
        dismissible
        onClose={() => {
          toggleAd(null);
        }}
        size="5xl"
        theme={modalTheme}
      >
        <Modal.Body>
          {viewAd && (
            <div className="relative">
              <img
                src={getFileURL(viewAd._urlID)}
                alt=""
                className="w-full rounded-md"
              />
              <div className="absolute bottom-0 w-full flex justify-end bg-gradient-to-t from-[#383838aa] from-25% to-[#00000000] p-2">
                {/* <p>Want to know more? Scan now!</p> */}
                {/* <p>{viewAd.description}</p> */}
                <img src={qrURL} className="rounded-md max-w-[200px]" />
              </div>
            </div>
          )}
        </Modal.Body>
      </Modal>
    )
  );
}

Popup.propTypes = {
  viewAd: PropTypes.object,
  toggleAd: PropTypes.func,
};

export default Popup;
