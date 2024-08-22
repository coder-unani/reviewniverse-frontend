import React, { useRef } from "react";
import Modal from "/src/components/Modal";
import CloseButton from "/src/components/Button/Close";

const PrivacyModal = React.memo(({ onClose }) => {
  const modalRef = useRef();

  // 이미지 바깥 영역 클릭시 모달 닫기
  const handleModalClose = (e) => {
    if (e.target === modalRef.current) onClose();
  };

  return (
    <Modal>
      <div className="terms-modal" ref={modalRef} onClick={handleModalClose}>
        <main className="terms-main-container">
          <section className="terms-main-wrapper">
            <section className="terms-header-section">
              <h1>개인정보 처리방침</h1>
              <CloseButton onClose={onClose} />
            </section>
            <section className="terms-content-section">
              <div className="terms-version-wrapper">
                <p>시행일자: 2024-08-22</p>
                <select className="terms-version-select" name="이전 버전 보기">
                  {/* option 기본값 */}
                  <option value="2024-08-22">2024-08-22</option>
                  <option value="2024-05-24">2024-05-24</option>
                </select>
              </div>
              <div className="terms-content-wrapper">
                <p>
                  리뷰니버스(이하 “회사”)는 고객(회원 및 비회원 포함)님의 개인정보 보호를 소중하게 생각하고, 회원의
                  개인정보를 보호하기 위하여 항상 최선을 다해 노력하고 있습니다
                </p>
                <p>
                  회사는 개인정보 보호 관련 주요 법률인 개인정보 보호법, 정보통신망 이용촉진 및 정보보호 등에 관한
                  법률(이하 “정보통신망법”이라고 합니다)을 비롯한 모든 개인정보 보호에 관련 법률 규정 및 국가기관 등이
                  제정한 고시, 훈령, 지침 등을 준수합니다.
                </p>
                <p>
                  본 개인정보처리방침은 회사의 서비스를 이용하는 회원에 대하여 적용되며, 회원이 제공하는 개인정보가
                  어떠한 용도와 방식으로 이용되고 있으며, 개인정보 보호를 위하여 회사가 어떠한 조치를 취하고 있는지
                  알립니다. 또한 개인정보와 관련하여 회사와 회원간의 권리 및 의무 관계를 규정하여 회원의
                  ‘개인정보자기결정권’을 보장하는 수단이 됩니다.
                </p>
              </div>
              <div className="terms-content-wrapper">
                <h4>1. 개인정보의 수집 및 이용 목적/항목</h4>
                <p>
                  회사는 다음과 같이 서비스 이용계약의 성립 및 이행에 필요한 최소한의 개인정보를 수집하며, 회원가입시
                  개인정보수집 · 이용 동의에 대한 내용을 제공하고 회원이 '동의' 버튼을 클릭하면 개인정보 수집 · 이용에
                  대해 동의한 것으로 봅니다.
                </p>
                <ul className="terms-table-wrapper">
                  <li>
                    1) 필수 개인정보 수집 항목
                    <table>
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
                  </li>
                </ul>
                <ul className="terms-table-wrapper">
                  <li>
                    2) 선택 개인정보 수집 항목
                    <table>
                      <thead>
                        <tr>
                          <th>수집 및 이용 목적</th>
                          <th>수집 및 이용 항목</th>
                          <th>보유 및 이용기간</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>서비스/업데이트 정보 제공, 맞춤형 추천 서비스 제공</td>
                          <td>성별, 연령, 서비스 이용기록, 디바이스 토큰</td>
                          <td>동의 철회 또는 회원 탈퇴시까지</td>
                        </tr>
                        <tr>
                          <td>이벤트 응모 및 경품 지급</td>
                          <td> 이름, 이메일주소, 휴대전화번호, 주소, 생년월일</td>
                          <td>동의 철회 또는 이벤트 목적 달성시까지</td>
                        </tr>
                      </tbody>
                    </table>
                  </li>
                </ul>
                <div className="terms-content-wrapper">
                  <p>3) 기타 수집 항목</p>
                  <ol>
                    <li>
                      가. 서비스 이용 과정에서 아래와 같은 정보들이 생성되어 수집될 수 있습니다.
                      <ul className="terms-privacy-more-wrapper">
                        <li>
                          PC : PC MacAddress, PC 사양정보, 브라우저 정보, 기타 서비스 이용 시 사용되는 프로그램 버전
                          정보
                        </li>
                        <li>
                          휴대전화(스마트폰) & 스마트OS 탑재 모바일 기기(Tablet PC 등) : 모델명, 기기별
                          고유번호(UDID,IMEI 등), OS정보, 이동통신사, 구글/애플 광고 ID
                        </li>
                        <li>기타 정보 : 서비스 이용(정지) 기록, 접속 로그, 쿠키, 접속 IP정보</li>
                      </ul>
                    </li>
                    <li>
                      나. 자동 생성에 의해 수집되는 정보는 개인을 식별할 수 없는 형태이며, 회사는 수집된 정보를 활용하여
                      개인을 식별하기 위한 활동을 하지 않습니다.
                    </li>
                    <li>
                      다. 자동 생성에 의해 수집되는 정보에 대한 내용과 수집 거부 방법은 제9조 및 제10조를 참고하시기
                      바랍니다.
                    </li>
                  </ol>
                </div>
                <div className="terms-content-wrapper">
                  <p>4) 회사는 다음과 같은 방식으로 개인정보를 수집합니다</p>
                  <ul className="terms-privacy-more-wrapper">
                    <li>
                      회원가입 및 서비스 이용 과정에서 이용자가 개인정보 수집에 대해 동의를 하고 직접 정보를 입력하여
                      수집
                    </li>
                    <li>고객센터를 통한 상담 과정에서 웹페이지, 메일, 팩스, 전화 등을 통해 수집</li>
                    <li>제휴 회사 및 단체로부터의 제공에 의한 수집</li>
                    <li>기기정보와 같은 생성정보는 PC웹, 모바일 웹/앱 이용 과정에서 자동으로 생성되어 수집</li>
                    <li>
                      온라인, 오프라인에서 진행되는 이벤트 등을 통해 추가 개인정보 수집 : 해당 개인정보 수집 시점에
                      개인정보 수집 및 이용 동의를 받습니다.
                    </li>
                  </ul>
                </div>
              </div>
            </section>
          </section>
        </main>
      </div>
    </Modal>
  );
});

export default PrivacyModal;
