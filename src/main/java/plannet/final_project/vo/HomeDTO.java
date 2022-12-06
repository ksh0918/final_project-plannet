package plannet.final_project.vo;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Getter @Setter
public class HomeDTO {
    private List<List<Map<String, Object>>> weekPlan;
    private List<Set<LocalDate>> planMark;
    private String memo;
    private String Quote;
    private boolean isOk;
}
