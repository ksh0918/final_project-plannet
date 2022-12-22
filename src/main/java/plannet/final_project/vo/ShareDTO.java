package plannet.final_project.vo;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Getter @Setter
public class ShareDTO {
    private String scalOwner; // 공유 캘린더 만든이
    private String scalName; // 공유 캘린더 이름
    private List<Map<String, Object>> smemberList;
    private List<Set<LocalDate>> splanMark;
    private String smemo;
    private List<List<Map<String, Object>>> sweekPlan;
    private List<Map<String, Object>> splanList;
    private List<Map<String, Object>> scommentList;

    private boolean isOk;
}