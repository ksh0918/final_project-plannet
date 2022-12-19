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
    private final SMEMRepository smemRepository;
    private final SPLANRepository splanRepository;
    private final SCALRepository scalRepository;
    private final FriendRepository friendRepository;
    private final MemberRepository memberRepository;
    private final NotiRepository notiRepository;
    private final DiaryRepository diaryRepository;
    private final PlanRepository planRepository;
    private final SCOMRepository scomRepository;

    // 공유 캘린더 생성
    public boolean scalWrite(String userId, String title, List<Map<String, Object>> smember) {
//        -- <공유캘린더 생성시 보내야 할 repository>
//        SELECT * FROM SCAL;
//        select * from smem;
//        select * from noti;

//        try {
//            Member member = memberRepository.findById(userId).orElseThrow(EntityNotFoundException::new);
//            // 공유 캘린더 설정
//            SCAL scal = new SCAL();
//            scal.setUserId(member);
//            scal.setCalName(title);
//            scalRepository.save(scal);
//            // 공유 캘린더 멤버 설정
//            SMEM smem = new SMEM();
//            smem.setCalNo(scal);
//            smem.setUserId(member);
//            smem.setIsOwner(1); // 공유 캘린더 주인이면 1 아니면 0
//            smemRepository.save(smem);
//            // 초대 멤버들에게 알림 보내기
//            Noti noti = new Noti();
//            noti.setUserId(member); // 보내는 이
//            for (Map<String, Object> s : smember) {
////                Member friend = memberRepository.fins.get("userCode");
////                noti.setReceiveId();
//            }
//        }
        return true;

    }


    // 내용 로드
    public ShareDTO homeList(Long calNo) {
        ShareDTO shareDTO = new ShareDTO();
        SCAL scal = scalRepository.findById(calNo).orElseThrow();
        try{
            // scal CalName Load
            shareDTO.setCalName(scal.getCalName());

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
                List<SPLAN> dayPlanOrigin = splanRepository.findByCalNoAndPlanDateOrderBySplanNoAsc(scal, weekDay[i]);
                for(SPLAN e : dayPlanOrigin) {
                    Map<String, Object> plan = new HashMap<>();
                    plan.put("no", e.getSplanNo());
                    plan.put("plan", e.getPlan());
                    plan.put("checked", e.getPlanChecked());
                    dayPlan.add(plan);
                }
                weekPlan.add(dayPlan);
            }
            shareDTO.setWeekPlan(weekPlan);

            // planMark Load
            List<Set<LocalDate>> planMark = new ArrayList<>();
            for(int i = 0; i < 2; i++) {
                Set<LocalDate> planDot = new HashSet<>();
                List<SPLAN> plan = splanRepository.findByCalNoAndPlanChecked(scal, i);
                for(SPLAN e : plan) {
                    planDot.add(e.getPlanDate());
                }
                planMark.add(planDot);
            }
            shareDTO.setPlanMark(planMark);

            // Memo Load
            if(scal.getCalMemo() != null) {
                shareDTO.setMemo(scal.getCalMemo());
            } else shareDTO.setMemo("");

            // Member Load
            List<Map<String, Object>> memberList = new ArrayList<>();
            SCAL scalNo = scalRepository.findById(calNo).orElseThrow(EntityNotFoundException::new);
            List<SMEM> memberListData = smemRepository.findByCalNo(scalNo);
            for (SMEM e : memberListData) {
                Map<String, Object> scalMember = new HashMap<>();
                scalMember.put("id", e.getUserId().getId());
                scalMember.put("isOwner", e.getIsOwner());
                scalMember.put("nickname", e.getUserId().getNickname());
                scalMember.put("userCode", e.getUserId().getUserCode());
                memberList.add(scalMember);
            }
            shareDTO.setMemberList(memberList);
            shareDTO.setOk(true);
        } catch (Exception e){
            shareDTO.setOk(false);
        }
        return shareDTO;
    }

    // 메모 수정
    public boolean memoWrite(Long calNo, String detail) {
        try {
            SCAL scal = scalRepository.findById(calNo).orElseThrow();
            scal.setCalMemo(detail);
            scalRepository.save(scal);
            return true;
        }
        catch (Exception e) {
            return false;
        }
    }

    // 일정 불러오기
    public ShareDTO planLoad(Long calNo, LocalDate date) {
        ShareDTO shareDTO = new ShareDTO();
        try{
            SCAL scal = scalRepository.findById(calNo).orElseThrow();
            List<SPLAN> plans = splanRepository.findByCalNoAndPlanDateOrderBySplanNoAsc(scal, date);
            List<Map<String, Object>> planList = new ArrayList<>();
            for (SPLAN e : plans) {
                Map<String, Object> plan = new HashMap<>();
                plan.put("key", e.getSplanNo());
                plan.put("checked", e.getPlanChecked());
                plan.put("text", e.getPlan());
                plan.put("deleted", false);
                planList.add(plan);
            }
            shareDTO.setPlanList(planList);
            shareDTO.setOk(true);
        } catch (Exception e) {
            shareDTO.setOk(false);
        }
        return shareDTO;
    }

    // 공유캘린더 댓글 불러오기
    public ShareDTO getCommentsLoad (Long calNo, LocalDate planDate) {
        ShareDTO shareDTO = new ShareDTO();
        try {
            List<Map<String, Object>> commentsList = new ArrayList<>();
            SCAL scal = scalRepository.findById(calNo).orElseThrow();
            List<SCOM> data = scomRepository.findByCalNoAndPlanDate(scal, planDate);
            for (SCOM e : data) {
                Map<String, Object> comments = new HashMap<>();
                comments.put("commentNo", e.getCommentNo());
                comments.put("writerId", e.getUserId().getId());
                comments.put("nickname", e.getUserId().getNickname());
                comments.put("detail", e.getDetail());
                comments.put("date", e.getWriteDate().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm")));
                commentsList.add(comments);
            }
            shareDTO.setComentsList(commentsList);
            shareDTO.setOk(true);
        } catch (Exception e) {
            shareDTO.setOk(false);
        }
        return shareDTO;
    }

    // 공유캘린더 댓글 작성하기
    public boolean commentsWrite(Long calNo, LocalDate planDate, String id, String detail) {
        try {
            SCOM scomComments = new SCOM();
            scomComments.setUserId(memberRepository.findById(id).orElseThrow());
            scomComments.setCalNo(scalRepository.findById(calNo).orElseThrow());
            scomComments.setPlanDate(planDate);
            scomComments.setWriteDate(LocalDateTime.now());
            scomComments.setDetail(detail);
            scomRepository.save(scomComments);
            return true;
        } catch (Exception e) {
            return true;
        }
    }

    // 공유캘린더 댓글 삭제하기
    public boolean commentsDelete(Long commentNo) {
        try {
            scomRepository.deleteById(commentNo);
            return true;
        } catch (Exception e) {
            return true;
        }
    }

    public ShareDTO infoLoad(Long calNo, String id) {
        ShareDTO shareDTO = new ShareDTO();
        List<Map<String, Object>> memberList = new ArrayList<>();
        try {
            SCAL scal = scalRepository.findById(calNo).orElseThrow(EntityNotFoundException::new);
            List<SMEM> memberData = smemRepository.findByCalNo(scal);

            if(scal.getUserId().getId().equals(id)) { // 오너인 경우
                Member owner = memberRepository.findById(id).orElseThrow(EntityNotFoundException::new);
                List<Friend> friendData = friendRepository.findByUserId(owner);
                List<String> memberId = new ArrayList<>();
                for(SMEM e : memberData) {
                    memberId.add(e.getUserId().getId());
                }
                for(Friend e : friendData) {
                    Map<String, Object> friend = new HashMap<>();
                    friend.put("key", e.getFriendNo());
                    friend.put("id", e.getUserId().getId());
                    friend.put("proImg", e.getUserId().getProImg());
                    friend.put("nickname", e.getUserId().getNickname());
                    friend.put("userCode", e.getUserId().getUserCode());
                    friend.put("profile", e.getUserId().getProfile());

                    Noti alreadyInvite = notiRepository.findByReceiveIdAndIsCheckedAndCalNo(e.getUserId(), 0, scal);
                    if(memberId.contains(e.getUserId().getId())) { //멤버라면 1
                        friend.put("status", 1);
                    } else if(alreadyInvite != null) { // 이미 초대한 기록이 있으면 2
                        friend.put("status", 2);
                    } else { // 멤버도 초대한 사람도 아님
                        friend.put("status", 0);
                    }

                    memberList.add(friend);
                }
            } else { // 오너가 아닌 경우
                for(SMEM e : memberData) {
                    Map<String, Object> member = new HashMap<>();
                    member.put("key", e.getSmemNo());
                    member.put("proImg", e.getUserId().getProImg());
                    member.put("nickname", e.getUserId().getNickname());
                    member.put("userCode", e.getUserId().getUserCode());
                    member.put("profile", e.getUserId().getProfile());
                    member.put("isOwner", e.getUserId().getId().equals(scal.getUserId().getId()));
                    memberList.add(member);
                } // 멤버의 정보를 불러온다.
            }
            shareDTO.setOk(true);
            shareDTO.setCalName(scal.getCalName()); // 캘린더 이름
            shareDTO.setMemberList(memberList);
        } catch (Exception e) {
            shareDTO.setOk(false);
        }
        return shareDTO;
    }

    public boolean infoSave(Long calNo, String calName) {
        try {
            // 캘린더 이름 저장
            SCAL scal = scalRepository.findById(calNo).orElseThrow(EntityNotFoundException::new);
            if(!scal.getCalName().equals(calName)) { // 이름이 다르면 변경
                scal.setCalName(calName);
                scalRepository.save(scal);
            }
            return true;
        } catch (Exception e) {
            return false;
        }
    }
    public boolean inviteMember(Long calNo, String id) {
        try {
            Noti noti = new Noti();
            // 멤버초대
            SCAL scal = scalRepository.findById(calNo).orElseThrow(EntityNotFoundException::new);
            Member sendId = scal.getUserId();
            Member receiveId = memberRepository.findById(id).orElseThrow(EntityNotFoundException::new);

            noti.setUserId(sendId);
            noti.setReceiveId(receiveId);
            noti.setType("S");
            noti.setIsChecked(0);
            noti.setCalNo(scal);
            noti.setInviteDate(LocalDateTime.now());
            notiRepository.save(noti);

            return true;
        } catch (Exception e) {
            return false;
        }
    }
    public boolean dropMember(Long calNo, String id) {
        try {
            SCAL scal = scalRepository.findById(calNo).orElseThrow(EntityNotFoundException::new);
            Member dropId = memberRepository.findById(id).orElseThrow(EntityNotFoundException::new);
            SMEM smem = smemRepository.findByCalNoAndUserId(scal, dropId);
            smemRepository.deleteById(smem.getSmemNo());

            return true;
        } catch (Exception e) {
            return false;
        }
    }
}