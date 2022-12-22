package plannet.final_project.vo;

import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.Map;

@Getter
@Setter
public class NotiDTO {
    List<Map<String, Object>> friendList;
    List<Map<String, Object>> notiList;
}