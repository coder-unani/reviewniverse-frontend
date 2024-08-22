import React, { useEffect, useRef, useState } from "react";
import Modal from "/src/components/Modal";
import CloseButton from "/src/components/Button/Close";
import { useAuthContext } from "/src/context/AuthContext";
import { useModalContext } from "/src/context/ModalContext";
import { useReviewCreate } from "/src/hooks/useReviewCreate";
import { useReviewUpdate } from "/src/hooks/useReviewUpdate";
import { showSuccessToast } from "/src/components/Toast";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Controller, useWatch } from "react-hook-form";
import { Tooltip } from "react-tooltip";
import { isEmpty } from "lodash";
import SpoilerActivateIcon from "/src/assets/button/spoiler-activate.svg?react";
import SpoilerDeactivateIcon from "/src/assets/button/spoiler-deactivate.svg?react";
import PrivateActivateIcon from "/src/assets/button/private-activate.svg?react";
import PrivateDeactivateIcon from "/src/assets/button/private-deactivate.svg?react";

const ReviewModal = React.memo(({ content, myReview }) => {
  const modalRef = useRef();
  const { user } = useAuthContext();
  const { toggleReviewModal } = useModalContext();
  const { mutate: reviewCreate, isPending: isCreatePending } = useReviewCreate();
  const { mutate: reviewUpdate, isPending: isUpdatePending } = useReviewUpdate();
  const [isSpoiler, setIsSpoiler] = useState(false);
  const [isPrivate, setIsPrivate] = useState(false);

  const handleModalClose = (e) => {
    if (e.target === modalRef.current) toggleReviewModal();
  };

  const handlePaste = (e) => {
    e.preventDefault();
  };

  const reviewSchema = Yup.object().shape({
    title: Yup.string().required("리뷰를 입력해주세요.").max(200, "리뷰는 최대 200자까지 작성 가능합니다."),
  });

  const defaultValues = {
    title: "",
  };

  const methods = useForm({
    resolver: yupResolver(reviewSchema),
    defaultValues,
    mode: "onChange",
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { isDirty, isValid },
    setValue,
    setFocus,
    trigger,
  } = methods;

  const watchedTitle = useWatch({ control, name: "title", defaultValue: "" });

  const toggleSpoiler = () => {
    setIsSpoiler((prev) => !prev);
  };

  const togglePrivate = () => {
    setIsPrivate((prev) => !prev);
  };

  const onSubmit = handleSubmit(async (data) => {
    if (isCreatePending || isUpdatePending) {
      return;
    }
    if (isEmpty(myReview)) {
      await reviewCreate(
        {
          videoId: content.id,
          title: data.title,
          is_spoiler: isSpoiler,
          is_private: isPrivate,
          userId: user.id,
        },
        {
          onSuccess: (res) => {
            if (res.status === 201) {
              showSuccessToast("리뷰가 등록되었습니다.");
              toggleReviewModal();
            }
          },
        }
      );
    } else {
      if (myReview.title === data.title && myReview.is_spoiler === isSpoiler && myReview.is_private === isPrivate) {
        showSuccessToast("리뷰가 수정되었습니다.");
        toggleReviewModal();
        return;
      }
      await reviewUpdate(
        {
          videoId: content.id,
          reviewId: myReview.id,
          title: data.title,
          is_spoiler: isSpoiler,
          is_private: isPrivate,
          userId: user.id,
        },
        {
          onSuccess: (res) => {
            if (res.status === 204) {
              showSuccessToast("리뷰가 수정되었습니다.");
              toggleReviewModal();
            }
          },
        }
      );
    }
  });

  useEffect(() => {
    setFocus("title");
  }, [setFocus]);

  useEffect(() => {
    if (isEmpty(myReview)) return;

    setValue("title", myReview.title, { shouldDirty: true });
    setIsSpoiler(myReview.is_spoiler);
    setIsPrivate(myReview.is_private);

    trigger();
  }, [myReview, setValue, trigger]);

  return (
    <Modal>
      <div className="review-modal" ref={modalRef} onClick={handleModalClose}>
        <main className="review-modal-container">
          <section className="review-modal-wrapper">
            <h2 className="review-modal-title">{content.title}</h2>
            <CloseButton onClose={toggleReviewModal} />
            <form method={methods} onSubmit={onSubmit} className="review-modal-content-wrapper">
              <Controller
                name="title"
                control={control}
                render={({ field }) => (
                  <textarea
                    {...field}
                    id="title"
                    className="review-modal-textarea"
                    placeholder="이 작품에 대한 리뷰를 남겨보세요."
                    spellCheck="false"
                    onPaste={handlePaste}
                  />
                )}
              />
              <div className="review-modal-more-wrapper">
                <div className="review-modal-check-wrapper">
                  <button
                    type="button"
                    data-tooltip-id="reviewModalSpoilerTooltip"
                    data-tooltip-content="스포일러"
                    className="review-spoiler-button"
                    onClick={toggleSpoiler}
                  >
                    {isSpoiler ? <SpoilerActivateIcon /> : <SpoilerDeactivateIcon />}
                  </button>
                  <Tooltip
                    id="reviewModalSpoilerTooltip"
                    className="review-modal-spoiler-tooltip"
                    place="bottom"
                    effect="solid"
                    globalEventOff="click"
                    isCapture={true}
                  />
                  <button
                    type="button"
                    data-tooltip-id="reviewModalPrivateTooltip"
                    data-tooltip-content="비공개"
                    className="review-private-button"
                    onClick={togglePrivate}
                  >
                    {isPrivate ? <PrivateActivateIcon /> : <PrivateDeactivateIcon />}
                  </button>
                  <Tooltip
                    id="reviewModalPrivateTooltip"
                    className="review-modal-private-tooltip"
                    place="bottom"
                    effect="solid"
                    globalEventOff="click"
                    isCapture={true}
                  />
                </div>
                <div className="review-modal-button-wrapper">
                  <p className="review-text-count">
                    <span>{watchedTitle.length}</span> / 100
                  </p>
                  <button
                    type="submit"
                    className="modal-save-button"
                    disabled={!isDirty || !isValid || isCreatePending || isUpdatePending}
                  >
                    {isEmpty(myReview) ? "등록" : "수정"}
                  </button>
                </div>
              </div>
            </form>
          </section>
        </main>
      </div>
    </Modal>
  );
});

export default ReviewModal;
