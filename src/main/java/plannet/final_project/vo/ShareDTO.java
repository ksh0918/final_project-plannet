package plannet.final_project.vo;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Getter @Setter
public class ShareDTO {
    //s_cal
    private Long scalNo; // 공유 캘린더 고유번호
    private String scalName; // 공유 캘린더 이름
    private String scalMemo; // 공유 캘린더 메모

    private List<List<Map<String, Object>>> sweekPlan;
    private List<Set<LocalDate>> splanMark;
    private List<Map<String, Object>> smemberList;
    private List<Map<String, Object>> splanList;
    private String smemo;
    private boolean isOwner; // 오너 여부

    //s_mem
    private String scalOwner; // 공유 캘린더 만든이
    private String scalMember; // 공유 캘린더 멤버 아이디
    private String scalNickname; // 공유 캘린더 멤버 닉네임

    //s_plan
    private LocalDateTime splanDate; // 공유 캘린더 일정 날짜
    private Long splanNo; // 공유 캘린더 일정 고유키
    private String splanWriter; // 공유 캘린더 일정 작성자
    private boolean splanCheck; // 공유 캘린더 일정 수행 여부
    private String splan; // 공유 캘린더 일정 내용

    //s_com
    private String scommentWriter; // 공유 캘린더 댓글 작성자
    private LocalDateTime scommentDate; // 공유 캘린더 댓글 날짜
    private String scomment; // 공유 캘린더 댓글 내용
    private List<Map<String, Object>> scommentList;

    //etc
    private int spes; // 공유 캘린더 일정 달성률

    private boolean isOk;
}
