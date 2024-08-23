import React, { useRef } from "react";
import Modal from "/src/components/Modal";
import CloseButton from "/src/components/Button/Close";

const PrivacyModal = React.memo(({ onClose }) => {
  const modalRef = useRef();

  const handleModalClose = (e) => {
    if (e.target === modalRef.current) onClose();
  };

  return (
    <Modal>
      <div className="policy-modal" ref={modalRef} onClick={handleModalClose}>
        <main className="policy-main-container">
          <section className="policy-main-wrapper">
            <section className="policy-header-section">
              <h1 className="policy-header-title">개인정보 처리방침</h1>
              <CloseButton onClose={onClose} />
            </section>
            <section className="policy-content-section">
              <div className="policy-version-wrapper">
                <p>시행일자: 2024-08-22</p>
                <select className="policy-version-select" name="이전 버전 보기">
                  {/* option 기본값 */}
                  <option value="2024-08-22">2024-08-22</option>
                  <option value="2024-05-24">2024-05-24</option>
                </select>
              </div>
              <div className="policy-content-wrapper">
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
              <div className="policy-content-wrapper">
                <h4 className="policy-content-title">1. 개인정보의 수집 및 이용 목적/항목</h4>
                <p>
                  회사는 다음과 같이 서비스 이용계약의 성립 및 이행에 필요한 최소한의 개인정보를 수집하며, 회원가입시
                  개인정보수집 · 이용 동의에 대한 내용을 제공하고 회원이 '동의' 버튼을 클릭하면 개인정보 수집 · 이용에
                  대해 동의한 것으로 봅니다.
                </p>
              </div>
              <div className="policy-content-wrapper">
                <p>1) 필수 개인정보 수집 항목</p>
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
                <p>2) 선택 개인정보 수집 항목</p>
                <table className="policy-table">
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
              </div>
              <div className="policy-content-wrapper">
                <p>3) 기타 수집 항목</p>
                <ul>
                  <li>
                    가. 서비스 이용 과정에서 아래와 같은 정보들이 생성되어 수집될 수 있습니다.
                    <ul className="policy-privacy-more-list">
                      <li>
                        PC : PC MacAddress, PC 사양정보, 브라우저 정보, 기타 서비스 이용 시 사용되는 프로그램 버전 정보
                      </li>
                      <li>
                        휴대전화(스마트폰) & 스마트OS 탑재 모바일 기기(Tablet PC 등) : 모델명, 기기별 고유번호(UDID,IMEI
                        등), OS정보, 이동통신사, 구글/애플 광고 ID
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
                </ul>
              </div>
              <div className="policy-content-wrapper">
                <p>4) 수집방법</p>
                <ul className="policy-privacy-more-list">
                  <li>
                    회원가입 및 서비스 이용 과정에서 이용자가 개인정보 수집에 대해 동의를 하고 직접 정보를 입력하여 수집
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
              <div className="policy-content-wrapper">
                <h4 className="policy-content-title">2. 개인정보의 보유, 이용기간 및 파기</h4>
                <ul>
                  <li>
                    <p>1) 이용기간 및 보유기간</p>
                    <p>
                      고객님의 개인정보는 수집목적 또는 제공받은 목적의 달성 시까지 보유하고 이를 활용합니다. 다만,
                      개인정보의 계속 보관·이용에 관한 별도 동의를 얻은 경우 또는 관계 법령에 따라 보관 의무가 주어진
                      경우에는 예외로 합니다.
                    </p>
                    <p>가. 관계법령에 따른 보존(아래에 한정되지 않음)</p>
                    <ul className="policy-privacy-more-list">
                      <li>계약 또는 청약철회 등에 관한 기록: 5년(전자상거래 등에서의 소비자보호에 관한 법률)</li>
                      <li>대금결제 및 재화 등의 공급에 관한 기록: 5년(전자상거래 등에서의 소비자보호에 관한 법률)</li>
                      <li>소비자의 불만 또는 분쟁처리에 관한 기록: 3년(전자상거래 등에서의 소비자보호에 관한 법률)</li>
                      <li>접속에 관한 기록: 사이트 방문 기록 3개월(통신비밀보호법)</li>
                      <li>그 외: 국세기본법 등에 따라 거래기록 등을 보관해야 하는 경우</li>
                    </ul>
                    <p>나. 기타 고객의 동의를 받은 경우 동의를 받은 기간까지</p>
                    <ul className="policy-privacy-more-list">
                      <li>
                        회원가입 및 서비스 이용에 관한 기록: 회원탈퇴일로부터 5일(부정 이용 및 서비스 혼선 방지 목적)
                      </li>
                    </ul>
                  </li>
                  <li>
                    <p>2) 개인정보의 파기절차 및 방법</p>
                    <p>
                      회사는 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가 불필요하게 되었을 때에는 지체없이
                      해당 개인정보를 파기합니다. 다만, 정보주체로부터 동의받은 개인정보 보유기간이 경과하거나
                      처리목적이 달성되었음에도 불구하고 다른 법령에 따라 개인정보를 계속 보존하여야 하는 경우에는, 해당
                      개인정보를 별도의 데이터베이스(DB)로 옮기거나 보관장소를 달리하여 보존합니다.
                    </p>
                    <p>
                      가. 파기절차: 회사는 파기 사유가 발생한 개인정보를 선정하고, 개인정보 보호책임자의 승인을 받아
                      개인정보를 파기합니다.
                    </p>
                    <p>나. 파기대상: 보유기간 및 관련법령에 따른 보존기간이 종료된 고객정보</p>
                    <p>다. 파기방법</p>
                    <ul className="policy-privacy-more-list">
                      <li>서면에 작성, 출력된 개인정보: 분쇄하거나 소각</li>
                      <li>DB등 전자적 파일 형태로 저장된 개인정보: 기록을 재생할 수 없는 기술적 방법으로 삭제</li>
                    </ul>
                  </li>
                  <li>
                    <p>3) 휴면 회원 대상 및 관리</p>
                    <p>가. 2023년 10월 22일 이전: 1년 동안 티빙서비스를 사용하지 않은 경우 휴면회원으로 전환됩니다.</p>
                    <p>나. 2023년 10월 23일 이후: 장기 미이용 회원의 경우에도 별도의 휴면전환 없이 유지됩니다.</p>
                    <p>
                      다. 휴면 고지 : 휴면 상태로 전환 될 경우, 30일 전 회원정보에 등록된 이메일 주소로 미리 안내 메일을
                      발송합니다.
                    </p>
                    <p>라. 휴면으로 전환된 아이디에 등록된 개인정보는 별도의 DB로 분리하여 안전하게 보관됩니다.</p>
                    <p>
                      마. 분리 보관된 개인정보는 휴면 해제 및 법률에 규정이 있는 경우를 제외한 다른 용도로는
                      이용·제공되지 않습니다.
                    </p>
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

export default PrivacyModal;
