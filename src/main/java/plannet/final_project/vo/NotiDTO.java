package plannet.final_project.vo;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class NotiDTO {
    private Long notiNo;
    private String sendId;
    private String receiveId;
    private String type;
    private Long calNo;


}