import React, { useRef } from "react";
import Modal from "/src/components/Modal";
import CloseButton from "/src/components/Button/Close";

const PrivacyCollectionModal = React.memo(({ onClose }) => {
  const modalRef = useRef();

  const handleModalClose = (e) => {
    if (e.target === modalRef.current) onClose();
  };

  return (
    <Modal>
      <div className="policy-modal" ref={modalRef} onClick={handleModalClose}>
        <main className="policy-modal-container">
          <section className="policy-modal-wrapper">
            <section className="policy-header-section">
              <h1 className="policy-header-title">개인정보 수집 및 이용 동의</h1>
              <CloseButton onClose={onClose} />
            </section>
            <section className="policy-content-section">
              <div className="policy-version-wrapper">
                <select className="policy-version-select" name="이전 버전 보기">
                  {/* option 기본값 */}
                  <option value="2024-08-22">2024-08-22</option>
                  <option value="2024-05-24">2024-05-24</option>
                </select>
              </div>
              <div className="policy-content-wrapper">
                <p>1) 필수 개인정보 수집 및 이용 동의</p>
                <table className="policy-table">
                  <thead>
                    <tr>
                      <th>수집 및 이용 목적</th>
                      <th colSpan={2}>수집 및 이용 항목</th>
                      <th>보유 및 이용기간</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td rowSpan={3}>SNS ID 회원 가입 및 회원 관리</td>
                      <td>카카오</td>
                      <td>이름, 이메일주소, 닉네임, 프로필 사진</td>
                      <td rowSpan={3}>회원 탈퇴시까지</td>
                    </tr>
                    <tr>
                      <td>네이버</td>
                      <td>이름, 이메일주소, 닉네임, 프로필 사진</td>
                    </tr>
                    <tr>
                      <td>구글</td>
                      <td>이름, 이메일주소, 프로필 사진</td>
                    </tr>
                    <tr>
                      <td>사용자 인증을 통한 본인 및 연령 확인, 사용자 인증에 따른 서비스 제공</td>
                      <td colSpan={2}>
                        이름, 생년월일, 성별, 내/외국인 여부, 휴대전화번호, 중복가입확인정보(DI), 연계정보(CI)
                      </td>
                      <td>회원 탈퇴시까지</td>
                    </tr>
                    <tr>
                      <td>만 14세 미만 회원가입 법정대리인 동의</td>
                      <td colSpan={2}>법정대리인의 이름, 생년월일, 성별, 중복가입확인정보, 휴대전화번호</td>
                      <td>회원 탈퇴시까지</td>
                    </tr>
                    <tr>
                      <td>
                        서비스 개선 및 안정화, 최적화 콘텐츠 및 서비스 제공, 맞춤형 광고 및 콘텐츠 제공, 서비스 부정
                        이용 방지
                      </td>
                      <td colSpan={2}>
                        성별, 연령, 사용자 기기 정보, 서비스 이용(정지) 기록, 접속 로그, 쿠키, 접속 IP정보
                      </td>
                      <td>회원 탈퇴시까지</td>
                    </tr>
                    <tr>
                      <td>고객센터 문의 응대</td>
                      <td colSpan={2}>이름, 생년월일, 이메일주소, 휴대전화번호, 결제 정보</td>
                      <td>회원 탈퇴시까지</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="policy-content-wrapper">
                <ul className="policy-privacy-more-list">
                  <li>
                    법률의 특별한 규정 또는 법령상 의무 준수를 위해 불가피한 경우에는 정보주체의 동의 없이 개인정보를
                    수집 ∙ 이용할 수 있습니다.
                  </li>
                  <li>
                    회원은 개인정보의 수집 및 이용 동의를 거부할 권리가 있습니다. 회원가입 시 수집하는 최소한의
                    개인정보, 즉, 필수 항목에 대한 수집 및 이용 동의를 거부하실 경우, 회원가입이 어려울 수 있습니다.
                  </li>
                </ul>
              </div>
            </section>
          </section>
        </main>
      </div>
    </Modal>
  );
});

export default PrivacyCollectionModal;
