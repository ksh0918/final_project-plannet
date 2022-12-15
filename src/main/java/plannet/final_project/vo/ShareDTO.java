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
    private Long calNo; // 공유 캘린더 고유번호
    private String calName; // 공유 캘린더 이름
    private String calMemo; // 공유 캘린더 메모

    private List<List<Map<String, Object>>> weekPlan;
    private List<Set<LocalDate>> planMark;
    private List<Map<String, Object>> memberList;
    private List<Map<String, Object>> planList;
    private String memo;
    private boolean isOk;



    //s_mem
    private boolean calOwner; // 공유 캘린더 만든이 여부
    private String calMember; // 공유 캘린더 멤버 아이디
    private String calNickname; // 공유 캘린더 멤버 닉네임

    //s_plan
    private LocalDateTime planDate; // 공유 캘린더 일정 날짜
    private Long planNo; // 공유 캘린더 일정 고유키
    private String planWriter; // 공유 캘린더 일정 작성자
    private boolean planCheck; // 공유 캘린더 일정 수행 여부
    private String plan; // 공유 캘린더 일정 내용

    //s_com
    private String commentWriter; // 공유 캘린더 댓글 작성자
    private LocalDateTime commentDate; // 공유 캘린더 댓글 날짜
    private String comment; // 공유 캘린더 댓글 내용
    private List<Map<String, Object>> comentsList;

    //etc
    private int pes; // 공유 캘린더 일정 달성률
}
