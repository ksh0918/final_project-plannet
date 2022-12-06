package plannet.final_project.vo;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;


@Getter @Setter
public class WriteDTO {
    private String userId;
    private LocalDateTime date;
    private List<Map<String, Object>> planList;
    private Map<String, Object> plan;
    private String diary;
    private boolean isOk;
}
