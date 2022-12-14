package plannet.final_project.vo;

import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.Map;

@Getter
@Setter
public class NotiDTO {
    private Long notiNo;
    private String sendId;
    private String receiveId;
    private String type;
    private Long calNo;

    List<Map<String, Object>> friendList;
    List<Map<String, Object>> notiList;


}