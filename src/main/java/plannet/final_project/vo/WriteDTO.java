package plannet.final_project.vo;

import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.Map;

@Getter @Setter
public class WriteDTO {
    private List<Map<String, Object>> planList;
    private String diary;
    private boolean isOk;
}