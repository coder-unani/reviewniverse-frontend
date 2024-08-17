import React, { useEffect, useRef } from "react";
import Modal from "/src/components/Modal";
import { useAuthContext } from "/src/context/AuthContext";
import { useReviewCreate } from "/src/hooks/useReviewCreate";
import { useReviewUpdate } from "/src/hooks/useReviewUpdate";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Controller, useWatch } from "react-hook-form";
import { RiCloseLine } from "@remixicon/react";
import { isEmpty } from "lodash";
import { showSuccessToast } from "/src/components/Toast";

const ReviewModal = React.memo(({ content, myReview, onClose }) => {
  const modalRef = useRef();
  const { user } = useAuthContext();
  const { mutateAsync: reviewCreate } = useReviewCreate();
  const { mutateAsync: reviewUpdate } = useReviewUpdate();

  const handleModalClose = (e) => {
    if (e.target === modalRef.current) onClose();
  };

  const handleCloseButton = () => {
    onClose();
  };

  const handlePaste = (e) => {
    e.preventDefault();
  };

  const reviewSchema = Yup.object().shape({
    title: Yup.string().required("리뷰를 입력해주세요.").max(200, "리뷰는 최대 200자까지 작성 가능합니다."),
    spoiler: Yup.boolean(),
    private: Yup.boolean(),
  });

  const defaultValues = {
    title: "",
    spoiler: false,
    private: false,
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

  const onSubmit = handleSubmit(async (data) => {
    if (isEmpty(myReview)) {
      const res = await reviewCreate({
        videoId: content.id,
        title: data.title,
        is_spoiler: data.spoiler,
        is_private: data.private,
        userId: user.id,
      });
      if (res.status) {
        showSuccessToast(res.code);
        onClose();
      }
    } else {
      const res = await reviewUpdate({
        videoId: content.id,
        reviewId: myReview.id,
        title: data.title,
        is_spoiler: data.spoiler,
        is_private: data.private,
        userId: user.id,
      });
      if (res.status) {
        showSuccessToast(res.code);
        onClose();
      }
    }
  });

  useEffect(() => {
    setFocus("title");
  }, [setFocus]);

  useEffect(() => {
    if (isEmpty(myReview)) return;

    setValue("title", myReview.title, { shouldDirty: true });
    setValue("spoiler", myReview.is_spoiler);
    setValue("private", myReview.is_private);

    trigger();
  }, [myReview, setValue, trigger]);

  return (
    <Modal>
      <div className="review-modal" ref={modalRef} onClick={handleModalClose}>
        <div className="review">
          <h2>{content.title}</h2>
          <RiCloseLine size={28} className="close" onClick={handleCloseButton} />
          <form method={methods} onSubmit={onSubmit} className="review-content">
            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <textarea
                  {...field}
                  id="title"
                  placeholder="이 작품에 대한 리뷰를 남겨보세요."
                  spellCheck="false"
                  onPaste={handlePaste}
                />
              )}
            />
            <div className="button-wrapper">
              <div className="left">
                <div className="input-wrapper">
                  <input type="checkbox" id="spoiler" name="spoiler" {...register("spoiler")} />
                  <label htmlFor="spoiler">스포일러</label>
                </div>
                <div className="input-wrapper">
                  <input type="checkbox" id="private" name="private" {...register("private")} />
                  <label htmlFor="private">비공개</label>
                </div>
              </div>
              <div className="right">
                <p>
                  <span>{watchedTitle.length}</span> / 100
                </p>
                <button type="submit" className="save" disabled={!isDirty || !isValid}>
                  {isEmpty(myReview) ? "등록" : "수정"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
});

export default ReviewModal;
