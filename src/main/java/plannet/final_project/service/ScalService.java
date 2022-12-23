package plannet.final_project.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import plannet.final_project.dao.*;
import plannet.final_project.entity.*;
import plannet.final_project.vo.ShareDTO;

import javax.persistence.EntityNotFoundException;
import javax.transaction.Transactional;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.TemporalAdjusters;
import java.util.*;

// 의존성 주입을 받는다: 객체 생성 없이 사용할 수 있게 한다
@Slf4j // log를 찍기 위한 어노테이션
@Service
@Transactional
@RequiredArgsConstructor
public class ScalService {
    private final MemberRepository memberRepository;
    private final NotiRepository notiRepository;
    private final FriendRepository friendRepository;
    private final SCALRepository scalRepository;
    private final SMEMRepository smemRepository;
    private final SPLANRepository splanRepository;
    private final SCOMRepository scomRepository;

    // 공유캘린더 생성
    public Long scalCreate(String id, String title, List<Map<String, Object>> smember) {
        Long scalNo;
        try {
            Member member = memberRepository.findById(id).orElseThrow(EntityNotFoundException::new);
            // 공유 캘린더 생성
            SCAL scal = new SCAL();
            scal.setUserId(member);
            scal.setScalName(title);
            scalRepository.save(scal);
            scalNo = scalRepository.findMaxScalNo(id);
            System.out.println("서비스 캘린더 번호 : " + scalNo);
            // 공유 캘린더 친구 설정
            SMEM smem = new SMEM();
            smem.setScalNo(scal);
            smem.setUserId(member);
            smem.setIsOwner(1); // 공유 캘린더 주인이면 1 아니면 0
            smemRepository.save(smem);
            // 초대할 친구들에게 알림 보내기
            for(Map<String, Object> s : smember) {
                Noti noti = new Noti();
                noti.setUserId(member); // 보내는 이
                Member friend = memberRepository.findByUserCode((String)s.get("userCode"));
                noti.setReceiveId(friend); // 초대할 친구들
                noti.setScalNo(scal);
                noti.setType("S");
                noti.setScalNo(scal);
                noti.setNotiDate(LocalDateTime.now());
                noti.setAcceptChecked(0); // 수락 여부, 0이면 미수락, 1이면 수락
                notiRepository.save(noti);
            }
        } catch(Exception e) {
            e.printStackTrace();
            return Long.valueOf(-1);
        }
        return scalNo;
    }

    // 공유 캘린더 삭제
    public boolean scalDelete(Long scalNo) {
        try {
            SCAL scal = scalRepository.findById(scalNo).orElseThrow(EntityNotFoundException::new);
            scomRepository.deleteByScalNo(scal);
            splanRepository.deleteByScalNo(scal);
            smemRepository.deleteByScalNo(scal);
            notiRepository.deleteByScalNo(scal);
            scalRepository.deleteByScalNo(scalNo);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    // 공유 캘린더 멤버 초대
    public boolean memberInvite(Long scalNo, String id) {
        try {
            Noti noti = new Noti();

            // 멤버초대
            SCAL scal = scalRepository.findById(scalNo).orElseThrow(EntityNotFoundException::new);
            Member sendId = scal.getUserId();
            Member receiveId = memberRepository.findById(id).orElseThrow();
            noti.setUserId(sendId);
            noti.setReceiveId(receiveId);
            noti.setType("S");
            noti.setAcceptChecked(0);
            noti.setScalNo(scal);
            noti.setNotiDate(LocalDateTime.now());
            notiRepository.save(noti);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    // 공유 캘린더 멤버 삭제
    public boolean memberDelete (Long scalNo, String id) {
        try {
            SCAL scal = scalRepository.findById(scalNo).orElseThrow(EntityNotFoundException::new);
            Member member = memberRepository.findById(id).orElseThrow();
            SMEM smem = smemRepository.findByScalNoAndUserId(scal, member);
            smemRepository.deleteById(smem.getSmemNo());
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    // 공유 캘린더 정보 저장
    public boolean infoSave(Long scalNo, String scalName) {
        try {
            // 캘린더 이름 저장
            SCAL scal = scalRepository.findById(scalNo).orElseThrow(EntityNotFoundException::new);
            if(!scal.getScalName().equals(scalName)) { // 이름이 다르면 변경
                scal.setScalName(scalName);
                scalRepository.save(scal);
            }
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    // 공유캘린더 home Load
    public ShareDTO homeList(Long calNo) {
        ShareDTO shareDTO = new ShareDTO();
        SCAL scalNo = scalRepository.findById(calNo).orElseThrow(EntityNotFoundException::new);
        try {
            // scal CalName Load
            shareDTO.setScalName(scalNo.getScalName());

            // plan Load
            LocalDate[] weekDay = {
                    LocalDate.now().with(TemporalAdjusters.previousOrSame(DayOfWeek.SUNDAY)),
                    LocalDate.now().with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY)),
                    LocalDate.now().with(TemporalAdjusters.previousOrSame(DayOfWeek.TUESDAY)),
                    LocalDate.now().with(TemporalAdjusters.previousOrSame(DayOfWeek.WEDNESDAY)),
                    LocalDate.now().with(TemporalAdjusters.previousOrSame(DayOfWeek.THURSDAY)),
                    LocalDate.now().with(TemporalAdjusters.previousOrSame(DayOfWeek.FRIDAY)),
                    LocalDate.now().with(TemporalAdjusters.previousOrSame(DayOfWeek.SATURDAY))
            };
            List<List<Map<String, Object>>> weekPlan = new ArrayList<>();
            for(int i = 0; i < 7; i++) {
                List<Map<String, Object>> dayPlan = new ArrayList<>();
                List<SPLAN> dayPlanOrigin = splanRepository.findByScalNoAndSplanDateOrderBySplanNoAsc(scalNo, weekDay[i]);
                for(SPLAN e : dayPlanOrigin) {
                    Map<String, Object> plan = new HashMap<>();
                    plan.put("no", e.getSplanNo());
                    plan.put("plan", e.getSplan());
                    plan.put("checked", e.getSplanChecked());
                    dayPlan.add(plan);
                }
                weekPlan.add(dayPlan);
            }
            shareDTO.setSweekPlan(weekPlan);

            // planMark Load
            List<Set<LocalDate>> planMark = new ArrayList<>();
            for(int i = 0; i < 2; i++) {
                Set<LocalDate> planDot = new HashSet<>();
                List<SPLAN> plan = splanRepository.findByScalNoAndSplanChecked(scalNo, i);
                for(SPLAN e : plan) {
                    planDot.add(e.getSplanDate());
                }
                planMark.add(planDot);
            }
            shareDTO.setSplanMark(planMark);

            // Memo Load
            if(scalNo.getScalMemo() != null) {
                shareDTO.setSmemo(scalNo.getScalMemo());
            } else shareDTO.setSmemo("");

            // Member Load
            List<Map<String, Object>> memberList = new ArrayList<>();
            List<SMEM> memberListData = smemRepository.findByScalNo(scalNo);
            for (SMEM e : memberListData) {
                Map<String, Object> scalMember = new HashMap<>();
                scalMember.put("id", e.getUserId().getId());
                scalMember.put("isOwner", e.getIsOwner());
                scalMember.put("nickname", e.getUserId().getNickname());
                scalMember.put("userCode", e.getUserId().getUserCode());
                memberList.add(scalMember);
            }
            shareDTO.setSmemberList(memberList);
            shareDTO.setOk(true);
        } catch (Exception e){
            shareDTO.setOk(false);
        }
        return shareDTO;
    }

    // 메모 수정 및 저장
    public boolean memoSave(Long scalNo, String detail) {
        try {
            SCAL scal = scalRepository.findById(scalNo).orElseThrow();
            scal.setScalMemo(detail);
            scalRepository.save(scal);
            return true;
        }
        catch (Exception e) {
            return false;
        }
    }

    // 일정 불러오기
    public ShareDTO splanLoad(Long scalNo, LocalDate date) {
        ShareDTO shareDTO = new ShareDTO();
        try {
            SCAL scal = scalRepository.findById(scalNo).orElseThrow();
            List<SPLAN> planData = splanRepository.findByScalNoAndSplanDateOrderBySplanNoAsc(scal, date);
            List<Map<String, Object>> planList = new ArrayList<>();
            for (SPLAN e : planData) {
                Map<String, Object> plan = new HashMap<>();
                plan.put("key", e.getSplanNo());
                System.out.println("key입니다" + e.getSplanNo());
                plan.put("checked", e.getSplanChecked());
                System.out.println("checked입니다" + e.getSplanChecked());
                plan.put("text", e.getSplan());
                System.out.println("text입니다" + e.getSplan());
                plan.put("writerId", e.getUserId().getNickname());
                System.out.println("writerId" + e.getUserId().getNickname());
                plan.put("deleted", false);
                planList.add(plan);
            }
            shareDTO.setSplanList(planList);
            shareDTO.setOk(true);
        } catch (Exception e) {
            shareDTO.setOk(false);
        }
        return shareDTO;
    }

    // 공유캘린더 일정 작성하기
    public boolean splanSave(Long scalNo, String id, LocalDate date, List<Map<String, Object>> plan) {
        try {
            Member member = memberRepository.findById(id).orElseThrow(EntityNotFoundException::new); // 회원 정보가 담긴 객체 가져옴
            splanRepository.deleteByPlanDateAndScalNo(date, scalNo); // 기존의 일정 삭제. 삭제 안 하면 기존의 것들이 DB에 계속 있음
            SCAL scal = scalRepository.findById(scalNo).orElseThrow();

            // plan 저장
            for(Map<String, Object> p : plan) {
                if(!(Boolean)p.get("deleted")) { // p.get("deleted") == false 이면 일정 저장
                    SPLAN splanData = new SPLAN();
                    splanData.setUserId(member);
                    splanData.setSplanDate(date);
                    String checked = String.valueOf(p.get("checked"));
                    // 수정하지 않은 기본의 것들은 checked가 1 또는 0으로 로드되기 때문에 따로 확인해줘야 함
                    if(checked.equals("0")) splanData.setSplanChecked(0);
                    else if (checked.equals("1")) splanData.setSplanChecked(1);
                    // 새로 생성하거나 수정한 checked는 true/false로 request함
                    else if (checked.equals("false")) splanData.setSplanChecked(0);
                    else if (checked.equals("true")) splanData.setSplanChecked(1);
                    splanData.setScalNo(scal);
                    splanData.setSplan((String)p.get("text"));
                    splanRepository.save(splanData);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
        return true;
    }

    // 공유캘린더 댓글 불러오기
    public ShareDTO commentLoad (Long scalNo, LocalDate planDate) {
        ShareDTO shareDTO = new ShareDTO();
        try {
            List<Map<String, Object>> commentList = new ArrayList<>();
            SCAL scal = scalRepository.findById(scalNo).orElseThrow();
            List<SCOM> scomData = scomRepository.findByScalNoAndSplanDate(scal, planDate);
            for (SCOM e : scomData) {
                Map<String, Object> comment = new HashMap<>();
                comment.put("commentNo", e.getCommentNo());
                comment.put("writerId", e.getUserId().getId());
                comment.put("nickname", e.getUserId().getNickname());
                comment.put("detail", e.getDetail());
                comment.put("date", e.getWriteDate().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm")));
                commentList.add(comment);
            }
            shareDTO.setScommentList(commentList);
            shareDTO.setOk(true);
        } catch (Exception e) {
            shareDTO.setOk(false);
        }
        return shareDTO;
    }

    // 공유캘린더 댓글 작성하기
    public boolean commentSave(Long scalNo, String id, LocalDate planDate, String detail) {
        try {
            SCOM scomComment = new SCOM();
            scomComment.setUserId(memberRepository.findById(id).orElseThrow());
            scomComment.setScalNo(scalRepository.findById(scalNo).orElseThrow());
            scomComment.setSplanDate(planDate);
            scomComment.setWriteDate(LocalDateTime.now());
            scomComment.setDetail(detail);
            scomRepository.save(scomComment);
            return true;
        } catch (Exception e) {
            return true;
        }
    }

    // 공유캘린더 댓글 삭제하기
    public boolean commentDelete(Long commentNo) {
        try {
            scomRepository.deleteById(commentNo);
            return true;
        } catch (Exception e) {
            return true;
        }
    }

    // 공유캘린더 정보 조회
    public ShareDTO infoLoad(Long scalNo, String id) {
        ShareDTO shareDTO = new ShareDTO();
        List<Map<String, Object>> memberList = new ArrayList<>();
        try {
            SCAL scal = scalRepository.findById(scalNo).orElseThrow(EntityNotFoundException::new); // 공유 캘린더 정보 객체
            List<SMEM> memberData = smemRepository.findByScalNo(scal); // 공유 캘린더 멤버 정보 List

            if(scal.getUserId().getId().equals(id)) { // 오너인 경우
                Member owner = memberRepository.findById(id).orElseThrow(EntityNotFoundException::new); // 오너의 정보 객체
                List<Friend> friendData = friendRepository.findByUserId(owner); // 오너의 친구들의 정보 List
                List<String> memberId = new ArrayList<>();
                for(SMEM e : memberData) memberId.add(e.getUserId().getId()); // 공유캘린더 멤버 아이디를 List에 담아줌
                for(Friend e : friendData) { // 오너의 친구들의 정보를 Map에 담아줌
                    Map<String, Object> friend = new HashMap<>();
                    friend.put("key", e.getFriendNo());
                    friend.put("id", e.getFriendId().getId());
                    friend.put("proImg", e.getFriendId().getProImg());
                    friend.put("nickname", e.getFriendId().getNickname());
                    friend.put("userCode", e.getFriendId().getUserCode());
                    friend.put("profile", e.getFriendId().getProfile());

                    // 공유 캘린더 초대를 받은 오너의 친구의 noti 객체
                   Noti alreadyInvite = notiRepository.findByReceiveIdAndAcceptCheckedAndScalNo(e.getFriendId(), 0, scal);
                    if(memberId.contains(e.getFriendId().getId())) { //멤버라면 1
                        friend.put("status", 1);
                    } else if(alreadyInvite != null) { // 이미 초대한 기록이 있으면 2
                        friend.put("status", 2);
                    } else { // 멤버도 초대한 사람도 아님
                        friend.put("status", 0);
                    }
                    memberList.add(friend);
                }
            } else { // 오너가 아닌 경우 멤버 정보만 Map에 담아줌
                for(SMEM e : memberData) {
                    Map<String, Object> member = new HashMap<>();
                    member.put("key", e.getSmemNo());
                    member.put("proImg", e.getUserId().getProImg());
                    member.put("nickname", e.getUserId().getNickname());
                    member.put("userCode", e.getUserId().getUserCode());
                    member.put("profile", e.getUserId().getProfile());
                    member.put("userId", e.getUserId().getId());
                    member.put("isOwner", e.getUserId().getId().equals(scal.getUserId().getId()));
                    memberList.add(member);
                } // 멤버의 정보를 불러온다.
            }
            shareDTO.setOk(true);
            shareDTO.setScalName(scal.getScalName()); // 캘린더 이름
            shareDTO.setScalOwner(scal.getUserId().getId());
            shareDTO.setSmemberList(memberList);
        } catch (Exception e) {
            shareDTO.setOk(false);
        }
        return shareDTO;
    }
}