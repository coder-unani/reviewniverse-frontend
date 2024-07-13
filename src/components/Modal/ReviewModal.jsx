import React, { useEffect, useRef } from "react";
import Modal from "/src/components/Modal";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Controller, useWatch } from "react-hook-form";
import { RiCloseLine } from "@remixicon/react";
import HttpClient from "/src/utils/HttpClient";
import "/src/styles/ReviewModal.css";
import { cLog, cError } from "/src/utils/test";
import { isEmpty } from "lodash";

const API_BASE_URL = "https://comet.orbitcode.kr/v1";

/**
 * TODO:
 * 1. 리뷰 등록/수정 성공 후 리뷰 업데이트는 어떻게 할 것인지
 */

const ReviewModal = (props) => {
  const { content, myReview, onClose } = props;
  const modalRef = useRef();

  // 리뷰 모달 바깥 영역 클릭시 모달 닫기
  const handleModalClose = (e) => {
    if (e.target === modalRef.current) onClose();
  };

  const handleCloseButton = () => {
    onClose();
  };

  const reviewSchema = Yup.object().shape({
    title: Yup.string().required("리뷰를 입력해주세요.").max(100, "리뷰는 최대 100자까지 작성 가능합니다."),
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
      // 리뷰 등록하기
      try {
        const client = new HttpClient();
        const res = await client.post(`${API_BASE_URL}/contents/videos/${content.id}/reviews`, {
          title: data.title,
          is_spoiler: data.spoiler,
          is_private: data.private,
        });

        if (res.status === 201) {
          // res.code === "REVIEW_CREATE_SUCC"
          cLog("리뷰가 등록되었습니다.");
          onClose();
        }
      } catch (error) {
        cError(error);
      }
    } else {
      // 리뷰 수정하기
      try {
        const client = new HttpClient();
        const res = await client.put(`${API_BASE_URL}/contents/videos/${content.id}/reviews/${myReview.id}`, {
          title: data.title,
          is_spoiler: data.spoiler,
          is_private: data.private,
        });

        if (res.status === 204) {
          // res.code === "REVIEW_UPDATE_SUCC"
          cLog("리뷰가 수정되었습니다.");
          onClose();
        }
      } catch (error) {
        cError(error);
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
                <textarea {...field} id="title" placeholder="이 작품에 대한 리뷰를 남겨보세요." spellCheck="false" />
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
};

export default ReviewModal;
