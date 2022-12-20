package plannet.final_project.vo;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Getter @Setter @ToString
public class MessageDTO {
    private int messageNo;
    private String sendId;
    private String receiveId;
    private String detail;
    private LocalDateTime sendDate;
    private int isRead;
    private boolean isOk;
    private List<Map<String, Object>> messageList;
}
