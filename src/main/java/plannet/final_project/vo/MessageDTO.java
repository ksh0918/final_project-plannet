package plannet.final_project.vo;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.List;
import java.util.Map;

@Getter @Setter @ToString
public class MessageDTO {
    private List<Map<String, Object>> messageList;

    private boolean isOk;
}