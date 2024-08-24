import React, { useRef } from "react";
import Modal from "/src/components/Modal";
import CloseButton from "/src/components/Button/Close";
import { setStorageHidePopupBanner } from "/src/utils/formatStorage";
import { DEFAULT_IMAGES } from "/src/config/constants";

/**
 * TODO:
 * - 오늘 그만 보기 or 일주일간 보지 않기 체크박스 클릭시 쿠키에 저장하여 다시 띄우지 않기
 * - 쿠키 키값: HIDE_POPUP_BANNER
 * - 쿠키 값: true
 * - 쿠키 만료일: 오늘 그만 보기 클릭시 만료일은 오늘 날짜로 설정
 * - 쿠키 만료일: 일주일간 보지 않기 클릭시 만료일은 오늘 날짜 + 7일로 설정
 */

const PopupBanner = React.memo(({ onClose }) => {
  const modalRef = useRef();

  // 팝업 배너 오늘 그만 보기 체크 후 닫기하면 쿠키에 저장
  const handleHidePopupBanner = (e) => {
    const isChecked = e.target.checked;
    setStorageHidePopupBanner(isChecked);
  };

  return (
    <Modal>
      <div className="popup-modal" ref={modalRef}>
        <main className="popup-modal-container">
          <section className="popup-modal-wrapper">
            <CloseButton onClose={onClose} />
            <div className="popup-modal-image-wrapper">
              <img className="popup-modal-image" src={DEFAULT_IMAGES.popup} alt="팝업 이미지" />
              <p className="popup-modal-content">🤪 팝업 광고 입니다 🤪</p>
            </div>
            <section className="popup-footer-section">
              <input type="checkbox" id="popup-footer-checkbox" onChange={(e) => handleHidePopupBanner(e)} />
              <label htmlFor="popup-footer-checkbox">오늘 하루 그만 보기</label>
            </section>
          </section>
        </main>
      </div>
    </Modal>
  );
});

export default PopupBanner;
